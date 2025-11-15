import React from 'react';
import {FlatList, View} from 'react-native';
import Record, {RecordProps} from '../Record';
import EmptyRecord from '../EmptyRecord';
interface ListRecordProps {
  data: Array<RecordProps>;
}
const ListRecord = ({data}: ListRecordProps) => {
  if (!data || data.length === 0) {
    return <EmptyRecord/>;
  }
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={{alignSelf: 'center'}}>
          <Record
            title={item.title}
            textRecord={item.textRecord}
            timeRecord={item.timeRecord}
          />
        </View>
      )}
    />
  );
};
export default ListRecord;
