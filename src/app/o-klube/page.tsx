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
    "Florbalový svetobežník s obrovskými skúsenosťami, ktorý pôsobí vo švédskej Superlige v klube Växjö Vipers. Niekoľkokrát bol ocenený ako slovenský florbalista roka a dlhé roky pôsobil aj vo švajčiarskom SV Wiler-Ersigen, s ktorým sa stal viacnásobným majstrom Švajčiarska.",    logo: "/logo/teams/vaxjou.png",
    logoAlt: "Växjö logo",
  },
  {
  name: "Michal Pažák",
  description:
  "Jeden z výrazných hráčov, ktorí vyrástli v ATU Košice a dokázali sa presadiť v českej najvyššej súťaži. Po pôsobení v Sparte Praha pokračuje vo Vítkoviciach a dlhé roky patril medzi lídrov slovenskej mužskej reprezentácie, ktorú viedol aj ako kapitán.",
  logo: "/logo/teams/vitkovice.png",
  logoAlt: "Vítkovice logo",
  },
  {
  name: "Lukáš Řezanina",
  description:
    "Odchovanec ATU Košice, ktorý patril medzi najvýraznejšie osobnosti slovenského florbalu. Presadil sa aj v zahraničí, pôsobil v českých Vítkoviciach aj švédskom Linköpingu a dlhé roky bol kapitánom slovenskej reprezentácie. Po úspešnej kariére sa vrátil do ATU, kde sa po sezóne rozhodol ukončiť aktívne hráčske pôsobenie.",
  logo: "/logo/teams/default.svg",
  logoAlt: "ATU Košice logo",
  largeLogo: true,
  },
  {
  name: "Ronald Gašparík",
  description:
    "Výrazný talent ATU košice, ktorý prešiel mládežníckou prípravou v ATU Košice a postupne sa posunul do kvalitných zahraničných súťaží. Skúsenosti zbieral v kluboch ako Tatran Střešovice, UHC Waldkirch St. Gallen či Florbal Mladá Boleslav. Momentálne si oblieka dres švajčiarskeho SV Wiler-Ersigen.",
  logo: "/logo/teams/wiler.png",
  logoAlt: "SV Wiler-Ersigen logo",
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
                Mgr. Juraja Dudoviča. Veľký impulz priniesla aj vysokoškolská
                liga v Košiciach, ktorá rozbehla florbalové dianie naplno a
                zároveň ukázala, že tento šport má v meste obrovský potenciál.
                Práve tam sa začalo formovať jadro budúceho tímu a postupne
                vznikali základy klubu, ktorý sa mal neskôr zaradiť medzi
                najvýraznejšie mená slovenského florbalu.
              </p>

              <p className={styles.bodyText}>
                Keď ATU Košice vstúpilo v sezóne 2002/2003 medzi
                členov najvyššej domácej súťaže, bolo jasné, že nejde len o
                krátkodobý projekt. Klub sa veľmi rýchlo usadil medzi
                slovenskou elitou, začal zbierať prvé medailové úspechy a
                budoval si silné meno na palubovkách po celom Slovensku. Prišli
                dôležité sezóny, veľké zápasy aj momenty, ktoré klub posúvali
                ďalej. Jedným z prvých veľkých vrcholov bola sezóna 2003/2004,
                keď bolo mužstvo veľmi blízko k titulu a napokon si odnieslo
                strieborné medaily.
              </p>

              <p className={styles.bodyText}>
                ATU si počas rokov prešlo viacerými obdobiami. Boli sezóny
                medailové,ale boli aj roky, keď tím prechádzal generačnou obmenou a
                musel si znovu budovať svoju silu. O to cennejší bol návrat na
                vrchol v sezóne 2015/2016, keď klub získal svoj premiérový titul
                majstra Slovenska. Tento úspech neprišiel náhodou. Bol výsledkom
                dlhodobej práce, trpezlivosti a systému, ktorý sa v klube
                budoval roky. Navyše, v tom istom období sa potvrdilo, že ATU
                nerobí kvalitnú robotu len pri mužoch, ale aj v mládežníckych
                kategóriách.
              </p>

              <p className={styles.bodyText}>
                Práve práca s mládežou je jednou z najväčších predností klubu.
                Juniori a dorastenci patria dlhodobo medzi slovenskú špičku a aj
                najmladšie kategórie pravidelne dosahujú výborné výsledky doma aj
                v zahraničí. ATU Košice dnes stojí na pevných základoch, ktoré
                vznikali rokmi poctivej práce, oddanosti a klubovej súdržnosti.
                Popri športových úspechoch sa tu buduje aj prostredie, ktoré má
                silnú identitu, zdravé ambície a zároveň rodinnú atmosféru. Aj
                preto ATU Košice nepôsobí len ako úspešný florbalový klub, ale aj
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
            Hráči klubu ATU Košice sa presadili nielen doma, ale aj v zahraničných kluboch.
            Odchovanci klubu ktorí hrajú v najlepších svetových súťažiach:
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