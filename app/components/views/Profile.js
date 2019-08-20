import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { allUsers } from '../../queries/queries';

const Profile = props => {
  const [formDetails, setFormDetails] = useState({ email: '', password: '' });

  const getAllUsers = () => {
    const { loading, error, data } = useQuery(allUsers);
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
      <View>
        <TextInput
          label="Email"
          value={formDetails.email}
          onChangeText={text => setFormDetails({ ...formDetails, email: text })}
          textContentType="emailAddress"
        />
        <TextInput
          label="Password"
          value={formDetails.password}
          onChangeText={text =>
            setFormDetails({ ...formDetails, password: text })
          }
          secureTextEntry={true}
          textContentType="password"
        />
        <Button mode="contained" onPress={() => console.log(formDetails)}>
          Submit
        </Button>
      </View>
      {getAllUsers()}
    </>
  );
};

export default Profile;
