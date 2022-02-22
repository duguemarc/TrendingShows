import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));
  
    useEffect(() => {
      const onChange = (result:any) => {
        setScreenData(result.screen);
      };
  
      Dimensions.addEventListener('change', onChange);
  
      return () => Dimensions.removeEventListener('change', onChange);
    });
  
    return {
      ...screenData,
      isLandscape: screenData.width > screenData.height
    };
  };
  