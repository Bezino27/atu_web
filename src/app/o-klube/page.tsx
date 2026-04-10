import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./o-klube.module.css";

export const metadata: Metadata = {
  title: "O klube | ATU Košice",
  description:
    "ATU Košice je klub s tradíciou, vysoko postavenými staršími aj mládežníckymi tímami a jasnou hodnotovou identitou.",
};

const heroHighlights = [
  { label: "Rok založenia", value: "2000" },
  { label: "Súťaž", value: "Extraliga" },
  { label: "Domáca hala", value: "SOŠ Ostrovského 1" },
  { label: "Klubové farby", value: "čierna & biela" },
];

const achievements = [
  {
    id: "gold",
    title: "Majster Slovenska",
    detail: "2015/2016",
    count: "1x",
    tone: "gold",
  },
  {
    id: "silver",
    title: "Strieborné pozície",
    detail: "2003/2004, 2014/2015",
    count: "2x",
    tone: "silver",
  },
  {
    id: "bronze",
    title: "Bronzové sezóny",
    detail:
      "2002/2003 · 2004/2005 · 2005/2006 · 2006/2007 · 2010/2011 · 2016/2017",
    count: "6x",
    tone: "bronze",
  },
];

const medalSeasons = [
  { season: "2002/2003", medal: "Bronz" },
  { season: "2003/2004", medal: "Striebro" },
  { season: "2004/2005", medal: "Bronz" },
  { season: "2005/2006", medal: "Bronz" },
  { season: "2006/2007", medal: "Bronz" },
  { season: "2010/2011", medal: "Bronz" },
  { season: "2014/2015", medal: "Striebro" },
  { season: "2015/2016", medal: "Zlato" },
  { season: "2016/2017", medal: "Bronz" },
];

const personalities = [
  {
    name: "Lukáš Řezanina",
    detail:
      "Reprezentoval Slovensko a patrí medzi profilových odchovancov v elitnej lige.",
  },
  {
    name: "Miško Dudovič",
    detail: "Stabilný štít defenzívy, ktorý bol lídrom aj mimo klubu.",
  },
  {
    name: "Rony Gašparík",
    detail: "Odlíšil sa v zahraničných súťažiach a posunul klubovú vizibilitu.",
  },
  {
    name: "Filip Čonka-Skyba",
    detail: "Talent, ktorý vyrástol v ATU Košice a rozdáva kreatívnu energiu na ihrisku.",
  },
  {
    name: "Ľuboš Šefčík",
    detail: "Prispel k dlhodobému úsiliu, ktoré klub pozicionuje medzi slovenskú špičku.",
  },
  {
    name: "Michal Chudina",
    detail: "Reprezentoval krajinu a pokračoval v kariére v kvalitných soutěžiach.",
  },
];

const values = [
  {
    title: "Rodina",
    text: "Klub je komunita hráčov, rodičov a fanúšikov, ktorí držia spolu mimo ihry.",
  },
  {
    title: "Rozvoj",
    text: "Tréningy sú premyslené, aby hráč postupoval technicky, takticky aj mentálne.",
  },
  {
    title: "Zodpovednosť",
    text: "Dodržiavame slovo, pravidlá aj príkladom pre mladších spoluhráčov.",
  },
  {
    title: "Ambícia",
    text: "Chceme byť konkurencieschopní v súťažiach i pri reprezentácii Košíc.",
  },
];

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

function SectionHeading({ eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <span className={styles.sectionEyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {intro && <p className={styles.sectionIntro}>{intro}</p>}
    </div>
  );
}

export default function OKlubePage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroInner}>
              <span className={styles.heroEyebrow}>O klube</span>
              <h1 className={styles.heroTitle}>
                ATU Košice je jeden z lídrov slovenského florbalu
              </h1>
              <p className={styles.heroText}>
                Seniorské aj mládežnícke tímy sú súčasťou slovenskej florbalovej
                elity. Klub je známy tímovým prístupom, poctivou prácou a
                zrekonštruovanou domácou halou na SOŠ Ostrovského 1 v Košiciach.
              </p>

              <div className={styles.heroHighlights}>
                {heroHighlights.map((item) => (
                  <article key={item.label} className={styles.heroCard}>
                    <span className={styles.heroCardLabel}>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="Príbeh klubu"
              title="Od roku 2000 medzi slovenskou špičkou"
              intro="Založený v nišších vetvách florbalu, ATU Košice postupne rástol a dnes má stabilné miesto v najvyššej súťaži."
            />

            <div className={styles.storyBlock}>
              <p>
                Klub začal písať históriu v roku 2000 s víziou vytvoriť
                otvorenú florbalovú komunitu. Odhodlanie trénerov a hráčov
                vybudovalo infraštruktúru, ktorá umožnila rýchly postup k
                elitnému postaveniu bez zbytočných kompromisov.
              </p>
              <p>
                Dnes je ATU Košice veľká florbalová rodina – rodičia, dorast,
                juniorskí hráči aj seniorské družstvo tvoria jeden smer a
                zodpovedne reprezentujú Košice doma aj v zahraničí.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.achievementsSection}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="Najväčšie úspechy"
              title="Zbierka medailí s jasnou stopou"
              intro="Klub pravidelne oslavuje umiestnenia, ktoré potvrdzujú stabilné miesto v čele extraligy."
            />

            <div className={styles.achievementGrid}>
              {achievements.map((item) => (
                <article
                  key={item.id}
                  className={`${styles.statCard} ${styles[item.tone]}`}
                >
                  <span className={styles.statNumber}>{item.count}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>

            <div className={styles.medalTable}>
              <h3>Medailové sezóny</h3>
              <ul className={styles.medalList}>
                {medalSeasons.map((item) => (
                  <li key={item.season}>
                    <span className={styles.medalSeason}>{item.season}</span>
                    <span className={styles.medalLabel}>{item.medal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.youthSection}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="Mládež"
              title="Budúcnosť sa rodí v našom klube"
              intro="Juniori a dorast majú pre nás úplne iný význam – sú silnou základňou aj pokračovaním myšlienky ATU Košice."
            />

            <div className={styles.youthGrid}>
              <p>
                Pravidelné trénerské kampane, výzvy aj zápasy ponúkajú platformu
                pre jasný rast. Juniori a dorastenci patria medzi tradičnú špičku
                Slovenska a mnohí z nich dostávajú šancu na reprezentáciu.
              </p>
              <p>
                Aj najmladšie kategórie zažívajú početné víťazstvá v turnajoch a
                ligách, čo potvrdzuje, že klub neustále investuje do systematickej práce.
              </p>
              <p>
                Viacerí odchovanci sa presadili v zahraničnom florbale a
                zároveň reprezentujú Slovensko v mládežníckych i seniorských
                tímoch, čo je dôkazom kvality nášho výchovného procesu.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.personalitiesSection}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="Osobnosti"
              title="Odchovanci, ktorí písali dejiny"
              intro="Ctižiadostiví hráči ATU Košice zanechali svoju stopu doma aj v zahraničí."
            />

            <div className={styles.personalityGrid}>
              {personalities.map((person) => (
                <article key={person.name} className={styles.personalityCard}>
                  <h3>{person.name}</h3>
                  <p>{person.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="Klubová identita"
              title="Hodnoty, ktoré definujú ATU Košice"
              intro="Nejde len o výsledky – ide o prostredie, ktoré hráčom dáva istotu, energiu a dlhodobý rast."
            />

            <div className={styles.valuesGrid}>
              {values.map((value) => (
                <article key={value.title} className={styles.valueCard}>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <p className={styles.ctaLabel}>Florbalová rodina</p>
              <h2>Tradícia, kvalita, mládež a ambície</h2>
              <p>
                ATU Košice je miesto, kde sa spája hrdosť z mesta, rešpekt ku
                kvalite a snaha posúvať florbal vpred. Chceme byť klubom, na ktorý
                sa dá spoľahnúť dnes aj o desať rokov.
              </p>
              <p className={styles.ctaLinkWrap}>
                <Link href="/kontakt" className={styles.ctaLink}>
                  Kontaktujte nás a spoznajte, ako sa pridať
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
