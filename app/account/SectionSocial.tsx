'use client';

import { Card } from './Card';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { AiOutlineInstagram } from 'react-icons/ai';
import { BsTelegram } from 'react-icons/bs';
import { SiOnlyfans } from 'react-icons/si';
import type { Database } from 'types_db';

interface Props {
  seller: Database['public']['Tables']['sellers']['Row'];
}

interface Errors {
  instagram: boolean;
  telegram: boolean;
  onlyfans: boolean;
  privacy: boolean;
}

const SectionSocial: React.FC<Props> = ({ seller }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [stateSeller, setStateSeller] = React.useState(seller);
  const [errors, setErrors] = React.useState<Errors>({
    instagram: false,
    telegram: false,
    onlyfans: false,
    privacy: false
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

    if (name === 'telegram') {
      const numberPhone = value.replace(/\D/g, '');
      setStateSeller((prevState) => ({
        ...prevState,
        telegram: numberPhone
      }));
      return;
    }

    setStateSeller((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
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
      title="Redes Sociais"
      description="(Opcional)"
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Clique para atualizar suas redes.</p>
          <Button disabled={loading} variant="slim" onClick={handleSave}>
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            {loading ? <LoadingDots /> : 'Atualizar'}
          </Button>
        </div>
      }
    >
      <div className="mt-2 mb-4 text-xl font-semibold mt-2">
        <div className="flex items-start justify-between flex-col">
          <label className="flex items-center text-sm mb-2">
            <AiOutlineInstagram className="mr-2" />
            Instagram
          </label>
          <input
            type="text"
            name="instagram"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={stateSeller?.instagram ?? ''}
            placeholder="@"
            maxLength={64}
            onChange={onChange}
          />
        </div>
        <div className="flex items-start justify-between flex-col">
          <label className="flex items-center text-sm my-2">
            <BsTelegram className="mr-2" />
            Telegram
          </label>
          <input
            value={maskPhone(stateSeller?.telegram ?? '')}
            className="w-full p-3 rounded-md bg-zinc-800"
            placeholder="(00) 00000-0000"
            name="telegram"
            type="tel"
            onChange={onChange}
            maxLength={15}
          />
        </div>
        <div className="flex items-start justify-between flex-col">
          <label className="flex items-center text-sm my-2">
            <SiOnlyfans className="mr-2" />
            Onlyfans
          </label>

          <input
            name="onlyfans"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={stateSeller?.onlyfans ?? ''}
            placeholder="@"
            max={64}
            onChange={onChange}
          />
        </div>
        <div className="flex items-start justify-between flex-col">
          <label className="flex items-center text-sm my-2">
            <SiOnlyfans className="mr-2" />
            Privacy
          </label>

          <input
            name="privacy"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={stateSeller?.privacy ?? ''}
            placeholder="@"
            max={64}
            onChange={onChange}
          />
        </div>
      </div>
    </Card>
  );
};

export default SectionSocial;
