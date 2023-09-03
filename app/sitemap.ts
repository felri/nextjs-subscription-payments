import { cityNameToSlug } from '@/utils/helpers';
import { getAllCapitals } from '@/utils/supabase-admin';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const defaultRouter: MetadataRoute.Sitemap = [
    {
      url: 'https://primabela.lol/',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: 'https://primabela.lol/terms',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5
    }
  ];

  for (let url of urls) {
    defaultRouter.push({
      url: `https://primabela.lol/city/${url.slug}/${url.gender}/${url.page}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    });
  }

  console.log(defaultRouter);

  return [...defaultRouter];
}
