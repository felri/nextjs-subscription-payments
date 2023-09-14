import { Database } from '@/types_db';

type Price = Database['public']['Tables']['prices']['Row'];
const COMPRESSION_SERVER_URL = process.env.NEXT_PUBLIC_COMPRESSION_SERVER_URL;

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const getData = async ({ url }: { url: string }) => {
  console.log('getting,', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin'
  });

  if (!res.ok) {
    console.log('Error in getData', { url, res });

    throw Error(res.statusText);
  }

  return await res.json();
};

export const postData = async ({ url, data }: { url: string; data?: any }) => {
  console.log('posting,', url, data);

  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const putData = async ({ url, data }: { url: string; data?: any }) => {
  console.log('putting,', url, data);

  const res = await fetch(url, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in putData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const postToCompression = async ({
  url,
  data,
  key
}: {
  url: string;
  data?: any;
  key: string;
}) => {
  const res = await fetch(COMPRESSION_SERVER_URL + url, {
    method: 'POST',
    body: data,
    headers: {
      'x-api-key': key
    }
  });

  if (!res.ok) {
    console.log('Error in postFormData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const postFormData = async ({
  url,
  data
}: {
  url: string;
  data?: FormData;
}) => {
  console.log('posting,', url, data);

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    body: data
  });

  if (!res.ok) {
    console.log('Error in postFormData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const getStorageSupabaseUrl = (filename: string, userId: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = `${supabaseUrl}/storage/v1/object/public/primabela-bucket/${userId}/${filename}`;
  return url;
};

export const cityNameToSlug = (cityName: string) => {
  return cityName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s/g, '-');
};

export const formatCurrencyToBrl = (value: number | string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value));
};

export const formatPhonenumberBR = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeFirstLetterAllWords = (string: string) => {
  return string.split(' ').map(capitalizeFirstLetter).join(' ');
};

export const getEthinicity = (
  ethinicity: string | null | undefined
): string => {
  if (!ethinicity) return 'não informada';

  const ethinicityMap: {
    [key: string]: string;
  } = {
    white: 'Branco',
    black: 'Preto',
    brown: 'Pardo',
    yellow: 'Amarelo',
    indigenous: 'Indígena',
    asian: 'Asiático',
    other: 'Outro'
  };

  return ethinicityMap[ethinicity];
};

export const getSexualOrientation = (
  sexualOrientation: string | null | undefined
): string => {
  if (!sexualOrientation) return '';

  const sexualOrientationMap: {
    [key: string]: string;
  } = {
    heterosexual: 'Heterossexual',
    homosexual: 'Homossexual',
    bisexual: 'Bissexual'
  };

  return sexualOrientationMap[sexualOrientation];
};

export const getGenderText = (g: string | null | undefined) => {
  if (!g) return '';

  if (g === 'female') return 'Mulheres';
  if (g === 'male') return 'Homens';
  if (g === 'trans') return 'Trans';
};

export const openWhatsapp = (name: string, phone: string) => {
  const defaultText = `Olá ${capitalizeFirstLetterAllWords(
    name
  )}, tudo bem? Te encontrei no Primabela e gostaria de saber mais sobre seus serviços.`;

  window.open(
    `https://api.whatsapp.com/send?phone=55${phone}&text=${encodeURIComponent(
      defaultText
    )}`,
    '_blank'
  );
};

export function getFileExtension(filename: string): string {
  return filename?.split('.')?.pop()?.toLowerCase() || '';
}

export function generateFileName(extension: string): string {
  return `${Math.random()}.${extension}`;
}
