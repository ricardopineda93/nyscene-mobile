import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Text
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { getScene } from '../../queries/queries';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start'
  },
  bubble: {
    width: 400,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderColor: '#FFF',
    borderWidth: 0.5
  },
  amount: {
    flex: 1
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#FFF',
    alignSelf: 'center',
    marginTop: -32
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#FFF',
    alignSelf: 'center',
    marginTop: -0.5
  }
});

const SceneCallout = props => {
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
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.amount}>{getSceneInfo()}</View>
      </View>
      <View style={styles.arrowBorder} />
      <View style={styles.arrow} />
    </View>
  );
};

export default SceneCallout;
