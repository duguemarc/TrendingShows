import React, { Fragment } from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { dataMovieType, mediaType } from "../constants/Types";



const displayMovieScreen = () => {
 return(<View style={{ flex:1, width: 500, height: 500 }}>
     <Text>alo</Text>
 </View>)
}
  

export default function PosterElement(props:{imgPoster:string, dataMovie:dataMovieType, mediaType:mediaType}) {
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
  