import { Database } from '@/types_db';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const compressionKey = process.env.SECRET_COMPRESSION_KEY;

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'GET' },
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

    // return the key
    return new Response(JSON.stringify({ key: compressionKey }), {
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
