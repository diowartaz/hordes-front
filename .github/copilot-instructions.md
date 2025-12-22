# Hordes Frontend - AI Coding Agent Instructions

## Project Overview

**Hordes** is a single-player survival strategy game built with **Angular 19** (standalone components). Players manage a city defending against nightly zombie attacks by building structures, learning skills, and collecting resources during limited daytime periods. The frontend communicates with a Node.js/Express/MongoDB backend.

## Architecture & State Management

### Angular Signals-First Approach

This codebase uses Angular's **modern signals API** extensively instead of traditional observables for state:

- **Primary state holder**: [src/app/services/city/city.service.ts](src/app/services/city/city.service.ts) manages all game state via signals
- Use `signal()` for writable state, `computed()` for derived state
- Example pattern: `city = signal<CityModel>(createDefaultCityModel())` with `buildings = computed(() => this.city().buildings)`
- Convert observables to signals with `toSignal()` from `@angular/core/rxjs-interop`
- Real-time game clock uses `toSignal()` with interval observable ([city.service.ts#L104-L138](src/app/services/city/city.service.ts#L104-L138))

### Standalone Components Architecture

All components use `standalone: true` - no NgModules exist:

- Import dependencies directly in component decorators: `imports: [CommonModule, ItemIconPipe, ...]`
- Inject services with `inject()` function, not constructor DI: `cityService = inject(CityService)`
- Configure app in [src/app/app.config.ts](src/app/app.config.ts) using `ApplicationConfig`

### State & Data Flow

1. **CityService** is the single source of truth for game state (city, stats, player state)
2. Components inject `CityService` and read computed signals reactively
3. User actions call service methods which make HTTP requests and update signals
4. HTTP interceptors automatically add JWT tokens ([auth.interceptor.ts](src/app/shared/interceptors/auth.interceptor.ts))

## Key Development Patterns

### Service State Pattern

Every HTTP mutation follows this pattern (see [city.service.ts](src/app/services/city/city.service.ts)):

```typescript
someAction(): void {
  if (this.someLoading()) return;  // Prevent duplicate requests
  this.someLoading.set(true);
  const url = this.API_URL + 'endpoint';
  this.httpClient.post<any>(url, {})
    .pipe(
      tap((response) => this.city.set(response.city)),
      catchError(handleError('someAction', url)),
      finalize(() => this.someLoading.set(false))
    )
    .subscribe();
}
```

### Complex Computed Values

Game logic calculations live in `src/app/shared/utils/`:

- `buildings.ts`: Calculate buildable buildings with resource/time checks + sorting logic
- `skills.ts`: Calculate learnable skills with efficiency modifiers
- `bonuses.ts`: Compute bonus effects from player upgrades
- Services consume these via computed signals: `advancedBuildings = computed(() => calculateAdvancedBuildings(...))`

### Component Patterns

- Use `DestroyRef` for cleanup: `destroyRef = inject(DestroyRef)` then `destroyRef.onDestroy(() => clearTimeout(...))`
- Custom pipes for icon mapping: `ItemIconPipe`, `BuildingRarityToIconPipe`, `SkillToIconPipe`
- Loading states prevent duplicate actions with guards like `if (this.buildLoading()) return;`

## Routing & Guards

Routes defined in [src/app/app.routes.ts](src/app/app.routes.ts) using functional guards:

- `authGuard`: Requires JWT authentication (redirects to home if not logged in)
- `notAuthenticatedGuard`: Blocks authenticated users from auth pages
- `gameLoadedGuard`: Ensures player data loaded before accessing game routes
- `stateGuard`: Validates `UserState` enum matches route requirements (e.g., `PLAYING`, `NO_CITY`, `ALIVE_RECAP`)

Guards use `inject()` pattern and return `boolean | UrlTree`.

## Model Architecture

All game interfaces defined in [src/app/models/hordes.ts](src/app/models/hordes.ts):

- `CityModel`: Core game state (day, defense, inventory, buildings, skills, time)
- `StatsModel`: Player progression (XP, money, personal bests, bonuses, ranked points)
- `DefaultValuesModel`: Game constants from backend (time limits, cost modifiers, etc.)
- "Advanced" types: enriched models with computed properties (e.g., `AdvancedBuildingModel` adds `enoughResources`, `timeString`)
- Factory functions: `createDefaultCityModel()`, `createDefaultStatsModel()` for initialization

## Development Workflow

### Local Development

```bash
npm run start1      # Dev server with hot reload (ng serve)
npm start           # Production server via server.js
npm run build       # Production build
npm test            # Karma/Jasmine tests
npm run lint        # ESLint with auto-fix
npm run prettier    # Format all files
```

### Environment Configuration

- Local: `src/environments/environment.ts` (API_URL: `http://localhost:3000/`)
- Production: `environment.prod.ts` (or commented Render URL in environment.ts)
- Change API_URL to switch backend targets

### Testing

- Tests located next to components: `*.component.spec.ts`
- Test city/auth services: `city.service.spec.ts`, `auth.service.spec.ts`
- Run with Karma: `npm test` (launches Chrome)

## Critical Project-Specific Conventions

### Time Management System

The game uses a real-time to in-game time conversion:

- Real-time updates converted to in-game seconds via `coef_realtime_to_ingametime`
- Auto end-day when `cityTimeSeconds >= day_end_time` ([city.service.ts#L120-L123](src/app/services/city/city.service.ts#L120-L123))
- All action times (build/dig/learn) factor in speed modifiers from `city.speeds`

### Resource & Inventory System

5 resource types: `wood`, `stone`, `metal`, `patch`, `screw`

- Check availability with `contains()` utility from `src/app/shared/utils/inventory.ts`
- Buildings cost resources from `building.inventory` object
- Track "found items" separately in `inventoryItemFound` signal for UX feedback

### Authentication Flow

1. User signs in → JWT token stored in `localStorage.getItem('token')`
2. `authInterceptor` attaches token to all API requests
3. `AuthService.verifiedToken` computed signal validates token expiry with `JwtHelperService`
4. Temporary accounts have `@temp.com` email domain (no Google sign-in)

### User State Machine

Player state enum (`UserState`) drives routing:

- `NOT_LOADED_PLAYER` → redirect to load-player
- `NO_CITY` → redirect to create-city
- `ALIVE_RECAP` → choose buildings to keep after surviving night
- `DEATH_RECAP` → view stats after death
- `PLAYING` → main game actions (dig/build/learn)

Routes enforce states via `stateGuard` with `data: { allowedStates: [...] }`.

## Code Style

### ESLint Configuration ([eslint.config.js](eslint.config.js))

- TypeScript with Angular recommended rules
- `@typescript-eslint/no-explicit-any: off` (allows `any` types)
- Component selectors: `app-` prefix, kebab-case
- Directive selectors: `app` prefix, camelCase
- Template rules: accessibility checks disabled for `click-events-have-key-events`, `interactive-supports-focus`

### Naming Conventions

- Services: inject with `readonly` when possible: `constructor(private readonly httpClient: HttpClient)`
- Signals: descriptive names like `buildLoading`, `leaderboardBestDay`
- Computed values: prefix "advanced" for enriched models (e.g., `advancedBuildings`)
- API methods: verb-first naming (`loadPlayer`, `findItems`, `getLeaderboardRanked`)

## Backend Integration

API base URL from `environment.API_URL`, all endpoints relative:

- `POST /city/build/:id` - Construct/upgrade building
- `POST /city/learn/:id` - Train skill
- `POST /city/item/find/:nb` - Dig for resources
- `POST /city/day/end` - Trigger night attack
- `POST /city/day/start` - Begin new day with chosen buildings
- `GET /player` - Load player state
- `GET /leaderboard/best-day` - Fetch best day leaderboard
- `GET /leaderboard/ranked` - Fetch ranked points leaderboard

Responses typically include `{ player: {...}, city: {...}, stats: {...}, default_values: {...} }`.

## Key Files Reference

| Path                                                                           | Purpose                           |
| ------------------------------------------------------------------------------ | --------------------------------- |
| [src/app/services/city/city.service.ts](src/app/services/city/city.service.ts) | Game state management & API calls |
| [src/app/services/auth/auth.service.ts](src/app/services/auth/auth.service.ts) | Authentication & JWT handling     |
| [src/app/models/hordes.ts](src/app/models/hordes.ts)                           | All game type definitions         |
| [src/app/shared/utils/](src/app/shared/utils/)                                 | Pure calculation functions        |
| [src/app/app.routes.ts](src/app/app.routes.ts)                                 | Route configuration & guards      |
| [server.js](server.js)                                                         | Production Express server for SPA |
