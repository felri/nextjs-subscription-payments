'use client';

import ImageGrid from '@/components/ImageGrid';
import LoadingDots from '@/components/ui/LoadingDots';
import { postFormData, getStorageSupabaseUrl } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import type { Database } from 'types_db';

interface Props {
  images: Database['public']['Tables']['media']['Row'][];
  userId: string;
  featuredImage?: string;
}

const MediaUpload: React.FC<Props> = ({ images, userId, featuredImage }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [uploadedImages, setUploadedImages] = React.useState<string[]>(
    images.map((image) => getStorageSupabaseUrl(image.media_url ?? '', userId))
  );

  const onDrop = async (acceptedFiles: File[]) => {
    setLoading(true);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('files', file);
    });
    const { data, error } = await postFormData({
      url: '/api/upload',
      data: formData
    });
    if (error) {
      console.error(`Failed to upload`, error.message);
      return null;
    }

    const newUrls = data.map((filename: string) =>
      getStorageSupabaseUrl(filename ?? '', userId)
    );

    setUploadedImages([...uploadedImages, ...newUrls]);
    setLoading(false);
  };

  const onDeleteMedia = async (image: string) => {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify({ image })
    });
    if (!res.ok) {
      console.error(`Failed to delete`, res.statusText);
      return null;
    }

    const newUrls = uploadedImages.filter(
      (url) => url.split('/').pop() !== image
    );
    setUploadedImages(newUrls);
  };

  const setImageAsFeatured = async (image: string) => {
    setLoading(true);
    const res = await fetch('/api/seller', {
      method: 'PUT',
      body: JSON.stringify({ featured_image_url: image })
    });
    if (!res.ok) {
      console.error(`Failed to delete`, res.statusText);
      return null;
    }

    setLoading(false);
    router.refresh();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
          <div className="flex pl-2 m-0">
            <LoadingDots />
          </div>
        ) : (
          <>
            <input {...getInputProps()} accept="image/*" />
            {isDragActive ? (
              <p>Arraste os arquivos aqui ...</p>
            ) : (
              <p>
                Clique aqui ou arraste e solte arquivos para fazer upload de
                novas imagens.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
