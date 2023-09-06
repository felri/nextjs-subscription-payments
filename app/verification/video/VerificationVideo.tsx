'use client';

import GenericModal from '@/components/GenericModal';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { BsFillRecordCircleFill, BsStopCircle } from 'react-icons/bs';
import {
  useReactMediaRecorder,
  ReactMediaRecorder
} from 'react-media-recorder';

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return (
    <video
      ref={videoRef}
      className="h-full w-full calc(100vh - 100px)"
      autoPlay
      controls
    />
  );
};

const ExampleImage = () => {
  return (
    <div className="h-4/5 w-5/6 mx-auto rounded relative -z-1 absolute top-0 right-0 left-0 m-2 overflow-hidden box-border">
      <Image
        src={'/model-video.jpg'}
        layout="fill"
        alt="model-video"
        className="box-border"
        objectFit="cover"
        objectPosition="center"
      />

      {/* Dividing Line */}
      <div className="absolute top-1/4 w-full h-0.5 bg-red-500"></div>

      {/* Green Opacity Overlay */}
      <div className="absolute top-1/4 w-full h-[85%] bg-green-500 opacity-50"></div>
    </div>
  );
};

const CaptureVideo: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="h-screen w-full relative">
      <GenericModal isOpen={showModal} onConfirm={() => setShowModal(false)}>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">
            Como gravar o vídeo de verificaçao
          </h1>
          <ol className="list-decimal list-inside text-gray-200 text-left">
            <li>
              Coloque o celular em um local firme, de preferência em um tripé ou
              em uma superfície plana.
            </li>
            <li>
              Posicione o celular de forma que você fique enquadrado na tela,
              como na imagem.
            </li>
            <li>
              A parte do video fora da area verde será cortada. Caso não queira
              que seu rosto não apareça, mantenha o rosto acima da area verde.
            </li>
            <li>Aperte o botão de gravar, mostre o numero identificador.</li>
            <li>Dê um 360º com seu corpo.</li>
            <li>Aperte o botão de parar.</li>
            <li>Confira o video e aperte o botão de confirmar.</li>
          </ol>
        </div>
      </GenericModal>
      <ExampleImage />
      <div className="h-4/5 w-full rounded z-1 absolute top-0 right-0 left-0 inset-0">
        <ReactMediaRecorder
          video
          render={({
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
            previewStream
          }) => (
            <div className="relative h-full">
              <div className="absolute bottom-0 w-full flex justify-center mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm flex items-start pt-4 z-20">
                {status === 'recording' ? (
                  <div className="flex flex-col items-center">
                    <BsStopCircle
                      className="text-red-500"
                      size={50}
                      onClick={stopRecording}
                    />
                    <p>Gravando</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center z-20">
                    <BsFillRecordCircleFill
                      className="text-gray-500"
                      size={50}
                      onClick={startRecording}
                    />
                    <p>Gravar</p>
                  </div>
                )}
              </div>
              <div className="w-full h-full absolute top-0 z-10">
                {mediaBlobUrl && (
                  <video
                    src={mediaBlobUrl || undefined}
                    controls
                    autoPlay
                    loop
                  />
                )}
                {!mediaBlobUrl && <VideoPreview stream={previewStream} />}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default CaptureVideo;
