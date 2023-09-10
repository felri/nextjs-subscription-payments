import { updateSeller, deleteMediaRecords } from '@/utils/supabase-admin';
import { NextRequest } from 'next/server';

const verificationKey = process.env.SECRET_VERIFICATION_KEY;

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
  try {
    const { password } = await req.json();

    if (password !== verificationKey) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 400
      });
    }

    return new Response(
      JSON.stringify({
        verified: true
      }),
      {
        status: 200
      }
    );
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

export async function PUT(req: Request) {
  if (req.method !== 'PUT') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'PUT' },
      status: 405
    });
  }
  try {
    const { userId, ...rest } = await req.json();

    if (!rest) {
      return new Response(JSON.stringify({ error: 'No data' }), {
        status: 400
      });
    }

    await updateSeller(userId, rest);
    return new Response(JSON.stringify({}), {
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
