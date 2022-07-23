import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { Task } from "../models/Task";
import { TaskRealmContext } from "../models";
import { IntroText } from "./IntroText";
import { AddTaskForm } from "./AddTaskForm";
import TaskList from "./TaskList";
import * as Location from 'expo-location';

//make it so that it updstes location as the user moves.

const { useRealm } = TaskRealmContext;

export const TaskManager = ({ tasks, userId }) => {
  const realm = useRealm();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [mapRegion, setmapRegion] = useState({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
  });

  useEffect(() => {
    (async () => {
      let { status } = await  Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
        console.log('denied');
        setErrorMsg('Permission to access location was denied');
        return;
     } else {
       let location = await Location.getCurrentPositionAsync({});
       setLocation(location);
       setmapRegion({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
         latitudeDelta: 0.0222,
         longitudeDelta: 0.0221
       })
     }
    
    })();
  }, []);


/*
  const handleAddTask = useCallback(
    (description) => {
      if (!description) {
        return;
      }

      // Everything in the function passed to "realm.write" is a transaction and will
      // hence succeed or fail together. A transcation is the smallest unit of transfer
      // in Realm so we want to be mindful of how much we put into one single transaction
      // and split them up if appropriate (more commonly seen server side). Since clients
      // may occasionally be online during short time spans we want to increase the probability
      // of sync participants to successfully sync everything in the transaction, otherwise
      // no changes propagate and the transaction needs to start over when connectivity allows.
      realm.write(() => {
        realm.create("Task", Task.generate(description, userId));
      });
    },
    [realm, userId],
  );

  const handleToggleTaskStatus = useCallback(
    (task) => {
      realm.write(() => {
        // Normally when updating a record in a NoSQL or SQL database, we have to type
        // a statement that will later be interpreted and used as instructions for how
        // to update the record. But in RealmDB, the objects are "live" because they are
        // actually referencing the object's location in memory on the device (memory mapping).
        // So rather than typing a statement, we modify the object directly by changing
        // the property values. If the changes adhere to the schema, Realm will accept
        // this new version of the object and wherever this object is being referenced
        // locally will also see the changes "live".
        task.isComplete = !task.isComplete;
      });

      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      // realm?.write(() => {
      //   const task = realm?.objectForPrimaryKey('Task', id); // If the ID is passed as an ObjectId
      //   const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
      //   task.isComplete = !task.isComplete;
      // });
    },
    [realm],
  );

  const handleDeleteTask = useCallback(
    (task) => {
      realm.write(() => {
        realm.delete(task);

        // Alternatively if passing the ID as the argument to handleDeleteTask:
        // realm?.delete(realm?.objectForPrimaryKey('Task', id));
      });
    },
    [realm],
  );
*/
  return (
    <View style={styles.content}>
      <MapView
        style={{ alignSelf: 'stretch', height: '100%' }}
        region={mapRegion}
      >
        <Marker pinColor="green" coordinate={mapRegion} title='Your location'></Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
});
