import Image from "next/image";
import styles from "./o-klube.module.css";
import ClubHero from "./ClubHero";
import AchievementsSection from "./AchievementsSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

const alumni = [
  {
    name: "Michal Dudovič",
    description:
      "Jeden z najvýraznejších odchovancov klubu, ktorý sa presadil aj na vysokej medzinárodnej úrovni.",
    logo: "/logo/teams/vaxjou.png",
    logoAlt: "Växjö logo",
  },
  {
    name: "Michal Pazák",
    description:
      "Odchovanec ATU Košice spojený s klubovou kvalitou, reprezentáciou a dlhodobou florbalovou výkonnosťou.",
    logo: "/logo/teams/vitkovice.png",
    logoAlt: "Vítkovice logo",
  },
  {
    name: "Lukáš Řezanina",
    description:
      "Patrí medzi odchovancov, ktorí sa výrazne presadili aj v zahraničí a otvorili cestu ďalším hráčom.",
    logo: "/logo/teams/default.svg",
    logoAlt: "ATU Košice logo",
    largeLogo: true,
  },
  {
    name: "Ronald Gašparík",
    description:
      "Odchovanec klubu, ktorý nadviazal na kvalitnú mládežnícku prípravu a uplatnil sa aj mimo Slovenska.",
    logo: "/logo/teams/wiler.png",
    logoAlt: "Wiler logo",
  },
];

export default function OKlubePage() {
  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.preTitle}>O klube</span>
            <h1 className={styles.sectionTitle}>ATU Košice</h1>
          </div>

          <ClubHero />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.preTitle}>História</span>
            <h2 className={styles.sectionTitle}>Príbeh ATU Košice</h2>
          </div>

          <div className={styles.textSectionCard}>
            <div className={styles.textColumns}>
              <p className={styles.bodyText}>
                Príbeh ATU Košice sa začal písať v roku 2000, keď sa partia
                hokejbalistov dostala k prvým florbalovým aktivitám pod vedením
                Mgr. Juraja Dudoviča. Veľký impulz priniesla aj Vysokoškolská
                liga v Košiciach, ktorá rozbehla florbalové dianie naplno a
                zároveň ukázala, že tento šport má v meste obrovský potenciál.
                Práve tam sa začalo formovať jadro budúceho tímu a postupne
                vznikali základy klubu, ktorý sa mal neskôr zaradiť medzi
                najvýraznejšie mená slovenského florbalu.
              </p>

              <p className={styles.bodyText}>
                Keď ATU Košice vstúpilo v sezóne 2002/2003 medzi plnohodnotných
                členov najvyššej domácej súťaže, bolo jasné, že nejde len o
                krátkodobý projekt. Klub sa veľmi rýchlo usadil medzi
                slovenskou elitou, začal zbierať prvé medailové úspechy a
                budoval si rešpekt na palubovkách po celom Slovensku. Prišli
                silné sezóny, veľké zápasy aj momenty, ktoré klub posúvali
                ďalej. Jedným z prvých veľkých vrcholov bola sezóna 2003/2004,
                keď bolo mužstvo veľmi blízko k titulu a napokon si odnieslo
                strieborné medaily.
              </p>

              <p className={styles.bodyText}>
                ATU si počas rokov prešlo viacerými obdobiami. Boli sezóny
                medailové, boli aj roky, keď tím prechádzal generačnou obmenou a
                musel si znovu budovať svoju silu. O to cennejší bol návrat na
                vrchol v sezóne 2015/2016, keď klub získal svoj premiérový titul
                majstra Slovenska. Tento úspech neprišiel náhodou. Bol výsledkom
                dlhodobej práce, trpezlivosti a systému, ktorý sa v klube
                budoval roky. Navyše, v tom istom období sa potvrdilo, že ATU
                nerobí kvalitnú robotu len pri mužoch, ale aj v mládežníckych
                kategóriách.
              </p>

              <p className={styles.bodyText}>
                Práve práca s mládežou je jednou z najväčších devíz klubu.
                Juniori a dorastenci patria dlhodobo medzi slovenskú špičku a aj
                najmladšie kategórie pravidelne dosahujú výborné výsledky doma aj
                v zahraničí. ATU Košice dnes stojí na pevných základoch, ktoré
                vznikali rokmi poctivej práce, oddanosti a klubovej súdržnosti.
                Popri športových úspechoch sa tu buduje aj prostredie, ktoré má
                silnú identitu, zdravé ambície a zároveň rodinnú atmosféru. Aj
                preto ATU Košice nepôsobí len ako úspešný florbalový klub, ale
                ako jedna veľká florbalová rodina.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Klubové úspechy</h2>
          </div>

          <AchievementsSection />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              Hráči, na ktorých je klub hrdý
            </h2>
          </div>

          <div className={styles.alumniSectionIntro}>
            Odchovanci ATU Košice dlhodobo potvrdzujú, že kvalitná klubová práca
            dokáže vychovať hráčov pripravených presadiť sa doma aj v zahraničí.
          </div>

          <div className={styles.alumniGrid}>
            {alumni.map((player) => (
              <article key={player.name} className={styles.alumniCard}>
                <div className={styles.alumniCardHeader}>
                  <div className={styles.alumniBadge}>
                  <Image
                    src={player.logo}
                    alt={player.logoAlt}
                    width={34}
                    height={34}
                    className={`${styles.alumniBadgeLogo} ${
                      player.largeLogo ? styles.logoLargeSingle : ""
                    }`}
                  />
                  </div>

                  <div className={styles.alumniMeta}>
                    <h3 className={styles.alumniName}>{player.name}</h3>
                  </div>
                </div>

                <div className={styles.alumniDescriptionWrap}>
                  <p className={styles.alumniText}>{player.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}