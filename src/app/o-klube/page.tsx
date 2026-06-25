import Image from "next/image";
import type { Metadata } from "next";
import styles from "./o-klube.module.css";
import ClubHero from "./ClubHero";
import AchievementsSection from "./AchievementsSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL, getApiFetchOptions } from "../lib/api";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";

const CLUB_SLUG = "atu-kosice";

export const metadata: Metadata = {
  title: "O klube",
  description:
    "Spoznajte históriu florbalového klubu ATU Košice, klubové úspechy, medaily a odchovancov, ktorí sa presadili doma aj v zahraničí.",
  alternates: {
    canonical: absoluteUrl("/o-klube"),
  },
  openGraph: {
    title: `O klube | ${SITE_NAME}`,
    description:
      "História, úspechy, medaily a významní odchovanci florbalového klubu ATU Košice.",
    url: absoluteUrl("/o-klube"),
    type: "website",
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

type PageSection = {
  id: number;
  section_type: string;
  title: string;
  pre_title: string;
  order: number;
  is_active: boolean;
  hide_when_empty: boolean;
  config: Record<string, unknown>;
};

type ClubPage = {
  id: number;
  title: string;
  slug: string;
  menu_title: string;
  page_type: string;
  meta_title: string;
  meta_description: string;
  club_slug: string;
  sections: PageSection[];
};

const aboutTexts = [
  `Príbeh ATU Košice sa začal písať v roku 2000, keď sa partia hokejbalistov dostala k prvým florbalovým aktivitám pod vedením Mgr. Juraja Dudoviča. Veľký impulz priniesla aj vysokoškolská liga v Košiciach, ktorá rozbehla florbalové dianie naplno a zároveň ukázala, že tento šport má v meste obrovský potenciál. Práve tam sa začalo formovať jadro budúceho tímu a postupne vznikali základy klubu, ktorý sa mal neskôr zaradiť medzi najvýraznejšie mená slovenského florbalu.`,
  `Keď ATU Košice vstúpilo v sezóne 2002/2003 medzi členov najvyššej domácej súťaže, bolo jasné, že nejde len o krátkodobý projekt. Klub sa veľmi rýchlo usadil medzi slovenskou elitou, začal zbierať prvé medailové úspechy a budoval si silné meno na palubovkách po celom Slovensku. Prišli dôležité sezóny, veľké zápasy aj momenty, ktoré klub posúvali ďalej. Jedným z prvých veľkých vrcholov bola sezóna 2003/2004, keď bolo mužstvo veľmi blízko k titulu a napokon si odnieslo strieborné medaily.`,
  `ATU si počas rokov prešlo viacerými obdobiami. Boli sezóny medailové, ale boli aj roky, keď tím prechádzal generačnou obmenou a musel si znovu budovať svoju silu. O to cennejší bol návrat na vrchol v sezóne 2015/2016, keď klub získal svoj premiérový titul majstra Slovenska. Tento úspech neprišiel náhodou. Bol výsledkom dlhodobej práce, trpezlivosti a systému, ktorý sa v klube budoval roky. Navyše, v tom istom období sa potvrdilo, že ATU nerobí kvalitnú robotu len pri mužoch, ale aj v mládežníckych kategóriách.`,
  `Práve práca s mládežou je jednou z najväčších predností klubu. Juniori a dorastenci patria dlhodobo medzi slovenskú špičku a aj najmladšie kategórie pravidelne dosahujú výborné výsledky doma aj v zahraničí. ATU Košice dnes stojí na pevných základoch, ktoré vznikali rokmi poctivej práce, oddanosti a klubovej súdržnosti. Popri športových úspechoch sa tu buduje aj prostredie, ktoré má silnú identitu, zdravé ambície a zároveň rodinnú atmosféru. Aj preto ATU Košice nepôsobí len ako úspešný florbalový klub, ale aj ako jedna veľká florbalová rodina.`,
];

const alumni = [
  {
    name: "Michal Dudovič",
    description:
      "Florbalový svetobežník s obrovskými skúsenosťami, ktorý pôsobí vo švédskej Superlige v klube Växjö Vipers. Niekoľkokrát bol ocenený ako slovenský florbalista roka a dlhé roky pôsobil aj vo švajčiarskom SV Wiler-Ersingen, s ktorým sa stal viacnásobným majstrom Švajčiarska.",
    logo: "/logo/teams/vaxjou.png",
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
      "Výrazný talent ATU Košice, ktorý prešiel mládežníckou prípravou v ATU Košice a postupne sa posunul do kvalitných zahraničných súťaží. Skúsenosti zbieral v kluboch ako Tatran Střešovice, UHC Waldkirch St. Gallen či Florbal Mladá Boleslav. Momentálne si oblieka dres švajčiarskeho SV Wiler-Ersingen.",
    logo: "/logo/teams/wiler.png",
    logoAlt: "SV Wiler-Ersingen logo",
  },
];

const fallbackSections: PageSection[] = [
  {
    id: -1,
    section_type: "hero",
    title: "ATU Košice",
    pre_title: "O klube",
    order: 1,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -2,
    section_type: "about_text",
    title: "Príbeh ATU Košice",
    pre_title: "História",
    order: 2,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -3,
    section_type: "achievements",
    title: "Klubové úspechy",
    pre_title: "",
    order: 3,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -4,
    section_type: "famous_players",
    title: "Hráči, na ktorých je klub hrdý",
    pre_title: "",
    order: 4,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
];

async function getAboutPage(): Promise<ClubPage | null> {
  try {
    const res = await fetch(
      `${API_URL}/public/pages/${CLUB_SLUG}/by-slug/o-klube/`,
      getApiFetchOptions(60),
    );

    if (!res.ok) {
      console.error(`Nepodarilo sa načítať stránku O klube: ${res.status}`);
      return null;
    }

    return (await res.json()) as ClubPage;
  } catch (error) {
    console.error("Chyba pri načítaní stránky O klube:", error);
    return null;
  }
}

function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
}

export default async function OKlubePage() {
  const page = await getAboutPage();

  const sections =
    page?.sections && page.sections.length > 0
      ? [...page.sections]
          .filter((section) => section.is_active)
          .sort((a, b) => a.order - b.order || a.id - b.id)
      : fallbackSections;

  const renderHeroSection = (section: PageSection) => (
    <section key={section.id} className="section">
      <div className="sectionHeading">
        <span className="preTitle">{getSectionPreTitle(section, "O klube")}</span>
        <h1 className="sectionTitle">
          {getSectionTitle(section, page?.title || "ATU Košice")}
        </h1>
      </div>

      <ClubHero />
    </section>
  );

  const renderAboutTextSection = (section: PageSection) => (
    <section key={section.id} className="section">
      <div className="sectionHeading">
        {getSectionPreTitle(section, "") ? (
          <span className="preTitle">{getSectionPreTitle(section, "")}</span>
        ) : null}
        <h2 className="sectionTitle">
          {getSectionTitle(section, "Príbeh ATU Košice")}
        </h2>
      </div>

      <div className={styles.textSectionCard}>
        <div className={styles.textColumns}>
          {aboutTexts.map((text) => (
            <p key={text} className={styles.bodyText}>
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );

  const renderAchievementsSection = (section: PageSection) => (
    <section key={section.id} className="section">
      <div className="sectionHeading">
        {getSectionPreTitle(section, "") ? (
          <span className="preTitle">{getSectionPreTitle(section, "")}</span>
        ) : null}
        <h2 className="sectionTitle">
          {getSectionTitle(section, "Klubové úspechy")}
        </h2>
      </div>

      <AchievementsSection />
    </section>
  );

  const renderFamousPlayersSection = (section: PageSection) => (
    <section key={section.id} className="section">
      <div className="sectionHeading">
        {getSectionPreTitle(section, "") ? (
          <span className="preTitle">{getSectionPreTitle(section, "")}</span>
        ) : null}
        <h2 className="sectionTitle">
          {getSectionTitle(section, "Hráči, na ktorých je klub hrdý")}
        </h2>
      </div>

      <div className={styles.alumniSectionIntro}>
        Hráči klubu ATU Košice sa presadili nielen doma, ale aj v zahraničných
        kluboch. Odchovanci klubu, ktorí hrajú v najlepších svetových
        súťažiach:
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
  );

  const renderSection = (section: PageSection) => {
    switch (section.section_type) {
      case "hero":
      case "about_overview":
        return renderHeroSection(section);
      case "about_text":
      case "custom_text":
        return renderAboutTextSection(section);
      case "achievements":
        return renderAchievementsSection(section);
      case "famous_players":
        return renderFamousPlayersSection(section);
      default:
        return null;
    }
  };

  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.content}>
        {sections.map((section) => renderSection(section))}
      </div>

      <Footer />
    </main>
  );
}
