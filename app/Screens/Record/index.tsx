import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import AnimationAudio from '../../../components/AnimationAudio';
import ButtonCustom from '../../../components/ButtonCustom';

const Record = () => {
  const [wordsRealTime, setWordsRealTime] = React.useState<string>('Recording your speech...');
  const [startAudioRecording, setStartAudioRecording] = React.useState<boolean>(false);
  return (
    <View style ={{marginTop:50, width:'100%', alignItems:'center'}}>
      <View style={{height:50, width:"100%"}}>
        <Text style={{fontSize:18, fontWeight:'bold',alignSelf:'center'}}>{"New Recording"}</Text>
      </View>
      <View style={{height:50, width:"100%", alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:24, fontWeight:'bold'}}>{"01:15"}</Text>
      </View>
      {
        wordsRealTime ? (
          <View style={{marginTop:20, width:'90%'}}>
            <Text numberOfLines={4} style={{fontSize:18}}>{wordsRealTime}</Text>
          </View>
        ) : null
      }
      <AnimationAudio startAudioRecording={startAudioRecording} />
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
        onPress={() => setStartAudioRecording(!startAudioRecording)}
      >
        <Image
          source={require('../../../assets/icons/microphone.png')}
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
      <View style={{marginTop:20, display:'flex', flexDirection:'row', justifyContent:'space-around', width:'100%'}}>
         <ButtonCustom
        title="Pause"
        styleButton={{
          width: '40%',
          height: '50%',
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
          height: '50%',
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
