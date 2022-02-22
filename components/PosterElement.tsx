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
      paddingVertical:4,
      paddingHorizontal:5

    },
    image: {
        borderRadius:6,
        resizeMode:'contain',
        height:138,
        width:92,
        shadowColor: "green",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
            width: -10,
            height: 9,
          }
        }
  });
  