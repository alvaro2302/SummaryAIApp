import React, {useEffect, useRef, useState} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Buffer} from 'buffer';
import {ASSEMBLY_TOKEN} from '@env';
import UploadViewModel from '../../app/ModelViewModels/UploadFileViewModel';
const {RealtimeAudioStreamer} = NativeModules;
const evt = new NativeEventEmitter(RealtimeAudioStreamer);

interface RecordRealtimeProps {
  startAudioRecording: boolean;
  setStartAudioRecording: (value: boolean) => void;
}

export default function RecordAudio({
  startAudioRecording,
  setStartAudioRecording,
}: RecordRealtimeProps) {
  const { uploadAudioFile } = UploadViewModel();
  const [text, setText] = useState('');
  const audioChunksRef = useRef<string[]>([]); // Guardamos base64 de los chunks
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Escuchar chunks emitidos por el módulo nativo
    const sub = evt.addListener('audioChunk', ({data}) => {
      console.log('Chunk recibido en JS, tamaño (base64):', data.length);
      audioChunksRef.current.push(data);
    });

    const errSub = evt.addListener('recorderError', ({error}) => {
      console.log('Recorder error:', error);
    });

    return () => {
      sub.remove();
      errSub.remove();
      stopRecording();
    };
  }, []);
  // Función para enviar todos los chunks a AssemblyAI
  const uploadChunks = async () => {
    if (audioChunksRef.current.length === 0) return;

    try {
      // Concatenar todos los base64 en un solo ArrayBuffer
      let totalLength = 0;
      const byteArrays: Uint8Array[] = [];
      for (const b64 of audioChunksRef.current) {
        const bytes = Buffer.from(b64, 'base64');
        byteArrays.push(bytes);
        totalLength += bytes.length;
      }

      // Concatenar todos los bytes
      const finalBytes = new Uint8Array(totalLength);
      let offset = 0;
      for (const arr of byteArrays) {
        finalBytes.set(arr, offset);
        offset += arr.length;
      }

      // Enviar a AssemblyAI
      const response = await uploadAudioFile(finalBytes);

      console.log('Archivo subido a AssemblyAI:', response.upload_url);

      // Reset chunks
      audioChunksRef.current = [];

      // Opcional: crear transcripción
      // await createTranscription(response.data.upload_url);
    } catch (err) {
      console.error('Error subiendo audio a AssemblyAI:', err);
    }
  };

  const startRecording = () => {
    console.log('Iniciando grabación...');
    setStartAudioRecording(true);
    audioChunksRef.current = [];
    RealtimeAudioStreamer.startRecording();

    // Cada 2 minutos subir audio
    timerRef.current = setInterval(uploadChunks, 2 * 60 * 1000);
  };

  const stopRecording = () => {
    setStartAudioRecording(false);
    console.log('Deteniendo grabación...');
    RealtimeAudioStreamer.stopRecording();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Subir los últimos chunks pendientes
    uploadChunks();
  };

  return (
    <TouchableOpacity
      style={{
        width: '20%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: startAudioRecording ? '#30F2D7' : '#9CFFEB',
        borderRadius: 999,
        padding: 10,
        marginTop: 30,
      }}
      onPress={() => (startAudioRecording ? stopRecording() : startRecording())}>
      <Image
        source={require('../../assets/icons/microphone.png')}
        style={{
          width: 30,
          height: 40,
          alignSelf: 'center',
          justifyContent: 'center',
          paddingBottom: 10,
          marginBottom: 5,
        }}
      />
    </TouchableOpacity>
  );
}
