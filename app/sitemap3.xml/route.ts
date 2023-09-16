import { cityNameToSlug } from '@/utils/helpers';
import { getAllCapitals } from '@/utils/supabase-admin';
import { MetadataRoute } from 'next';
import { NextRequest } from 'next/server';

const getSitemap = async () => {
  const capitals = await getAllCapitals();
  const genders = ['female', 'trans', 'male'];
  const urls = [];
  for (const capital of capitals) {
    for (const gender of genders) {
      if (capital.name) {
        const slug = cityNameToSlug(capital.name) + '-' + capital.city_id;
        const params = {
          slug,
          gender,
          page: '1'
        };
        urls.push({
          ...params
        });
      }
    }
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11, so we add 1 to get the correct month number
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const defaultRouter: MetadataRoute.Sitemap = [
    {
      url: 'https://primabela.lol/',
      lastModified: formattedDate,
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: 'https://primabela.lol/signin',
      lastModified: formattedDate,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: 'https://primabela.lol/terms',
      lastModified: formattedDate,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: 'https://primabela.lol/pricing',
      lastModified: formattedDate,
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];

  for (let url of urls) {
    defaultRouter.push({
      url: `https://primabela.lol/city/${url.slug}/${url.gender}/${url.page}`,
      lastModified: formattedDate,
      changeFrequency: 'daily',
      priority: 1
    });
  }

  return [...defaultRouter];
};

export async function GET(req: NextRequest) {
  const sitemap: any = await getSitemap();

  const toXml = (urls: any) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item: any) => {
    return `
<url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
</url>
    `;
  })
  .join('')}
</urlset>`;

  return new Response(toXml(sitemap), {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml'
    }
  });
}
