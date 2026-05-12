import * as Speech from 'expo-speech';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useApp } from './AppContext';

export const AppText = ({ children, style, ...props }: any) => {
  const { isTtsEnabled, language } = useApp();

  const speak = () => {
    if (isTtsEnabled && children) {
      Speech.stop();
      Speech.speak(children.toString(), { language: language === 'हिंदी' ? 'hi-IN' : 'en-US', rate: 0.9 });
    }
  };

  return (
    <TouchableOpacity onPress={speak} activeOpacity={0.6}>
      <Text style={style} {...props}>{children}</Text>
    </TouchableOpacity>
  );
};
