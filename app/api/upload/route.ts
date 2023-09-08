import { Database } from '@/types_db';
import { upsertMediaRecords, deleteMediaRecords } from '@/utils/supabase-admin';
import { uploadFile } from '@/utils/supabase-storage';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sharp from 'sharp';

const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'avi'];
const VIDEO_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB

export async function POST(req: Request) {
  if (!isPostRequest(req)) {
    return methodNotAllowedResponse();
  }

  try {
    const user = await getUserFromAuth();
    if (!user) throw new Error('Could not get user');

    const files = await getFilesFromRequest(req);
    if (files.length === 0) return noFilesErrorResponse();

    const fileNames = await uploadFilesAndGetNames(files, user.id);

    if (fileNames.length === 0) return noFilesUploadedErrorResponse();

    return successResponse(fileNames);
  } catch (error: any) {
    return internalServerErrorResponse(error);
  }
}

function isPostRequest(req: Request): boolean {
  return req.method === 'POST';
}

function methodNotAllowedResponse(): Response {
  return new Response('Method Not Allowed', {
    headers: { Allow: 'POST' },
    status: 405
  });
}

async function getUserFromAuth() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

async function getFilesFromRequest(req: Request): Promise<File[]> {
  const formData = await req.formData();
  const files = formData.getAll('files');
  return files.filter((file): file is File => file instanceof File);
}

function noFilesErrorResponse(): Response {
  return jsonResponse({ error: 'No files' }, 400);
}

async function uploadFilesAndGetNames(
  files: File[],
  userId: string
): Promise<string[]> {
  const fileNames = [];

  for (const file of files) {
    await sleep(1000); // Avoid rate limiting

    const fileExt = getFileExtension(file.name);
    const fileName = generateFileName(fileExt);
    const filePath = `${userId}/${fileName}`;

    try {
      if (ALLOWED_IMAGE_EXTENSIONS.includes(fileExt)) {
        await uploadImage(file, filePath, fileExt);
      } else if (
        ALLOWED_VIDEO_EXTENSIONS.includes(fileExt) &&
        file.size <= VIDEO_SIZE_LIMIT
      ) {
        await uploadFile(file, filePath, fileExt);
      } else {
        console.error(`Unsupported or too large file type for ${file.name}.`);
        continue;
      }
      console.log(`Successfully uploaded ${file.name}.`);

      // If you've reached this point, it means the file upload was successful.
      // Now, you can update the DB for this particular file.
      await upsertMediaRecords([fileName], userId);

      // If DB update is also successful, push the filename to the list.
      fileNames.push(fileName);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
    }
  }

  return fileNames;
}

function getFileExtension(filename: string): string {
  return filename?.split('.')?.pop()?.toLowerCase() || '';
}

function generateFileName(extension: string): string {
  return `${Math.random()}.${extension}`;
}

async function uploadImage(file: File, path: string, ext: string) {
  const watermark = await sharp('./public/watermark.png')
    .resize(200, 200)
    .toBuffer();

  const compressedBuffer = await sharp(Buffer.from(await file.arrayBuffer()))
    .composite([{ input: watermark, gravity: 'southeast' }])
    .png({ quality: 70 }) // Adjust the quality as needed
    .toBuffer();

  const compressedFile = new File([compressedBuffer], file.name, {
    type: `image/png`
  });

  return await uploadFile(compressedFile, path, 'png');
}

function noFilesUploadedErrorResponse(): Response {
  return jsonResponse({ error: 'No files uploaded' }, 400);
}

function successResponse(data: any): Response {
  return jsonResponse({ data }, 200);
}

function internalServerErrorResponse(error: Error): Response {
  return jsonResponse(
    {
      error: { statusCode: 500, message: error.message }
    },
    500
  );
}

function jsonResponse(body: any, status: number): Response {
  return new Response(JSON.stringify(body), { status });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function DELETE(req: Request) {
  if (req.method !== 'DELETE') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'DELETE' },
      status: 405
    });
  }
  try {
    const supabase = createRouteHandlerClient<Database>({
      cookies
    });
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Could not get user');

    const data = await req.json();

    const filename = data.image;

    if (!filename) {
      return new Response(JSON.stringify({ error: 'No file' }), {
        status: 400
      });
    }

    await deleteMediaRecords(filename);

    return new Response(JSON.stringify({ data }), {
      status: 200
    });
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: { statusCode: 500, message: error.message } }),
      {
        status: 500
      }
    );
  }
}
