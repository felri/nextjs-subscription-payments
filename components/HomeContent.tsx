import Logo from '@/components/icons/Logo';
import { cityNameToSlug } from '@/utils/helpers';
import { getAllCapitals } from '@/utils/supabase-admin';
import Image from 'next/image';

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
    const slug =
      cityNameToSlug(city.name) +
      '-' +
      city.states.sigla.toLowerCase() +
      '-' +
      city.city_id;
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
          <Image
            src="/female.png"
            alt="Media"
            width="0"
            height="0"
            sizes="100vw"
            className="rounded overflow-hidden object-cover"
            style={{ width: '150px', height: '150px' }}
          />
          <div className="ml-4 underline">
            {randomCitiesOne.map((city) => (
              <a
                className="flex flex-col items-start justify-start mt-4"
                href={getLink(city, 'female')}
              >
                <p className="text-center">
                  {city.name} - {city.states.sigla}
                </p>
              </a>
            ))}
          </div>
        </div>
        <div className="sm:flex-col flex-row flex">
          <Image
            src="/trans.png"
            alt="Media"
            width="0"
            height="0"
            sizes="100vw"
            className="rounded overflow-hidden object-cover"
            style={{ width: '150px', height: '150px' }}
          />
          <div className="ml-4 underline">
            {randomCitiesTwo.map((city) => (
              <a
                className="flex flex-col items-start justify-start mt-4"
                href={getLink(city, 'trans')}
              >
                <p className="text-center">
                  {city.name} - {city.states.sigla}
                </p>
              </a>
            ))}
          </div>
        </div>
        <div className="sm:flex-col flex-row flex">
          <Image
            src="/man.png"
            alt="Media"
            width="0"
            height="0"
            sizes="100vw"
            className="rounded overflow-hidden object-cover"
            style={{ width: '150px', height: '150px' }}
          />
          <div className="ml-4 underline">
            {randomCitiesThree.map((city) => (
              <a
                className="flex flex-col items-start justify-start mt-4"
                href={getLink(city, 'male')}
              >
                <p className="text-center">
                  {city.name} - {city.states.sigla}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
