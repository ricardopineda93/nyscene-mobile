/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import { Provider as StoreProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F5F5F5',
    accent: '#000000'
  }
};

const client = new ApolloClient({
  uri: 'http://192.168.1.7:8080/graphql'
});

const Main = () => {
  return (
    <ApolloProvider client={client}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </ApolloProvider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
