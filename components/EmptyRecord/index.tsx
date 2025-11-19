import React from 'react';
import {Image, Text, View} from 'react-native';

const EmptyRecord = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <View
        style={{
          width: '90%',
          alignItems: 'center',
          backgroundColor: '#F7F9FA',
          borderRadius: 10,
          borderColor: 'gray',
          borderWidth: 1,
          marginTop: 20,
          padding: 10,
        }}>
        <Image
          source={require('../../assets/icons/folderEmpty.png')}
          style={{width: 40, height: 40, marginTop: 20, marginBottom: 10}}
        />
        <Text
          numberOfLines={1}
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 5,
          }}>
          {'No Recording Yet'}
        </Text>
        <Text style={{color: 'gray'}} numberOfLines={1}>
          {"Tap 'Start Recording' to begin"}
        </Text>
      </View>
    </View>
  );
};
export default EmptyRecord;
