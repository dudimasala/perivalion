import { StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import SearchBar from "react-native-dynamic-search-bar";
import Icon from 'react-native-vector-icons/MaterialIcons'
// import Carousel from 'react-native-reanimated-carousel';
import Modal from "react-native-modal";
import { useState } from 'react';
import BackIcon from 'react-native-vector-icons/Ionicons'
import LongBtn from '../components/LongBtn';
import LongBtnPlain from '../components/LongBtnPlain';
import ItemComponent from '../components/ItemComponent';
import HKBINS from '../../assets/RecyclingBinsHK.jpg'
import HKWASTE from '../../assets/wasteProblemHK.png'
import COLA from '../../assets/Cola.png'
import CAPSULES from '../../assets/Capsules.png'
import ALUMINIUM from '../../assets/AluminumFoil.png'
import PerivalionLogo from '../../assets/PerivalionLOGO.png'





const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = (props) => {
    const [isModalVisible, setModalVisible] = useState(false);
    //make sure recyclingItems array always only has 3 items, each an object
    const [recyclingItems, setRecyclingItems] = useState([{ image: COLA, name: 'Coca Cola Can', type: 'metal' }, { image: CAPSULES, name: 'Nestle Capsules', type: 'metal' }, { image: ALUMINIUM, name: 'Aluminium Plates', type: 'metal' }]);
    const [selectedItem, setSelectedItem] = useState({ name: '', type: '' });
    const setModalItem = (object) => {
        setSelectedItem(object);
    }
    const toggleModal = () => {
        // console.warn('pressed')
        setModalVisible(!isModalVisible);
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={{
                    color: 'white',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: windowWidth / 18
                }}>Search</Text>
            </View>

            <SearchBar
                placeholder="Your item"
                onChangeText={(text) => console.log(text)}
            />

            <View style={styles.menu}>
                <Text style={styles.menuText}>
                    Metal
                </Text>
                <Text style={styles.menuText}>
                    Paper
                </Text>
                <Text style={styles.menuText}>
                    Plastic
                </Text>
                <Text style={styles.menuText}>
                    Glass
                </Text>
                <Text style={{
                    color: '#25aa72',
                    fontSize: windowWidth / 15,
                    padding: windowWidth / 25,
                    fontWeight: '900'
                }}>
        
                </Text>
            </View>
            {/* <Carousel toggleModal={toggleModal} /> */}
            <View style={{ height: windowHeight / 3 }}>
                {
                    recyclingItems.map((item, index) => {
                        return <ItemComponent image={item.image} name={item.name} key={index} setModalItem={setModalItem} type={item.type} toggleModal={toggleModal} />
                    })
                }
            </View>
            <Modal isVisible={isModalVisible}
                coverScreen={true}
                onSwipeComplete={() => toggleModal()}
                swipeDirection="up"
                backdropOpacity={0.6}
            // deviceWidth={deviceWidth}
            // deviceHeight={deviceHeight}
            >
                <View style={{

                    flex: 1,
                    backgroundColor: '#232630',
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <View style={{ justifyContent: 'flex-start' }}>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <BackIcon name='arrow-back' size={windowWidth / 9} color='#25aa72' />
                        </TouchableOpacity>
                        <View style={{
                            width: windowWidth * 0.8,
                            height: windowHeight * 0.1
                        }}></View>
                    </View>
                    <Text style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: windowWidth / 15,
                        padding: windowHeight / 50
                    }}>{selectedItem.name}</Text>
                    {/* <View style={styles.modalImagePlaceholder}>
                        <Text>Image</Text>
                    </View> */}
                    <Image source={PerivalionLogo} style={styles.modalIMG} />

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: windowHeight / 40,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: windowWidth / 18,
                            padding: windowHeight / 100
                        }}>Waste type:</Text>
                        <Text style={{
                            color: '#25aa72',
                            fontSize: windowWidth / 18,
                            padding: windowHeight / 100
                        }}>{selectedItem.type}</Text>
                    </View>
                    <View style={{ paddingTop: windowHeight / 15 }}>
                        <LongBtnPlain text='FEEDBACK' />
                    </View>
                    <TouchableOpacity onPress={() => (props.recycle('nav'))}>
                      <View style={{ padding: windowHeight / 30 }}>
                        <LongBtn text='RECYCLE' />
                      </View>
                    </TouchableOpacity>

                </View>
            </Modal>
            <View style={styles.moreInfo}>
                <Text style={{
                    color: 'white',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: windowWidth / 18
                }}>More Info</Text>
                <Text style={{
                    color: '#25aa72',
                    fontSize: windowWidth / 15,
                    padding: windowWidth / 25,
                    fontWeight: '900'
                }}>
    
                </Text>
            </View>
            <View>
                <View style={styles.articles}>
                    {/* image */}
                    <Image source={HKBINS} style={styles.articleIMGs} />

                    {/* text */}
                    <Text style={styles.articleText}>
                        Recycling System in Hong Kong
                    </Text>
                    <Icon name='arrow-forward-ios' size={windowWidth / 16} color='#25aa72' />

                </View>
                <View style={styles.articles}>
                    {/* image */}
                    <Image source={HKWASTE} style={styles.articleIMGs} />
                    {/* <View style={styles.imagePlaceholder}>
                        <Text>Image</Text>
                    </View> */}
                    {/* text */}
                    <Text style={styles.articleText}>
                        Waste Problem in Hong Kong
                    </Text>
                    <Icon name='arrow-forward-ios' size={windowWidth / 16} color='#25aa72' />

                </View>
            </View>
        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0e152b',
        alignItems: 'center',
        justifyContent: 'center'
    },
    box: {
        backgroundColor: 'white',
        borderRadius: windowWidth * 0.05,
        borderWidth: 2,
        borderColor: 'grey',
        height: windowHeight * 0.14,
        width: windowWidth * 0.8,
        justifyContent: 'center'
    },
    menu: {
        flexDirection: 'row',
        color: 'white',
        fontSize: 20,
        paddingLeft: windowWidth / 15,
        alignItems: 'center'
    },
    menuText: {
        color: 'white',
        fontSize: windowWidth / 24,
        padding: windowWidth / 25
    },
    header: {
        height: windowHeight * 0.08,
        width: windowWidth * 0.8,
        justifyContent: 'center'
    },
    moreInfo: {
        height: windowHeight * 0.08,
        width: windowWidth * 0.8,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    imagePlaceholder: {
        backgroundColor: 'white',
        borderRadius: windowWidth * 0.05,
        borderWidth: 2,
        borderColor: 'grey',
        height: windowHeight * 0.11,
        width: windowWidth * 0.28,
        justifyContent: 'center'
    },
    articleIMGs: {
        borderRadius: windowWidth * 0.05,
        height: windowHeight * 0.11,
        width: windowWidth * 0.28,
        justifyContent: 'center'
    },
    articles: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    articleText: {
        color: 'white',
        fontSize: windowWidth / 26,
        padding: windowWidth / 25
    },
    modalImagePlaceholder: {
        backgroundColor: 'white',
        borderRadius: windowWidth * 0.05,
        borderWidth: 2,
        borderColor: 'grey',
        height: windowHeight * 0.2,
        width: windowWidth * 0.6,
        justifyContent: 'center',
        padding: windowHeight / 65
    },
    modalIMG: {
        height: windowHeight * 0.3,
        width: windowWidth * 0.6,
        justifyContent: 'center',
        padding: windowHeight / 70
    }
})