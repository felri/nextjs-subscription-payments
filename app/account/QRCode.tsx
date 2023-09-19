'use client';

import { QRCodeSVG } from 'qrcode.react';
import { BiSolidShare } from 'react-icons/bi';

export default function QRCode({ userId }: { userId: string }) {
  const onShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Primabela',
        text: 'Conheça meu perfil na Primabela',
        url: 'https://primabela.lol/profile/' + userId
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center mt-8 "
      onClick={onShare}
    >
      <div className="border border-zinc-600 rounded-md p-2">
        <QRCodeSVG
          value={'https://primabela.lol/profile/' + userId}
          size={198}
          bgColor={'#ffffff'}
          fgColor={'#000000'}
          level={'L'}
          includeMargin={false}
          imageSettings={{
            src: '/favicon-32x32.png',
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            excavate: true
          }}
        />
      </div>
      <div className="flex items-center justify-center mt-3">
        <p className="text-xl font-semibold text-white ">
          Clique para compartilhar
        </p>
        <BiSolidShare className="text-white text-lg ml-2 mt-2" />
      </div>
    </div>
  );
}
