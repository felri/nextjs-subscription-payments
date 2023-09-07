'use client';

import GenericModal from '@/components/GenericModal';
import { postFormData } from '@/utils/helpers';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsFillRecordCircleFill, BsStopCircle } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { ReactMediaRecorder } from 'react-media-recorder';
import { toast } from 'react-toastify';

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
    <>
      <video
        ref={videoRef}
        className="object-cover min-h-full"
        autoPlay
        controls
        playsInline
      />
    </>
  );
};

const ExampleImage = () => {
  return (
    <div className="mx-auto rounded relative m-2 h-ful w-full min-h-[300px] min-w-[300px] max-w-[500px] max-h-[500px]">
      <Image
        src={'/model-video.jpg'}
        alt="model-video"
        width={150}
        height={150}
        className="box-border mx-auto rounded"
        objectPosition="center"
      />
      {/* Green Opacity Overlay */}
      <div className="absolute top-[20%] w-[150px] mx-auto left-0 right-0 h-[70%] bg-green-500 opacity-40"></div>
    </div>
  );
};

const CaptureVideo: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(2);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const countdownRef = useRef(countdown);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  const handleCountdown = async (startRecording: () => void) => {
    if (countdownRef.current === 0) {
      startRecording();
      return;
    }

    setCountdown(countdownRef.current - 1);
    setTimeout(() => handleCountdown(startRecording), 1000);
  };

  const handleStop = (stopRecording: () => void) => {
    stopRecording();
    setCountdown(3);
  };

  const resetVideo = (clearBlobUrl: () => void) => {
    clearBlobUrl();
    setCountdown(3);
    setShowModal(true);
  };

  const handleConfirm = async (mediaBlobUrl: string) => {
    setLoading(true);
    let mimeType;
    let fileExtension;
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      mimeType = 'video/mp4;codecs=avc1';
      fileExtension = '.mp4';
    } else {
      mimeType = 'video/webm;codecs=h264';
      fileExtension = '.webm';
    }

    console.log(mimeType, fileExtension);
    console.log(mediaBlobUrl);

    const formData = new FormData();
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      formData.append(
        'file',
        new File([blob], `filename${fileExtension}`, { type: mimeType })
      );
    } catch (error) {
      console.error('Error fetching blob from URL:', error);
    }

    try {
      const { data, error } = await postFormData({
        url: '/api/verification/video',
        data: formData
      });

      console.log(data, error);

      if (error) {
        console.error(`Failed to upload`, error.message);
        toast.error('Erro ao fazer upload, tente novamente');
        return null;
      }

      setLoading(false);
      toast.success('Upload realizado com sucesso');
    } catch (error) {
      console.error(`Failed to upload`, error);
      toast.error('Erro ao fazer upload, tente novamente');
      return null;
    }
  };

  return (
    <div className="h-screen w-full relative max-w-xl mx-auto">
      <GenericModal
        isOpen={showModal}
        onConfirm={() => setShowModal(false)}
        confirmText="Entendi"
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">
              Como gravar o vídeo de verificaçao
            </h1>
            <ol className="list-decimal list-inside text-gray-200 text-left">
              <li>
                Posicione o celular de forma que você fique enquadrado na tela,
                como na imagem.
              </li>
              <li>
                A parte do video fora da area verde será cortada.{' '}
                <b>
                  Caso não queira que seu rosto apareça, mantenha o rosto fora
                  da area verde.
                </b>
              </li>
              <li>Aperte o botão de gravar</li>
              <li>Mostre o numero identificador</li>
              <li>Dê um 360º com seu corpo.</li>
              <li>Aperte o botão de parar.</li>
              <li>Confira o video e aperte o botão de confirmar.</li>
            </ol>
          </div>
          <ExampleImage />
        </div>
      </GenericModal>
      <GenericModal
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        confirmText="Finalizar"
        loading={loading}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">
              {loading ? 'Enviando...' : 'Video enviado com sucesso!'}
            </h1>
            <p className="text-gray-200 text-center">
              {loading
                ? 'Aguarde enquanto enviamos seu video'
                : 'Seu video foi enviado com sucesso, aguarde enquanto analisamos'}
            </p>
          </div>
        </div>
      </GenericModal>
      <div className="h-4/5 w-full rounded z-1 absolute top-0 right-0 left-0 inset-0">
        <ReactMediaRecorder
          video
          audio={false}
          stopStreamsOnStop={false}
          askPermissionOnMount
          render={({
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
            clearBlobUrl,
            previewStream
          }) => (
            <div className="relative h-full">
              <div className="absolute bottom-0 w-full flex justify-center mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm flex items-start pt-4 z-20">
                {!mediaBlobUrl && status === 'recording' ? (
                  <div className="flex flex-col items-center">
                    <BsStopCircle
                      className="text-red-500"
                      size={50}
                      onClick={() => handleStop(stopRecording)}
                    />
                    <p>Gravando</p>
                  </div>
                ) : !mediaBlobUrl ? (
                  <div className="flex flex-col items-center z-20">
                    <BsFillRecordCircleFill
                      className="text-green-500"
                      size={50}
                      onClick={() => handleCountdown(startRecording)}
                    />
                    <p className="text-3xl font-bold">
                      {countdown === 0 ? 'Iniciando' : countdown}
                    </p>
                  </div>
                ) : (
                  mediaBlobUrl && (
                    <div className="flex justify-around w-full">
                      <div className="flex flex-col items-center z-20">
                        <MdOutlineCancel
                          className="text-red-500"
                          size={50}
                          onClick={() => resetVideo(clearBlobUrl)}
                        />
                        <p className="text-lg font-bold">Refazer</p>
                      </div>
                      <div className="flex flex-col items-center z-20">
                        <AiOutlineCheckCircle
                          className="text-green-500"
                          size={50}
                          onClick={() => handleConfirm(mediaBlobUrl)}
                        />
                        <p className="text-lg font-bold">Confirmar</p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="w-full h-full absolute top-0 z-10 relative">
                {mediaBlobUrl && (
                  <>
                    <video
                      src={mediaBlobUrl || undefined}
                      controls={false}
                      className="object-cover min-h-full"
                      autoPlay
                      playsInline
                      loop
                      muted
                    />
                  </>
                )}
                {!mediaBlobUrl && <VideoPreview stream={previewStream} />}
                <div className="absolute top-[20%] w-full h-[85%] bg-green-500 opacity-20"></div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default CaptureVideo;
