import {  StyleService, useStyleSheet } from '@ui-kitten/components';
import React from 'react';
import {  Switch, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';



export default function SettingsScreen(props:{isChecked:boolean, toggleTheme:(check:any)=>void} ) {

  const styles =  useStyleSheet(themedStyles);
  const STATUSBAR_HEIGHT = getStatusBarHeight()
  const mainContainerStyle = useStyleSheet(themedStyleMainContainer(STATUSBAR_HEIGHT));



  return (
    <View style={mainContainerStyle.mainContainer}>
      <View style={styles.themeContainer}>
        <Text style={styles.title}>Settings</Text>
        <Switch style={styles.switchTheme}value={props.isChecked} onChange={(value)=>{props.toggleTheme(value)}}></Switch>
      </View>
    </View>
  );
}

const themedStyles = StyleService.create({
 
  themeContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'color-basic-900',
    flexDirection:'row'
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'color-primary-500',


  },

  switchTheme: {
    paddingHorizontal:5
  }
});

const themedStyleMainContainer = (STATUSBAR_HEIGHT:number) => StyleService.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'color-basic-900',
    marginTop:STATUSBAR_HEIGHT,
    paddingVertical:15,
    paddingHorizontal:10
  }

})
