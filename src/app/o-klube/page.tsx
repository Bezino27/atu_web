import styles from "./o-klube.module.css";
import ClubHero from "./ClubHero";
import Header from "../components/Header";
import Footer from "../components/Footer";

const menAchievements = [
  { label: "Majster Slovenska", value: "1× zlato" },
  { label: "Vicemajster", value: "2× striebro" },
  { label: "Bronzové umiestnenie", value: "6× bronz" },
];

const youthAchievements = [
  { label: "Juniori", value: "4× zlato" },
  { label: "Mládež", value: "strieborné aj bronzové úspechy" },
  { label: "Prague Games", value: "1. miesto" },
  { label: "Hummel Open Game Brno", value: "2. miesto" },
];

const alumni = [
  {
    name: "Michal Dudovič",
    description:
      "Jeden z najvýraznejších odchovancov klubu, ktorý sa presadil aj na vysokej medzinárodnej úrovni.",
  },
  {
    name: "Michal Pazák",
    description:
      "Odchovanec ATU Košice spojený s klubovou kvalitou, reprezentáciou a dlhodobou florbalovou výkonnosťou.",
  },
  {
    name: "Lukáš Řezanina",
    description:
      "Patrí medzi odchovancov, ktorí sa výrazne presadili aj v zahraničí a otvorili cestu ďalším hráčom.",
  },
  {
    name: "Filip Čonka-Skyba",
    description:
      "Odchovanec klubu, ktorý nadviazal na kvalitnú mládežnícku prípravu a uplatnil sa aj mimo Slovenska.",
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
                Florbalová história klubu Akademik TU Košice sa začala písať v roku
                2000, keď sa skupina hokejbalistov zapojila do prvých florbalových
                aktivít pod vedením Mgr. Juraja Dudoviča. Dôležitým impulzom bola aj
                Vysokoškolská liga v Košiciach, ktorá pomohla rozšíriť florbalové
                dianie a vytvorila priestor pre nových hráčov, z ktorých sa postupne
                formovalo pevné jadro tímu.
              </p>

              <p className={styles.bodyText}>
                Sezóna 2002/2003 znamenala vstup ATU Košice medzi plnohodnotných
                členov najvyššej domácej súťaže. Už v úvodných rokoch sa klub zaradil
                medzi silné florbalové mená na Slovensku, keď prišli prvé medailové
                úspechy a vytvorili sa základy klubovej identity postavenej na
                bojovnosti, kvalite a dlhodobom raste.
              </p>

              <p className={styles.bodyText}>
                V nasledujúcich sezónach prešiel klub viacerými etapami – od
                medailových ročníkov cez generačnú obmenu až po návrat na úplný vrchol.
                Historickým momentom sa stala sezóna 2015/2016, počas ktorej ATU
                Košice získalo svoj premiérový titul majstra Slovenska. Toto obdobie
                zároveň potvrdilo silu klubu aj v mládežníckych kategóriách.
              </p>

              <p className={styles.bodyText}>
                ATU Košice dnes stojí na pevných základoch vybudovaných počas rokov
                práce, oddanosti a klubovej súdržnosti. Popri mužskom tíme klub
                dlhodobo rozvíja aj mládež, vychováva reprezentantov a buduje
                prostredie, ktoré právom nesie charakter jednej veľkej florbalovej
                rodiny.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.preTitle}>Úspechy</span>
            <h2 className={styles.sectionTitle}>Muži</h2>
          </div>

          <div className={styles.achievementGrid}>
            {menAchievements.map((item) => (
              <article key={item.label} className={styles.achievementCard}>
                <span className={styles.achievementLabel}>{item.label}</span>
                <strong className={styles.achievementValue}>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.preTitle}>Úspechy</span>
            <h2 className={styles.sectionTitle}>Mládež</h2>
          </div>

          <div className={styles.achievementGrid}>
            {youthAchievements.map((item) => (
              <article key={item.label} className={styles.achievementCard}>
                <span className={styles.achievementLabel}>{item.label}</span>
                <strong className={styles.achievementValue}>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.preTitle}>Odchovanci</span>
            <h2 className={styles.sectionTitle}>Hráči, na ktorých je klub hrdý</h2>
          </div>

          <div className={styles.alumniGrid}>
            {alumni.map((player) => (
              <article key={player.name} className={styles.alumniCard}>
                <div className={styles.alumniTop}>
                  <span className={styles.alumniAccent} />
                  <h3 className={styles.alumniName}>{player.name}</h3>
                </div>
                <p className={styles.alumniText}>{player.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}