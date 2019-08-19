import { gql } from 'apollo-boost';

export const allScenes = gql`
  {
    allScenes {
      id
      lat
      lng
      film
    }
  }
`;

export const allUsers = gql`
  {
    allUsers {
      id
      email
      password
    }
  }
`;

export const userFavorites = gql`
  query($id: ID!) {
    singleUser(id: $id) {
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
`;

export const getScene = gql`
  query($id: ID!) {
    singleScene(id: $id) {
      id
      film
      locationDetails
      boro
      neighborhood
      imdbLink
      omdbInfo {
        Year
        Actors
        Poster
      }
    }
  }
`;
