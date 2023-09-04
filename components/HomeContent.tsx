import { cityNameToSlug } from '@/utils/helpers';
import { getAllCapitals } from '@/utils/supabase-admin';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomeContent() {
  const capitals = await getAllCapitals();

  const randomCitiesOne = capitals
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  const randomCitiesTwo = capitals
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  const randomCitiesThree = capitals
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  const getLink = (city: any, type: string) => {
    const slug = cityNameToSlug(city.name) + '-' + city.city_id;
    return `/city/${slug}/${type}/1`;
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <p className="text-white text-center text-xl my-6">
        Anúncios de acompanhantes <br />
        em todo o Brasil
      </p>
      {/* display three images in one grid row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-2 mt-4">
        <div className="sm:flex-col flex-row flex">
          <div className="relative" style={{ width: '150px', height: '150px' }}>
            <Image
              src="/female.png"
              alt="Media"
              width="0"
              height="0"
              sizes="100vw"
              className="rounded overflow-hidden object-cover border border-pink-400"
              style={{ width: '150px', height: '150px' }}
            />

            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

            <p className="absolute bottom-2 left-4 text-white">Mulheres</p>
          </div>

          <div className="ml-4 underline">
            {randomCitiesOne.map((city) => (
              <Link
                key={city.city_id} // Added key for best practice
                className="flex flex-col items-start justify-start mt-4"
                href={getLink(city, 'female')}
              >
                <p className="text-center">
                  {city.name} - {city.states.sigla}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="sm:flex-col flex-row flex">
          <div className="relative" style={{ width: '150px', height: '150px' }}>
            <Image
              src="/trans.png"
              alt="Media"
              width="0"
              height="0"
              sizes="100vw"
              className="rounded overflow-hidden object-cover border border-pink-400"
              style={{ width: '150px', height: '150px' }}
            />

            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

            <p className="absolute bottom-2 left-4 text-white">Trans</p>
          </div>
          <div className="ml-4 underline">
            {randomCitiesTwo.map((city) => (
              <Link
                className="flex flex-col items-start justify-start mt-4"
                href={getLink(city, 'trans')}
              >
                <p className="text-center">
                  {city.name} - {city.states.sigla}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="sm:flex-col flex-row flex">
          <div className="relative" style={{ width: '150px', height: '150px' }}>
            <Image
              src="/man.png"
              alt="Media"
              width="0"
              height="0"
              sizes="100vw"
              className="rounded overflow-hidden object-cover border border-pink-400"
              style={{ width: '150px', height: '150px' }}
            />

            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

            <p className="absolute bottom-2 left-4 text-white">Homens</p>
          </div>
          <div className="ml-4 underline">
            {randomCitiesThree.map((city) => (
              <Link
                className="flex flex-col items-start justify-start mt-4"
                href={getLink(city, 'male')}
              >
                <p className="text-center">
                  {city.name} - {city.states.sigla}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* list all capitals with links for google bot index  */}
      <div className="flex-row flex flex-wrap w-full justify-center my-4 mx-1">
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
