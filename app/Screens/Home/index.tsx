import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import ButtonCustom from '../../../components/ButtonCustom';
const Home = () => {
  return (
    <View>
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
        styleButton={{ width: "90%", height: "40%", backgroundColor: '#23F1D8', padding: 10, borderRadius: 10, alignSelf:'center',justifyContent: 'center', alignItems: 'center' }}
        styleText={{color: 'black', fontWeight: 'bold', fontSize: 17}}
        onPress={() => alert('Button Pressed')}
      />
    </View>
  );
};
export default Home;
