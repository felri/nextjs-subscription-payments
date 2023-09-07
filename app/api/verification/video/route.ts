import { Database } from '@/types_db';
import { updateSeller } from '@/utils/supabase-admin';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { StorageClient } from '@supabase/storage-js';
import { cookies } from 'next/headers';

const STORAGE_BUCKET = 'primabela-bucket';
const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_ROLE_KEY as string,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`
});

const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'avi'];
const VIDEO_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB

export async function POST(req: Request) {
  if (!isPostRequest(req)) {
    return methodNotAllowedResponse();
  }

  try {
    const user = await getUserFromAuth();
    if (!user) throw new Error('Could not get user');

    const file = await getFileFromRequest(req);

    console.log('file', file);

    if (!file) return noFilesErrorResponse();

    // user id = 00bebe54-b902-43f8-a68c-ccfb842008a0
    // file name = a68c
    const fileName = user.id.split('-')[3];
    const fileExt = getFileExtension(file.name);

    console.log('fileName', fileName);
    console.log('fileExt', fileExt);

    if (
      !ALLOWED_VIDEO_EXTENSIONS.includes(fileExt) ||
      file.size > VIDEO_SIZE_LIMIT
    ) {
      return jsonResponse(
        {
          error: {
            statusCode: 400,
            message: 'File type not supported or too large'
          }
        },
        400
      );
    }

    const filePath = `verification/${fileName}.mp4`;
    const croppedFile = await cutTop25Percent(file, fileExt);

    console.log('croppedFile', croppedFile);

    await uploadVideo(croppedFile, filePath, fileExt);

    await updateSeller(user.id, {
      verification_video: filePath
    });

    return successResponse({ verification_video: filePath });
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

async function getFileFromRequest(req: Request): Promise<File> {
  const formData = await req.formData();
  const file = formData.get('file');
  return file as File;
}

function noFilesErrorResponse(): Response {
  return jsonResponse({ error: 'No files' }, 400);
}

const cutTop25Percent = async (file: File, fileExt: string) => {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  await ffmpeg.load({
    // This file is located in the public folder
    // of the Next.js project
    coreURL: '/ffmpeg-core.js',
    wasmURL: '/ffmpeg-core.wasm'
  });

  // Set the percentage of the video to cut (25% in this case)
  const cutPercentage = 25;

  const fileData = await file.arrayBuffer();
  const fileDataUint8 = new Uint8Array(fileData);

  await ffmpeg.writeFile(`input.${fileExt}`, fileDataUint8);

  // cut the top 25% of the video screen
  await ffmpeg.exec([
    '-i',
    `input.${fileExt}`,
    '-filter:v',
    `crop=in_w:in_h*${cutPercentage / 100}:0:0`,
    '-c:a',
    'copy',
    `output.mp4`
  ]);

  const outputData = await ffmpeg.readFile(`output.mp4`);
  console.log('outputData', outputData);
  // clean up
  ffmpeg.deleteFile(`input.${fileExt}`);
  ffmpeg.deleteFile(`output.mp4`);
  return new File([outputData], `output.mp4`);
};

function getFileExtension(filename: string): string {
  return filename?.split('.')?.pop()?.toLowerCase() || '';
}

function generateFileName(extension: string): string {
  return `${Math.random()}.${extension}`;
}

async function uploadVideo(file: File, path: string, ext: string) {
  const uploadResult = await storageClient
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: `video/${ext}`,
      duplex: 'half',
      upsert: true
    });

  return uploadResult.error;
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
