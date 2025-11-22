import React from 'react';
import {Text, View} from 'react-native';
import AnimationAudio from '../../../components/AnimationAudio';
import ButtonCustom from '../../../components/ButtonCustom';
import RecordAudio from '../../../components/RecordAudio';
import {RecordingTimer} from '../../../components/RecordingTimer';
import {useUploadFileStore} from '../../Store/UploadFile';
import {Snackbar} from 'react-native-paper';
const Record = () => {
  const [wordsRealTime, setWordsRealTime] = React.useState<string>('');
  const [startAudioRecording, setStartAudioRecording] =
    React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [isStopped, setIsStopped] = React.useState<boolean>(false);
  const {isUploading, setIsUploading} = useUploadFileStore();
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
      {/*<View
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 50, fontWeight: 'bold'}}>{''}</Text>
      </View>*/}
      <RecordingTimer
        isStart={startAudioRecording}
        isPause={isPaused}
        isStop={!startAudioRecording}
        StopRecording={() => setStartAudioRecording(false)}
      />
      {wordsRealTime.length > 0 ? (
        <View style={{marginTop: 20, width: '90%'}}>
          <Text numberOfLines={4} style={{fontSize: 18}}>
            {wordsRealTime}
          </Text>
        </View>
      ) : null}
      <AnimationAudio startAudioRecording={startAudioRecording && !isPaused} />
      <RecordAudio
        startAudioRecording={startAudioRecording}
        setStartAudioRecording={setStartAudioRecording}
        stopAudioRecording={isStopped}
      />
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
            backgroundColor: isPaused ? '#A9A9A9' : '#DEE1E6',
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          styleText={{color: 'black', fontWeight: 'bold', fontSize: 17}}
          sourceImage={require('../../../assets/icons/pause.png')}
          onPress={() => setIsPaused(!isPaused)}
        />
        <ButtonCustom
          title="Stop"
          styleButton={{
            width: '40%',
            height: '35%',
            backgroundColor: isStopped ? 'red' : '#DEE1E6',
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          styleText={{color: 'black', fontWeight: 'bold', fontSize: 17}}
          sourceImage={require('../../../assets/icons/stop.png')}
          onPress={() => setIsStopped(!isStopped)}
        />
       
        <Snackbar
          visible={isUploading}
          onDismiss={() => setIsUploading(false)}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
            },
          }}>
          Starting record uploaded successfully.
        </Snackbar>
  
      </View>
    </View>
  );
};

export default Record;
