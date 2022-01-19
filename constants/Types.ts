import { InteractionManagerStatic } from "react-native";

export type dataMovieType = {id:string, poster_path:string, original_title: string,  original_name: string, original_language: string, overview: string, title: string, name: string, vote_average:number,vote_count:number, media_type:string};

export type dataVideoType = {id:string, results:videoResultType[]};

export type videoResultType = {name:string, key:string, site:string}


export enum mediaType {
    ALL="all",
    MOVIE="movie",
    TV="tv"
  }





