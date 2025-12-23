TODO
faire un deck + collection
faire en sorte d'avoir un skill de chaque au debut
verifier de random de batiment

faire un system pour creer des ranked à la volé en feature flipping

joueur qui ne finisse pas les ranked au bout de 2h
et faire des fausses ranked

------------ fonc ------------------
afficher le % d'efficacite de chaque journee et gloable à la fin de la partie

coffre à la clash royale pour améliorer les batiments + deck de batiments?
bobs? on peut attibuer une tache à chaque bob (fouille a une chance de trouver des objets, defense augmente un peu la defense, learn, )
chaque bob permet d'avoir une reduction du coup de l'action (pourcentage de croissant) mécanique de changer à chaque action les bob pour obtenir de l'aide
affiher le temps d'economie par action

---

------------un peu osef (optimisations)------------

bug affichage erreur mdp et confirmmdp
aller chercher les deffaultValues et reference bonus au meme temps
timeout pour retry les valeurs par defaut
attackRecap renseigné dès le J0 dans le back (avec la supression des truc inutiles)

---

comment dynamiser les games:

etat des lieu:
qaund on a de l'avance la gameplay se resulte à
une journee que fouille
une journee que build

comment je peux rajouter de la profondeur à mon jeu? (Faire en sorte que quelqu'un d'experimenté, soit meilleur d'un debutant)
batiment spéciaux?
-> le batiment donne 0 de defense à la construction mais rapporte un peu de défense chaque jour
-> le batiment permet de trouver d'avoir la chance de trouver plusieurs ressources en une fouille
-> batiment qui change de defense/inventory chaque jour
-> batiment qui rapporte un % de la defense de la ville à l'instant T
-> ecole des bob
-> phare
-> decharge optimisée: contruire, demande 2 de chaque et rapport 3
-> donne de la defense tous les 5 jours
-> donne de la défense apres 10jours
-> obliger de faire les fouilles par 2 mais diminue le temps de fouille

bob:
arrive chaque soir dans la ville (ou toutes les 6h)
brico/fouineur/boulet

skill
les actions lancer dnas les 5 min premieres minutes d'une heure prenne moins de temps
les actions lancer le matin prennent moins de temps
