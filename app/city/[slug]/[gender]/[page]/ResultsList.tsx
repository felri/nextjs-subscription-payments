'use client';

import Card from './Card';
import PhoneModal from '@/components/PhoneModal';
import { Database } from '@/types_db';
import { openWhatsapp } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ResultsListProps {
  sellers: Database['public']['Tables']['sellers']['Row'][];
  city: string;
  page: number;
  totalPages: number;
  gender: string;
  slug: string;
}

const ResultsList: React.FC<ResultsListProps> = ({
  sellers,
  city,
  page,
  totalPages,
  gender,
  slug
}) => {
  const router = useRouter();

  if (!sellers || sellers.length === 0) {
    return (
      <p className="text-white text-center mt-4">
        Nenhum resultado encontrado para {city}
      </p>
    );
  }

  const [showPhone, setShowPhone] = React.useState(false);
  const [selectedSeller, setSelectedSeller] = React.useState<
    Database['public']['Tables']['sellers']['Row'] | null
  >(null);

  const onShowPhone = (
    seller: Database['public']['Tables']['sellers']['Row'] | undefined
  ) => {
    setSelectedSeller(seller || null);
    setShowPhone(true);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(selectedSeller?.phone || '');
    setShowPhone(false);
  };

  const onClick = () => {
    router.push(`/city/${slug}/${gender}/${page}`);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center mt-4">
        {sellers.map((seller) => (
          <Card
            key={seller.user_id}
            seller={seller}
            media={seller?.media || []}
            onShowPhone={onShowPhone}
          />
        ))}
      </div>
      <Pagination page={page} total={totalPages} onClick={onClick} />
      <PhoneModal
        isOpen={showPhone}
        onWhatsapp={() => {
          setShowPhone(false);
          openWhatsapp(selectedSeller?.name || '', selectedSeller?.phone || '');
        }}
        onCancel={() => setShowPhone(false)}
        onCopy={onCopy}
        phone={selectedSeller?.phone || ''}
      />
    </div>
  );
};

const Pagination: React.FC<{
  page: number;
  total: number;
  onClick: (page: number) => void;
}> = ({ page, total, onClick }) => {
  const maxPagesToShow = 3;

  let startPage = Math.max(page - 2, 1);
  let endPage = Math.min(page + 2, total);

  if (page <= 3) {
    endPage = Math.min(maxPagesToShow, total);
  } else if (page >= total - 2) {
    startPage = total - maxPagesToShow + 1;
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => i + startPage
  );

  return (
    <div className="flex justify-center mt-4">
      {startPage > 1 && (
        <>
          <div
            className="mx-1 cursor-pointer p-2 rounded border border-gray-400 h-10 w-10 flex items-center justify-center text-gray-400"
            onClick={() => onClick(1)}
          >
            1
          </div>
          <div className="mx-1 p-2 rounded border border-gray-400 h-10 w-10 flex items-center justify-center text-gray-400">
            ...
          </div>
        </>
      )}

      {pages.map((p) => (
        <div
          className={`mx-1 cursor-pointer p-2 rounded 
            border border-gray-400 h-10 w-10 flex items-center justify-center
            ${p === page ? 'text-white' : 'text-gray-400'}`}
          key={p}
          onClick={() => onClick(p)}
        >
          {p}
        </div>
      ))}

      {endPage < total && (
        <>
          <div className="mx-1 p-2 rounded border border-gray-400 h-10 w-10 flex items-center justify-center text-gray-400">
            ...
          </div>
          <div
            className="mx-1 cursor-pointer p-2 rounded border border-gray-400 h-10 w-10 flex items-center justify-center text-gray-400"
            onClick={() => onClick(total)}
          >
            {total}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsList;
