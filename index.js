import 'expo-dev-client';
import 'react-native-get-random-values';
import React from 'react';
import {registerRootComponent} from 'expo'
import {AppWrapper} from './app/AppWrapper';

const App = () => <AppWrapper />

registerRootComponent(App);
