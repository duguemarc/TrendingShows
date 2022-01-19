import React, { Fragment, useEffect, useState } from 'react';
import {Modal, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

import { Text, View } from '../components/Themed';
import PosterElement from '../components/PosterElement';
import { dataMovieType, dataVideoType, mediaType } from '../constants/Types';
import Constants from 'expo-constants';
import { MonoText, SoraText } from '../components/StyledText';


export default function CatalogueScreen() {


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

  
  const defaultMovie : dataMovieType = {
    id:'id',
    poster_path:'poster_path',
    original_title:'original_title',
    original_name:'original_name',
    original_language:'original_language',
    overview:'overview',
    title:'title',
    name:'name',
    vote_average:0,
    vote_count:0,
    media_type:'media_type'
  }

  const defaultVideo : dataVideoType = {
    id:'id',
    results:[{name:'name', key:'key', site:'site'}]
  }
    
  
  const STATUSBAR_HEIGHT = Constants.statusBarHeight;

  const [configMovie, setConfigMovie] = useState(configDefault);

  const [dataTrendingMovies, setDataTrendingMovies] = useState<dataMovieType[]>([]);
  const [dataTrendingSeries, setDataTrendingSeries] = useState<dataMovieType[]>([]);
  const [dataTrendingAll, setDataTrendingAll] = useState<dataMovieType[]>([]);
  const [dataVideos, setDataVideos] = useState<dataVideoType>(defaultVideo);

  const [resquestType, setRequestType] = useState<mediaType>(mediaType.ALL);

  const [urlPoster, setUrlPoster] = useState ("");

  type mediaDataType = {dMovieType: dataMovieType, urlPoster: string, mType: mediaType}

  const movieList: mediaDataType[] = [];
  const serieList: mediaDataType[] = [];
  const allList: mediaDataType[] = [];


  const movieT = mediaType.MOVIE;
  const serieT = mediaType.TV;
  const allT = mediaType.ALL;

  const API_KEY = "api_key=fe8d932d92d501a77c50e1f9318292e8";
  const rootURL = "https://api.themoviedb.org/3/";



  const [selectedMovie, setSelectedMovie] = useState<dataMovieType>(defaultMovie);
  const [isModalVisible, setIsModalVisible]= useState(false);

  useEffect(() => {
    getConfigFromApi();
    getTrendingMoviesFromApi();
    getTrendingSeriesFromApi();
    getTrendingAllFromApi();

  }, []);

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
  
  const getTrendingMoviesFromApi = () => {
    fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=fe8d932d92d501a77c50e1f9318292e8')
     .then((response) => response.json())
     .then((dataTrending) => {
       setDataTrendingMovies((dataTrending.results));
     })
     .catch((error) => {
       console.error(error);
     });
  };  

  const getTrendingSeriesFromApi = () => {
    fetch('https://api.themoviedb.org/3/trending/tv/week?api_key=fe8d932d92d501a77c50e1f9318292e8')
     .then((response) => response.json())
     .then((dataTrending) => {setDataTrendingSeries((dataTrending.results));
     })
     .catch((error) => {
       console.error(error);
     });
  }; 

  const getTrendingAllFromApi = () => {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=fe8d932d92d501a77c50e1f9318292e8')
     .then((response) => response.json())
     .then((dataTrending) => {
       setDataTrendingAll((dataTrending.results));

     })
     .catch((error) => {
       console.error(error);
     });
  }; 


  const getVideos = (idMovie:string, media:string) => {
    const mediaStr = media.toString();
    const idStr = idMovie.toString();
    console.log(mediaStr);

    const urlVideos  = `${rootURL}${mediaStr}/${idStr}/videos?${API_KEY}`;

    fetch(urlVideos)
     .then((response) => response.json())
     .then((videos) => {
       setDataVideos((videos));
     })
     .catch((error) => {
       console.error(error);
     });
  };  
  
  const buildUrlImage = (urlPosterMovie: string) => {
    return (urlPoster+"w500"+urlPosterMovie);
  }

  const filterByType = (mType: mediaType) => {
    setRequestType(mType);
  }



  const buildMovieList = () => {
    dataTrendingMovies.map(movieD => { 
      const finalUrl:string = buildUrlImage(movieD.poster_path);
      
      const movie = {
        dMovieType:movieD,
        urlPoster:finalUrl,
        mType:movieT
      }
      movieList.push(movie);
      })
  }  

  const buildSerieList = () => {
    dataTrendingSeries.map(serieD => { 
      const finalUrl:string = buildUrlImage(serieD.poster_path);
      const serie = {
        dMovieType:serieD,
        urlPoster:finalUrl,
        mType:serieT
      }
      serieList.push(serie);

      })
  } 

  const buildAllList = () => {
    dataTrendingAll.map(allD => { 
      const finalUrl:string = buildUrlImage(allD.poster_path);
      const all = {
        dMovieType:allD,
        urlPoster:finalUrl,
        mType:allT
      }
      allList.push(all);     
     })
  } 


  function displayMediaView(movieInfos: dataMovieType, mediaType: string){

    setSelectedMovie(movieInfos);
    getVideos(movieInfos.id, mediaType);
    setIsModalVisible(!isModalVisible);
    
  }

  let list:JSX.Element[]

      const displayMedias= ()=> {
        list = [];
        switch(resquestType){

          case (mediaType.MOVIE): {
            if (movieList.length===0) {
              buildMovieList();
            }
            movieList.map(movieK => 
              { 
                list.push(
                  <TouchableOpacity key={movieK.dMovieType.id+'movie'} onPress={()=> {displayMediaView(movieK.dMovieType, movieK.dMovieType.media_type)}}>
                    <PosterElement dataMovie={movieK.dMovieType} imgPoster={movieK.urlPoster} mediaType={movieK.mType} />
                  </TouchableOpacity>
                )
             }
            )
            break; 

          }
          case (mediaType.TV): {
            if (serieList.length===0) {
              buildSerieList();
            }
            serieList.map(serieK => 
              { 
                
                list.push(
                  <TouchableOpacity key={serieK.dMovieType.id+'tv'} onPress={()=> {displayMediaView(serieK.dMovieType, serieK.dMovieType.media_type)}}>
                    <PosterElement dataMovie={serieK.dMovieType} imgPoster={serieK.urlPoster} mediaType={serieK.mType} />
                  </TouchableOpacity>
                )
             }
         
            )
            break; 

          }

          case (mediaType.ALL): {
            if (allList.length===0) {
              buildAllList();
            }
            allList.map(allK => 
              { 
                list.push(
                  <TouchableOpacity key={allK.dMovieType.id+'all'} onPress={()=> {displayMediaView(allK.dMovieType, allK.dMovieType.media_type)}}>
                    <PosterElement dataMovie={allK.dMovieType} imgPoster={allK.urlPoster} mediaType={allK.mType}  />
                  </TouchableOpacity>
                )
             }
         
            )
            break; 

          }

          default : {
            break; 
          }
      }

      return (<Fragment>{list}</Fragment>)

}



  return (
    <View style={styleMainContainer(STATUSBAR_HEIGHT).mainContainer}>

      <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.title} onPress={()=>{filterByType(mediaType.ALL)}}><SoraText>All</SoraText></TouchableOpacity>
      <TouchableOpacity style={styles.title} onPress={()=>{filterByType(mediaType.MOVIE)}}><SoraText>Movies</SoraText></TouchableOpacity>
      <TouchableOpacity style={styles.title} onPress={()=>{filterByType(mediaType.TV)}}><SoraText>Series</SoraText></TouchableOpacity>
      </View>

    <Modal visible={isModalVisible} animationType = {"slide"} transparent={false} onRequestClose={() => {setIsModalVisible(false)}}>
      <View style={styles.modalMainContainer}>
        <SoraText style={styles.modalTitle}>{selectedMovie.name} {selectedMovie.title}</SoraText>
        <SoraText style={styles.overviewText}>{selectedMovie.overview}</SoraText>
        <SoraText style={styles.voteCountText}>Note : {selectedMovie.vote_average} ({selectedMovie.vote_count}) vote(s)</SoraText>
        <SoraText style={styles.youtubeText}>data : {dataVideos.results[0].name}</SoraText>
      </View>
    </Modal>

      <ScrollView contentContainerStyle={styles.scrollViewContainer} >
      <SoraText style={styles.trendingTitle}>Trending</SoraText>

      {
        displayMedias()
      }
      </ScrollView>


    </View>
  );
}
const styleMainContainer = (STATUSBAR_HEIGHT:number) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
    marginTop:STATUSBAR_HEIGHT
  }

})
const styles = StyleSheet.create({
   
  menuContainer: {
    flexDirection : 'row',
    },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: 'red',
    color:'white',
    display:'flex',
    flexDirection: 'row',
    paddingVertical:10,
    flex:1,
    justifyContent:'center'

  },

  scrollViewContainer: {
    backgroundColor: 'black',
    flexWrap: 'wrap',
    flexDirection:'row',
    justifyContent: 'center',
    borderRadius:6
  },
  movieModalContainer: {
    backgroundColor: 'red',
    flex:1,
    width:'80%',
    height:'80%'
  },

  trendingTitle: {
    fontSize:30,
    color:'white',
    marginVertical:10,
    width:'100%',
    textAlign:'center'
  },
  modalMainContainer: {
    backgroundColor:'black',
    flex:1,
    color:'white'
  },

  overviewText : {
    color:'white',
    justifyContent:'center',
    textAlign: 'center'
  },

  modalTitle : {
    color:'white',
    justifyContent:'center',
    textAlign: 'center',
    fontSize: 35,
    paddingVertical:10,
    fontWeight:'bold',
    paddingHorizontal:15
  },

  voteCountText : {
    color:'white',
    justifyContent:'center',
    textAlign: 'center',
    paddingVertical:20

  },

  youtubeText : {
    color:'white',
    justifyContent:'center',
    textAlign: 'center',
  }

});
