import React from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const Profile = props => {
  const getAllUsers = () => {
    const { loading, error, data } = useQuery(gql`
      {
        allUsers {
          id
          email
          password
        }
      }
    `);
    if (loading) return <Text>Loading...</Text>;
    if (error) {
      console.log(error);
      return <Text>Error :(</Text>;
    }
    return data.allUsers.map(({ id, email }) => (
      <View key={id}>
        <Text>Email: {email}</Text>
        <Text>ID: {id}</Text>
      </View>
    ));
  };

  return (
    <>
      <Text>Profiles: </Text>
      {getAllUsers()}
    </>
  );
};

export default Profile;
