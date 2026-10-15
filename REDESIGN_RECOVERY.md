# ATU web – obnova redesignu

- Vetva: `fix/atu-redesign-recovery`, základ `36912c7` (aktuálny `main`).
- Zdroj: vybrané súbory a úpravy z `e4e28b8` a jeho histórie; bez merge WIP vetvy.
- Zmeny sú necommitnuté. Nebol vykonaný push ani deploy.
- Pôvodné pracovné zmeny sú zachované; ich dodatočná záloha je v `/private/tmp/atu-redesign-recovery-original/`.

## Obnovené

- Farebné hover vyplnenie čísel hráčov, responzívne karty a dlhé mená; doplnené rešpektovanie reduced-motion pre túto animáciu.
- Článkové komponenty, kategóriové novinky, homepage karty, hero/detail CSS, image metadata, ATU fallback, WebP pozadie a menší OG obrázok.
- Runtime fallback nefunkčných log súperov; odstránené mapovania na chýbajúce lokálne logá.
- Dropdowny, klávesnica, mobilné menu, ARIA a obnova fokusu pri Escape; Ludimus logo zachované na desktope aj mobile.
- Povinné polia, kontrola emailu, chybové hlásenia a prístupnosť náborového formulára; zachovaná validácia telefónu a spracovanie limitov backendu.
- Responzívne CSS a súvisiace globálne premenné, typografia, rozostupy a vizuálne detaily.
- Stránkovanie článkov vrátane ochrany pred cyklom; použitie v zoznamoch, kategóriách a sitemap.
- HTML sanitizácia s novou závislosťou `sanitize-html` a typmi. Oproti WIP zachováva interné odkazy, kotvy, mailto a tel; nebezpečné schémy neprepisuje na media URL.
- YouTube privacy embedy v oboch anketových komponentoch; zachované nahrávané videá a Vimeo.
- Odstránené odkazy na šesť neexistujúcich CSS tried, ktoré boli nefunkčné už vo východiskovej verzii.

## Vedome vynechané a zachované

- MapTileLayer, TrainingMap, ContactMapClient, ClubVenueMap, Stadia autentifikácia a mapové API bez zmien. Pôvodné mapové CSS pravidlá v spoločných contact/about štýloch sú zachované a porovnané cez CSS parser.
- Dockerfile, Compose, localhost porty, Next konfigurácia, API/Admin konfigurácia a server-only deploy skripty bez zmien.
- Zachované aktuálne verzie Next.js, React, ESLint a všetkých už uzamknutých závislostí. Pribudol iba sanitizátor s potrebnými závislosťami a typmi.
- Zachované existujúce obrázky, Ludimus logo aj nepoužívaný loading komponent; nepreberalo sa plošné mazanie assetov z WIP.
- Starý proxy route a kód z backup vetvy sa neobnovovali, pretože aktuálny projekt už používa rewrites.
- Admin a backend repozitáre sa nemenili.

## Overenie

- `npx --no-install tsc --noEmit --incremental false` – úspech.
- `npm run build` – úspech na Next.js 16.2.6. Existujúci next/font potrebuje sieťový prístup na Google Fonts.
- `npm run lint` – bez chýb a upozornení.
- `npm run test:recovery` – 5 úspešných regresných testov: sanitizácia a odkazy, stránkovanie, logá, článkové obrázky a dlhé mená hráčov.
- Kontrola všetkých statických odkazov TSX na CSS module triedy – žiadne chýbajúce triedy.
- `git diff --check` – bez chýb.
- HTTP 200 v lokálnom produkčnom náhľade: `/`, `/kategorie/muzi`, `/kategorie/juniori`, `/clanky`, `/pridaj_sa`, `/clanky/nabor-deti-atu-kosice-2026`, `/sitemap.xml`, `/atu-article-bg.webp`, `/images/news_hero-og.jpg`, `/logo/ludimus.png`.
- HTML kontrola potvrdila zachovanie panáka v oboch kategóriách, Ludimus loga a ARIA atribútov formulára.
- Interaktívna a vizuálna kontrola v prehliadači zostáva otvorená: v nástroji nebol dostupný žiadny prehliadač. HTTP/SSR kontroly nepotvrdzujú pixelovú zhodu ani všetky používateľské interakcie.
- Produkčný server nebol použitý na overovanie.

## Zmenené a nové súbory

Celkom 83 súborov vrátane tohto reportu.

- `REDESIGN_RECOVERY.md`
- `package-lock.json`
- `package.json`
- `public/atu-article-bg.webp`
- `public/images/news_hero-og.jpg`
- `src/app/clanky/ArticleCard.tsx`
- `src/app/clanky/[slug]/ArticleSidebar.tsx`
- `src/app/clanky/[slug]/page.module.css`
- `src/app/clanky/[slug]/page.tsx`
- `src/app/clanky/[slug]/sidebar.css`
- `src/app/clanky/page.module.css`
- `src/app/clanky/page.tsx`
- `src/app/components/ArticleImage.module.css`
- `src/app/components/ArticleImage.tsx`
- `src/app/components/CopyEmailButton.module.css`
- `src/app/components/Footer.module.css`
- `src/app/components/Footer.tsx`
- `src/app/components/GlitchText.module.css`
- `src/app/components/Header.module.css`
- `src/app/components/Header.tsx`
- `src/app/components/HeroScrollZoomImage.tsx`
- `src/app/components/RuntimeImage.tsx`
- `src/app/components/poll/PollCard.module.css`
- `src/app/components/poll/PollCard.tsx`
- `src/app/components/poll/PollResultsCard.tsx`
- `src/app/globals.css`
- `src/app/kategorie/[slug]/page.tsx`
- `src/app/kategorie/components/CategoryLeaderPlayerName.tsx`
- `src/app/kategorie/components/CategoryNews.tsx`
- `src/app/kategorie/dorast/components/nabor.tsx`
- `src/app/kategorie/dorast/components/novinky.tsx`
- `src/app/kategorie/dorast/page.tsx`
- `src/app/kategorie/juniori/components/najlepsi_hrac.tsx`
- `src/app/kategorie/juniori/components/nasledujuce_zapasy.tsx`
- `src/app/kategorie/juniori/components/novinky.tsx`
- `src/app/kategorie/juniori/components/posledne_zapasy.tsx`
- `src/app/kategorie/juniori/components/tabulka.tsx`
- `src/app/kategorie/juniori/page.tsx`
- `src/app/kategorie/mladsi-ziaci/components/nabor.tsx`
- `src/app/kategorie/mladsi-ziaci/components/novinky.tsx`
- `src/app/kategorie/mladsi-ziaci/page.tsx`
- `src/app/kategorie/muzi/components/najlepsi_hrac.tsx`
- `src/app/kategorie/muzi/components/nasledujuce_zapasy.tsx`
- `src/app/kategorie/muzi/components/novinky.tsx`
- `src/app/kategorie/muzi/components/posledne_zapasy.tsx`
- `src/app/kategorie/muzi/components/tabulka.tsx`
- `src/app/kategorie/muzi/page.tsx`
- `src/app/kategorie/pripravka/components/nabor.tsx`
- `src/app/kategorie/pripravka/components/novinky.tsx`
- `src/app/kategorie/pripravka/page.tsx`
- `src/app/kategorie/starsi-ziaci/components/nabor.tsx`
- `src/app/kategorie/starsi-ziaci/components/novinky.tsx`
- `src/app/kategorie/starsi-ziaci/page.tsx`
- `src/app/kategorie/styles/CategoryHero.module.css`
- `src/app/kategorie/styles/CategoryLeaders.module.css`
- `src/app/kategorie/styles/CategoryMatches.module.css`
- `src/app/kategorie/styles/CategoryNews.module.css`
- `src/app/kategorie/styles/CategoryPage.module.css`
- `src/app/kategorie/styles/CategoryRecruitment.module.css`
- `src/app/kategorie/styles/CategoryStandings.module.css`
- `src/app/kategorie/styles/SzfbCards.module.css`
- `src/app/kategorie/styles/TrainingTable.module.css`
- `src/app/kontakt/kontakt.module.css`
- `src/app/lib/posts.ts`
- `src/app/lib/richHtml.ts`
- `src/app/lib/seo.ts`
- `src/app/lib/teamLogos.ts`
- `src/app/not-found.module.css`
- `src/app/o-klube/o-klube.module.css`
- `src/app/page.module.css`
- `src/app/page.tsx`
- `src/app/pridaj_sa/BenefitsCarousel.module.css`
- `src/app/pridaj_sa/BenefitsCarousel.tsx`
- `src/app/pridaj_sa/FaqAccordion.tsx`
- `src/app/pridaj_sa/RecruitmentForm.module.css`
- `src/app/pridaj_sa/RecruitmentForm.tsx`
- `src/app/pridaj_sa/page.tsx`
- `src/app/pridaj_sa/pridaj_sa.module.css`
- `src/app/sitemap.ts`
- `src/app/stranka/[slug]/page.tsx`
- `src/app/stranka/[slug]/stranka.module.css`
- `src/app/styles/rich-text.module.css`
- `tests/redesign-recovery.test.mjs`
