import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import customStyle from '../../../customStyle';
const filmstripIcon = require('../../static/filmstrip.png');

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

const FunctionMap = props => {
  const [userLocation, setUserLocation] = useState({
    // defaulting to Madison Square Park
    latitude: 40.742963,
    longitude: -73.986683,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  const [sceneLocations, setSceneLocations] = useState(false);

  const getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(position => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });
      err => {
        console.log(err);
      };
    });
  };

  const getAllSceneLocationsHandler = () => {
    const { loading, error, data } = useQuery(gql`
      {
        allScenes {
          id
          lat
          lng
          film
        }
      }
    `);
    if (loading) console.log(loading);
    if (error) console.log(error);
    if (data.allScenes) {
      return data.allScenes.map(({ id, lat, lng, film }) => (
        <MapView.Marker
          key={id}
          coordinate={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onPress={() => console.log(film)}
          image={filmstripIcon}
        />
      ));
    }
  };

  const userLocationMarker = () => (
    <MapView.Marker
      coordinate={userLocation}
      onPress={() => console.log('Found me!!!')}
      pinColor="navy"
    />
  );

  useEffect(() => {
    getUserLocationHandler();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={userLocation}
        region={userLocation}
        customMapStyle={customStyle}
      >
        {userLocationMarker()}
        {getAllSceneLocationsHandler()}
      </MapView>
      <Button title="Get Location" onPress={getUserLocationHandler} />
    </View>
  );
};

export default FunctionMap;
