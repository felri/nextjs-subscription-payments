'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function SearchBarPage() {
  const router = useRouter()
  const [searchResults, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const fetchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null); // Note: If you're not in Node environment, you might use `number` instead of `NodeJS.Timeout`.

  const fetchResults = async (query: string) => {
    const res = await fetch(`/api/search/auto-complete?q=${query}`);
    const data = await res.json();
    setSearchResults(data.cities);
  };

  const onSearch = (query: string) => {
    setSearch(query);

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    if (!query) {
      setSearchResults([]);
      return;
    }

    if (query.length >= 3) {
      fetchTimeoutRef.current = setTimeout(() => {
        fetchResults(query);
      }, 300);
    }
  };

  const setParamInUrl = (cityId: string) => {
    setSearch('')
    setSearchResults([])
    router.push( '/search?c=' + cityId)
  }

  return (
    <div className="flex flex-col items-center justify-start w-full py-2 w-full">
      <SearchBar
        dropdownItems={searchResults}
        setSearchTerm={onSearch}
        searchTerm={search}
        setParamInUrl={setParamInUrl}
      />
    </div>
  );
}

type City = {
  city_id: number;
  name: string;
  name_unaccented: string;
  state_id: number;
  states: {
    sigla: string;
  };
};

type Props = {
  setSearchTerm: (query: string) => void;
  searchTerm: string;
  dropdownItems?: City[];
  setParamInUrl?: (cityId: string) => void;
};

export const SearchBar: React.FC<Props> = ({
  dropdownItems,
  setSearchTerm,
  searchTerm,
  setParamInUrl
}) => {
  return (
    <div className="relative w-full px-10 text-2xl max-w-2xl">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-md bg-zinc-800"
        placeholder="Selecionar cidade"
      />
      {dropdownItems && dropdownItems.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 mx-5 border border-gray-500 bg-zinc-900 z-10 w-auto rounded-b-lg"
          style={{ left: '1.25rem', right: '1.25rem' }} // Corresponding to 5 (from ml-3 and mr-3) divided by 4 (Tailwind's scaling factor)
        >
          {(dropdownItems || []).map((result) => (
            <div
              onClick={() => setParamInUrl && setParamInUrl(result.city_id.toString())}
              key={result.city_id}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-500"
            >
              {result.name} - {result.states.sigla}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
