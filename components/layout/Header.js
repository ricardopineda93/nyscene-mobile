import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';

export default function Header() {
  const _goBack = () => console.log('Went back');

  const _onSearch = () => console.log('Searching');

  const _onMore = () => console.log('Shown more');

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title="nyscene." subtitle="As scene on TV." />
      <Appbar.Action icon="more-vert" onPress={_onMore} />
    </Appbar.Header>
  );
}
