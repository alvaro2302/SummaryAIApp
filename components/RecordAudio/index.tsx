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
import RNFS from 'react-native-fs';
const {RealtimeAudioStreamer} = NativeModules;
const evt = new NativeEventEmitter(RealtimeAudioStreamer);

interface RecordRealtimeProps {
  startAudioRecording: boolean;
  stopAudioRecording?: boolean;
  setStartAudioRecording: (value: boolean) => void;
}

export default function RecordAudio({
  startAudioRecording,
  stopAudioRecording,
  setStartAudioRecording,

}: RecordRealtimeProps) {
  const {uploadAudioFile} = UploadViewModel();
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
    if(stopAudioRecording) {
      stopRecording();
    }
    return () => {
      sub.remove();
      errSub.remove();
    };
  }, [stopAudioRecording]);
  function pcmToWav(pcmBytes, sampleRate = 16000, numChannels = 1) {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    const blockAlign = numChannels * 2;
    const byteRate = sampleRate * blockAlign;

    // ChunkID "RIFF"
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + pcmBytes.length, true); // ChunkSize
    writeString(view, 8, 'WAVE');

    // Subchunk1ID "fmt "
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat = PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // BitsPerSample

    // Subchunk2ID "data"
    writeString(view, 36, 'data');
    view.setUint32(40, pcmBytes.length, true); // Subchunk2Size

    // Result WAV = header + pcmData
    const wavBuffer = new Uint8Array(44 + pcmBytes.length);
    wavBuffer.set(new Uint8Array(header), 0);
    wavBuffer.set(pcmBytes, 44);

    return wavBuffer;
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  // Función para enviar todos los chunks a AssemblyAI
  const uploadChunks = async () => {
    if (audioChunksRef.current.length === 0) return;

    try {
      console.log('🔄 Concatenando chunks PCM...');

      // 1. Concatenar PCM
      const byteArrays = audioChunksRef.current.map(b64 =>
        Buffer.from(b64, 'base64'),
      );

      let totalLength = byteArrays.reduce((acc, arr) => acc + arr.length, 0);
      const finalBytes = new Uint8Array(totalLength);

      let offset = 0;
      for (const arr of byteArrays) {
        finalBytes.set(arr, offset);
        offset += arr.length;
      }

      // 2. PCM → WAV
      const wavBytes = pcmToWav(finalBytes);

      console.log('⬆️ Enviando WAV binario a AssemblyAI...');
      // Comprobar contenido real de PCM
      let silentCount = 0;
      let totalSamples = 0;

      const pcmAll = Buffer.concat(
        audioChunksRef.current.map(c => Buffer.from(c, 'base64')),
      );

      for (let i = 0; i < pcmAll.length; i += 2) {
        const sample = pcmAll.readInt16LE(i);
        totalSamples++;
        if (sample === 0) silentCount++;
      }

      console.log('samples total:', totalSamples);
      console.log('zeros:', silentCount);
      console.log('silence ratio:', silentCount / totalSamples);
      // 3. Upload binario real
      const response = await uploadAudioFile(wavBytes);
      const result = response;
      console.log('URL AssemblyAI:', result.upload_url);

      audioChunksRef.current = [];
    } catch (err) {
      console.error('❌ Error subiendo audio:', err);
    }
  };

  const startRecording = () => {
    console.log('Iniciando grabación...');
    setStartAudioRecording(true);
    audioChunksRef.current = [];
    RealtimeAudioStreamer.startRecording();

    // Cada 2 minutos subir audio
   // timerRef.current = setInterval(uploadChunks, 2 * 60 * 1000);
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
      onPress={() =>
        startAudioRecording ? stopRecording() : startRecording()
      }>
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
