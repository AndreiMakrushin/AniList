export interface User {
    id: string
    name: string
    email: string
    avatar_url: string
}

export interface Credentials {
    name: string
    email: string
    password: string
}

interface AnimeBase {
    id: number;
    code: string;
    description: string;
    updated: number;
    announce: string | null;
    blocked: {
      copyrights: boolean;
      geoip: boolean;
      geoip_list: [];
    };
    franchises: [];
    genres: [];
    in_favorites: number;
    last_change: number;
    names: {
      en: string;
      ru: string;
      alternative: string | null;
    };
    season: {
      string: string;
      code: number;
      year: number;
      week_day: number;
    };
    status: {
      string: string;
      code: number;
    };
    team: {};
    torrents: {};
    type: {
      code: number;
      string: string;
      episodes: number;
      full_string: string;
      length: number;
    };
  }
  
  interface AnimePlayer {
    player: {
      alternative_player: string | null;
      episodes: {
        first: number;
        last: number;
        string: string;
      };
      host: string | null;
      is_rutube: boolean;
      list: {
        created_timestamp: number;
        episode: number;
        hls: {
          fhd: string;
          hd: string;
          sd: string;
        };
        name: string;
        preview: string;
        skips: {
          ending: [];
          opening: [];
          uuid: string;
        };
      };
      rutube: {};
    };
  }
  
  interface AnimePosters {
    posters: {
      small: {};
      medium: {};
      original: {};
    };
  }
  
 export type Anime = AnimeBase & AnimePlayer & AnimePosters;