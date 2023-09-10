'use client';

import { Card } from './Card';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import { revalidatePath } from 'next/cache';
import React, { use, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import type { Database } from 'types_db';

interface Props {
  seller: Database['public']['Tables']['sellers']['Row'];
}
const SectionPayment: React.FC<Props> = ({ seller }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateSeller, setStateSeller] = React.useState(seller);

  useEffect(() => {
    setStateSeller(seller);
  }, [seller]);

  const onChange = (value: string | undefined, name: string | undefined) => {
    if (!name) return;
    setStateSeller((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    const currentPaymentMethods = stateSeller.payment_methods ?? [];

    if (checked) {
      setStateSeller((prevState) => ({
        ...prevState,
        payment_methods: [...currentPaymentMethods, name]
      }));
    } else {
      const newPaymentMethods = currentPaymentMethods.filter(
        (method) => method !== name
      );
      setStateSeller((prevState) => ({
        ...prevState,
        payment_methods: newPaymentMethods
      }));
    }
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
    revalidatePath('/account');
  };

  return (
    <Card
      title="Pagamento"
      description="Informações sobre pagamento"
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            Clique em "Atualizar Pagamento" para salvar as informações.
          </p>
          <Button disabled={loading} variant="slim" onClick={onSave}>
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            {loading ? <LoadingDots /> : 'Atualizar Pagamento'}
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <div className="mb-4 flex items-center justify-between">
          <span className="mr-4">Valor por Hora</span>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <CurrencyInput
            id="input-name"
            prefix="R$ "
            name="hourly_rate"
            placeholder="0,00"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={stateSeller.hourly_rate ?? undefined}
            decimalsLimit={2}
            onValueChange={onChange}
            decimalSeparator=","
            groupSeparator="."
          />
        </div>
        <div className="mb-4 flex items-start justify-between flex-col">
          <span className="mr-4">Formas de Pagamento</span>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="pix"
              checked={stateSeller?.payment_methods?.includes('pix')}
            />
            Pix
          </label>

          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="debit"
              checked={stateSeller?.payment_methods?.includes('debit')}
            />
            Débito
          </label>

          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="credit"
              checked={stateSeller?.payment_methods?.includes('credit')}
            />
            Crédito
          </label>
          <label className="mr-4 p-2 w-full border-gray-700 border-b flex items-center justify-start">
            <input
              onChange={onCheck}
              className="mr-2"
              type="checkbox"
              name="cash"
              checked={stateSeller?.payment_methods?.includes('cash')}
            />
            Dinheiro
          </label>
        </div>
      </div>
    </Card>
  );
};

export default SectionPayment;
