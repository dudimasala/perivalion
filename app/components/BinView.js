import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function BinView(props) {
    if(props.blue) {
        return (
            <View style={styles.binView1}>
              <View style={styles.binViewLeft}>
              <Text style={styles.rank}>{props.rank}</Text>
              </View>
              <View style={styles.binViewCenter}>
                <Text style={styles.address}>{props.address}</Text>
                <Text style={styles.distance}>{`${props.distance} Away`}</Text>
              </View>
              <View style={styles.binViewRight}>
                <Text style={styles.time}>{props.time}</Text>
                <Text style={styles.unit}>{props.units}</Text>
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
                <Text style={styles.distance}>{`${props.distance} Away`}</Text>
              </View>
              <View style={styles.binViewRight}>
                <Text style={styles.time}>{props.time}</Text>
                <Text style={styles.unit}>{props.units}</Text>
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
        paddingTop: "5%",
        fontFamily: "arial",
        color: "white",
        fontSize: 14,
        textAlign: "center"
      }
})
