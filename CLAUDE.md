# Hordes — frontend

SPA Angular (standalone components, signals, `inject()`), Angular Material. Build de prod servi par `server.js` (Express) depuis `dist/website2/browser`.

## Commandes

```bash
npm start          # ng serve (http://localhost:4200, API sur http://localhost:3000/)
npm run build      # build de prod
npm run express    # sert le build via server.js
npm run lint       # ng lint --fix
npm run prettier   # formatage
npx ng test        # Karma/Jasmine (Chrome requis ; peu de specs)
```

## Conventions

- `CityService` (`src/app/services/city/city.service.ts`) est la source de vérité de l'état du jeu, exposée en `signal`/`computed`.
- Mutations HTTP : garde `xxxLoading()` contre les doubles requêtes, puis `tap` → `catchError(handleError(...))` → `finalize`.
- Calculs de jeu purs dans `src/app/shared/utils/` ; types dans `src/app/models/hordes.ts`.
- Routage piloté par l'état joueur (`UserState`) via `stateGuard` et `data.allowedStates` dans `app.routes.ts`.
- Composants en `ChangeDetectionStrategy.Eager` (conservé lors du passage à Angular 22, où OnPush est devenu le défaut) ; templates en control flow `@if`/`@for`.
- Sélecteurs de composants préfixés `app-` ; `any` autorisé par ESLint.
- L'URL de l'API vient de `src/environments/environment*.ts`.
- `yarn.lock` et `package-lock.json` coexistent : les garder synchronisés quand on change une dépendance.

Détails d'architecture : @.github/copilot-instructions.md (attention : les commandes `start1`/`npm test` qui y figurent n'existent pas dans `package.json`).
