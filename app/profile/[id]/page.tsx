import Seller from './Seller';
import { getSellerProfile, getAllServiceTags } from '@/app/supabase-server';
import { Database } from '@/types_db';
import { getStorageSupabaseUrl } from '@/utils/helpers';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = params;
  const seller = await getSellerProfile(id);

  const url = `https://primabela.lol/profile/${id}`;
  const title = `${seller?.name || ''} | Primabela`;
  const description = `${seller?.short_description || ''}`;
  const image = `${getStorageSupabaseUrl(seller?.featured_image || '', id)}`;

  return {
    title: title,
    description: description,
    robots: 'follow, index',
    openGraph: {
      url: url,
      title: title,
      description: description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      siteName: title
    }
  };
}

export default async function SearchBarPage({
  params
}: {
  params: { id: string };
}) {
  let seller: Database['public']['Tables']['sellers']['Row'] | null = null;
  let tags:
    | Database['public']['Tables']['seller_services_tags']['Row'][]
    | null = null;
  const userId = params.id;

  const fetchSellerProfile = async (userId: string) => {
    'use server';
    const seller = await getSellerProfile(userId);
    return seller;
  };

  const fetchAllServiceTags = async () => {
    'use server';
    const tags = await getAllServiceTags();
    return tags;
  };

  if (userId) {
    seller = await fetchSellerProfile(userId);
    tags = await fetchAllServiceTags();
    if (!seller) {
      redirect('/404');
    }
  } else {
    redirect('/404');
  }

  return (
    <div className="min-h-screen py-2 w-full max-w-screen-sm mx-auto">
      <Seller seller={seller} media={seller?.media} tags={tags} />
    </div>
  );
}
