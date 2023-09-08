import { StorageClient } from '@supabase/storage-js';

const STORAGE_BUCKET = 'primabela-bucket';
const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_ROLE_KEY as string,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`
});

export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
export const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'avi'];
export const VIDEO_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB

async function uploadVideo(file: File, path: string, ext: string) {
  const uploadResult = await storageClient
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: `video/${ext}`,
      duplex: 'half',
      upsert: true
    });

  return uploadResult.error;
}

async function uploadImage(file: File, path: string, ext: string) {
  const uploadResult = await storageClient
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: `image/${ext}`,
      duplex: 'half',
      upsert: true
    });

  return uploadResult.error;
}

export async function uploadFile(file: File, path: string, ext: string) {
  console.log('uploadFile', file, path, ext);
  if (ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
    return uploadVideo(file, path, ext);
  } else if (ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return uploadImage(file, path, ext);
  } else {
    throw new Error('File type not supported');
  }
}

export async function deleteFile(path: string) {
  const deleteResult = await storageClient.from(STORAGE_BUCKET).remove([path]);
  return deleteResult.error;
}

export async function getFile(path: string) {
  const file = await storageClient.from(STORAGE_BUCKET).download(path);
  return file;
}

export async function getFileUrl(path: string) {
  const fileUrl = await storageClient.from(STORAGE_BUCKET).getPublicUrl(path);
  return fileUrl;
}

export async function getFileList(path: string) {
  const fileList = await storageClient.from(STORAGE_BUCKET).list(path);
  return fileList;
}

export async function getFileSignedUrl(path: string) {
  const signedUrl = await storageClient
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 60);
  return signedUrl;
}
