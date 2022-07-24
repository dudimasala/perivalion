import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LongBtn from './components/LongBtn';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import { CollectionPoints } from './pages/CollectionPoints'
import { useState } from 'react';

export default function App() {
  const [currPage, setCurrPage] = useState('home');
  const changePage = (newPage) => {
    setCurrPage(newPage);
  }
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {currPage === 'nav' ? <CollectionPoints /> : <Home />}
      </View>
      <View style={styles.navbar}>
        <NavBar setCurrView={changePage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e152b',
    alignItems: 'center',
    justifyContent: 'center',


  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
});