import ResultsList from './ResultsList';
import { getSellersByCity } from '@/app/supabase-server';
import SearchBar from '@/components/SearchBar';
import React, { Suspense } from 'react';

export default async function SearchBarPage({
  params
}: {
  params: { slug: string; gender: string; page: string };
}) {
  let results: any[] = [];
  let cityName = null;
  let noResults = false;

  const city = params.slug;
  const page = params.page ? parseInt(params.page as string) : 1;
  const gender = params.gender ?? 'female';
  const cityId = city.split('-').pop() || '';

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
      <SearchBar refreshWhenGenderChanges gender={gender} slug={city} />
      {cityName && <CityNameTitle cityName={cityName} />}
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
    <h1 className="text-white text-2xl font-semibold my-0 ml-10">{cityName}</h1>
  );
};
