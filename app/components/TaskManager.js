import React, { useCallback, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { TaskRealmContext } from "../models";
import * as Location from 'expo-location';
import binAddresses from "./binAddresses";
import BinView from "./BinView";
import Geocoder from "react-native-geocoding";


//make it so that it updates location as the user moves.

const {useRealm, useQuery, useObject} = TaskRealmContext;

export const TaskManager = ({ tasks, userId }) => {
  const realm = useRealm();
  
  const items = useQuery("Bin");
/*
  if(items.length !== 0) {
    realm.write(() => {
      realm.deleteAll();
    })
  } 
*/
  //1 time only, initialises the database for bins. Pulls from binAddresses.js
  //gets coordinates of all addresses using geocoder (Google API)
  //Then adds address + coords to our database
  if(items.length === 0) {
    Geocoder.init("AIzaSyALD0YncwoJ6nHW6MkL5J385Kr7s_RSfu4");
    for(let i = 0; i < binAddresses.length; i++) {
      Geocoder.from(binAddresses[i])
      .then(json => {
        var location = json.results[0].geometry.location;
        realm.write(() => {
          realm.create("Bin", {_id: new Realm.BSON.ObjectId(), address: binAddresses[i], lat: location.lat, lng: location.lng})
        })
      })  
      .catch(error => console.warn(error));    
    }
  }


  const nItems = useQuery("Bin");
  console.log(nItems);
  //for whether user wants to walk or drive
  const [walking, setWalking] = useState(true);

  //in case user denies permission
  const [errorMsg, setErrorMsg] = useState(null);

  //to set the region of the map and also place the user's pin (triangulated around their location)
  const [mapRegion, setmapRegion] = useState({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
  });


  useEffect(() => {
    (async () => {

      //ask the users for location permission (one time only)
      let { status } = await  Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
        console.log('denied');
        setErrorMsg('Permission to access location was denied');
        return;
     } else {
       //gets the users current position --> places a marker there later
       let location = await Location.getCurrentPositionAsync({});
       setmapRegion({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
         latitudeDelta: 0.0222,
         longitudeDelta: 0.0221
       })

       //determining the closest 5 recycling bins to the user:
       //get the addresses of all the bins
       //find the time from all the bins to the users location
       //sort the findings



     }
    
    })();
  }, []);

  //if the walk/drive button is pressed, to toggle the state accordingly

  function toggleWalk() {
    setWalking(!walking);
  }


  return (
    <View style={styles.content}>
      <MapView
        style={{ alignSelf: 'stretch', height: '50%' }}
        region={mapRegion}
      >
        <Marker pinColor="green" coordinate={mapRegion} title='Your location'></Marker>
      </MapView>
      <ScrollView style={styles.bottomView}>
        <View style={styles.buttonView}>
          {
            walking ? 
            <Pressable style={[styles.button, styles.selected]} onPress={toggleWalk}><Text style={styles.buttonText}>Walk</Text></Pressable>
            :
            <Pressable style={[styles.button]} onPress={toggleWalk}><Text style={styles.buttonText}>Walk</Text></Pressable>
          }
          {
            walking ?
            <Pressable style={styles.button} onPress={toggleWalk}><Text style={styles.buttonText}>Drive</Text></Pressable>
            :
            <Pressable style={[styles.button, styles.selected]} onPress={toggleWalk}><Text style={styles.buttonText}>Drive</Text></Pressable>
          }
        </View>
        <View style={styles.descriptorView}><Text style={styles.descriptor}>The 5 Closest Bins To You:</Text></View>
        <BinView 
          blue={true} 
          rank={1} 
          address={"Lung Lok House, Lower Wong Tai Sin (2) Estate, Wong Tai Sin"} 
          distance={"5km"}
          time={1}
          units={"min"}
        />
        <BinView 
          blue={false} 
          rank={2} 
          address={"Lung Lok House, Lower Wong Tai Sin (2) Estate, Wong Tai Sin"} 
          distance={"10km"}
          time={3}
          units={"mins"}
        />
        <BinView 
          blue={true} 
          rank={3} 
          address={"Lung Lok House, Lower Wong Tai Sin (2) Estate, Wong Tai Sin"} 
          distance={"12km"}
          time={5}
          units={"mins"}
        />
        <BinView 
          blue={false} 
          rank={4} 
          address={"Lung Lok House, Lower Wong Tai Sin (2) Estate, Wong Tai Sin"} 
          distance={"15km"}
          time={10}
          units={"mins"}
        />
        <BinView 
          blue={true} 
          rank={5} 
          address={"Lung Lok House, Lower Wong Tai Sin (2) Estate, Wong Tai Sin"} 
          distance={"20km"}
          time={20}
          units={"mins"}        
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  bottomView: {
    backgroundColor: "#0E152B",
    height: "50%",
  },

  buttonView: {
    flexDirection: "row"
  },

  button: {
    backgroundColor: "#25AA72",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 2,
    paddingTop: "2%",
    paddingBottom: "2%",
    paddingLeft: "1%",
    paddingRight: "1%",
    width: "50%",
    textAlign: "center"
  },
  buttonText: {
    textAlign: "center"
  },
  selected: {
    opacity: 0.5
  },
  descriptorView: {
    width: "100%",
    backgroundColor: "#232630"
  },
  descriptor: {
    fontFamily: "arial",
    color: "white",
    paddingTop: "2%",
    paddingBottom: "2%",
    fontSize: 20,
    textAlign: "center"
  }
});
