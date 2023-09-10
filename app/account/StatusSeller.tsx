import { Database } from '@/types_db';
import React from 'react';

interface SellerStatusProps {
  seller: Database['public']['Tables']['sellers']['Row'];
}

const SellerStatus: React.FC<SellerStatusProps> = ({ seller }) => {
  const fieldsToFill = React.useMemo(() => {
    const fieldsRequired = [
      { name: 'Nome', value: seller.name },
      { name: 'Descrição curta', value: seller.short_description },
      { name: 'Whatsapp', value: seller.phone },
      { name: 'Cidade', value: seller.city_id },
      { name: 'Estado', value: seller.state_id },
      { name: 'Bairro', value: seller.neighborhood },
      { name: 'Imagem de capa', value: seller.featured_image_url },
      { name: 'Gênero', value: seller.gender },
      { name: 'Valor hora', value: seller.hourly_rate }
    ];

    return fieldsRequired.filter(
      (field) => !field.value || field.value === '' || field.value === 0
    );
  }, [seller]);

  

  return (
    <div className="bg-zinc-800 p-3 rounded-md mt-4 max-w-sm mx-auto">
      {seller.active ? (
        <div className="flex items-center">
          {/* little green ball */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block mr-1 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
          <p>Anúncio ativo</p>
        </div>
      ) : (
        <div>
          <>
            <div className="flex items-center">
              {/* little green ball */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block mr-1 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="5" />
              </svg>
              <p>Anúncio inativo</p>
            </div>
            <div className="text-sm text-gray-400 text-center">
              Preencha os campos abaixo para ativar:
            </div>
          </>
          <ul className="list-disc list-inside text-sm text-gray-400">
            {fieldsToFill.map((field) => (
              <li key={field.name}>{field.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SellerStatus;
