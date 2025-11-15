import React from 'react';
import {Text, View} from 'react-native';
export interface RecordProps {
    title: string;
    textRecord: string;
    timeRecord: number;
}
const Record = ({title, textRecord, timeRecord}: RecordProps) => {
  return (
    <View
      style={{
        width: '90%',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 20,
        padding: 10,
        shadowColor: 'gray',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 5,
      }}>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          margin: 10,
          width: '70%',
        }}>
       {title}
      </Text>
      <View style={{paddingHorizontal: 10, display: 'flex'}}>
        <Text style={{color: 'gray'}} numberOfLines={4}>{textRecord}</Text>
      </View>
      <Text style={{paddingHorizontal: 10}}>
        {timeRecord} minutes
      </Text>
    </View>
  );
};
export default Record;
