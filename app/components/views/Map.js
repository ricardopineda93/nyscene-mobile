import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useQuery } from '@apollo/react-hooks';
import customStyle from '../../../customStyle';
import SceneInfo from './SceneInfo';
import SceneCallout from './SceneCallout';
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

const Map = props => {
  // Used to render user location marker and default center of map
  const [userLocation, setUserLocation] = useState({
    // defaulting to Madison Square Park if user info isn't grabbed successfully
    latitude: 40.742963,
    longitude: -73.986683,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  // Control whether modal overlaying map is visible or not
  const [modalIsVisible, setModalIsVisible] = useState(false);
  // Controls where map should center on rerenders
  const [currentMapCenter, setCurrentMapCenter] = useState(userLocation);
  // Controls what scene has been selected to render in modal
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  // Manually goes to fetch user location
  const getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(position => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });
      // Makes map center user location if a forced location fetch is made
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

  // What happens when a user clicks a scene marker - sets the selected sceneId
  // in state for modal component to use as prop and rerender, centers the map over
  // that scene when rerender occurs so it doesn't fly back to user location,
  // and makes the sceneInfo modal visible over map
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
        <Marker
          key={id}
          coordinate={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onPress={() => sceneSelectHandler(id, lat, lng, film)}
          // image={filmstripIcon}
          pinColor={selectedSceneId === id ? 'yellow' : 'red'}
        >
          <Callout>
            <View>
              <Text>{film}</Text>
            </View>
          </Callout>
          {/* <Callout tooltip onPress={e => {
            if (
              e.nativeEvent.action === 'callout-press'
            ) {
              return;
            }

            Alert.alert('callout pressed');
          }}>
            <SceneCallout sceneId={selectedSceneId} />
          </Callout> */}
        </Marker>
      ));
    }
  };

  const userLocationMarker = () => (
    <Marker coordinate={userLocation} pinColor="navy">
      <Callout>
        <View>
          <Text>Found ya!</Text>
        </View>
      </Callout>
    </Marker>
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

export default Map;
