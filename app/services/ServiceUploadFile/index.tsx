import {UploadMediaFileResponse} from '../../helper/uploadMediaFileResponse';
import {ASSEMBLY_TOKEN} from '@env';
const URL = 'https://api.assemblyai.com/v2/upload';

export const uploadFile = async (
  dataAudio: Uint8Array,
): Promise<UploadMediaFileResponse> => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: String(ASSEMBLY_TOKEN),
    },
    body: dataAudio,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  const result: UploadMediaFileResponse = await response.json();
  return result;
};
