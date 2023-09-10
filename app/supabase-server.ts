import { Database } from '@/types_db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
});

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getSeller = async () => {
  const session = await getSession();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('user_id', session?.user.id as string)
    .single();

  if (error) {
    console.log(error.message);
  }
  return data;
};

export const getMedia = async () => {
  const session = await getSession();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('user_id', session?.user.id as string);

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getAllStates = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('states').select('*');

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getAllCities = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('cities').select('*');

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const searchCities = async (search: string) => {
  const supabase = createServerSupabaseClient();
  // remove accents and lowercase
  const aux = search
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const { data, error } = await supabase
    .from('cities')
    .select('*, states(sigla)')
    .ilike('name_unaccented', `%${aux}%`)
    .limit(10)
    .order('name_unaccented');

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

// based on the city id, get all the sellers in that city
// with pagination and filtering and sorting and searching and offset
export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return { from, to };
};

export const getSellersByCity = async ({
  cityId,
  page = 1,
  limit = 10,
  sort = 'name',
  order = 'asc',
  gender = 'female'
}: {
  cityId: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  gender?: string;
}) => {
  const supabase = createServerSupabaseClient();

  // Using getPagination to calculate from and to for pagination
  const { from, to } = getPagination(page - 1, limit); // subtract 1 from page as pages usually start from 1, but we need it zero-based for the calculation

  const { data, error } = await supabase
    .from('sellers')
    .select(
      `
      *,
      media:media!media_user_id_fkey ( media_id, media_url, media_type ),
      cities:city_id ( city_id, name, state_id ( sigla ) )
    `
    )
    .eq('gender', gender)
    .eq('city_id', cityId)
    .eq('active', true)
    .order(sort, { ascending: order === 'asc' })
    .range(from, to);

  if (error) {
    console.log(error);
  }

  const { count, error: countError } = await supabase
    .from('sellers')
    .select('*', { count: 'exact', head: true })
    .eq('gender', gender)
    .eq('city_id', cityId);

  if (countError) {
    console.log(countError);
  }

  return {
    results: data ?? [],
    total: count
  };
};

export const getMetadataForCity = async (cityId: string) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*, states(sigla)')
    .eq('city_id', cityId)
    .single();

  if (error) {
    console.log(error.message);
  }

  return data ?? null;
};

export const getSellersByState = async ({
  stateId,
  page = 1,
  limit = 10,
  sort = 'name',
  order = 'asc',
  gender = 'female'
}: {
  stateId: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  gender?: string;
}) => {
  const supabase = createServerSupabaseClient();

  // Using getPagination to calculate from and to for pagination
  const { from, to } = getPagination(page - 1, limit); // subtract 1 from page as pages usually start from 1, but we need it zero-based for the calculation

  const { data, error } = await supabase
    .from('sellers')
    .select(
      `
      *,
      media:media!media_user_id_fkey ( media_id, media_url, media_type ),
      cities:city_id ( city_id, name, state_id ( sigla ) )
    `
    )
    .eq('gender', gender)
    .eq('state_id', stateId)
    .order(sort, { ascending: order === 'asc' })
    .range(from, to);

  if (error) {
    console.log(error);
  }

  return data ?? [];
};

export const getSellerProfile = async (userId: string) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('sellers')
    .select(
      `
      *,
      media:media!media_user_id_fkey ( media_id, media_url, media_type ),
      cities:city_id ( city_id, name, state_id ( sigla ) )
    `
    )
    .eq('user_id', userId)
    .single();

  if (error) {
    console.log(error);
  }

  return data ?? null;
};

export const getAllServiceTags = async () => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('seller_services_tags')
    .select('*');

  if (error) {
    console.log(error);
  }

  return data ?? [];
};
