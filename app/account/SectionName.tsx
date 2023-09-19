'use client';

import { Card } from './Card';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import type { Database } from 'types_db';

interface Props {
  seller: Database['public']['Tables']['sellers']['Row'];
}

interface Errors {
  name: boolean;
  phone: boolean;
  short_description: boolean;
}

const SectionName: React.FC<Props> = ({ seller }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [stateSeller, setStateSeller] = React.useState(seller);
  const [errors, setErrors] = React.useState<Errors>({
    name: false,
    phone: false,
    short_description: false
  });

  useEffect(() => {
    setStateSeller(seller);
  }, [seller]);

  const maskPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const char: any = { 0: '(', 2: ') ', 7: '-' };
    let formattedValue = '';

    for (let i = 0; i < numbers.length; i++) {
      formattedValue += (char[i] || '') + numbers[i];
    }

    return formattedValue;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'phone') {
      const numberPhone = value.replace(/\D/g, '');
      setStateSeller((prevState) => ({
        ...prevState,
        phone: numberPhone
      }));
      return;
    }

    setStateSeller((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const checkInputsBeforeSave = () => {
    const newName = stateSeller.name;
    const newPhone = stateSeller.phone;
    const newShortDescription = stateSeller.short_description;

    const numberPhone = newPhone?.replace(/\D/g, '');

    const newErrors = { ...errors };

    newErrors.name =
      !newName || newName.length > 64 || newName.length < 2 ? true : false;

    newErrors.phone =
      !numberPhone || numberPhone.length > 11 || numberPhone.length < 11
        ? true
        : false;

    newErrors.short_description =
      !newShortDescription || newShortDescription.length > 256 ? true : false;

    setErrors(newErrors);

    if (newErrors.name || newErrors.phone || newErrors.short_description) {
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!checkInputsBeforeSave()) {
      return;
    }
    setLoading(true);
    const res = await fetch('/api/seller', {
      method: 'PUT',
      body: JSON.stringify(stateSeller)
    });
    if (!res.ok) {
      console.error(`Failed to save`, res.statusText);
    }
    router.refresh();
    setLoading(false);
  };

  return (
    <Card
      title="Dados Pessoais"
      description="Seu nome, Whatsapp e descrição curta."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Clique para atualizar seus dados.</p>
          <Button disabled={loading} variant="slim" onClick={handleSave}>
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            {loading ? <LoadingDots /> : 'Atualizar Dados'}
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <input
          type="text"
          name="name"
          className="w-full p-3 rounded-md bg-zinc-800"
          defaultValue={stateSeller?.name ?? ''}
          placeholder="Seu nome"
          maxLength={64}
          onChange={onChange}
        />
        <input
          value={maskPhone(stateSeller?.phone ?? '')}
          className="w-full p-3 rounded-md bg-zinc-800 mt-4"
          placeholder="Seu Whatsapp"
          name="phone"
          type="tel"
          onChange={onChange}
          maxLength={15}
        />
        <input
          name="short_description"
          className="w-full p-3 rounded-md bg-zinc-800  mt-4"
          defaultValue={stateSeller?.short_description ?? ''}
          placeholder="Sua descrição curta"
          max={256}
          onChange={onChange}
        />
      </div>
      {(errors.name || errors.phone || errors.short_description) && (
        <div className="bg-red-500 text-white p-2 rounded-md mt-4 text-sm">
          <div>
            {errors.name && <p>Nome inválido</p>}
            {errors.phone && <p>Telefone inválido</p>}
            {errors.short_description && <p>Descrição curta inválida</p>}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SectionName;
