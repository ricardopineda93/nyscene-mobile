import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Headline, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const Favorites = props => {
  const getUserFavorites = () => {
    const { loading, error, data } = useQuery(gql`
      {
        singleUser(id: 2) {
          favorites {
            scene {
              id
              film
              locationDetails
              imdbLink
              omdbInfo {
                Year
                Poster
              }
            }
          }
        }
      }
    `);
    if (loading) return <Text>Loading...</Text>;
    if (error) {
      console.log(error);
      return <Text>Error :(</Text>;
    }
    const { favorites } = data.singleUser;
    return favorites.map(({ scene }) => (
      <View key={scene.id}>
        <Card>
          <Card.Content>
            <TouchableOpacity onPress={() => Linking.openURL(scene.imdbLink)}>
              <Title style={{ textDecorationLine: 'underline' }}>
                {scene.film} ({scene.omdbInfo.Year})
              </Title>
            </TouchableOpacity>
            <Paragraph>{scene.locationDetails}</Paragraph>
          </Card.Content>
          <Card.Cover source={{ uri: scene.omdbInfo.Poster }} />
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => console.log('Take me there!')}
            >
              Visit
            </Button>
            <Button
              mode="contained"
              color="red"
              onPress={() => console.log('Get it outta here!')}
            >
              Remove
            </Button>
          </Card.Actions>
        </Card>
      </View>
    ));
  };

  return (
    <>
      <Headline>Favorites:</Headline>
      <ScrollView>{getUserFavorites()}</ScrollView>
    </>
  );
};

export default Favorites;
