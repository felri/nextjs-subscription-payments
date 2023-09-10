'use client';

import { useSupabase } from '@/app/supabase-provider';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import {
  initiateFFmpeg,
  prepareFile,
  compressImage
} from '@/utils/ffmpeg-helper';
import { putData } from '@/utils/helpers';
import { uploadFile } from '@/utils/supabase-storage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useRef, useState } from 'react';
import { BsFillRecordCircleFill } from 'react-icons/bs';
import { PiCameraRotateFill } from 'react-icons/pi';
import { toast } from 'react-toastify';

const SelfieInstructions: React.FC = () => {
  return (
    <div className="p-4 rounded-md shadow-md max-w-md mx-auto mt-4 text-center">
      <h2 className="text-xl font-bold mb-2 text-center">
        Instruções para foto do documento
      </h2>
      <div className="mb-2">
        Enquadre o documento de forma que ele fique totalmente visível na foto.
      </div>
      {/* a circle around the image */}
      <div className="flex justify-center">
        <div className="mx-auto relative m-2">
          <Image
            src="/model-document.png"
            alt="model-document"
            width={150}
            height={150}
            className="box-border mx-auto rounded"
            objectPosition="center"
          />
        </div>
      </div>
    </div>
  );
};

const VerificationDocument = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode
        },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing webcam: ', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => {
      track.stop();
    });
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log(canvas.width, canvas.height);
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      setImageURL(dataURL);
    }
    stopCamera();
  };

  const uploadPicture = async () => {
    setLoading(true);
    const ffmpeg = await initiateFFmpeg();

    const result = await prepareFile(
      ffmpeg,
      'document',
      imageURL as string,
      'png',
      'image/png'
    );

    if (!result?.path) {
      toast.error('Erro ao fazer upload, tente novamente');
      return;
    }

    const compressedFile = await compressImage(ffmpeg, 'document', 'png');
    const filePath = `verification/${userId}/${result?.path}`;
    const error = await uploadFile(compressedFile, filePath, 'png', supabase);

    if (error) {
      console.error(`Failed to upload`, error.message);
      toast.error('Erro ao fazer upload, tente novamente');
      return;
    }

    try {
      const data = await putData({
        url: '/api/seller',
        data: {
          verification_document_url: result?.path
        }
      });

      if (data.error) {
        console.error(`Failed to upload`, data.error.message);
        toast.error('Erro ao fazer upload, tente novamente');
        return;
      }

      console.log('Upload successful:', imageURL);

      toast.success('Upload realizado com sucesso');
      toast.success('Redirecionando para a próxima etapa');
      setTimeout(() => {
        router.push('/verification/picture');
      }, 1000);
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Erro ao fazer upload, tente novamente');
    }
    setLoading(false);
    ffmpeg.terminate();
  };

  const onReset = () => {
    setImageURL(null);
  };

  useEffect(() => {
    if (videoRef.current) {
      startCamera();
    }
  }, [imageURL]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    startCamera();
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <SelfieInstructions />
      <div className="relative min-h-[calc(100% - 100px)]">
        {!imageURL && (
          <>
            <video
              ref={videoRef}
              controls={false}
              className="object-cover min-h-[calc(100% - 100px)] w-full h-screen"
              autoPlay
              playsInline
              loop
              muted
            />

            <div className="flex items-center z-20 absolute bottom-0 left-0 right-0 mb-4 w-full justify-around bg-black bg-opacity-40 py-4">
              <div className="w-[50px]" />
              <BsFillRecordCircleFill
                className="text-green-500"
                size={50}
                onClick={takePicture}
              />
              <PiCameraRotateFill
                className="text-white"
                size={30}
                onClick={toggleCamera}
              />
            </div>
          </>
        )}
        {imageURL && (
          <>
            <Image
              src={imageURL}
              alt="selfie"
              width="0"
              height="0"
              sizes="100vw"
              className="rounded overflow-hidden object-fit border border-pink-400 mx-auto"
              style={{ width: '100%' }}
            />
            <p className="text-center font-bold py-4">
              Seu documento está completamente <br />
              visível na foto?
            </p>
            <div className="flex items-center justify-around items-center my-10">
              <Button
                variant="slim"
                onClick={onReset}
                className="mr-4"
                disabled={loading}
              >
                {loading ? <LoadingDots /> : 'Recomeçar'}
              </Button>
              <Button
                variant="slim"
                onClick={uploadPicture}
                className="ml-4"
                disabled={loading}
              >
                {loading ? <LoadingDots /> : 'Enviar'}
              </Button>
            </div>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        className="h-screen w-auto object-cover"
      ></canvas>
    </div>
  );
};

export default VerificationDocument;
