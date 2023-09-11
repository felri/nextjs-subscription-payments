const STORAGE_BUCKET = 'primabela-bucket';

export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
export const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'avi'];
export const VIDEO_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB

async function uploadVideo(
  file: File,
  path: string,
  ext: string,
  supabase: any
) {
  const uploadResult = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: `video/${ext}`,
      duplex: 'half',
      upsert: true
    });

  return uploadResult.error;
}

async function uploadImage(
  file: File,
  path: string,
  ext: string,
  supabase: any
) {
  const uploadResult = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: `image/${ext}`,
      upsert: true
    });

  console.log('uploadResult', uploadResult);

  return uploadResult.error;
}

export async function uploadFile(
  file: File,
  path: string,
  ext: string,
  supabase: any
) {
  console.log('uploadFile', file, path, ext);
  if (ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
    return await uploadVideo(file, path, ext, supabase);
  } else if (ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return await uploadImage(file, path, ext, supabase);
  } else {
    throw new Error('File type not supported');
  }
}

// export async function deleteFile(path: string) {
//   const deleteResult = await storageClient.from(STORAGE_BUCKET).remove([path]);
//   return deleteResult.error;
// }

// export async function getFile(path: string) {
//   const file = await storageClient.from(STORAGE_BUCKET).download(path);
//   return file;
// }

// export async function getFileUrl(path: string) {
//   const fileUrl = await storageClient.from(STORAGE_BUCKET).getPublicUrl(path);
//   return fileUrl;
// }

// export async function getFileList(path: string) {
//   const fileList = await storageClient.from(STORAGE_BUCKET).list(path);
//   return fileList;
// }

// export async function getFileSignedUrl(path: string) {
//   const signedUrl = await storageClient
//     .from(STORAGE_BUCKET)
//     .createSignedUrl(path, 60);
//   return signedUrl;
// }
