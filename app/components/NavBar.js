import { StyleSheet, Text, View } from 'react-native'
import { Dimensions } from 'react-native';
import React, { useState } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const NavBar = (props) => {
    const [curr, setCurr] = useState('home');
    const color = (icon) => {
        switch (icon) {
            case 'nav':
                if (curr === 'nav') {
                    return '#25aa72'
                } else {
                    return '#c4c4c4'
                }
            case 'home':
                if (curr === 'home') {
                    return '#25aa72'
                } else {
                    return '#c4c4c4'
                }
        }
    }
    const changePage = (newPage) => {
        setCurr(newPage)
        props.setCurrView(newPage)
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => changePage('home')}>
                <FontAwesome5 name={'home'} solid size={windowWidth / 11} color={color('home')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changePage('nav')}>
                <Entypo name='map' size={windowWidth / 11} color={color('nav')} />
            </TouchableOpacity>
        </View>
    )
}

export default NavBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        color: 'black',
        backgroundColor: 'white',
        width: windowWidth,
        height: windowHeight / 12,
    }
})