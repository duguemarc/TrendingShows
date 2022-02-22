import {  StyleService, useStyleSheet, useTheme } from '@ui-kitten/components';
import React from 'react';
import {  Image, ImageStyle, Switch, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';



export default function SettingsScreen(props:{isChecked:boolean, toggleTheme:()=>void} ) {

  const styles =  useStyleSheet(themedStyles);
  const STATUSBAR_HEIGHT = getStatusBarHeight()
  const mainContainerStyle = useStyleSheet(themedStyleMainContainer(STATUSBAR_HEIGHT));
  const theme = useTheme();


  return (
    <View style={mainContainerStyle.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.themeContainer}>
          <Text style={styles.themeText}>Theme</Text>
          <Switch thumbColor={theme['color-primary-500']} trackColor={{false:theme['color-basic-100'],true:theme['color-primary-200']}} style={styles.switchTheme} value={props.isChecked} onChange={()=>{props.toggleTheme()}}></Switch>
        </View>
        <View style={styles.tmdbContainer}>
          <Text style={styles.contentText}>Made with :</Text>
          <Image source={require('../assets/images/TheMovieDB.png')} style={styles.imageDB as ImageStyle}></Image>
        </View>
      </View>
    </View>
  );
}

const themedStyles = StyleService.create({
 
  themeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    borderColor:'black',
    borderBottomWidth: 3,
    marginBottom:20,
    
  },

  tmdbContainer: {
    flex:3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'color-primary-500',
    borderRadius: 10

  },

  titleContainer: {
  },

  contentContainer: {
    justifyContent: 'center',
    alignSelf:'center',
    alignContent: 'center',
    width:'80%',
    height:'80%',
    paddingBottom:10

  },

  contentText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical:10,
    borderLeftWidth:10,
    borderLeftColor:'white',
    paddingLeft:15

  },

  themeText: {
    color: 'color-basic-100',
    fontSize: 20,
    fontWeight: 'bold'

  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'color-primary-500',


  },

  switchTheme: {
    paddingHorizontal:5
  },

  imageDB: {
    width:150,
    height:150
  }
  
});

const themedStyleMainContainer = (STATUSBAR_HEIGHT:number) => StyleService.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'color-basic-500',
    marginTop:STATUSBAR_HEIGHT,
    paddingVertical:15,
    paddingHorizontal:10
  }

})
