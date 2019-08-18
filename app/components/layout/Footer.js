import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import FunctionMap from '../views/FunctionMap';
import Favorites from '../views/Favorites';
import Profile from '../views/Profile';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'map', title: 'Map', icon: 'map' },
        { key: 'favorites', title: 'Favorites', icon: 'favorite' },
        { key: 'profile', title: 'Profile', icon: 'account-circle' }
      ]
    };
  }

  _handleIndexChange = index => this.setState({ index });

  MapRoute = () => <FunctionMap />;
  FavoritesRoute = () => <Favorites />;
  ProfileRoute = () => <Profile />;

  _renderScene = BottomNavigation.SceneMap({
    map: this.MapRoute,
    favorites: this.FavoritesRoute,
    profile: this.ProfileRoute
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}
