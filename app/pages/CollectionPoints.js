import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { TaskRealmContext } from "../models";
import * as Location from 'expo-location';
import binAddresses from "../components/binAddresses";
import BinView from "../components/BinView";
import Geocoder from "react-native-geocoding";
var axios = require("axios");
var mongoose = require('mongoose');

//for the private API key
import environmentalVariables from "../../env";


const {useRealm, useQuery } = TaskRealmContext;


export const CollectionPoints = ({ tasks, userId }) => {
  
  const realm = useRealm();
  
  //for whether user wants to walk or drive
  const [mode, setMode] = useState("walking");

  //in case user denies permission
  const [errorMsg, setErrorMsg] = useState(null);
    
  //to set the region of the map and also place the user's pin (triangulated around their location)
  const [mapRegion, setmapRegion] = useState(null);
  
  const [closestFive, setClosestFive] = useState(null);

  //to stop an infinite loop for finding the closest 5 bins
  const [loaded, setLoaded] = useState(false);

  const [loadedItems, setLoadedItems]=useState(false);

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
  
  if(items.length === 0 && !loadedItems) {
    setLoadedItems(true);
    Geocoder.init(environmentalVariables.GOOGLE_API_KEY);
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
  
  
  const bins = useQuery("Bin");

      //determining the closest 5 recycling bins to the user:
      //get the addresses of all the bins
      //find the time from all the bins to the users location
      //sort the findings

  //The main algorithm
  //Use axios to create a get request and pull from the gmaps distance matrix api
  //from there we get several useful pieces of data: time + distance given some travelling method
  //Use that to create a dictionary, -> find the five lowest time values and then store the bins, the time, and the distance of the closest 5

  if(mapRegion !== null && loaded === false) {
    setLoaded(true);
    let travelTimes = {};
    let completeData = {};
    for(let i = 0; i < bins.length; i++) {
      var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${mapRegion.latitude}%2C${mapRegion.longitude}&destinations=${bins[i].lat}%2C${bins[i].lng}&mode=${mode}&units=imperial&key=${environmentalVariables.GOOGLE_API_KEY}`,
        headers: { }
      };
      axios(config)
      .then(function (response) {
        travelTimes[bins[i]._id] = response.data.rows[0].elements[0].duration.value;
        completeData[bins[i]._id] = response.data.rows[0].elements[0].distance.text;
        const vals = Object.values(travelTimes)
        if(vals.length === bins.length) {
          let newVals = vals;
          let keys = Object.keys(travelTimes);
          let lowestIds = [];
          for(let i = 0; i<5; i++) {
            let index = newVals.indexOf(Math.min(...newVals));
            lowestIds.push([keys[index], newVals[index], completeData[keys[index]]]);
            newVals.splice(index, 1);
            keys.splice(index, 1);
          }  
          setClosestFive(lowestIds);
        }
      })
      .catch(function (error) {
        setErrorMsg("No Routes Found!");
      });
    }

 
  }




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
         latitudeDelta: 0.0622,
         longitudeDelta: 0.0621
       });
       setLoaded(false);

     }
    
    })();
  }, []);

  //if the walk/drive button is pressed, to toggle the state accordingly

  function toggleMode() {
    mode === "walking" ? setMode("driving"):setMode("walking");
    setLoaded(false);
    setClosestFive(null);
  }

  //to try again after an error
  function tryAgain() {
    setErrorMsg(null);
  }

//Some error/loading UIs
  if(errorMsg !== null) {
    return (
      <View style={styles.content}>
        <View style={styles.filler}>
          <Text style={styles.error}>{errorMsg}</Text>
          <Pressable style={styles.errButton} onPress={tryAgain}><Text style={styles.buttonText}>Try Again</Text></Pressable>
        </View>
      </View>
    )
  }
  else if(mapRegion === null) {
    return (
      <View style={styles.content}>
        <View style={styles.filler}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      </View>
    )
    
  }
  else if(closestFive === null) {
    return (
      <View style={styles.content}>
        <MapView
          style={{ alignSelf: 'stretch', height: '50%' }}
          region={mapRegion}
        >
        <Marker pinColor="green" coordinate={mapRegion} title='Your location'></Marker>
        </MapView>
        <ScrollView style={styles.bottomView}>
          <Text style={styles.bottomLoading}>Loading...</Text>
        </ScrollView>
      </View>      
    )
  }
  else {
//The main UI
  return (
    <View style={styles.content}>
      <MapView
        style={{ alignSelf: 'stretch', height: '50%' }}
        region={mapRegion}
      >
        <Marker pinColor="green" coordinate={mapRegion} title='Your location'></Marker>
        <Marker pinColor="red" coordinate={{latitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[0][0])).lat, longitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[0][0])).lng}} title={`${realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[0][0])).address}`}></Marker>
        <Marker pinColor="red" coordinate={{latitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[1][0])).lat, longitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[1][0])).lng}} title={`${realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[1][0])).address}`}></Marker>
        <Marker pinColor="red" coordinate={{latitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[2][0])).lat, longitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[2][0])).lng}} title={`${realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[2][0])).address}`}></Marker>
        <Marker pinColor="red" coordinate={{latitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[3][0])).lat, longitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[3][0])).lng}} title={`${realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[3][0])).address}`}></Marker>
        <Marker pinColor="red" coordinate={{latitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[4][0])).lat, longitude: realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[4][0])).lng}} title={`${realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[4][0])).address}`}></Marker>
      </MapView>
      <ScrollView style={styles.bottomView}>
        <View style={styles.buttonView}>
          {
            mode === "walking" ? 
            <Pressable style={[styles.button, styles.selected]} onPress={toggleMode}><Text style={styles.buttonText}>Walk</Text></Pressable>
            :
            <Pressable style={[styles.button]} onPress={toggleMode}><Text style={styles.buttonText}>Walk</Text></Pressable>
          }
          {
            mode === "walking" ?
            <Pressable style={styles.button} onPress={toggleMode}><Text style={styles.buttonText}>Drive</Text></Pressable>
            :
            <Pressable style={[styles.button, styles.selected]} onPress={toggleMode}><Text style={styles.buttonText}>Drive</Text></Pressable>
          }
        </View>
        <View style={styles.descriptorView}><Text style={styles.descriptor}>The 5 Closest Bins To You:</Text></View>
        <BinView 
          blue={true} 
          rank={1} 
          address={realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[0][0])).address} 
          distance={closestFive[0][2]}
          seconds ={closestFive[0][1]}
          time={1}
          units={"min"}
        />
        <BinView 
          blue={false} 
          rank={2} 
          address={realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[1][0])).address} 
          distance={closestFive[1][2]}
          seconds={closestFive[1][1]}
          time={3}
          units={"mins"}
        />
        <BinView 
          blue={true} 
          rank={3} 
          address={realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[2][0])).address} 
          distance={closestFive[2][2]}
          seconds={closestFive[2][1]}
          time={5}
          units={"mins"}
        />
        <BinView 
          blue={false} 
          rank={4} 
          address={realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[3][0])).address}  
          distance={closestFive[3][2]}
          seconds={closestFive[3][1]}
          time={10}
          units={"mins"}
        />
        <BinView 
          blue={true} 
          rank={5} 
          address={realm.objectForPrimaryKey("Bin", mongoose.Types.ObjectId(closestFive[4][0])).address} 
          distance={closestFive[4][2]}
          seconds={closestFive[4][1]}
          time={20}
          units={"mins"}        
        />
      </ScrollView>
    </View>
  );
};
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  filler: {
    backgroundColor: "#0E152B",
    height: "100%",
  },
  loading: {
    color: "white",
    textAlign: "center",
    fontFamily: "arial",
    fontSize: 30,
    paddingTop: "85%"
  },
  bottomLoading: {
    color: "white",
    textAlign: "center",
    fontFamily: "arial",
    fontSize: 30,
    paddingTop: "40%"
  },
  error: {
    color: "red",
    textAlign: "center",
    fontFamily: "arial",
    fontSize: 30,
    paddingTop: "85%"    
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
  errButton: {
    backgroundColor: "#25AA72",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: "30%",
    marginTop: "5%",
    paddingTop: "2%",
    paddingBottom: "2%",
    paddingLeft: "1%",
    paddingRight: "1%",
    width: "40%",
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