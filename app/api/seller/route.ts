import { Database } from '@/types_db';
import { updateSeller, deleteMediaRecords } from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(req: Request) {
  if (req.method !== 'PUT') {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'PUT' },
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

    if (!data) {
      return new Response(JSON.stringify({ error: 'No data' }), {
        status: 400
      });
    }

    await updateSeller(user.id, data);

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
