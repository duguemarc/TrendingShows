import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import MagicButton from '../components/MagicButton';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {


const configDefault = {
  images: {
    base_url: "http://image.tmdb.org/t/p/",
    secure_base_url: "https://image.tmdb.org/t/p/",
    backdrop_sizes: [
      "original"
    ],
    logo_sizes: [
      "original"
    ],
    poster_sizes: [
      "original"
    ],
    profile_sizes: [
      "original"
    ],
    still_sizes: [
      "original"
    ]
  },
  change_keys: [
    "videos"
  ]
}

const dataMovieDefault = {id:'', poster_path:'', original_title: '', original_language: '', overview: ''};


const [dataMovie, setDataMovie] = useState(dataMovieDefault);
const [configMovie, setConfigMovie] = useState(configDefault);
const [urlPoster, setUrlPoster] = useState ("");


useEffect(() => {
  getMoviesFromApi();
  getConfigFromApi();
  buildUrlImage();
}, []);

const getMoviesFromApi = () => {
   fetch('https://api.themoviedb.org/3/movie/550?api_key=fe8d932d92d501a77c50e1f9318292e8')
    .then((response) => response.json())
    .then((data) => {setDataMovie((data))

    })
    .catch((error) => {
      console.error(error);
    });
};

const getConfigFromApi = () => {
  fetch('https://api.themoviedb.org/3/configuration?api_key=fe8d932d92d501a77c50e1f9318292e8')
   .then((response) => response.json())
   .then((config) => {setConfigMovie((config));
    setUrlPoster(configMovie.images.base_url);
   })
   .catch((error) => {
     console.error(error);
   });
};

const buildUrlImage = (dataMovie={poster_path:''}) => {
  return (urlPoster+"w500"+dataMovie.poster_path);
}




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text>Config : {buildUrlImage(dataMovie)}</Text>
      <Image source={{uri:buildUrlImage(dataMovie)}} style={{ width: 500, height: 500 }}></Image>
      <MagicButton />
      <Button onPress={getMoviesFromApi} title='test'>Bouton test</Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
});
