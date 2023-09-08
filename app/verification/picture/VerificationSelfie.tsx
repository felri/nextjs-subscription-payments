'use client';

import Button from '@/components/ui/Button';
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
        Instruções para Verificação Facial
      </h2>
      <div className="mb-2">
        Seu rosto está completamente visível e centralizado na foto.
      </div>
      {/* a circle around the image */}
      <div className="flex justify-center">
        <div className="mx-auto rounded-full relative m-2 border-4 border-green-800 flex w-[150px] overflow-hidden">
          <Image
            src="/model-photo.png"
            alt="model-photo"
            width={150}
            height={150}
            className="box-border mx-auto rounded"
            objectPosition="center"
          />
        </div>
        <div className="mx-auto rounded-full relative m-2 border-4 border-red-800 flex w-[150px] overflow-hidden h-[150px]">
          <div className="absolute top-[20%] left-[50%] w-[150px] mx-auto left-0 right-0 h-[100%]">
            <Image
              src="/model-photo.png"
              alt="model-photo"
              width={150}
              height={150}
              className="box-border mx-auto rounded"
              objectPosition="center"
            />
          </div>
        </div>
      </div>
      <div className="mb-2">
        Evite locais com iluminação fraca ou fundos muito brilhantes.
      </div>
      <div className="flex justify-center">
        <div className="mx-auto rounded-full relative m-2 border-4 border-green-800 flex w-[150px] overflow-hidden">
          <Image
            src="/model-photo.png"
            alt="model-photo"
            width={150}
            height={150}
            className="box-border mx-auto rounded"
            objectPosition="center"
          />
        </div>
        <div className="mx-auto rounded-full relative m-2 border-4 border-red-800 flex w-[150px] overflow-hidden">
          <Image
            src="/model-photo.png"
            alt="model-photo"
            width={150}
            height={150}
            className="box-border mx-auto rounded opacity-20"
            objectPosition="center"
          />
        </div>
      </div>
    </div>
  );
};

const VerificationSelfie: React.FC = () => {
  const router = useRouter();
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
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      setImageURL(dataURL);
    }
    stopCamera();
  };

  const uploadPicture = async () => {
    setLoading(true);
    const formData = new FormData();
    const response = await fetch(imageURL as string);
    const blob = await response.blob();
    const fileType = blob.type || 'image/png'; // Default to 'image/png' if the type cannot be determined
    const file = new File([blob], 'selfie.png', { type: fileType });
    formData.append('file', file);
    formData.append('type', 'verification_photo_url');

    try {
      if (imageURL) {
        const response = await fetch('/api/verification/picture', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        console.log('Upload successful:', imageURL);
      }
      toast.success('Upload realizado com sucesso');
      toast.success('Redirecionando para a próxima etapa');
      setTimeout(() => {
        router.push('/verification/video');
      }, 2000);
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Erro ao fazer upload, tente novamente');
    }
    setLoading(false);
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
    <div className="flex flex-col items-center">
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
              className="rounded overflow-hidden object-fit border border-pink-400"
              style={{ width: '100%', height: '100%' }}
            />
            <p className="text-center font-bold py-4">
              Seu rosto está completamente <br />
              visível na foto?
            </p>
            <div className="flex items-center justify-around items-center my-10">
              <Button variant="slim" onClick={onReset} className="mr-4">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Recomeçar
              </Button>
              <Button variant="slim" onClick={uploadPicture} className="ml-4">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Enviar foto
              </Button>
            </div>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        className="object-cover min-h-[calc(100% - 100px)] w-full h-screen"
      ></canvas>
    </div>
  );
};

export default VerificationSelfie;
