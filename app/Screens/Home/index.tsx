import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import ButtonCustom from '../../../components/ButtonCustom';
import ListRecord from '../../../components/ListRecord';

interface HomeProps {
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {navigation} = props;
  const navigationToRecord = () => {
    navigation.navigate('Record');
  };
  return (
    <View style={{paddingTop: 75}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingStart: '35%',
        }}>
        <Text style={{fontWeight: '600', fontSize: 20}}>TalkSense</Text>
        <TouchableOpacity style={{margin: 10}}>
          <Image
            source={require('../../../assets/icons/searchIcon.png')}
            style={{width: 20, height: 20, marginLeft: 'auto', marginRight: 10}}
          />
        </TouchableOpacity>
      </View>

      <ButtonCustom
        title="Start Recording"
        styleButton={{
          width: '80%',
          height: '15%',
          backgroundColor: '#23F1D8',
          borderRadius: 10,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        styleText={{color: 'black', fontWeight: 'bold', fontSize: 17}}
        sourceImage={require('../../../assets/icons/microphone.png')}
        onPress={navigationToRecord}
      />
      <ListRecord data={[]} />
    </View>
  );
};
export default Home;
