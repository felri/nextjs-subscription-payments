import ResultsList from './ResultsList';
import { getSellersByCity, getMetadataForCity } from '@/app/supabase-server';
import SearchBar from '@/components/SearchBar';
import LogoTitle from '@/components/ui/Logo';
import { Database } from '@/types_db';
import { cityNameToSlug, getGenderText } from '@/utils/helpers';
import { getAllCapitals } from '@/utils/supabase-admin';
import type { Metadata, ResolvingMetadata } from 'next';
import React, { Suspense } from 'react';

const meta = {
  title: 'Primabela',
  description: 'Encontre acompanhantes por todos os cantos do país',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://primabela.lol',
  type: 'website'
};

type Props = {
  params: { slug: string; gender: string; page: string };
};

// export const dynamicParams = true;

// export async function generateStaticParams() {
//   const capitals = await getAllCapitals();
//   const genders = ['female', 'trans', 'male'];
//   const urls = [];
//   for (const capital of capitals) {
//     for (const gender of genders) {
//       if (capital.name) {
//         const slug = cityNameToSlug(capital.name) + '-' + capital.city_id;
//         const params = {
//           slug,
//           gender,
//           page: '1'
//         };
//         urls.push({ params });
//       }
//     }
//   }
//   return urls;
// }

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { slug, gender, page } = params;
  const cityId = slug.split('-').pop() || '';
  const genderName =
    gender === 'female' ? 'mulheres' : gender === 'trans' ? 'trans' : 'homens';
  const data: Database['public']['Tables']['cities']['Row'] =
    await getMetadataForCity(cityId);
  const beforeWord = gender === 'female' || gender === 'trans' ? 'as' : 'os';

  const url = `https://primabela.lol/city/${slug}/${gender}/${page}`;
  const title = `Acompanhantes ${genderName} em ${data.name} - ${data.states?.sigla} | Primabela`;
  const description = `Encontre acompanhantes ${beforeWord} ${genderName} mais TOPS de ${data.name} - ${data.states?.sigla} aqui no Primabela. Acompanhantes de luxo, garotas de programa e muito mais.`;

  return {
    title: title,
    description: description,
    robots: meta.robots,
    openGraph: {
      url: url,
      title: title,
      description: description,
      images: [
        {
          url: '/og.png',
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
  params: { slug: string; gender: string; page: string };
}) {
  let data: {
    results: any[];
    total: number | null;
  } = {
    results: [],
    total: 0
  };
  let cityName = null;
  let noResults = false;

  const city = params.slug;
  const page = params.page ? parseInt(params.page as string) : 1;
  const gender = params.gender ?? 'female';
  const cityId = city.split('-').pop() || '';

  if (city) {
    data = await getSellersByCity({
      cityId,
      page,
      gender
    });
    if (data.results.length > 0)
      cityName =
        data.results[0]?.cities?.name +
          ' - ' +
          data.results[0]?.cities?.state_id.sigla || '';
    else noResults = true;
  }

  return (
    <div className="min-h-screen py-2 w-full">
      <LogoTitle />
      <SearchBar refreshWhenGenderChanges gender={gender} slug={city} />
      {cityName && (
        <CityNameTitle cityName={cityName} gender={getGenderText(gender) || ''} />
      )}
      {noResults && (
        <p className="text-white text-center mt-4">
          Nenhum resultado encontrado
        </p>
      )}

      {cityName && data.results.length > 0 && (
        <ResultsList
          sellers={data.results}
          city={cityName}
          page={page}
          slug={city}
          totalPages={Math.ceil((data.total || 1) / 10)}
          gender={gender}
        />
      )}
    </div>
  );
}

const CityNameTitle = ({
  cityName,
  gender
}: {
  cityName: string;
  gender: string;
}) => {
  return (
    <h1 className="text-white text-2xl text-center font-semibold max-w-2xl mx-auto px-4" id="cityNameTitle">
      {gender} em {cityName} 
    </h1>
  );
};
