'use client';

import GenericModal from '@/components/GenericModal';
import Button from '@/components/ui/Button/Button';
import LoadingDots from '@/components/ui/LoadingDots/LoadingDots';
import { postFormData } from '@/utils/helpers';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

// this component is just something we render instead of the heavy media recorder stuff
// we need to run ffmpeg in the browser because Vercel
// we also use the component to handle all the ffmpeg stuff
const LightComponentForFFmpeg = ({
  mediaBlobUrl
}: {
  mediaBlobUrl: string;
}): JSX.Element => {
  const router = useRouter();
  const [step, setStep] = useState<
    'loading' | 'cropping' | 'uploading' | 'done' | 'error'
  >('loading');
  const userAgent = navigator.userAgent.toLowerCase();
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLDivElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const mimeType =
    userAgent.includes('safari') && !userAgent.includes('chrome')
      ? 'video/mp4;codecs=avc1'
      : 'video/webm;codecs=h264';
  const fileExtension =
    userAgent.includes('safari') && !userAgent.includes('chrome')
      ? '.mp4'
      : '.webm';

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }: { message: string }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
        console.log(message);
      }
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    console.log('Loading FFmpeg...');
    await ffmpeg.load({
      coreURL: '/ffmpeg-core.js',
      wasmURL: '/ffmpeg-core.wasm'
    });
    console.log('FFmpeg loaded successfully.');
    postVideo();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const cropTopVideo = async (blobUrl: string) => {
    const ffmpeg = ffmpegRef.current;
    const randomName = Math.random().toString(36).substring(7);
    const cutPercentage = 25;

    console.log('Writing file to FFmpeg file system...');
    try {
      await ffmpeg.writeFile(
        `input-${randomName}${fileExtension}`,
        await fetchFile(blobUrl)
      );
    } catch (error) {
      console.error('Failed to write file to FFmpeg file system.', error);
      return null;
    }

    console.log('File written to FFmpeg file system successfully.');

    // read file to check if it's a valid video
    const fileData = (await ffmpeg.readFile(
      `input-${randomName}${fileExtension}`
    )) as unknown as Blob;
    const file = new File([fileData], `filename${fileExtension}`, {
      type: mimeType
    });
    if (file.size === 0) {
      console.error('File is empty');
      return null;
    }

    ffmpeg.on('log', ({ message }: { message: string }) => {
      console.log('ffmpeg ON', message);
    });
    // compress video quick
    await ffmpeg.exec([
      '-i',
      `input-${randomName}${fileExtension}`,
      '-filter:v',
      `crop=in_w:in_h*${(100 - cutPercentage) / 100}:0:in_h*${
        cutPercentage / 100
      }`,
      '-c:v',
      'libx264',
      '-crf',
      '23',
      '-preset',
      'ultrafast',
      `output-${randomName}.mp4`
    ]);

    const outputData = await ffmpeg.readFile(`output-${randomName}.mp4`);

    // clean up
    ffmpeg.deleteFile(`input-${randomName}${fileExtension}`);
    ffmpeg.deleteFile(`output-${randomName}.mp4`);
    return new File([outputData], `filename.mp4`, {
      type: 'video/mp4'
    });
  };

  const postVideo = async () => {
    setStep('cropping');
    const croppedVideo = await cropTopVideo(mediaBlobUrl);

    setStep('uploading');
    const formData = new FormData();
    formData.append('file', croppedVideo as File);

    try {
      const { data, error } = await postFormData({
        url: '/api/verification/video',
        data: formData
      });

      if (error) {
        console.error(`Failed to upload`, error.message);
        toast.error('Erro ao fazer upload, tente novamente');
        setStep('error');
        return null;
      }

      setStep('done');
      toast.success('Upload realizado com sucesso');
    } catch (error) {
      console.error(`Failed to upload`, error);
      toast.error('Erro ao fazer upload, tente novamente');
      setStep('error');
      return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100% - 100px)] items-center w-full h-screen justify-center mx-auto p-6">
      {step === 'loading' && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Processando video</h1>
          <LoadingDots />
          <div ref={messageRef} className="text-gray-200 text-center"></div>
        </div>
      )}
      {step === 'cropping' && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Cortando video</h1>
          <LoadingDots />
        </div>
      )}
      {step === 'uploading' && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Enviando video</h1>
          <LoadingDots />
        </div>
      )}
      {step === 'done' && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">
            Video enviado com sucesso!
          </h1>
          <p className="text-gray-200 text-center text-sm">
            Agora é só aguardar enquanto analisamos seus dados, em breve te
            avisaremos por email ou whatsapp!
          </p>
          <Button
            className="mt-4"
            variant="slim"
            onClick={() => {
              router.push('/account');
            }}
          >
            Finalizar
          </Button>
        </div>
      )}
      {step === 'error' && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Erro ao enviar video</h1>
        </div>
      )}
    </div>
  );
};

const VerificationVideo = ({ code }: { code: string }): JSX.Element => {
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
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
    setIsConfirmed(true);
    setBlobUrl(mediaBlobUrl);
  };

  return (
    <>
      {isConfirmed && blobUrl && (
        <LightComponentForFFmpeg mediaBlobUrl={blobUrl} />
      )}
      {!isConfirmed && !blobUrl && (
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
                  <li>Aperte o botão de parar.</li>
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
      )}
    </>
  );
};

export default VerificationVideo;
