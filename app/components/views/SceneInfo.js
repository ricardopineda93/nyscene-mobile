import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Modal,
  Portal
} from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { getScene } from '../../queries/queries';

const SceneInfo = props => {
  const getSceneInfo = () => {
    const { sceneId } = props;

    if (sceneId) {
      const { loading, error, data } = useQuery(getScene, {
        variables: { id: sceneId }
      });
      if (loading) return <Text>Loading...</Text>;
      if (error) {
        console.log(error);
        return <Text>Error :(</Text>;
      }
      const { singleScene } = data;
      const { omdbInfo } = singleScene;
      return (
        <View key={singleScene.id}>
          <Card>
            <Card.Content>
              <Card.Cover source={{ uri: omdbInfo.Poster }} />
              <TouchableOpacity
                onPress={() => Linking.openURL(singleScene.imdbLink)}
              >
                <Title style={{ textDecorationLine: 'underline' }}>
                  {singleScene.film} ({omdbInfo.Year})
                </Title>
              </TouchableOpacity>
              <Paragraph>Starring: {omdbInfo.Actors}</Paragraph>
              <Paragraph>
                Location Details: {singleScene.locationDetails}
              </Paragraph>
              <Paragraph>Neighborhood: {singleScene.neighborhood}</Paragraph>
              <Paragraph>Borough: {singleScene.boro}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => console.log('Added to Favorites!')}
              >
                Add to Favorites
              </Button>
            </Card.Actions>
          </Card>
        </View>
      );
    } else {
      return <Text>No scene here!</Text>;
    }
  };

  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={props.onDismiss}>
        {getSceneInfo()}
      </Modal>
    </Portal>
  );
};

export default SceneInfo;
