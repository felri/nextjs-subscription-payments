'use client';

import { Card } from './Card';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import React, { useEffect } from 'react';
import type { Database } from 'types_db';

interface Props {
  seller: Database['public']['Tables']['sellers']['Row'];
}

const SectionGeneralInformation: React.FC<Props> = ({ seller }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateSeller, setStateSeller] = React.useState(seller);
  const [forceUpdate, setForceUpdate] = React.useState(false);

  useEffect(() => {
    setStateSeller(seller);
  }, [seller]);

  // force update to fix radio buttons
  useEffect(() => {
    setForceUpdate(true);
  }, [stateSeller]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setStateSeller((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStateSeller((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setStateSeller((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const onSave = async () => {
    setLoading(true);
    const res = await fetch('/api/seller', {
      method: 'PUT',
      body: JSON.stringify(stateSeller)
    });
    if (!res.ok) {
      console.error(`Failed to save`, res.statusText);
    }
    setLoading(false);
  };

  return (
    <Card
      title="Informações gerais"
      description="Peso, altura e outras informações"
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            Clique em "Atualizar Informações" para salvar as alterações.
          </p>
          <Button disabled={loading} variant="slim" onClick={onSave}>
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            {loading ? <LoadingDots /> : 'Atualizar Informações'}
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <select
          name="age"
          className="w-full p-3 rounded-md bg-zinc-800 mb-4"
          defaultValue={stateSeller?.age ?? ''}
          onChange={onChange}
        >
          <option value="" disabled>
            Idade
          </option>
          {[...Array(70).keys()].map((i) => {
            const age = 18 + i;
            return (
              <option key={age} value={age}>
                {age} anos
              </option>
            );
          })}
        </select>
        <select
          name="current_height"
          className="w-full p-3 rounded-md bg-zinc-800 mb-4"
          defaultValue={stateSeller?.current_height ?? ''}
          onChange={onChange}
        >
          <option value="" disabled>
            Altura
          </option>
          {[...Array(101).keys()].map((i) => {
            const height = (1.3 + i * 0.01).toFixed(2);
            return (
              <option key={height} value={height}>
                {height} m
              </option>
            );
          })}
        </select>

        <select
          name="current_weight"
          className="w-full p-3 rounded-md bg-zinc-800 mb-4"
          defaultValue={stateSeller?.current_weight ?? 0}
          onChange={onChange}
        >
          <option value="" disabled>
            Peso
          </option>
          {[...Array(111).keys()].map((i) => {
            const weight = 40 + i;
            return (
              <option key={weight} value={weight}>
                {weight} kg
              </option>
            );
          })}
        </select>

        <select
          name="shoe_size"
          className="w-full p-3 rounded-md bg-zinc-800 mb-4"
          defaultValue={stateSeller?.shoe_size ?? ''}
          onChange={onChange}
        >
          <option value="" disabled>
            Tamanho do pé
          </option>
          {[...Array(18).keys()].map((i) => {
            const shoe_size = 30 + i;
            return (
              <option key={shoe_size} value={shoe_size}>
                {shoe_size}
              </option>
            );
          })}
        </select>
        <div className="mb-4 flex items-start justify-between flex-col">
          <span className="mr-4">Gênero</span>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="gender"
              value="female"
              checked={stateSeller.gender === 'female'}
            />{' '}
            Mulher
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="gender"
              value="trans"
              checked={stateSeller.gender === 'trans'}
            />{' '}
            Trans
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="gender"
              value="male"
              checked={stateSeller.gender === 'male'}
            />{' '}
            Homem
          </label>
        </div>
        <div className="mb-4 flex items-start justify-between flex-col">
          <span className="mr-4">Orientação sexual</span>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="sexual_orientation"
              value="heterosexual"
              checked={stateSeller?.sexual_orientation === 'heterosexual'}
            />{' '}
            Heterossexual
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="sexual_orientation"
              value="homosexual"
              checked={stateSeller.sexual_orientation == 'homosexual'}
            />{' '}
            Homossexual
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="sexual_orientation"
              value="bisexual"
              checked={stateSeller.sexual_orientation === 'bisexual'}
            />{' '}
            Bissexual
          </label>
        </div>
        <div className="mb-4 flex items-start justify-between flex-col">
          <span className="mr-4">Eticidade</span>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="ethnicity"
              value="white"
              checked={stateSeller.ethnicity === 'white'}
            />{' '}
            Branco
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="ethnicity"
              value="black"
              checked={stateSeller.ethnicity === 'black'}
            />{' '}
            Preto
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="ethnicity"
              value="asian"
              checked={stateSeller.ethnicity === 'asian'}
            />{' '}
            Asiático
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="ethnicity"
              value="indigenous"
              checked={stateSeller.ethnicity === 'indigenous'}
            />{' '}
            Indígena
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onRadio}
              className="mr-2"
              type="radio"
              name="ethnicity"
              value="brown"
              checked={stateSeller.ethnicity === 'mixed'}
            />{' '}
            Pardo
          </label>
        </div>
        <div className="mb-4 flex items-start justify-between flex-col">
          <span className="mr-4">Modificações corporais</span>

          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="has_tattoos"
              checked={stateSeller.has_tattoos ?? false}
            />
            Tattoo
          </label>

          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="has_piercings"
              checked={stateSeller.has_piercings ?? false}
            />
            Piercing
          </label>

          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="has_silicone"
              checked={stateSeller.has_silicone ?? false}
            />
            Silicone
          </label>
        </div>
      </div>
    </Card>
  );
};

export default SectionGeneralInformation;
