'use client';

import { Card } from '@/app/account/Card';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';
import type { Database } from 'types_db';

interface Props {
  seller: Database['public']['Tables']['sellers']['Row'];
}

interface StateSellerProps {
  cpf: string | null;
  full_name: string | null;
  birthday: string | null;
}

const SectionAddress: React.FC<Props> = ({ seller }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [stateSeller, setStateSeller] = React.useState<StateSellerProps>({
    cpf: seller.cpf ?? null,
    full_name: seller.full_name ?? null,
    birthday: seller.birthday ?? null
  });
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const checkInputsBeforeSave = () => {
    if (
      stateSeller.cpf === null ||
      stateSeller.full_name === null ||
      stateSeller.birthday === null
    ) {
      return false;
    }
    // check cpf length and if its valid
    if (stateSeller.cpf.length !== 14) {
      return false;
    }
    // check full_name length
    if (stateSeller.full_name.length < 3) {
      return false;
    }
    // check birthday length
    if (stateSeller.birthday.length !== 10) {
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (!checkInputsBeforeSave()) {
      setErrorMessages([
        'Preencha todos os campos corretamente antes de salvar.'
      ]);
      return;
    }
    setLoading(true);

    // Convert birthday from DD/MM/YYYY to YYYY-MM-DD
    if (stateSeller.birthday === null) {
      return;
    }
    const [day, month, year] = stateSeller.birthday.split('/');
    const formattedBirthday = `${year}-${month}-${day}`;

    try {
      await fetch('/api/seller', {
        method: 'PUT',
        body: JSON.stringify({
          cpf: stateSeller.cpf,
          full_name: stateSeller.full_name,
          birthday: formattedBirthday
        })
      });

      setLoading(false);
      toast.success('Informações pessoais salvas com sucesso.');
      setTimeout(() => {
        router.push('/verification/document');
      }, 1000);
    } catch (error) {
      toast.error('Erro ao salvar informações pessoais.');
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let newValue = value;
    if (name === 'cpf') {
      newValue = value.replace(/\D/g, '');
      if (newValue.length <= 11) {
        newValue = newValue.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          '$1.$2.$3-$4'
        );
      }
    }

    if (name === 'birthday') {
      newValue = value.replace(/\D/g, '');
      if (newValue.length <= 8) {
        newValue = newValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
      }
    }

    setStateSeller((prevState) => ({
      ...prevState,
      [name]: newValue
    }));
  };

  return (
    <div className="p-4">
      <Card
        title="Informações pessoais"
        description="Informe seus dados pessoais."
        footer={
          <div className="flex flex-col items-end justify-between sm:flex-row sm:items-center">
            <Button
              variant="slim"
              type="submit"
              onClick={saveChanges}
              disabled={loading}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              {loading ? <LoadingDots /> : 'Salvar'}
            </Button>
          </div>
        }
      >
        <div className="mt-8 mb-4 text-xl font-semibold">
          <label className="block mb-2 text-sm">Nome completo</label>
          <input
            type="text"
            name="full_name"
            className="w-full p-3 rounded-md bg-zinc-800 mb-4"
            placeholder="Nome completo"
            value={stateSeller?.full_name ?? ''}
            onChange={handleChange}
          />
          <label className="block mb-2 text-sm">CPF</label>
          <input
            maxLength={14}
            name="cpf"
            className="w-full p-3 rounded-md bg-zinc-800 mb-4"
            placeholder="CPF"
            value={stateSeller?.cpf ?? ''}
            onChange={handleChange}
          />
          <label className="block mb-2 text-sm">Data de nascimento</label>
          <input
            maxLength={10}
            name="birthday"
            className="w-full p-3 rounded-md bg-zinc-800 mb-4"
            placeholder="Data de nascimento"
            value={stateSeller?.birthday ?? ''}
            onChange={handleChange}
          />

          <div className="flex flex-col items-center justify-between sm:flex-row sm:items-center">
            {
              // show error messages
              errorMessages.map((message, index) => (
                <p key={index} className="text-red-500 text-center text-sm">
                  {message}
                </p>
              ))
            }
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SectionAddress;
