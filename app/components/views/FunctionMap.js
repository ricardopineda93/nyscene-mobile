import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import customStyle from '../../../customStyle';
import SceneInfo from './SceneInfo';
import { allScenes } from '../../queries/queries';
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

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [currentMapCenter, setCurrentMapCenter] = useState(userLocation);
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  const getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(position => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });
      setCurrentMapCenter({
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

  const sceneSelectHandler = (id, lat, lng) => {
    setSelectedSceneId(id);
    setCurrentMapCenter({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    });
    setModalIsVisible(true);
  };

  const getAllSceneLocationsHandler = () => {
    const { loading, error, data } = useQuery(allScenes);
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
          onPress={() => sceneSelectHandler(id, lat, lng)}
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
    <>
      <SceneInfo
        visible={modalIsVisible}
        onDismiss={() => setModalIsVisible(false)}
        sceneId={selectedSceneId}
      />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={currentMapCenter}
          region={currentMapCenter}
          customMapStyle={customStyle}
        >
          {userLocationMarker()}
          {getAllSceneLocationsHandler()}
        </MapView>
        <Button title="Get Location" onPress={getUserLocationHandler} />
      </View>
    </>
  );
};

export default FunctionMap;
