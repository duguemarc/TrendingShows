export const API_KEY = "fe8d932d92d501a77c50e1f9318292e8";
export const rootURL = "https://api.themoviedb.org/3/";

export const defaultMovie =  {
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

export const configDefault = {
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