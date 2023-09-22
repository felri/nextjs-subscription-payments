import GitHub from '@/components/icons/GitHub';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';
import {
  AiFillDollarCircle,
  AiFillHome,
  AiFillInstagram,
  AiFillRedditCircle
} from 'react-icons/ai';
import { BiLogoDiscord } from 'react-icons/bi';
import { BsBookHalf } from 'react-icons/bs';
import { IoLogoWhatsapp } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900 -z-1">
      <div className="grid grid-cols-1 gap-8 py-12 text-white transition-colors duration-150 border-b lg:grid-cols-12 border-zinc-600 bg-zinc-900">
        <div className="col-span-1 lg:col-span-2">
          <Link
            href="/"
            className="flex items-center flex-initial font-bold md:mr-24"
          >
            <span className="mr-2 border rounded-full border-zinc-700">
              <Logo />
            </span>
            <span>Primabela</span>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
                Links
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <AiFillHome className="inline-block mr-2 text-3xl" />
                Início
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <AiFillDollarCircle className="inline-block mr-2 text-3xl" />
                Preço
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
                Legal
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/terms"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <BsBookHalf className="inline-block mr-2 text-3xl" />
                Termos de Uso
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/blog"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <BsBookHalf className="inline-block mr-2 text-3xl" />
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
                Contato
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                target="_blank"
                href="https://discord.gg/X6JJV4e5kR"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <BiLogoDiscord className="inline-block mr-2 text-4xl" /> Discord
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                target="_blank"
                href="https://instagram.com/primabela.lol"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <AiFillInstagram className="inline-block mr-2 text-3xl" />{' '}
                Instagram
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                target="_blank"
                href="https://reddit.com/r/primabela"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                <AiFillRedditCircle className="inline-block mr-2 text-3xl" />{' '}
                Reddit
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-zinc-900">
        <div>
          <span>
            &copy; {new Date().getFullYear()} Primabela. Todos os direitos
            reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
