import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function BinView(props) {
    //based on number of seconds, determine what time unit should be displayed (minutes, hours, or days)
    let days = Math.floor(props.seconds / 86400);
    let time = 0;
    let units = "";
    if(days >= 1) {
      time = days;
      units = "day"
    } else {
        let hours = Math.floor(props.seconds / 3600);
        if(hours >= 1) {
            time = hours;
            units = "hour";
        } else {
            time = Math.floor(props.seconds / 60);
            units = "min"
        }
    }
    if(time > 1) {
        units += "s";
    }

    if(props.blue) {
        return (
            <View style={styles.binView1}>
              <View style={styles.binViewLeft}>
              <Text style={styles.rank}>{props.rank}</Text>
              </View>
              <View style={styles.binViewCenter}>
                <Text style={styles.address}>{props.address}</Text>
                <Text style={styles.distance}>{`${props.distance} away`}</Text>
              </View>
              <View style={styles.binViewRight}>
                <Text style={styles.time}>{time}</Text>
                <Text style={styles.unit}>{units}</Text>
              </View>
            </View>
        );
    } else {
        return (
            <View style={styles.binView2}>
              <View style={styles.binViewLeft}>
              <Text style={styles.rank}>{props.rank}</Text>
              </View>
              <View style={styles.binViewCenter}>
                <Text style={styles.address}>{props.address}</Text>
                <Text style={styles.distance}>{`${props.distance} away`}</Text>
              </View>
              <View style={styles.binViewRight}>
                <Text style={styles.time}>{time}</Text>
                <Text style={styles.unit}>{units}</Text>
              </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    binView1: {
        backgroundColor: "#0E152B",
        height: 75,
        width: "100%",
        flexDirection: "row"
      },
      binView2: {
        backgroundColor: "#232630",
        height: 75,
        width: "100%",
        flexDirection: "row"
      },
      binViewLeft: {
        height: "100%",
        width: "20%"
      },
      binViewCenter: {
        height: "100%",
        width: "60%",
        justifyContent: 'space-between',
        paddingTop: 5
      },
      binViewRight: {
        height: "100%",
        width: "20%",
      },
      time: {
        fontFamily: "arial",
        color: "white",
        paddingTop: "10%",
        paddingBottom: "2%",
        fontSize: 35,
        textAlign: "center"
      },
      unit: {
        fontFamily: "arial",
        color: "white",
        textAlign: "center"
      },
      rank: {
        fontFamily: "arial",
        color: "white",
        paddingTop: "12.5%",
        fontSize: 50,
        textAlign: "center"
      },
      address: {
        fontFamily: "arial",
        color: "white",
        fontSize: 16,
      },
      distance: {
        paddingBottom: "1.5%",
        fontFamily: "arial",
        color: "white",
        fontSize: 14,
        textAlign: "center"
      }
})
