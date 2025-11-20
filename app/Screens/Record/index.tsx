import React, {useEffect, useRef} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import AnimationAudio from '../../../components/AnimationAudio';
import ButtonCustom from '../../../components/ButtonCustom';
import AudioRecord from 'react-native-audio-record';
import base64js from 'base64-js';
import {Buffer} from 'buffer';
import RecordAudio from '../../../components/RecordAudio';
const Record = () => {
  const ASSEMBLYAI_API_KEY = '41449613248a4dabbe417106520e6a59';
  const [wordsRealTime, setWordsRealTime] = React.useState<string>(
    '',
  );
  const [startAudioRecording, setStartAudioRecording] =
    React.useState<boolean>(false);
  const wsRef = useRef(null);
  useEffect(() => {
    // Configuración del recorder: PCM 16-bit, sampleRate 16000
    AudioRecord.init({
      sampleRate: 16000, // important: 16000 Hz
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6, // android mic source (opcional)
      wavFile: 'temp.wav', // (solo si quieres guardar)
    });

    // Cuando AudioRecord emite 'data', recibe base64 o bytes (depende de la lib/version)
    // En react-native-audio-record, por defecto emite chunks en base64.
    AudioRecord.on('data', data => {
      // data suele venir en base64 ya (si tu lib lo hace). Si viene en base64:
      sendAudioChunk(data); // enviar directamente

      // Si viniera en ArrayBuffer/Uint8Array lo convertirías:
      // const b64 = base64js.fromByteArray(new Uint8Array(byteArray));
      // sendAudioChunk(b64);
    });

    return () => {
      stopWebsocket();
      AudioRecord.stop();
    };
  }, []);

  // Abrir websocket con sample_rate=16000 (según la doc)
  const startWebsocket = () => {
    const url = 'wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&language=es';

    const ws = new WebSocket(url, [], {
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
      },
    });

    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('WebSocket abierto (V3)');
    };

    ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data);
        console.log('Mensaje WS V3:', msg);
        // Mensajes válidos en V3: partial, final
        if (msg.type === 'partial') {
          setWordsRealTime(msg.words.map(word => word.text).join(' '));
        }

        if (msg.type === 'final') {
          setWordsRealTime(prev => prev + '\n' + msg.words.map(word => word.text).join(' '));
        }
      } catch (err) {
        console.log('Mensaje no JSON:', e.data);
      }
    };

    ws.onerror = e => {
      console.error('WebSocket error', e.message);
    };

    ws.onclose = e => {
      console.log('WebSocket cerrado', e.code, e.reason);
    };

    wsRef.current = ws;
  };

  const stopWebsocket = () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {}
      wsRef.current = null;
    }
  };

  // Envía chunk base64 al websocket con el formato que AssemblyAI espera
  const sendAudioChunk = base64Data => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // convertir base64 → bytes PCM reales
    const byteArray = base64js.toByteArray(base64Data);

    // enviar binario
    ws.send(byteArray.buffer);
  };
  const startRecording = async () => {
    console.log('Iniciando grabación...');
    startWebsocket();

    // Espera un momento a que ws abra (en prod deberías manejar onopen)
    setTimeout(() => {
      AudioRecord.start();
      setStartAudioRecording(true);
    }, 100); // pequeño delay para que ws se abra
  };

  const stopRecording = async () => {
    console.log('Deteniendo grabación...');
    AudioRecord.stop();
    setStartAudioRecording(false);
    stopWebsocket();
    wsRef.current.close();
  };
  return (
    <View
      style={{
        marginTop: 50,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <View style={{height: 50, width: '100%'}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>
          {'New Recording'}
        </Text>
      </View>
      <View
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 50, fontWeight: 'bold'}}>{'01:15'}</Text>
      </View>
      {wordsRealTime.length > 0 ? (
        <View style={{marginTop: 20, width: '90%'}}>
          <Text numberOfLines={4} style={{fontSize: 18}}>
            {wordsRealTime}
          </Text>
        </View>
      ) : null}
      <AnimationAudio startAudioRecording={startAudioRecording} />
      <RecordAudio startAudioRecording={startAudioRecording} setStartAudioRecording={setStartAudioRecording} />
      <View
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
        }}>
        <ButtonCustom
          title="Pause"
          styleButton={{
            width: '40%',
            height: '35%',
            backgroundColor: '#DEE1E6',
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          styleText={{color: 'black', fontWeight: 'bold', fontSize: 17}}
          sourceImage={require('../../../assets/icons/pause.png')}
          onPress={() => setStartAudioRecording(false)}
        />
        <ButtonCustom
          title="Stop"
          styleButton={{
            width: '40%',
            height: '35%',
            backgroundColor: '#DEE1E6',
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          styleText={{color: 'black', fontWeight: 'bold', fontSize: 17}}
          sourceImage={require('../../../assets/icons/stop.png')}
          onPress={() => setStartAudioRecording(false)}
        />
      </View>
    </View>
  );
};

export default Record;
