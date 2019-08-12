import React, { Fragment, Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        {/* Footer contains most of the app's router logic to nav between views */}
        <Footer />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
