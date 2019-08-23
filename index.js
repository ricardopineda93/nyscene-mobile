/**
 * @format
 */
import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { persistCache } from 'apollo-cache-persist';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F5F5F5',
    accent: '#000000'
  }
};

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage
});

const client = new ApolloClient({
  uri: 'http://192.168.1.10:8080/graphql',
  credentials: 'include',
  request: async operation => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include'
      }
    });
  },
  cache
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
