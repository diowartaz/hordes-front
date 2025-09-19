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


export const statesToRoutes: Record<string, string> = {
  noCity: RoutesEnum.CREATE_CITY,
  playing: RoutesEnum.PLAY,
  deathRecap: RoutesEnum.DEATH_RECAP,
  recap: RoutesEnum.RECAP,
};

export const getUserStateCorrespondingToTheUrlTheUserIsTryingToAccess = (url: string) => {
  for (const [state, route] of Object.entries(statesToRoutes)) {
    if (route === url.slice(1).split('/')[0]) {
      return state;
    }
  }
  return RoutesEnum.PLAY;
};