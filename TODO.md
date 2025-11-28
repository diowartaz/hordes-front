TODO
deleteAccount
creer un service pour le local storage
mettre le isLoggedIn en signal
reparer le loadPlayer
userIsLoggedIn dans city service wtf


quel mecanisme pour rediriger l'utilisateur quand il est loaded
effect quand loaded et connect, redirige vers state to route

avir un effect sur le token pour rediriger vers la home


@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  
  playerInfo = signal<PlayerInfo | null>(null);
  
  constructor() {
    effect(() => {
      if (this.authService.isConnected()) {
        this.loadPlayerInfo();
      }
    });
  }
  
  private loadPlayerInfo() {
    this.apiService.getPlayerInfo().subscribe({
      next: (info) => this.playerInfo.set(info)
    });
  }
}


faire ne sorte que loadPlayer soit charger par les gardiens
qaund on se deconnecte est ce que le loadplayer se fait bien apres une reconnexion
load des headers apres un refresh

attackRecap renseigné dès le J0 dans le back (avec la supression des truc inutiles)

------------ fonc ------------------
avoir une money secondaire grace à la ranked / tournois pour avoir des batiments legendaire
afficher le % d'efficacite de chaque journee et gloable à la fin de la partie

---

    // Mettre ça en place
    // const timeoutSeconds = (timeRequired - city.time) / defaultValues.coef_realtime_to_ingametime;
    // this.setTimeoutRefs.push(
    //     setTimeout(() => {
    //       skill.enoughTime = false;
    //     }, timeoutSeconds * 1000),
    //   );
