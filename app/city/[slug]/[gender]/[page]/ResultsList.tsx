'use client';

import Card from './Card';
import PhoneModal from '@/components/PhoneModal';
import { Database } from '@/types_db';
import React from 'react';

interface ResultsListProps {
  sellers: Database['public']['Tables']['sellers']['Row'][];
  city: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ sellers, city }) => {
  if (!sellers || sellers.length === 0) {
    return (
      <p className="text-white text-center mt-4">
        Nenhum resultado encontrado para {city}
      </p>
    );
  }

  const [showPhone, setShowPhone] = React.useState(false);
  const [phone, setPhone] = React.useState('');

  const onShowPhone = (phone: string) => {
    setShowPhone(true);
    setPhone(phone);
  };

  const openWhatsapp = () => {
    window.open(`https://wa.me/55${phone}`, '_blank');
  };

  const onCopy = () => {
    navigator.clipboard.writeText(phone);
  };

  return (
    <div className="flex flex-wrap justify-center mt-4">
      {sellers.map((seller) => (
        <Card
          key={seller.user_id}
          seller={seller}
          media={seller?.media || []}
          onShowPhone={onShowPhone}
        />
      ))}
      <PhoneModal
        isOpen={showPhone}
        onWhatsapp={openWhatsapp}
        onCancel={() => setShowPhone(false)}
        onCopy={onCopy}
        phone={phone}
      />
    </div>
  );
};

export default ResultsList;
