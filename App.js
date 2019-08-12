import React, { Fragment, Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FetchLocation from './components/views/FetchLocation';
import Map from './components/views/Map';

export default class App extends Component {
  // state = {
  //   userLocation: {
  //     // defaulting to Madison Square Park
  //     latitude: 40.742963,
  //     longitude: -73.986683,
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421
  //   }
  // };

  // componentDidMount() {
  //   this.getUserLocationHandler();
  // }

  // getUserLocationHandler = () => {
  //   Geolocation.getCurrentPosition(position => {
  //     this.setState({
  //       userLocation: {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421
  //       }
  //     });
  //     err => {
  //       console.log(err);
  //     };
  //   });
  // };
  render() {
    return (
      <Fragment>
        <Header />
        <View style={styles.container}>
          <Map
          // userLocation={this.state.userLocation}
          // onGetLocation={this.getUserLocationHandler}
          />
        </View>
        {/* <Footer
          userLocation={this.state.userLocation}
          onGetLocation={this.getUserLocationHandler}
        /> */}
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
