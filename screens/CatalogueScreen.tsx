import React, { Fragment, useEffect, useRef, useState } from 'react';
import {Modal, ScrollView, TouchableOpacity, Image, View, Text, ImageStyle } from 'react-native';

import PosterElement from '../components/PosterElement';
import { dataShowType, mediaType, videoResultType } from '../constants/Types';

import YoutubeIframe, { getYoutubeMeta, YoutubeIframeRef, YoutubeMeta } from 'react-native-youtube-iframe';
import { Button, Icon, Spinner, StyleService, useStyleSheet, useTheme } from '@ui-kitten/components';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { API_KEY, configDefault, defaultMovie, rootURL } from '../constants/Constants';


export default function CatalogueScreen() {

  const STATUSBAR_HEIGHT = getStatusBarHeight()
  
  const theme = useTheme();
  const styles =  useStyleSheet(themedStyles);
  const mainContainerStyle = useStyleSheet(themedStyleMainContainer(STATUSBAR_HEIGHT));

  const playerRef = useRef<YoutubeIframeRef | null>(null);

  const [configMovie, setConfigMovie] = useState(configDefault);
  const [dataTrendingMovies, setDataTrendingMovies] = useState<dataShowType[]>([]);
  const [dataTrendingSeries, setDataTrendingSeries] = useState<dataShowType[]>([]);
  const [dataTrendingAll, setDataTrendingAll] = useState<dataShowType[]>([]);


  const [resquestType, setRequestType] = useState<mediaType>(mediaType.ALL);

  const [urlPoster, setUrlPoster] = useState ("");

  type mediaDataType = {dMovieType: dataShowType, urlPoster: string, mType: mediaType}

  const movieList: mediaDataType[] = [];
  const serieList: mediaDataType[] = [];
  const allList: mediaDataType[] = [];

  const movieT = mediaType.MOVIE;
  const serieT = mediaType.TV;
  const allT = mediaType.ALL;

  const [selectedMovie, setSelectedMovie] = useState<dataShowType>(defaultMovie);
  const [isModalVisible, setIsModalVisible]= useState(false);
  const [isYoutubeLoading, setIsYoutubeLoading]= useState(true);

  const [youtubeMetas, setYoutubeMetas] = useState<{key:string, meta:YoutubeMeta|undefined}[]>([]);

  const [playingVideoKey, setPlayingVideoKey] = useState("");

  useEffect(() => {
    getConfigFromApi();
    getTrendingMoviesFromApi();
    getTrendingSeriesFromApi();
    getTrendingAllFromApi();
  }, []);


  //API CALLS
  const getConfigFromApi = () => {
    fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`)
     .then((response) => response.json())
     .then((config) => {setConfigMovie((config));
      setUrlPoster(configMovie.images.base_url);
     })
     .catch((error) => {
       console.error(error);
     });
  }; 
  
  const getTrendingMoviesFromApi = () => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
     .then((response) => response.json())
     .then((dataTrending) => {
       setDataTrendingMovies((dataTrending.results));
     })
     .catch((error) => {
       console.error(error);
     });
  };  

  const getTrendingSeriesFromApi = () => {
    fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`)
     .then((response) => response.json())
     .then((dataTrending) => {setDataTrendingSeries(dataTrending.results);
     })
     .catch((error) => {
       console.error(error);
     });
  }; 

  const getTrendingAllFromApi = () => {
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`)
     .then((response) => response.json())
     .then((dataTrending) => {
       setDataTrendingAll((dataTrending.results));

     })
     .catch((error) => {
       console.error(error);
     });
  }; 

// API getting videos list for movie selected (Trailer, teaser ect...)
  const getVideos = (idMovie:string, media:string) => {
    const mediaStr = media.toString();
    const idStr = idMovie.toString();

    const urlVideos  = `${rootURL}${mediaStr}/${idStr}/videos?api_key=${API_KEY}`;
    
    fetch(urlVideos)
     .then((response) => response.json())
     .then(async (videos) => {
      
      const filteredVideos: videoResultType[] = videos.results.filter((video:videoResultType)=>{if(video.site==='YouTube'){return {video} }});
     
      if(filteredVideos.length>0){
        const values= filteredVideos.map((video)=>{return{id:video.id, key:video.key, name:video.name, site:video.site, type:video.type}});
        
        // Getting youtube video metas info from API
         const ytMetas = await Promise.all(
          values.map(async (video)=>{
            
            const metaVideo =await getYoutubeMeta(video.key).then((meta)=>{
              return meta}).catch(()=>{return undefined})
              
                return {key:video.key, meta:metaVideo};
                
            }))
  
        setYoutubeMetas([...ytMetas]);
  
      }

      getYoutubeTrailerKey(videos.results);

     })
     .catch((error) => {
       console.error(error);
     });
  };  
  
  // Building image url for poster
  const buildUrlImage = (urlPosterMovie: string) => {
    return (urlPoster+"w500"+urlPosterMovie);
  }

  const filterByType = (mType: mediaType) => {
    setRequestType(mType);
  }


// Build lists by media type
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

  
  // Called on movie selection, call api for youtubes videos related to media

  function displayMediaView(movieInfos: dataShowType, mediaType: string){
    setIsYoutubeLoading(true);
    setSelectedMovie(movieInfos);
    getVideos(movieInfos.id, mediaType);
    setIsModalVisible(!isModalVisible);
    setIsYoutubeLoading(false);

  }

  // From api results, get a youtube video of 'Trailer' type, if doesn't find just return the first youtube video found

  function getYoutubeTrailerKey (res:videoResultType[]) {
    const youtubeTrailer = res.filter((video:videoResultType)=>{if(video.type==='Trailer' && video.site==='YouTube'){return video}});
    const youtubeVideos = res.filter((video:videoResultType)=>{if(video.site==='YouTube'){return video}});

    let url = 'dQw4w9WgXcQ';


    if(youtubeTrailer.length>0){

      url= youtubeTrailer[0].key;
    }
    else {
      if(youtubeVideos.length>0){
        url = youtubeVideos[0].key;
      }

    }
      setPlayingVideoKey(url);

  }

  // Render by media type
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

const BackIcon = (props:any) => (
  <Icon name='arrow-circle-left-outline' {...props} />
);

  return (
    <View style={mainContainerStyle.mainContainer}>
      <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.categoryContainer} onPress={()=>{filterByType(mediaType.ALL)}}>
        <Icon style={styles.iconMenu} fill={theme['color-primary-500']} name='archive-outline'/>
        <Text style={styles.categoryLabel}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryContainer} onPress={()=>{filterByType(mediaType.MOVIE)}}>
        <Icon style={styles.iconMenu} fill={theme['color-primary-500']} name='film-outline'/>
        <Text style={styles.categoryLabel}>Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryContainer} onPress={()=>{filterByType(mediaType.TV)}}>
        <Icon style={styles.iconMenu} fill={theme['color-primary-500']} name='tv-outline'/>
        <Text style={styles.categoryLabel}>Series</Text>
      </TouchableOpacity>
      </View>
      {modalMovie()}

      <ScrollView contentContainerStyle={styles.scrollViewContainer} >

      <View style={styles.backgroundLayerContainer}>
        <View style={styles.trendingContainer}>
        <Text style={styles.trendingTitle}>Trending</Text>
        </View>
      </View>

      {
        displayMedias()
      }
      </ScrollView>


    </View>
  );

  function modalMovie() {

    const starsElement:JSX.Element[]=[];
    const nbFilledStars = Math.floor((selectedMovie.vote_average)/2);
    for(let i=0; i<5; i++){
      if(i<nbFilledStars){
        starsElement.push(<Icon key={'i' + i + selectedMovie.id} style={styles.iconMenu} fill={theme['color-primary-600']} name='star'/>)
      }
      else {
        starsElement.push(<Icon key={'i' + i + selectedMovie.id} style={styles.iconMenu} fill={theme['color-primary-600']} name='star-outline'/>)
      }
    }


    return <Modal visible={isModalVisible} animationType={"slide"} transparent={false} onRequestClose={() => { setIsModalVisible(false);setPlayingVideoKey(''); } }>
      <View style={styles.modalMainContainer}>
        <Button style={styles.buttonBack} accessoryLeft={BackIcon} appearance='filled' onPress={() => { setIsModalVisible(false);setPlayingVideoKey(''); } }></Button>
        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
          {isYoutubeLoading ? <Spinner style={styles.spinner} /> : <YoutubeIframe
            ref={playerRef}
            height={200}
            videoId={playingVideoKey} />}

          <Text style={styles.modalTitle}>{selectedMovie.name} {selectedMovie.title}</Text>
          <Text style={styles.overviewText}>{selectedMovie.overview}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>
              Rating: 
            </Text>

            <View style={styles.voteContainer}>
              <Text style={styles.voteCountText}>
        
              {selectedMovie.vote_average/2}
              </Text>
              <View style={styles.starsContainer}>
              {starsElement}
              </View>

            </View>

          </View>


          <Text style={styles.moreVideo}>Plus de vidéos: </Text>

          <ScrollView horizontal={true} style={styles.scrollViewYoutube} contentContainerStyle={styles.scrollViewContentYoutube}>
            {youtubeMetas.length>0 && youtubeMetas.map((yMeta) => {
              return <Fragment key={JSON.stringify(yMeta)}>
                {yMeta.meta !=undefined &&
                <View style={styles.contentYoutubeVideo}>
                  <Text ellipsizeMode='tail' numberOfLines={2} style={styles.titleVideo}>{yMeta.meta.title}</Text>
                  <TouchableOpacity style={styles.touchableVideo} onPress={() => setPlayingVideoKey(yMeta.key)}>
                    <Image source={{ uri: yMeta.meta.thumbnail_url }} style={styles.thumbnailYoutube as ImageStyle} />
                  </TouchableOpacity>
                </View>}

              </Fragment>;
            })}
          </ScrollView>
        </ScrollView>


      </View>


    </Modal>;
  }
}
const themedStyleMainContainer = (STATUSBAR_HEIGHT:number) => StyleService.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'color-basic-900',
    marginTop:STATUSBAR_HEIGHT
  }

})

const themedStyles = StyleService.create({
   
  menuContainer: {
    flexDirection : 'row',
    padding:5,
    backgroundColor: 'color-basic-900'

  },
   categoryContainer: {
    backgroundColor: 'color-basic-900',
    display:'flex',
    flexDirection: 'row',
    paddingVertical:10,
    flex:1,
    justifyContent:'center',
    alignItems:'center'

  },

  categoryLabel : {
    color: 'color-basic-100',
    textDecorationLine: 'underline',
    fontSize: 16,
    textAlignVertical:'center'
  },

  

  scrollViewContainer: {
    backgroundColor: 'color-basic-500',
    flexWrap: 'wrap',
    flexDirection:'row',
    justifyContent: 'center'
   },

  movieModalContainer: {
    backgroundColor: 'color-basic-900',
    flex:1,
    width:'80%',
    height:'80%'
  },

  trendingTitle: {
    fontSize:25,
    color:'color-basic-100',
    textAlign:'center',
    borderLeftColor: 'color-basic-500',
    borderLeftWidth: 30,
    height:'100%',
    flex:1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 1,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 10,
    backgroundColor:'color-basic-500'
  },

  trendingContainer: {

    backgroundColor:'color-primary-500'

  },

  backgroundLayerContainer:{
    width:'80%',
    marginHorizontal:'20%',
    backgroundColor:'color-primary-500',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingRight:10,
    marginVertical:20,
    borderLeftWidth: 110,
    borderLeftColor: 'color-primary-500',
    borderRightWidth: 10,
    borderRightColor: 'color-primary-500',
    borderRadius: 3
  },

  moreVideo:{
    color:'color-primary-500',
    fontSize:30,
    paddingVertical:20
  },

  modalMainContainer: {
    backgroundColor:'color-basic-900',
    flex:1,
    color:'color-basic-100',
    paddingHorizontal:10
  },

  overviewText : {
    color:'color-basic-100',
    justifyContent:'center',
    textAlign: 'left',
    paddingLeft:20,
    borderLeftWidth:10,
    borderLeftColor:'color-primary-700',
    marginLeft:10,
    backgroundColor:'color-basic-900'
  },

  modalTitle : {
    color:'color-primary-300',
    justifyContent:'center',
    textAlign: 'right',
    fontSize: 26,
    paddingVertical:10,
    fontWeight:'bold',
    paddingRight:20,
    borderRightWidth:10,
    borderRightColor: 'color-primary-300',
    marginBottom:15,
    backgroundColor:'color-basic-900'

  },

  voteCountText : {
    color:'color-basic-100',
    justifyContent:'center',
    textAlign: 'center'

  },

  starsContainer : {
    backgroundColor:'color-basic-900',
    flex:1,
    flexDirection:'row',
    alignSelf:'center'
  },

  voteContainer : {
    backgroundColor:'color-basic-900',
    flexDirection:'column',
    flex:2

  },

  averageVoteLabel : {
    backgroundColor:'color-basic-900',
    textAlign:'center',
    color:'color-basic-100'

  },

  ratingLabel : {
    color:'color-basic-100',
    justifyContent:'center',
    backgroundColor:'color-basic-900',
    flex:1,
    textAlign: 'left',
    paddingLeft:20,
    borderLeftWidth:10,
    borderLeftColor:'color-primary-700',
    marginLeft:10,
    textAlignVertical:'center'

  },

  ratingContainer : {
    backgroundColor: 'color-basic-900',
    paddingVertical: 20,
    textAlignVertical:'center',
    flexDirection:'row'
  },


  buttonBack : {
    backgroundColor: 'color-basic-900',
    width:50,
    borderColor: 'color-basic-900'
  },

  iconMenu : {
    width:20,
    height:20,
    marginHorizontal:3
  },

  iconTrending : {
    width:20,
    height:20,
    marginHorizontal:2,

  },

  webViewYTVisible : {
    display:'flex'
  },

  webViewYTNotVisible : {
    display:'none'

  },

  spinner : {
    justifyContent:'center'  },
    
    
  image: {
      height:138,
      width:92,
      borderRadius:6
  },

  scrollViewYoutube: {

  },

  scrollViewContentYoutube: {

  },

  contentYoutubeVideo:{
    backgroundColor:'color-basic-500',
    flexDirection:'column',
    width:150,
    justifyContent:'center',
    alignContent:'center',
    borderWidth:2
  },

  titleVideo:{
    flex:1,
    width:'100%',
    color:'color-basic-100',
    justifyContent:'center',
    textAlign: 'left',
    paddingVertical:10,
    paddingHorizontal:10,
    fontSize:12,
    borderTopWidth:1,
    borderTopColor:'grey'


  },

  touchableVideo: {
    flex:3,
    justifyContent:'flex-start',
    alignSelf:'center',
    width:'100%'

  },

  thumbnailYoutube: {
    aspectRatio:16/9,
    flex:1
  },

  modalScrollContainer: {
    paddingBottom:30
  }

}

);


