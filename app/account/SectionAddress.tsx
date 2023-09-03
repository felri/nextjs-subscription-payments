'use client';

import { Card } from './Card';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import React, { useEffect } from 'react';
import type { Database } from 'types_db';

interface Props {
  states: Database['public']['Tables']['states']['Row'][];
  seller: Database['public']['Tables']['sellers']['Row'];
}

const SectionAddress: React.FC<Props> = ({ states, seller }) => {
  const [loading, setLoading] = React.useState(false);
  const [cities, setCities] = React.useState<
    Database['public']['Tables']['cities']['Row'][]
  >([]);
  const [neighborhoods, setNeighborhoods] = React.useState<string | null>(
    seller.neighborhood
  );
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
  const [selectedState, setSelectedState] = React.useState<string | null>(
    states.find((state) => state.state_id === seller.state_id)?.name ?? ''
  );

  const stateChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setSelectedState(event.target.value);
    setSelectedCity(null);
    setNeighborhoods(null);

    const stateObj = states.find((state) => state.name === event.target.value);

    if (stateObj) {
      const stateId = stateObj.state_id;
      const newSeller = {
        ...seller,
        state_id: stateId,
        city_id: null,
        neighborhood: null
      };
      await fetch('/api/seller', {
        method: 'PUT',
        body: JSON.stringify(newSeller)
      });
    }
    setLoading(false);
  };

  const cityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setSelectedCity(event.target.value);
    setNeighborhoods(null);

    const cityObj = cities.find((city) => city.name === event.target.value);
    const stateId = states.find(
      (state) => state.name === selectedState
    )?.state_id;
    if (cityObj) {
      const cityId = cityObj.city_id;
      const newSeller = {
        ...seller,
        city_id: cityId,
        state_id: stateId,
        neighborhood: null
      };
      await fetch('/api/seller', {
        method: 'PUT',
        body: JSON.stringify(newSeller)
      });
    }
    setLoading(false);
  };

  const saveChanges = async () => {
    setLoading(true);
    const cityId = cities.find((city) => city.name === selectedCity)?.city_id;
    const stateId = states.find(
      (state) => state.name === selectedState
    )?.state_id;
    const newSeller = {
      ...seller,
      neighborhood: neighborhoods,
      city_id: cityId,
      state_id: stateId
    };
    await fetch('/api/seller', {
      method: 'PUT',
      body: JSON.stringify(newSeller)
    });
    setLoading(false);
  };

  const fetchCitiesByState = async (stateId: string) => {
    const res = await fetch(`/api/cities`, {
      method: 'POST',
      body: JSON.stringify({ stateId })
    });

    const data = await res.json();
    const sellerCity = data.cities.find(
      (city: Database['public']['Tables']['cities']['Row']) =>
        city.city_id === seller.city_id
    );

    setSelectedCity(sellerCity?.name ?? '');
    setCities(data.cities);
  };

  useEffect(() => {
    if (selectedState) {
      const stateObj = states.find((state) => state.name === selectedState);
      if (stateObj) {
        const stateId = stateObj.state_id;
        fetchCitiesByState(stateId);
      }
    }
  }, [selectedState]);

  return (
    <Card
      title="Local"
      description="Infomações sobre o local de atendimento."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            Informe sua cidade e bairro. Não é necessário informar o endereço
            completo.
          </p>
          <Button onClick={saveChanges} disabled={loading} variant="slim">
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            {loading ? <LoadingDots /> : 'Atualizar Local'}
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <select
          name="state"
          className="w-full p-3 rounded-md bg-zinc-800 mb-4"
          defaultValue={selectedState ?? ''}
          onChange={stateChange}
        >
          <option value="" disabled>
            Selecione seu estado
          </option>
          {states.map((state) => (
            <option key={state.state_id} value={state.name ?? ''}>
              {state.name}
            </option>
          ))}
        </select>
        {selectedState && cities.length > 0 && (
          <select
            name="city"
            className="w-full p-3 rounded-md bg-zinc-800 mb-4"
            defaultValue={selectedCity ?? ''}
            onChange={cityChange}
          >
            <option value="" disabled>
              Selecione sua cidade
            </option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.name ?? ''}>
                {city.name}
              </option>
            ))}
          </select>
        )}
        {selectedCity && (
          <input
            type="text"
            name="neighborhood"
            className="w-full p-3 rounded-md bg-zinc-800 mb-4"
            placeholder="Bairro"
            value={neighborhoods ?? ''}
            onChange={(event) => setNeighborhoods(event.target.value)}
          />
        )}
      </div>
    </Card>
  );
};

export default SectionAddress;
