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
  const city = searchParams.c;
  const page = searchParams.p ? parseInt(searchParams.p as string) : 1;
  const gender = searchParams.g ? (searchParams.g as string) : 'female';

  if (city) {
    results = await getSellersByCity({
      cityId: city as string,
      page,
      gender
    });
  }

  return (
    <div className="min-h-screen py-2 w-full">
      <SearchBar />
      {results.length > 0 && (
        <ResultsList sellers={results} city={city as string} />
      )}
    </div>
  );
}
