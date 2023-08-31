'use client';

import LoadingDots from '@/components/ui/LoadingDots';
import { cityNameToSlug } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function SearchBarPage({
  refreshWhenGenderChanges,
  gender = 'female',
  slug
}: {
  refreshWhenGenderChanges?: boolean;
  gender?: string;
  slug?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [selectedGender, setSelectedGender] = useState(gender);
  const fetchTimeoutRef = React.useRef<number | null>(null);

  const fetchResults = async (query: string) => {
    setLoading(true);
    const res = await fetch(`/api/search/auto-complete`, {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setSearchResults(data.cities);
    setLoading(false);
  };

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      fetchTimeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay) as unknown as number;
    };
  };

  const debouncedFetchResults = debounce(fetchResults, 300);

  const onSearch = (query: string) => {
    setSearch(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    if (query.length >= 3) {
      debouncedFetchResults(query);
    }
  };

  const setParamInUrl = (city: City) => {
    const slug =
      cityNameToSlug(city.name) +
      '-' +
      city.states.sigla.toLowerCase() +
      '-' +
      city.city_id;
    setSearch('');
    setSearchResults([]);
    router.push(`/city/${slug}/${gender}/1`);
  };

  const handleGenderChange = (g: string) => {
    setSelectedGender(g);
    if (refreshWhenGenderChanges) {
      router.push(`/city/${slug}/${g}/1`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full py-2 w-full">
      <GenderSelect
        selectedGender={selectedGender}
        onSelect={handleGenderChange}
      />
      <SearchBar
        dropdownItems={searchResults}
        setSearchTerm={onSearch}
        searchTerm={search}
        setParamInUrl={setParamInUrl}
        loading={loading}
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
  setParamInUrl?: (city: City) => void;
  loading?: boolean;
};

export const SearchBar: React.FC<Props> = ({
  dropdownItems,
  setSearchTerm,
  searchTerm,
  setParamInUrl,
  loading
}) => {
  return (
    <div className="relative w-full px-10 text-2xl max-w-2xl relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-md bg-zinc-800"
        placeholder="Selecionar cidade"
      />
      {loading && (
        <div className="w-full flex items-center justify-center mt-5 absolute top-14 left-0 right-0">
          <LoadingDots />
        </div>
      )}
      {dropdownItems && dropdownItems.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 mx-5 border border-gray-500 bg-zinc-900 z-10 w-auto rounded-b-lg"
          style={{ left: '1.25rem', right: '1.25rem' }} // Corresponding to 5 (from ml-3 and mr-3) divided by 4 (Tailwind's scaling factor)
        >
          {(dropdownItems || []).map((result) => (
            <div
              onClick={() => setParamInUrl && setParamInUrl(result)}
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

type ButtonProps = {
  onClick: (g: string) => void;
  selected: boolean;
  className?: string;
  title: string;
  value: string;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  className,
  onClick,
  selected,
  value,
  ...props
}) => {
  return (
    <button
      className={`${
        selected ? 'bg-zinc-300 text-gray-800' : 'bg-zinc-900 text-white '
      } ${className} font-semibold px-3 py-2 rounded-md hover:bg-zinc-800 min-w-[80px]`}
      onClick={() => onClick(value)}
      {...props}
    >
      {title}
    </button>
  );
};

type GenderSelectProps = {
  onSelect: (g: string) => void;
  selectedGender: string;
};

export const GenderSelect: React.FC<GenderSelectProps> = ({
  onSelect,
  selectedGender
}) => {
  return (
    <div className="relative w-full px-10 text-2xl max-w-2xl flex justify-around items-center my-6">
      <Button
        className="text-sm p-1 rounded-lg"
        onClick={onSelect}
        selected={selectedGender.toLowerCase() === 'female'}
        title="Mulheres"
        value="female"
      />
      <Button
        className="text-sm p-1 rounded-lg"
        onClick={onSelect}
        selected={selectedGender.toLowerCase() === 'trans'}
        title="Trans"
        value="trans"
      />

      <Button
        className="text-sm p-1 rounded-lg"
        onClick={onSelect}
        selected={selectedGender.toLowerCase() === 'male'}
        title="Homens"
        value="male"
      />
    </div>
  );
};
