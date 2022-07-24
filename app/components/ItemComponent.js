import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ItemComponent = (props) => {
    const itemPressed = () => {
        props.setModalItem({ name: props.name, type: props.type })
        props.toggleModal()
    }
    return (
        <TouchableOpacity onPress={itemPressed}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <Image source={props.image} style={styles.IMGs} />


                </View>
                <View style={styles.right}>
                    <Text style={styles.text}>{props.name}</Text>
                    <Icon name='arrow-forward-ios' size={windowWidth / 16} color='#25aa72' />

                </View>
            </View>
        </TouchableOpacity>

    )
}

export default ItemComponent

const styles = StyleSheet.create({
    container: {

        borderRadius: windowWidth * 0.05,
        borderColor: '#25aa72',
        borderWidth: 2,
        padding: windowHeight / 200,
        width: windowWidth * 0.95,
        height: windowHeight / 9,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,

    },
    left: {
        marginRight: 30
    },
    right: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // flexWrap: 'wrap',
        fontSize: 12,
        fontWeight: 'bold'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        color: '#25aa72'
    },
    imagePlaceholder: {
        backgroundColor: 'white',
        borderRadius: windowWidth * 0.05,
        height: windowHeight / 9,
        width: windowWidth * 0.28,
        justifyContent: 'center'
    },
    IMGs: {
        borderRadius: windowWidth * 0.05,
        height: windowHeight * 0.11,
        width: windowWidth * 0.28,
        justifyContent: 'center'
    },
})