import { Database } from '@/types_db';
import { upsertMediaRecords, deleteMediaRecords } from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sharp from 'sharp';

const STORAGE_BUCKET = 'primabela-bucket';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
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

    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files' }), {
        status: 400
      });
    }

    const promises = files.map(async (file) => {
      const aux = file as File;
      const fileExt = aux?.name?.split('.').pop()?.toLowerCase();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      if (fileExt && ['png', 'jpg', 'jpeg', 'gif'].includes(fileExt)) {
        const compressedBuffer = await sharp(
          Buffer.from(await aux.arrayBuffer())
        )
          .png({ quality: 70 }) // Adjust the quality as needed
          .toBuffer();

        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, compressedBuffer, {
            contentType: 'image/png' // Update based on your image type
          });

        if (error) {
          console.error(`Failed to upload ${aux.name}:`, error.message);
          return null;
        }
      } else if (fileExt && ['mp4', 'webm', 'avi'].includes(fileExt)) {
        if (aux.size > 20 * 1024 * 1024) {
          // Check if the video size is more than 20MB
          console.error(`${aux.name} exceeds the 20MB size limit.`);
          return null;
        }

        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, Buffer.from(await aux.arrayBuffer()), {
            contentType: 'video/mp4' // Update based on your video type
          });

        if (error) {
          console.error(`Failed to upload ${aux.name}:`, error.message);
          return null;
        }
      } else {
        console.error(`Unsupported file type for ${aux.name}.`);
        return null;
      }

      return fileName;
    });

    const fileNames = await Promise.all(promises);

    if (!fileNames || fileNames.length === 0) {
      return new Response(JSON.stringify({ error: 'No files uploaded' }), {
        status: 400
      });
    }

    await upsertMediaRecords(fileNames as string[], user.id);

    return new Response(JSON.stringify({ data: fileNames }), {
      status: 200
    });
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: { statusCode: 500, message: error.message }
      }),
      {
        status: 500
      }
    );
  }
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
