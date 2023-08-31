import ResultsList from './ResultsList';
import { getSellersByCity } from '@/app/supabase-server';
import SearchBar from '@/components/SearchBar';
import React from 'react';

export default async function SearchBarPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let results: any[] = [];
  let cityName = null;
  const city = params.slug;
  const cityId = city.split('-').pop() || '';
  const page = searchParams.p ? parseInt(searchParams.p as string) : 1;
  const gender = searchParams.g ? (searchParams.g as string) : 'female';
  let noResults = false;

  if (city) {
    results = await getSellersByCity({
      cityId,
      page,
      gender
    });
    if (results.length > 0)
      cityName =
        results[0]?.cities?.name + ' - ' + results[0]?.cities?.state_id.sigla ||
        '';
    else noResults = true;
  }

  return (
    <div className="min-h-screen py-2 w-full">
      {cityName && <CityNameTitle cityName={cityName} />}

      <SearchBar refreshWhenGenderChanges gender={gender} />
      {noResults && (
        <p className="text-white text-center mt-4">
          Nenhum resultado encontrado
        </p>
      )}
      {cityName && results.length > 0 && (
        <ResultsList sellers={results} city={cityName} />
      )}
    </div>
  );
}

const CityNameTitle = ({ cityName }: { cityName: string }) => {
  return (
    <h1 className="text-white text-3xl font-semibold my-0 ml-4">{cityName}</h1>
  );
};
