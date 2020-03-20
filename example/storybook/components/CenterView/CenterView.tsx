/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { View } from 'react-native';

export default function CenterView({ children, styles = {} }) {
  return (
    <View style={[
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      styles,
    ]}>
      {children}
    </View>
  );
}
