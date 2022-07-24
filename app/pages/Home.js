import { TextInput, StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView, Button, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
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
import * as WebBrowser from 'expo-web-browser';
import { TaskRealmContext } from "../models";
import i_m_pairs from "../components/itemMaterials";

const {useRealm, useQuery } = TaskRealmContext;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = (props) => {

    const realm = useRealm();
    
    const items = useQuery("Item");


  //1 time only, initialises the database for item-material. 
  //pulls from itemMaterials.js
/*
  if(items.length !== 0) {
    realm.write(() => {
      realm.deleteAll();
    })
  }
  console.log(items);
*/

    if(items.length === 0) {
        realm.write(() => {
            for(let i= 0; i<Object.keys(i_m_pairs).length; i++) {
                realm.create("Item", {item: Object.keys(i_m_pairs)[i], materials: i_m_pairs[Object.keys(i_m_pairs)[i]]});
            }
        })
    }
    
    const newIms = useQuery("Item");
    const newItems = []; 

    for(let i = 0; i<newIms.length; i++) {
        newItems.push(newIms[i].item);
    }

    
    const [isModalVisible, setModalVisible] = useState(false);
    const [feedbackSelected, setFeedbackSelected] = useState(false);
    const [userInput, setUserInput] = useState("");
    //make sure recyclingItems array always only has 3 items, each an object
    const [recyclingItems, setRecyclingItems] = useState([{ image: COLA, name: 'Coca Cola Can', type: realm.objectForPrimaryKey("Item", 'coca cola can').materials.join(", ")}, { image: CAPSULES, name: 'Coffee Capsule', type: realm.objectForPrimaryKey("Item", 'coffee capsule').materials.join(", ") }, { image: ALUMINIUM, name: 'Aluminium Plate', type: realm.objectForPrimaryKey("Item", 'aluminium plate').materials.join(", ") }]);
    const [selectedItem, setSelectedItem] = useState({ name: '', type: '' });
    const [feedback, setFeedback] = useState("");

    //creating suggestions from our list of items based on user input. 
    //Logic: Must contain users input + the earlier the substring the better the suggestion
    const isBetterSuggestion = (wordOne, wordTwo, substring) => {
        let lettersBeforeSplit1 = wordOne.split(substring)[0].length;
        let lettersBeforeSplit2 = wordTwo.split(substring)[0].length;
        if(lettersBeforeSplit1 > lettersBeforeSplit2) {
            return true;
        }
        return false
    }

    const goToNav = () => {
        props.recycle('nav');
    }

    const returnSuggestedItems = (input) => {
        input = input.toLowerCase();
        if(input === "") {
            setRecyclingItems([{ image: COLA, name: 'Coca Cola Can', type: realm.objectForPrimaryKey("Item", 'coca cola can').materials.join(", ")}, { image: CAPSULES, name: 'Coffee Capsule', type: realm.objectForPrimaryKey("Item", 'coffee capsule').materials.join(", ") }, { image: ALUMINIUM, name: 'Aluminium Plate', type: realm.objectForPrimaryKey("Item", 'aluminium plate').materials.join(", ") }]);
            return
        } 
        const matches = newItems.filter(element => {
            if (element.indexOf(input) !== -1) {
              return true;
            }
        });
        if(matches.length <= 3) {
            let newArr = [];
            for(let i = 0; i<matches.length;i++) {
                let materials = realm.objectForPrimaryKey("Item", matches[i]).materials.join(", ");
                //capitalise each word of the item
                let item = matches[i].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                newArr.push({image: PerivalionLogo, name: item, type: materials})
            }
            setRecyclingItems(newArr);
            return
        }

        let stOne = "";
        let stTwo = "";
        let stThree = "";
        for(let i = 0; i< matches.length; i++) {
            if(stOne === "") {
                stOne = matches[i]
            } else if(stTwo === "") {
                if(isBetterSuggestion(stOne, matches[i], input)) {
                    stTwo = stOne;
                    stOne = matches[i]
                } else {
                    stTwo = matches[i]
                }
            } else if(stThree === "") {
                if(isBetterSuggestion(stOne, matches[i], input)) {
                    stThree = stTwo;
                    stTwo = stOne;
                    stOne = matches[i]
                } else if(isBetterSuggestion(stTwo, matches[i], input)) {
                    stThree = stTwo;
                    stTwo = matches[i]
                } else {
                    stThree = matches[i]
                }
            } else {
                if(isBetterSuggestion(stOne, matches[i], input)) {
                    stThree = stTwo;
                    stTwo = stOne;
                    stOne = matches[i]
                } else if(isBetterSuggestion(stTwo, matches[i], input)) {
                    stThree = stTwo;
                    stTwo = matches[i]   
                } else if(isBetterSuggestion(stThree, matches[i], input)) {
                    stThree = matches[i];
                }
            }
        }  
        let neededArr = [stOne, stTwo, stThree];
        let newArr = [];
        for(let i = 0; i<neededArr.length;i++) {
            let materials = realm.objectForPrimaryKey("Item", neededArr[i]).materials.join(", ");
            //capitalise first letter of each word of the item
            let item = neededArr[i].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            newArr.push({image: PerivalionLogo, name: item, type: materials})
        }
        setRecyclingItems(newArr);
        return 
    }

    //called when user changes input
    const changeText = (text) => {
        setUserInput(text);
        returnSuggestedItems(text)
    }

    const setModalItem = (object) => {
        setSelectedItem(object);
    }
    const toggleModal = () => {
        // console.warn('pressed')
        setFeedbackSelected(false);
        setFeedback("");
        setModalVisible(!isModalVisible);
    };
    const changeFeedbackSelected = () => {
        setFeedbackSelected(!feedbackSelected)
    }
    
    //when the user presses the search button -> we check if input is in our db
    //If not we use word2vec to guess what material the item is

    const search = () => {
        let item = realm.objectForPrimaryKey("Item", userInput.toLowerCase());
        if(item) {
            let itemName = userInput.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            setSelectedItem({name: itemName, type: item.materials.join("/")})
            setModalVisible(true);
        } else {
            console.log('hehe')
        }
    }

    //update db with the submitted feedback. If item exists, we update db else we create a new item in db.
    const submitFeedbackSelected = () => {

        let item = realm.objectForPrimaryKey("Item", selectedItem.name.toLowerCase());

        if(item) {
            realm.write(() => {
                const toChange = realm.objectForPrimaryKey("Item", selectedItem.name.toLowerCase());
                toChange.materials = [feedback.toLowerCase()];
            })
        } else {
            realm.write(() => {
                realm.create("Item", {item: userInput.toLowerCase(), materials: [feedback.toLowerCase()]});
            })
        }
        setUserInput("");
        setRecyclingItems([{ image: COLA, name: 'Coca Cola Can', type: realm.objectForPrimaryKey("Item", 'coca cola can').materials.join(", ")}, { image: CAPSULES, name: 'Coffee Capsule', type: realm.objectForPrimaryKey("Item", 'coffee capsule').materials.join(", ") }, { image: ALUMINIUM, name: 'Aluminium Plate', type: realm.objectForPrimaryKey("Item", 'aluminium plate').materials.join(", ") }]);
        toggleModal();
    }

    const linkReyclingBins = () => {
        WebBrowser.openBrowserAsync('https://www.gov.hk/en/residents/environment/waste/index.htm');
    }
    const linkRecyclingProblem = () => {
        WebBrowser.openBrowserAsync('https://www.scmp.com/magazines/post-magazine/long-reads/article/3163237/how-hong-kongs-waste-problem-becoming-crisis');
    }
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
                value={userInput}
                onChangeText={(text) => changeText(text)}
                onClearPress={() => changeText("")}
                onSearchPress={() => search()}
            />

            <View style={styles.menu}>

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

                    {/* <View style={{
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
                    </View> */}
                    {
                        feedbackSelected ?
                            <View style={{ padding: windowHeight / 30 }}>
                                <View style={{ borderBottomColor: 'white', borderBottomWidth: 2 }}>
                                    <TextInput placeholder='Input Suggested Material Type:' style={{ color: 'white', fontSize: 14 }} placeholderTextColor='#d9d9d9' value={feedback} onChangeText={(e) => setFeedback(e)} />
                                </View>
                                <TouchableOpacity onPress={() => submitFeedbackSelected()}>
                                    <View style={{ paddingTop: windowHeight / 15 }}>
                                        <LongBtnPlain text='SUBMIT' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    padding: windowHeight / 40,
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: windowWidth / 18,
                                        padding: windowHeight / 100,
                                 
              
                                    }}>Waste type:</Text>
                                    <Text style={{
                                        color: '#25aa72',
                                        fontSize: windowWidth / 18,
                                        padding: windowHeight / 100,
                             
                                    }}>{selectedItem.type}</Text>
                                </View>
                                <TouchableOpacity onPress={() => changeFeedbackSelected()}>
                                    <View style={{ paddingTop: windowHeight / 15, paddingLeft: windowHeight/15, paddingRight: windowHeight/15 }}>
                                        <LongBtnPlain text='FEEDBACK' />
                                    </View>
                                </TouchableOpacity>
                            </View>


                    }
                    {/* <TouchableOpacity onPress={() => changeFeedbackSelected()}>
                        <View style={{ paddingTop: windowHeight / 15 }}>
                            <LongBtnPlain text='FEEDBACK' />
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => goToNav()}>
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
                <TouchableOpacity onPress={() => linkReyclingBins()}>
                    <View style={styles.articles}>
                        {/* image */}
                        <Image source={HKBINS} style={styles.articleIMGs} />

                        {/* text */}
                        <Text style={styles.articleText}>
                            Recycling System in Hong Kong
                        </Text>
                        <Icon name='arrow-forward-ios' size={windowWidth / 16} color='#25aa72' />

                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => linkRecyclingProblem()}>
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
                </TouchableOpacity>

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
        alignItems: 'center',
        height: 20
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