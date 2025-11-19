import {createNativeStackNavigator,} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../../Screens/Home';
import Record from '../../Screens/Record';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerTitle: '',
  headerShown: false,
};
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Record" component={Record} />
    </Stack.Navigator>
  );
};
export default HomeStack;
