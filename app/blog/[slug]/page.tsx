import { Database } from '@/types_db';
import { cityNameToSlug } from '@/utils/helpers';
import { getAllCapitals, getPostBySlug } from '@/utils/supabase-admin';
import Image from 'next/image';
import Link from 'next/link';

interface PostProps {
  params: {
    slug: string;
  };
}

export default async function Post({ params }: PostProps) {
  const post = await getPostBySlug(params.slug);
  const capitals = await getAllCapitals();

  const getLink = (city: any, type: string) => {
    const slug = cityNameToSlug(city.name) + '-' + city.city_id;
    return `/city/${slug}/${type}/1`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      {post.image_url && (
        <Image
          src={`/${post.image_url}`}
          alt={post.title + ' image'}
          width={800}
          height={400}
          className="rounded mb-6"
        />
      )}

      {post.content.map((section: any, index: number) => (
        <div key={index} className="mb-6">
          {section.subTitle && (
            <h2 className="text-2xl mb-3">{section.subTitle}</h2>
          )}
          {section.content.map((para: string, pIndex: number) => (
            <p key={pIndex} className="mb-4">
              {para}
            </p>
          ))}
        </div>
      ))}
      {/* list all capitals with links for google bot index  */}
      <h2 className="text-xl mb-3 text-center">Encontre acompanhantes em:</h2>
      <div className="flex-row flex flex-wrap w-full justify-center my-4 mx-1 max-w-2xl">
        {capitals.map((city) => (
          <div className="mx-1 underline text-gray-400" key={city.city_id}>
            <Link
              className="flex flex-col items-start justify-start mt-4"
              href={getLink(city, 'female')}
            >
              <p className="text-center">
                {city.name} - {city.states.sigla}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
