'use client';

import Logo from '@/components/icons/Logo';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BsPersonBoundingBox } from 'react-icons/bs';
import { LiaAddressCardSolid } from 'react-icons/lia';
import { Tb360View } from 'react-icons/tb';

function TextSlider() {
  const settings = {
    dots: false,
    arrows: false,
    vertical: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    infinite: true,
    centerMode: true,
    centerPadding: '40px',
    autoplay: true
  };

  const cardsText = [
    {
      icon: <LiaAddressCardSolid />,
      title: (
        <span>
          Acompanhantes
          <br /> <b>Verificadas</b>
        </span>
      ),
      description:
        'Garantimos que cada profissional tenha seus documentos verificados.'
    },
    {
      icon: <Tb360View />,
      title: (
        <span>
          Mídia de
          <br /> <b>Comparação</b>
        </span>
      ),
      description:
        'Vídeo de confirmação com demonstração de corpo e rosto, conforme o documento registrado.'
    },
    {
      icon: <BsPersonBoundingBox />,
      title: (
        <span>
          Autenticação <br /> <b>Facial</b>
        </span>
      ),
      description:
        'A face deve ser reconhecível e idêntica à imagem presente no documento oficial.'
    }
  ];

  return (
    <div className="max-w-lg mx-auto">
      <Slider {...settings} lazyLoad="ondemand">
        {cardsText.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center m-4 p-4 border border-gray-200 rounded shadow-md box-border max-w-[250px] h-[100px]"
          >
            <div className="flex flex-row items-center justify-start space-x-4 h-full font-light">
              <div className="text-4xl text-[#ff004a] mr-4">{card.icon}</div>
              <h3 className="text-white text-xl">{card.title}</h3>
              {/* <p>{card.description}</p> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default function LogoTitle() {
  return (
    <div>
      <div className="flex flex-col items-start justify-center max-w-2xl mx-auto">
        <div className="text-white text-2xl font-bold px-8 py-2 font-light lg:text-4xl">
          <b className='text-4xl lg:text-6xl'>Encontre acompanhantes</b> <br /> verificadas na sua cidade <br />
        </div>
      </div>
      <TextSlider />
    </div>
  );
}
