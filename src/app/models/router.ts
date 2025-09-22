export enum RoutesEnum {
  PLAY = 'play',
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  LOAD_PLAYER = 'load-player',
  RECAP = 'recap',
  LEADERBOARD = 'leaderboard',
  SETTINGS = 'settings',
  PROFIL = 'profil',
  CREATE_CITY = 'create-city',
  DEATH_RECAP = 'death-recap',
}

export enum UserSate {
  NOT_LOADED_PLAYER = 'notLoadedPlayer',
  NO_CITY = 'noCity',
  PLAYING = 'playing',
  DEAH_RECAP = 'deathRecap',
  RECAP = 'recap',

}

export const statesToRoutes: Record<UserSate, RoutesEnum> = {
  [UserSate.NOT_LOADED_PLAYER]: RoutesEnum.LOAD_PLAYER,
  [UserSate.NO_CITY]: RoutesEnum.CREATE_CITY,
  [UserSate.PLAYING]: RoutesEnum.PLAY,
  [UserSate.DEAH_RECAP]: RoutesEnum.DEATH_RECAP,
  [UserSate.RECAP]: RoutesEnum.RECAP,
};

export const getUserStateCorrespondingToTheUrlTheUserIsTryingToAccess = (url: string) => {
  for (const [state, route] of Object.entries(statesToRoutes)) {
    if (route === url.slice(1).split('/')[0]) {
      return state;
    }
  }
  return RoutesEnum.PLAY;
};