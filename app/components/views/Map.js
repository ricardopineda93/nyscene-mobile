import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import customStyle from '../../../customStyle';

export default class Map extends Component {
  state = {
    userLocation: {
      // defaulting to Madison Square Park
      latitude: 40.742963,
      longitude: -73.986683,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  };

  componentDidMount() {
    this.getUserLocationHandler();
  }

  getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      });
      err => {
        console.log(err);
      };
    });
  };

  userLocationMarker = () => (
    <MapView.Marker
      coordinate={this.state.userLocation}
      onPress={() => console.log('Found me!!!')}
    />
  );
  render() {
    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={this.state.userLocation}
          region={this.state.userLocation}
          customMapStyle={customStyle}
        >
          {this.userLocationMarker()}
        </MapView>
        <Button title="Get Location" onPress={this.getUserLocationHandler} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '95%'
  },
  map: {
    width: '100%',
    height: '100%'
  }
});