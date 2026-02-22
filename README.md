# Restaurant Listing App (Expo + React Native)

Aplicación móvil construida con Expo Router que consume la API mock de HackerRank:
`https://jsonmock.hackerrank.com/api/food_outlets`

## Funcionalidades

- Carga inicial de restaurantes desde la API.
- Indicador de carga con `ActivityIndicator` (`testID="progress"`).
- Header con el total mostrado: `<count> Restaurants Near You`.
- Listado con `FlatList`.
- ítems con nombre, ciudad, rating y votos.
- Buscador por ciudad (`city` en query params).
- Filtro por costo máximo (`estimated_cost`) en cliente.
- Paginación/infinite scroll usando `page` + `total_pages`.

## API

Ejemplos de endpoints usados:

- `https://jsonmock.hackerrank.com/api/food_outlets`
- `https://jsonmock.hackerrank.com/api/food_outlets?city=Denver`
- `https://jsonmock.hackerrank.com/api/food_outlets?city=Denver&page=2`

Respuesta esperada (resumen):

- `page`, `per_page`, `total`, `total_pages`, `data[]`

## Estructura principal

- `app/(tabs)/index.tsx`: pantalla principal (fetch, filtros y paginación).
- `features/restaurant/components/Header.tsx`
- `features/restaurant/components/Listing.tsx`
- `features/restaurant/components/ListingItem.tsx`
- `features/restaurant/styles.ts`
- `features/restaurant/types.ts`
- `app/(tabs)/_layout.tsx`: tabs (tab `Restaurant` con icono de comida).

## Scripts

Instalar dependencias:

```bash
npm install
```

Iniciar app:

```bash
npm start
```

Android:

```bash
npm run android
```

iOS:

```bash
npm run ios
```

Web:

```bash
npm run web
```

Lint:

```bash
npm run lint
```

Nota: actualmente `package.json` no incluye script `test`.

## Notas

- Se usa `SafeAreaView` de `react-native-safe-area-context`.
- La API de HackerRank no incluye imágenes de restaurantes en la respuesta.
