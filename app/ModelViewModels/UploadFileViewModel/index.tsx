import {UploadMediaFileResponse} from '../../helper/UploadMediaFileResponse';
import {uploadFile} from '../../services/ServiceUploadFile';

const UploadViewModel = () => {
const uploadAudioFile = async (
  dataAudio: Uint8Array<any>,
): Promise<UploadMediaFileResponse> => {
  try {
    const response = await uploadFile(dataAudio);
    return response;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    throw error;
  }
}
return {
  uploadAudioFile,}
};

export default UploadViewModel; 