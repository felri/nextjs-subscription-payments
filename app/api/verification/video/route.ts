import { Database } from '@/types_db';
import { updateSeller } from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { StorageClient } from '@supabase/storage-js';
import ffprobeStatic from 'ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import { cookies } from 'next/headers';

const STORAGE_BUCKET = 'primabela-bucket';
const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

ffmpeg.setFfmpegPath('./bin/ffmpeg');
ffmpeg.setFfprobePath(ffprobeStatic.path);

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
      verification_video_url: filePath
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

const cutTop25Percent = async (file: File, fileExt: string): Promise<File> => {
  console.log(
    'Function called with file:',
    file,
    'and file extension:',
    fileExt
  );

  const cutPercentage = 25;

  console.log('Reading file data...');
  const fileData = await file.arrayBuffer();
  const fileDataUint8 = new Uint8Array(fileData);
  console.log('File data read successfully.');

  console.log('Writing file to FFmpeg file system...');
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  const inputFilePath = `/tmp/input_${timestamp}_${randomNum}.${fileExt}`;
  const outputFilePath = `/tmp/output_${timestamp}_${randomNum}.mp4`;

  await require('fs').writeFileSync(inputFilePath, fileDataUint8);
  console.log('File written to FFmpeg file system successfully.');

  console.log('Executing FFmpeg command...');

  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .inputFormat(fileExt)
      .videoCodec('libx264')
      .outputOptions([
        `-filter:v crop=in_w:in_h*${(100 - cutPercentage) / 100}:0:in_h*${
          cutPercentage / 100
        }`,
        '-c:a copy'
      ])
      .output(outputFilePath)
      .on('end', () => {
        console.log('FFmpeg command executed successfully.');

        // Read the output file data
        const outputData = require('fs').readFileSync(outputFilePath);
        console.log('Reading output file...');

        // Clean up input and output files
        require('fs').unlinkSync(inputFilePath);
        require('fs').unlinkSync(outputFilePath);
        console.log('Output file read successfully.');

        console.log('Returning new File object...');
        resolve(new File([outputData], `output.mp4`, { type: 'video/mp4' }));
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Error executing FFmpeg command:', err);
        console.error('FFmpeg Stdout:', stdout);
        console.error('FFmpeg Stderr:', stderr);
        reject(err);
      })
      .run();
  });
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

  console.log('uploadResult', uploadResult);

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
