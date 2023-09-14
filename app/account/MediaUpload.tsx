'use client';

import ImageGrid from '@/components/ImageGrid';
import LoadingDots from '@/components/ui/LoadingDots';
import { postData, postToCompression } from '@/utils/helpers';
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
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [totalSteps, setTotalSteps] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [uploadedImages, setUploadedImages] = React.useState(images);

  const onDrop = async (acceptedFiles: File[]) => {
    const compressedAndWatermarkedFilesUrls: string[] = [];
    setLoading(true);
    setTotalSteps(acceptedFiles.length);
    const response = await fetch('/api/compression');
    const { key } = await response.json();

    for (const file of acceptedFiles) {
      setStep((prev) => prev + 1);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      const result = await postToCompression({
        url: `/upload_media`,
        data: formData,
        key
      });

      compressedAndWatermarkedFilesUrls.push(result?.filename ?? '');
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

      setUploadedImages([...uploadedImages, ...data]);
      setLoading(false);
      toast.success('Upload realizado com sucesso');
    } catch (error) {
      console.error(`Failed to upload`, error);
      toast.error('Erro ao fazer upload, tente novamente');
      return null;
    }
    setStep(0);
    setTotalSteps(0);
  };

  const onDeleteMedia = async (fileId: string) => {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify({ fileId })
    });
    if (!res.ok) {
      console.error(`Failed to delete`, res.statusText);
      toast.error('Erro ao deletar imagem');
      return null;
    }

    toast.success('Imagem deletada com sucesso');

    const newUrls = uploadedImages.filter((url) => url.media_id !== fileId);
    setUploadedImages(newUrls);
  };

  const setImageAsFeatured = async (imageId: string) => {
    setLoading(true);

    const image = uploadedImages.find(
      (img) => img.media_id === imageId
    )?.media_url;

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
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 20
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-center">
        <ImageGrid
          userId={userId}
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
