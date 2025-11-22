import {TranscriptFileResponse} from '../../helper/TranscriptFileResponse';
import {ASSEMBLY_TOKEN} from '@env';
export const generateTranscriptFile = async (
  urlAudio: string,
): Promise<TranscriptFileResponse> => {
  const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: String(ASSEMBLY_TOKEN),
    },
    body: JSON.stringify({
      audio_url: urlAudio,
      language_detection: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start transcript');
  }

  const data: TranscriptFileResponse = await response.json();
  return data;
};
