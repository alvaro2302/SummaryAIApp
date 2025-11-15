import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
interface ButtonProps {
  title: string;
  styleButton: object;
  styleText?: object;
  onPress: () => void;
}
const ButtonCustom = ({title, styleButton, styleText, onPress}: ButtonProps) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styleButton}>
        <Text style={styleText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ButtonCustom;
