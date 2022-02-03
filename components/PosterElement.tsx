import React, { Fragment } from "react";
import { Image, StyleSheet, View } from "react-native";
import { dataShowType, mediaType } from "../constants/Types";

  

export default function PosterElement(props:{imgPoster:string, dataMovie:dataShowType, mediaType:mediaType}) {
    return (<Fragment>
        <View style={styles.container}>
            <Image source={{uri:props.imgPoster}} style={styles.image}>

            </Image>
        </View>
        </Fragment>
    )

}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap:'wrap',
      marginHorizontal:3,
      marginVertical:1,
      height: 138,
      width:92
    },
    image: {
        height:138,
        width:92,
        borderRadius:6
    }
  });
  