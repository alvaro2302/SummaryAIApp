import React from 'react';
import {Image, ImageSourcePropType, Text, TouchableOpacity, View} from 'react-native';
interface ButtonProps {
  title: string;
  styleButton: object;
  styleText?: object;
  sourceImage?: ImageSourcePropType | undefined;
  onPress: () => void;
}
const ButtonCustom = ({title, styleButton, styleText,sourceImage,onPress}: ButtonProps) => {
  return (

      <TouchableOpacity onPress={onPress} style={styleButton}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        {sourceImage && <Image source={sourceImage} style={{width: 18, height: 18, marginRight: 10}} />}
        <Text style={styleText}>{title}</Text>
        </View>
      </TouchableOpacity>

  );
};
export default ButtonCustom;
