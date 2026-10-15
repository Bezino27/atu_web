# OpenFreeMap Positron – migrácia máp ATU

## Zmena

- Vetva `fix/atu-redesign-recovery`; východiskový commit pri začatí úlohy `3d79b18`.
- Všetkých šesť máp používa spoločný `OpenFreeMapLayer` a štýl `https://tiles.openfreemap.org/styles/positron`.
- Oficiálny adaptér `@maplibre/maplibre-gl-leaflet@0.1.4`, kompatibilný `maplibre-gl@5.24.0`; verzie ostatných existujúcich uzamknutých závislostí bez zmeny.
- Adaptér sa importuje v useEffect až na klientovi. Zachované pôvodné ssr:false hranice všetkých šiestich máp.
- React-Leaflet riadi markery, polohy, aktívne miesta, zoom a ovládanie. MapLibre vykresľuje iba podklad v existujúcom tile pane; interaktivita adaptéra je vypnutá.
- Zachované rozmery kontajnerov, súradnice, min/max zoom, ovládacie prvky aj markerové HTML.
- OpenFreeMap/OpenMapTiles/OpenStreetMap atribúcie sú v ovládaní Leaflet. Odstránené pôvodné CSS skrývanie atribúcií v troch spoločných štýloch.
- Pridané chybové hlásenie mapového podkladu a cleanup vrstvy/listenerov pri odpojení. Neskoro načítaný adaptér nevytvorí vrstvu po odpojení komponentu.
- Žiadne Stadia URL v src ani vo výsledných klientskych JS chunkoch. Bez API kľúčov, bez náhrady markerov alebo prechodu na iný mapový framework.
- Docker, deploy konfigurácia a obnovené časti redesignu bez zmeny. Next konfigurácia následne doplnená o produkčnú CSP opísanú nižšie.

## CSP

Produkčný Next.js build teraz posiela:

```text
Content-Security-Policy: connect-src 'self' https://tiles.openfreemap.org; worker-src 'self' blob:
```

Politika sa nastavuje v `next.config.ts` iba v produkcii. Dovoľuje jediný externý origin pre mapové fetch/XHR požiadavky a blob worker MapLibre 5. Glyph PBF súbory sa načítavajú cez fetch/XHR, nie ako CSS webfonty. Žiadne nové výnimky pre script-src, font-src, img-src či frame-src sa nepridávajú; ostatné existujúce hlavičky a prípadné ďalšie CSP zostávajú nedotknuté. Development nie je obmedzený touto politikou, aby fungoval HMR.

Verejný audit 15. 10. 2026 našiel na úvode, šiestich mapových stránkach a www kontakte HTTP 200 bez CSP hlavičky, report-only hlavičky či CSP meta tagu. Server sa identifikoval ako nginx/1.24.0 (Ubuntu). Nginx konfigurácia v tomto repozitári nie je.

Podrobné zistenia, kontrolné príkazy pre Nginx a pravidlá zachovania ďalšej serverovej CSP sú v [CSP_OPENFREEMAP.md](CSP_OPENFREEMAP.md).

## Overenie

- `npx --no-install tsc --noEmit --incremental false`: úspech.
- `npm run lint`: úspech, bez upozornení.
- `npm test`: 11/11 testov; 5 regresných, 3 pre mapovú vrstvu a 3 pre produkčnú CSP/development/API rewrites.
- `npm run build`: úspech, Next.js 16.2.6, vrátane prerenderovania Kontakt/O klube bez browser-global chýb.
- `git diff --check`: úspech.
- HTTP 200 pre `/kategorie/dorast`, `/kategorie/mladsi-ziaci`, `/kategorie/pripravka`, `/kategorie/starsi-ziaci`, `/kontakt`, `/o-klube` v lokálnom produkčnom náhľade.
- Verejný štýl Positron a TileJSON: HTTP 200, bez autentifikácie.
- Reálna vektorová dlaždica pri Košiciach z14/x9158/y5647: HTTP 200, 244791 bajtov. Fonty a sprite JSON/PNG: HTTP 200.
- Opera: vizuálne overený kontakt na desktope a v responzívnom náhľade; zachovaný marker a funkčný zoom.
- Opera Network: 9 filtrovaných požiadaviek OpenFreeMap (štýl, TileJSON, sprite, dlaždica, fonty), všetky HTTP 200. Žiadna Stadia/401 chyba.
- Úplná vizuálna kontrola všetkých šiestich miest a finálneho zobrazenia atribúcií po poslednom builde nebola dokončená; všetky použitia boli overené v kóde a cez SSR/HTTP.

## Otvorené pozorovania

- Console pri kontakte obsahovala neblokujúce MapLibre worker upozornenie `Expected value to be of type number, but found null instead.`; mapový podklad sa vykresľoval. Hostovaný Positron štýl ani dáta sa lokálne neupravovali.
- Existujúce lokálne obrázky klubových odkazov vracali Next Image HTTP 400: produkčný image optimizer blokuje privátnu IP 127.0.0.1 z lokálneho backendu. Nesúvisí s mapovým podkladom; bezpečnostné nastavenie sa nemenilo.
- Pred nasadením treba overiť prípadnú externú CSP a finálny vizuálny stav na produkcii. Produkcia bola iba čítaná cez verejné HTTP GET požiadavky pri audite CSP, bez zmeny konfigurácie.
- Počas tejto úlohy nebol vytvorený commit, merge, push ani produkčný deploy.

## Zmenené a nové súbory

- `OPENFREEMAP_MIGRATION.md`
- `package-lock.json`
- `package.json`
- `src/app/components/OpenFreeMapLayer.module.css`
- `src/app/components/OpenFreeMapLayer.tsx`
- `src/app/kategorie/dorast/components/TrainingMap.tsx`
- `src/app/kategorie/mladsi-ziaci/components/TrainingMap.tsx`
- `src/app/kategorie/pripravka/components/TrainingMap.tsx`
- `src/app/kategorie/starsi-ziaci/components/TrainingMap.tsx`
- `src/app/kategorie/styles/TrainingTable.module.css`
- `src/app/kontakt/ContactMapClient.tsx`
- `src/app/kontakt/kontakt.module.css`
- `src/app/o-klube/ClubVenueMap.tsx`
- `src/app/o-klube/o-klube.module.css`
- `tests/openfreemap.test.mjs`

## Oficiálne podklady

- [OpenFreeMap – Leaflet quick start](https://openfreemap.org/quick_start/)
- [MapLibre GL Leaflet – API](https://github.com/maplibre/maplibre-gl-leaflet/blob/main/API.md)
