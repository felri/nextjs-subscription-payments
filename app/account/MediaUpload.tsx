'use client';

import { useSupabase } from '../supabase-provider';
import ImageGrid from '@/components/ImageGrid';
import LoadingDots from '@/components/ui/LoadingDots';
import { initiateFFmpeg, prepareFile } from '@/utils/ffmpeg-helper';
import {
  getStorageSupabaseUrl,
  getFileExtension,
  postData
} from '@/utils/helpers';
import { uploadFile } from '@/utils/supabase-storage';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import type { Database } from 'types_db';

interface Props {
  images: Database['public']['Tables']['media']['Row'][];
  userId: string;
  featuredImage?: string;
}

const MediaUpload: React.FC<Props> = ({ images, userId, featuredImage }) => {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [totalSteps, setTotalSteps] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [uploadedImages, setUploadedImages] = React.useState<string[]>(
    images.map((image) => getStorageSupabaseUrl(image.media_url ?? '', userId))
  );

  const processImage = async (
    ffmpeg: FFmpeg,
    inputFileName: string,
    fileExtension: string,
    watermarkPath: string
  ) => {
    const randomName = Math.random().toString(36).substr(2, 5);

    const watermarkOutput = `output-${randomName}-watermarked.${fileExtension}`;
    const compressedOutput = `output-${randomName}-final.${fileExtension}`;
    try {
      await ffmpeg.exec([
        '-i',
        inputFileName,
        '-i',
        watermarkPath,
        '-filter_complex',
        'overlay=W-w-10:H-h-10,scale=-2:900', // Adjust MAX_HEIGHT to your desired value
        watermarkOutput
      ]);

      await ffmpeg.exec([
        '-i',
        watermarkOutput,
        '-compression_level',
        '9', // Adjust the value to set the compression level as needed
        compressedOutput
      ]);

      // Step 2: Compress the image

      const outputData = await ffmpeg.readFile(compressedOutput);

      // Clean up
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(watermarkOutput);
      await ffmpeg.deleteFile(compressedOutput);

      return new File([outputData], `filename.${fileExtension}`, {
        type: `image/${fileExtension}`
      });
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const compressedAndWatermarkedFilesUrls: string[] = [];
    setLoading(true);
    const ffmpeg = await initiateFFmpeg();
    const watermarkPath = '/watermark.png';

    const preparedWatermark = await prepareFile(
      ffmpeg,
      'watermark',
      watermarkPath,
      '.png',
      'image/png'
    );

    setTotalSteps(acceptedFiles.length);

    for (const file of acceptedFiles) {
      setStep((prev) => prev + 1);
      const fileExt = getFileExtension(file.name);
      const blobUrl = URL.createObjectURL(file);
      const randomName = Math.random().toString(36).substr(2, 5);

      const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', '3gp', 'webm'];
      if (videoTypes.includes(fileExt)) {
        // const filePath = `${userId}/${randomName}.${fileExt}`;
        // const error = await uploadFile(file, filePath, fileExt, supabase);
        // if (error) {
        //   console.error(`Failed to upload`, error.message);
        //   toast.error('Erro ao fazer upload, tente novamente');
        //   return null;
        // }

        // compressedAndWatermarkedFilesUrls.push(`${randomName}.${fileExt}`);
        continue;
      }

      const result = await prepareFile(
        ffmpeg,
        randomName,
        blobUrl,
        fileExt,
        file.type
      );

      const finalFile = await processImage(
        ffmpeg,
        result?.path ?? '',
        fileExt,
        preparedWatermark?.path ?? ''
      );

      const filePath = `${userId}/${result?.path}`;

      const error = await uploadFile(finalFile, filePath, fileExt, supabase);
      if (error) {
        console.error(`Failed to upload`, error.message);
        toast.error('Erro ao fazer upload, tente novamente');
        return null;
      }

      compressedAndWatermarkedFilesUrls.push(result?.path ?? '');
    }

    try {
      const { data, error } = await postData({
        url: '/api/upload',
        data: { images: compressedAndWatermarkedFilesUrls }
      });
      if (error) {
        console.error(`Failed to upload`, error.message);
        toast.error('Erro ao fazer upload, tente novamente');
        return null;
      }
      const newUrls = data.map((filename: string) =>
        getStorageSupabaseUrl(filename ?? '', userId)
      );

      setUploadedImages([...uploadedImages, ...newUrls]);
      setLoading(false);
      toast.success('Upload realizado com sucesso');
    } catch (error) {
      console.error(`Failed to upload`, error);
      toast.error('Erro ao fazer upload, tente novamente');
      return null;
    }
    setStep(0);
    setTotalSteps(0);
    ffmpeg.terminate();
  };

  const onDeleteMedia = async (image: string) => {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify({ image })
    });
    if (!res.ok) {
      console.error(`Failed to delete`, res.statusText);
      toast.error('Erro ao deletar imagem');
      return null;
    }

    toast.success('Imagem deletada com sucesso');

    const newUrls = uploadedImages.filter(
      (url) => url.split('/').pop() !== image
    );
    setUploadedImages(newUrls);
  };

  const setImageAsFeatured = async (image: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller', {
        method: 'PUT',
        body: JSON.stringify({ featured_image_url: image })
      });
      if (!res.ok) {
        console.error(`Failed to delete`, res.statusText);
        return null;
      }
    } catch (error) {
      setLoading(false);
      toast.error('Erro ao definir imagem como destaque');
    }

    toast.success('Imagem definida como destaque com sucesso');
    setLoading(false);
    router.refresh();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 20
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-center">
        <ImageGrid
          images={uploadedImages}
          onDelete={onDeleteMedia}
          loading={loading}
          featuredImage={featuredImage}
          setFeatured={setImageAsFeatured}
        />
      </div>

      <div
        {...getRootProps()}
        className="mt-4 border-dashed border-4 border-gray-400 p-6 text-center rounded-md w-full h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900"
      >
        {loading ? (
          <div className="flex flex-col pl-2 m-0 items-center justify-center">
            <LoadingDots />
            <div className="text-sm text-gray-400 mt-2">
              {step === 0
                ? 'Fazendo upload das midias...'
                : `${step} de ${totalSteps}`}
            </div>
          </div>
        ) : (
          <>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Arraste os arquivos aqui ...</p>
            ) : (
              <p>
                Clique aqui ou arraste fotos para fazer upload. Max 20 fotos por
                vez.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
