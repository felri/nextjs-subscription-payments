import { getCitiesByStateId } from '@/utils/supabase-admin';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
  try {
    const { stateId } = await req.json();
    const cities = await getCitiesByStateId(stateId || '');

    if (!cities) {
      return new Response(JSON.stringify({ error: 'No cities' }), {
        status: 400
      });
    }

    return new Response(
      JSON.stringify({
        cities
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