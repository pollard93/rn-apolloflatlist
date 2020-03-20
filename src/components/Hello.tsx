import React from 'react';
import { Text } from 'react-native';

export interface HelloProps { content: string; }

export const Hello = (props: HelloProps) => <Text>{props.content}</Text>;
