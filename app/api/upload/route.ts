import { Database } from '@/types_db';
import { upsertMediaRecords, deleteMediaRecords } from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  if (!isPostRequest(req)) {
    return methodNotAllowedResponse();
  }

  try {
    const user = await getUserFromAuth();
    if (!user) throw new Error('Could not get user');

    const { images } = await getBodyFromRequest(req);

    if (!images || images.length === 0) return noFilesUploadedErrorResponse();

    await upsertMediaRecords(images, user.id);

    return successResponse(images);
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

async function getBodyFromRequest(req: Request): Promise<any> {
  const body = await req.json();
  return body;
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
