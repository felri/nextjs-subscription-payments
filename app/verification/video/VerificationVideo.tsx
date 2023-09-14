'use client';

import GenericModal from '@/components/GenericModal';
import Button from '@/components/ui/Button/Button';
import LoadingDots from '@/components/ui/LoadingDots/LoadingDots';
import { postToCompression, putData } from '@/utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsFillRecordCircleFill, BsStopCircle } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { ReactMediaRecorder } from 'react-media-recorder';
import { toast } from 'react-toastify';

const VideoPreview = ({ stream }: { stream: MediaStream | null | string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current && containerRef.current?.clientHeight) {
      setHeight(containerRef.current?.clientHeight);
    }
  }, [containerRef.current]);

  useEffect(() => {
    const typeOfStream = typeof stream;

    if (typeOfStream === 'string') {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = stream as string;
      }
      return;
    }

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream as MediaStream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <div className="h-full flex items-center jusitfy-center">
      <div ref={containerRef} className="relative">
        <video
          ref={videoRef}
          className="object-fit z-10"
          autoPlay
          playsInline
          loop
          muted
          controls={false}
        />
        <div
          className="absolute bottom-0 w-full bg-green-500 opacity-20 z-20"
          style={{
            height: height * (80 / 100)
          }}
        ></div>
      </div>
    </div>
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

const Timer = ({
  handleStop,
  stopRecording
}: {
  handleStop: (stopRecording: () => void) => void;
  stopRecording: () => void;
}) => {
  const [time, setTime] = useState(15);

  useEffect(() => {
    if (time === 0) {
      handleStop(stopRecording);
      setTime(15);
      return;
    }

    setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  return <p className="text-3xl font-bold text-red-500">{time}</p>;
};

const VerificationVideo = ({
  code,
  userId
}: {
  code: string;
  userId: string;
}): JSX.Element => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const countdownRef = useRef(countdown);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  const handleCountdown = async (
    startRecording: () => void,
    stopRecording: () => void
  ) => {
    if (countdownRef.current === 0) {
      startRecording();
      return;
    }

    setCountdown(countdownRef.current - 1);
    setTimeout(() => handleCountdown(startRecording, stopRecording), 1000);
  };

  const handleStop = (stopRecording: () => void) => {
    stopRecording();
    setCountdown(5);
  };

  const resetVideo = (clearBlobUrl: () => void) => {
    clearBlobUrl();
    setCountdown(5);
    setShowModal(true);
  };

  const handleConfirm = async (mediaBlobUrl: string) => {
    setBlobUrl(mediaBlobUrl);
    setLoading(true);
    try {
      const response = await fetch('/api/compression');
      const { key } = await response.json();

      const blob = await fetch(mediaBlobUrl).then((r) => r.blob());

      const formData = new FormData();
      formData.append('file', blob, 'video.mp4');
      formData.append('user_id', userId);

      const result = await postToCompression({
        url: `/upload_video`,
        data: formData,
        key
      });

      const data = await putData({
        url: '/api/seller',
        data: {
          verification_photo_url: result?.path,
          verification_message: null
        }
      });

      if (data.error) {
        console.error(`Failed to upload`, data.error.message);
        toast.error('Erro ao fazer upload, tente novamente');
        return;
      }

      toast.success('Selfie enviada com sucesso!');
      setTimeout(() => {
        router.push('/verification');
      }, 1000);
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Erro ao fazer upload, tente novamente');
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="h-screen w-full relative max-w-xl mx-auto">
          <div className="flex flex-col items-center h-full">
            <div className="flex flex-col items-center h-full justify-center text-center">
              <LoadingDots />
              <h1 className="text-2xl font-bold mt-4">
                Enviando o vídeo de verificação
              </h1>
              <p className="text-gray-200 text-center">
                Aguarde enquanto enviamos seu vídeo
              </p>
            </div>
          </div>
        </div>
      )}
      {!loading && !blobUrl && (
        <div className="h-screen w-full relative max-w-xl mx-auto">
          <GenericModal isOpen={showModal}>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">
                  Como gravar o vídeo de verificação
                </h1>
                <ol className="list-decimal list-inside text-gray-200 text-left">
                  <li>
                    Posicione o celular de forma que você fique enquadrado na
                    tela, como na imagem.
                  </li>
                  <li>
                    A parte do video fora da area verde será cortada.{' '}
                    <b>
                      Caso não queira que seu rosto apareça, mantenha o rosto
                      fora da area verde.
                    </b>
                  </li>
                  <li>Aperte o botão de gravar</li>
                  <li>
                    <b>
                      Escreva o CÓDIGO em um papel e segure ele na frente da
                      camera.
                    </b>
                  </li>
                  <li>Dê um 360º com seu corpo.</li>
                  <li>O video dura 15 segundos.</li>
                  <li>Confira o video e aperte o botão de confirmar.</li>
                </ol>
              </div>
              <div className="flex flex-row items-center w-full mt-4">
                <div className="flex flex-col items-center w-full">
                  <b>CÓDIGO:</b>
                  <span className="text-green-500 font-bold text-4xl">
                    {code}
                  </span>
                </div>
                <Button
                  disabled={loading}
                  onClick={() => setShowModal(false)}
                  variant="slim"
                  className="w-full"
                >
                  {loading ? <LoadingDots /> : 'Entendi'}
                </Button>
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
                      <div className="flex items-center justify-around w-full">
                        <Timer
                          stopRecording={stopRecording}
                          handleStop={handleStop}
                        />
                        <div className="flex flex-col items-center">
                          <BsStopCircle
                            className="text-red-500"
                            size={50}
                            onClick={() => handleStop(stopRecording)}
                          />
                          <p>Gravando</p>
                        </div>
                      </div>
                    ) : !mediaBlobUrl ? (
                      <div className="flex flex-col items-center z-20">
                        <BsFillRecordCircleFill
                          className="text-green-500"
                          size={50}
                          onClick={() =>
                            handleCountdown(startRecording, stopRecording)
                          }
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
                    {mediaBlobUrl ? (
                      <VideoPreview stream={mediaBlobUrl} />
                    ) : (
                      <VideoPreview stream={previewStream} />
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationVideo;
