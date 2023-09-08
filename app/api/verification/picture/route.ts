import { Database } from '@/types_db';
import { updateSeller } from '@/utils/supabase-admin';
import { uploadFile } from '@/utils/supabase-storage';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  if (!isPostRequest(req)) {
    return methodNotAllowedResponse();
  }

  try {
    const user = await getUserFromAuth();
    if (!user) throw new Error('Could not get user');

    const { file, type } = await getFileFromRequest(req);

    console.log('file', file);

    if (!file) return noFilesErrorResponse();

    // user id = 00bebe54-b902-43f8-a68c-ccfb842008a0
    // file name = a68c
    const fileName = user.id;
    const fileExt = getFileExtension(file.name);

    const filePath = `verification/${fileName}/${type}${fileExt}`;

    await uploadFile(file, filePath, fileExt);

    await updateSeller(user.id, {
      [type]: filePath
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

async function getFileFromRequest(req: Request): Promise<{
  file: File;
  type: string;
}> {
  const formData = await req.formData();
  const file = formData.get('file');
  const type = formData.get('type');
  return {
    file: file as File,
    type: `${type}`
  };
}

function noFilesErrorResponse(): Response {
  return jsonResponse({ error: 'No files' }, 400);
}

function getFileExtension(filename: string): string {
  return filename?.split('.')?.pop()?.toLowerCase() || '';
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
