import {generateTranscriptFile} from '../../services/ServiceTranscriptFile';

const TranscriptFileViewModel = () => {
  const startTranscriptFile = async (urlAudio: string) => {
    try {
      const response = await generateTranscriptFile(urlAudio);
      return response;
    } catch (error) {
      console.error('Error generating transcript file:', error);
      throw error;
    }
  };

  return {startTranscriptFile};
};
export default TranscriptFileViewModel;
