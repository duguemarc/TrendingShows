import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Icon, useTheme } from '@ui-kitten/components';
import * as React from 'react';

import CatalogueScreen from '../screens/CatalogueScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default function Navigation(props:{toggleTheme:(check:any)=>void, isChecked:boolean}) {


  return (
    
    <NavigationContainer>
        <BottomTabNavigator isChecked={props.isChecked} toggleTheme={props.toggleTheme} />
    </NavigationContainer>
  );
}


const BottomTab = createBottomTabNavigator();

function BottomTabNavigator(props:{toggleTheme:(check:any)=>void, isChecked:boolean}) {
  const theme = useTheme();
  const check = props.isChecked;
  const toggle = props.toggleTheme;
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: theme['color-primary-500'],
        headerShown:false,
        tabBarStyle:{backgroundColor:theme['color-basic-900'], borderTopColor:theme['color-basic-900']},
          }}>
      
      <BottomTab.Screen
        name="TabOne"
        component={CatalogueScreen}
        
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon style={{height:27, width:27}} fill={color} name='home-outline'/>,
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon style={{height:27, width:27}} fill={color} name='edit-outline'/>,
        }}
      >
         {() => <SettingsScreen isChecked={check} toggleTheme={toggle} />}

      </BottomTab.Screen>

    </BottomTab.Navigator>
  );
}
