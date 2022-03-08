import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import Navigation from './navigation';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { myThemeDark } from './constants/CustomDarkTheme';
import { myThemeLight } from './constants/CustomLightTheme';
import { StatusBar, StatusBarStyle } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import { enableScreens } from 'react-native-screens';


export default function App() {
  const isLoadingComplete = useCachedResources();

  const themes:any = { myThemeLight, myThemeDark };

  const [theme, setTheme] = useState('myThemeDark');
  const [checked, setChecked] = React.useState(false);
  const [mode, setMode] = useState<StatusBarStyle>('light-content');

  const toggleTheme = () => {
    const nextTheme = theme === 'myThemeLight' ? 'myThemeDark' : 'myThemeLight';
    const nextMode = mode === 'light-content' ? 'dark-content' : 'light-content';
    
    setTheme(nextTheme);
    setMode(nextMode);
    setChecked(!checked);
  };


  if (!isLoadingComplete) { 
    return null;
  } else {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={themes[theme]}>
          <SafeAreaProvider >
            <Navigation toggleTheme={toggleTheme} isChecked={checked} />
            <StatusBar backgroundColor={themes[theme]['color-basic-900']}  barStyle={mode} translucent/>
            
          </SafeAreaProvider>
          
        </ApplicationProvider>  
      </>
    );
  }
}
