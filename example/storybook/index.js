/* eslint-disable global-require */
import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import { ApolloProvider } from 'react-apollo';
import { name as appName } from '../app.json';
import mockClient from './components/mockApolloClient/mockApolloClient';

import './rn-addons';

const client = mockClient();

addDecorator((getStory) => (
  <ApolloProvider client={client}>
    {getStory()}
  </ApolloProvider>
));

// import stories
configure(() => {
  require('./stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent(appName, () => StorybookUIRoot);

export default StorybookUIRoot;
