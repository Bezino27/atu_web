# Produkčná CSP a OpenFreeMap

## Verejný audit – 15. 10. 2026

HTTP GET overil tieto URL, všetky s HTTP 200:

- https://atukosice.sk/
- https://atukosice.sk/kontakt
- https://atukosice.sk/o-klube
- https://atukosice.sk/kategorie/dorast
- https://atukosice.sk/kategorie/mladsi-ziaci
- https://atukosice.sk/kategorie/pripravka
- https://atukosice.sk/kategorie/starsi-ziaci
- https://www.atukosice.sk/kontakt

Žiadna z odpovedí neobsahovala `Content-Security-Policy`, `Content-Security-Policy-Report-Only` ani CSP meta tag. Hlavička Server uvádzala `nginx/1.24.0 (Ubuntu)`. Existujúca verejná CSP preto v čase auditu nebola príčinou blokovania mapy.

## Implementovaná zmena

`next.config.ts` nastavuje na produkčných odpovediach túto doplnkovú politiku:

```text
connect-src 'self' https://tiles.openfreemap.org; worker-src 'self' blob:
```

- `connect-src`: vlastný origin pre `/backend-api` a iba `https://tiles.openfreemap.org` pre Positron style JSON, TileJSON, vektorové/rastrové dlaždice, sprites a glyph PBF.
- `worker-src`: vlastný origin a `blob:` pre používaný balík MapLibre GL 5.24.0.
- Glyph PBF sa načítavajú cez fetch/XHR. Nie je potrebné pridať mapový origin do `font-src`.
- Kód a CSS adaptéra sa servujú aplikáciou; žiadne CDN skripty, wildcard domény, obecné `https:`, nové `unsafe-inline` ani `unsafe-eval` povolenia.
- Ostatné direktívy nie sú touto doplnkovou politikou definované. Existujúca samostatná CSP a ostatné bezpečnostné hlavičky sa nemenia ani neodstraňujú. Nejde o zavedenie plošnej bezpečnostnej politiky pre celý web.
- Development túto CSP neposiela; zostáva funkčné HMR a lokálny backend. Produkčné API požiadavky zostávajú same-origin cez existujúce rewrites.

## Čo preveriť na serveri

Nginx konfigurácia nie je v repozitári. Nasledujúce príkazy sú návod na kontrolu, neboli vykonané na serveri a nič nenasadzujú:

```bash
sudo nginx -T 2>&1 | rg -n 'server_name|Content-Security-Policy|add_header|proxy_hide_header|more_set_headers|include'

curl -sS -D - -o /dev/null http://127.0.0.1:3000/kontakt
curl -sS -D - -o /dev/null https://atukosice.sk/kontakt
curl -sS -D - -o /dev/null https://www.atukosice.sk/kontakt
```

Porovnať odpoveď Next.js na porte 3000 s verejnými odpoveďami po nasadení:

1. Skontrolovať aktívne HTTPS vhosty pre obe domény, ich `location` bloky aj zahrnuté snippets. Vyhľadať CSP nastavovanú cez `add_header`, modul headers-more alebo meta tagy.
2. Overiť, či `proxy_hide_header Content-Security-Policy` alebo nadradený proxy/CDN neodstraňuje CSP aplikácie. Neupravovať to bez zohľadnenia prípadnej samostatnej serverovej politiky.
3. Ak Nginx posiela ďalšiu CSP, doplniť do jej existujúceho `connect-src` origin `https://tiles.openfreemap.org` a do `worker-src` schému `blob:`. Zachovať všetky ostatné povolené zdroje a obmedzenia. Ak `worker-src` chýba, zohľadniť jeho pôvodný fallback cez `child-src`, `script-src`, prípadne `default-src`; nestratiť doterajšie potrebné zdroje.
4. Nesmie sa len pridať druhá rovnomenná direktíva do jednej politiky. Upraviť pôvodnú direktívu. Pri zmene z `'none'` použiť explicitný nevyhnutný zoznam zdrojov namiesto ponechania `'none'` v zmiešanom zozname.
5. Viaceré CSP hlavičky sa vyhodnocujú súčasne. Nová aplikačná hlavička neuvoľní prísnejšiu serverovú politiku. Neodstraňovať plnú Nginx CSP len preto, aby mapa fungovala.
6. Ak existujúci `img-src`/`default-src` obmedzuje dekódovanie obrázkov MapLibre, preveriť povolenie `data:`/`blob:` pre tento účel; nepridávať nové externé obrazové domény bez konkrétneho dôvodu.
7. Pri úprave `add_header` preveriť dedenie. Na Nginx 1.24 vlastný `add_header` v `location` môže zrušiť dedenie rodičovských hlavičiek. Zachovať HSTS, frame obmedzenia a ostatné hlavičky; nezavádzať iba izolovaný CSP riadok do nového location bloku.
8. Skontrolovať v prehliadači Network/Console na reálnej HTTPS doméne. Neprítomnosť CSP hlášok na localhoste sama nepotvrdzuje správanie externého Nginxu.

Oficiálne podklady: [Nginx – dedenie add_header](https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header), [CSP – viacero politík](https://www.w3.org/TR/CSP3/#multiple-policies), [MapLibre – CSP](https://maplibre.org/maplibre-gl-js/docs/#csp-directives).

## Overenie lokálneho produkčného buildu

- `npm test`: 11/11 úspešných testov.
- `npm run lint`: bez chýb a upozornení.
- `npx --no-install tsc --noEmit --incremental false`: úspech.
- `npm run build`: úspech na Next.js 16.2.6.
- Reálne HTTP GET na úvod a všetkých šesť mapových stránok lokálneho produkčného servera: HTTP 200 a presná vynucovaná CSP hlavička uvedená vyššie. Nejde iba o Report-Only.
- Docker, vetva `fix/atu-redesign-recovery` a existujúce rozpracované zmeny zachované. Bez commitu, pushu či deployu. Verejná produkcia sa týmto lokálnym zásahom nezmenila.
