import Card from './Card';
import { Database } from '@/types_db';
import React from 'react';

interface ResultsListProps {
  sellers: Database['public']['Tables']['sellers']['Row'][];
  city: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ sellers, city }) => {
  if (!sellers || sellers.length === 0) {
    return <p className="text-white text-center mt-4">Nenhum resultado encontrado para {city}</p>;
  }

  return (
    <div className="flex flex-wrap justify-center mt-4">
      {sellers.map((seller) => (
        <Card
          key={seller.user_id}
          seller={seller}
          media={seller?.media?.media || []}
        />
      ))}
    </div>
  );
};

export default ResultsList;
