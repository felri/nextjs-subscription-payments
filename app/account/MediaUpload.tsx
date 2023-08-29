'use client';

import ImageGrid from '@/components/ImageGrid';
import LoadingDots from '@/components/ui/LoadingDots';
import { postFormData, getStorageSupabaseUrl } from '@/utils/helpers';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import type { Database } from 'types_db';

interface Props {
  images: Database['public']['Tables']['media']['Row'][];
  userId: string;
}

const ImageDropzone: React.FC<Props> = ({ images, userId }) => {
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

    const newUrls = uploadedImages.filter((url) => url.split('/').pop() !== image);
    setUploadedImages(newUrls);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        <ImageGrid images={uploadedImages} onDelete={onDeleteMedia} loading={loading} />
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
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Arraste os arquivos aqui ...</p>
            ) : (
              <p>
                Arraste e solte até 20 fotos e videos aqui, ou clique para
                selecionar arquivos
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
