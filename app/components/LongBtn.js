import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LongBtn = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.text}</Text>
        </View>
    )
}

//25aa72
//23260
//0e152b

export default LongBtn

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#25aa72',
        borderRadius: windowWidth * 0.08,
        height: windowHeight * 0.052,
        width: windowWidth * 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        // letterSpacing: 1,
        fontSize: windowWidth * 0.04,
        color: 'white',
        fontWeight: '700'

    }
})