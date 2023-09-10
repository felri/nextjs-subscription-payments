import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export async function initiateFFmpeg() {
  const ffmpeg = new FFmpeg();

  // Set up any FFmpeg event handlers you want here (e.g., for logging)
  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  console.log('Loading FFmpeg...');

  // Load the FFmpeg core and WASM files
  await ffmpeg.load({
    coreURL: '/ffmpeg-core.js',
    wasmURL: '/ffmpeg-core.wasm'
  });

  console.log('FFmpeg loaded successfully.');

  return ffmpeg;
}

export const prepareFile = async (
  ffmpeg: FFmpeg,
  fileName: string,
  blobUrl: string,
  fileExtension: string,
  mimeType: string
) => {
  if (!ffmpeg) {
    console.error('FFmpeg not loaded.');
    return null;
  }

  const path = `${fileName}.${fileExtension}`;

  console.log('Writing file to FFmpeg file system...');
  try {
    await ffmpeg.writeFile(path, await fetchFile(blobUrl));
  } catch (error) {
    console.error('Failed to write file to FFmpeg file system.', error);
    return null;
  }

  console.log('File written to FFmpeg file system successfully.');

  const fileData = (await ffmpeg.readFile(path)) as unknown as Blob;
  const file = new File([fileData], `filename${fileExtension}`, {
    type: mimeType
  });
  if (file.size === 0) {
    console.error('File is empty');
    return null;
  }

  return { file, path };
};

export const compressImage = async (
  ffmpeg: FFmpeg,
  inputFileName: string,
  fileExtension: string
) => {
  const randomName = Math.random().toString(36).substr(2, 5);

  const compressedOutput = `output-${randomName}-final.${fileExtension}`;
  try {
    await ffmpeg.exec([
      '-i',
      `${inputFileName}.${fileExtension}`,
      '-compression_level',
      '9', // Adjust the value to set the compression level as needed
      compressedOutput
    ]);

    // Step 2: Compress the image

    const outputData = await ffmpeg.readFile(compressedOutput);

    // Clean up
    await ffmpeg.deleteFile(`${inputFileName}.${fileExtension}`);
    await ffmpeg.deleteFile(compressedOutput);

    return new File([outputData], `filename.${fileExtension}`, {
      type: `image/${fileExtension}`
    });
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
