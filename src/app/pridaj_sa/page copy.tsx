import Link from "next/link";
import BenefitsCarouselSection from "./BenefitsCarousel";
import styles from "./pridaj_sa.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import RecruitmentForm from "./RecruitmentForm";
import { API_URL } from "@/app/lib/api";

const benefits = [
  {
    id: 1,
    title: "Osobný prístup",
    text: "Každé dieťa vnímame individuálne.",
  },
  {
    id: 2,
    title: "Mladí tréneri",
    text: "Aktívni, hrajúci a blízki dnešnej hre.",
  },
  {
    id: 3,
    title: "Dobrá partia",
    text: "Deti sa u nás cítia prirodzene a bezpečne.",
  },
  {
    id: 4,
    title: "Rozvoj",
    text: "Pohyb, technika, disciplína aj návyky.",
  },
  {
    id: 5,
    title: "Klubové prostredie",
    text: "Poriadok, systém a kvalitné fungovanie.",
  },
  {
    id: 6,
    title: "Prvý tréning zdarma",
    text: "Najprv skúsiť, potom sa rozhodnúť.",
  },
];

type BackendCategory = {
  id: number;
  name: string;
  slug: string;
  season: string;
  birth_year_from: number;
  birth_year_to: number;
  is_active: boolean;
};

const CATEGORY_CONTENT: Record<
  string,
  { text: string; href: string }
> = {
  pripravka: {
    text: "Pre deti, ktoré sa chcú hýbať, zabaviť a získať prvé športové návyky.",
    href: "/kategorie/pripravky",
  },
  "mladsi-ziaci": {
    text: "Rozvoj techniky, pohybu a vzťahu k hre v tímovom prostredí.",
    href: "/kategorie/mladsi_ziaci",
  },
  "starsi-ziaci": {
    text: "Viac tempa, viac zodpovednosti a ďalší športový rast.",
    href: "/kategorie/starsi_ziaci",
  },
  dorast: {
    text: "Súťažné prostredie, intenzívnejší tréning a príprava na vyšší level.",
    href: "/kategorie/dorast",
  },
  juniori: {
    text: "Vyššie tempo, kvalitná príprava a posun k seniorskému florbalu.",
    href: "/kategorie/juniori",
  },
};

async function getCategories(): Promise<BackendCategory[]> {
  try {
    const res = await fetch(`${API_URL}/public/teams/atu-kosice/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}


const faqItems = [
  {
    question: "Môže prísť aj dieťa bez skúseností?",
    answer:
      "Áno. Veľa detí začína úplne od nuly. Dôležitá je chuť hýbať sa a skúsiť niečo nové.",
  },
  {
    question: "Čo si treba priniesť na prvý tréning?",
    answer:
      "Stačí športové oblečenie, halové tenisky a fľaša s vodou. Ostatné vám vysvetlíme.",
  },
  {
    question: "Je prvý tréning zadarmo?",
    answer:
      "Áno. Dieťa si môže tréning najprv vyskúšať bez poplatku a bez záväzku.",
  },
  {
    question: "Koľko stojí členstvo?",
    answer: "Členský poplatok je 150 € na pol roka.",
  },
  {
    question: "Ako vybrať správnu kategóriu?",
    answer:
      "Napíšte nám vek dieťaťa a my vás nasmerujeme na správnu kategóriu.",
  },
  {
    question: "Ako sa prihlásiť alebo ozvať?",
    answer:
      "Najjednoduchšie je poslať meno a email. Následne sa vám ozveme.",
  },
];

export default async function PridajSaPage() {
  const categories = await getCategories();
  return (
    <main className={styles.pageContainer}>
      <Header />

      <div className={styles.content}>
        <section className={styles.heroSection}>
          <div className={styles.heroCard}>
            <img
              src="/images/nabor-hero.jpg"
              alt="Deti na tréningu ATU Košice"
              className={styles.heroBackgroundImage}
            />

            <div className={styles.heroOverlay} />

            <div className={styles.heroInner}>
              <div className={styles.heroGlassBadge}>
                <span>ATU KOŠICE / MLÁDEŽ</span>
              </div>

              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Poď hrať florbal</h1>

                <p className={styles.heroText}>
                  Pridaj sa k ATU Košice a vyskúšaj si tréning v kvalitnom klubovom
                  prostredí s osobným prístupom.
                </p>

                <div className={styles.heroActions}>
                  <a href="#kontakt" className={styles.primaryButton}>
                    Chcem skúsiť tréning
                  </a>
                  <a href="#kategorie" className={styles.secondaryButton}>
                    Pozrieť kategórie
                  </a>
                </div>
              </div>

              <div className={styles.heroMiniInfo}>
                <div className={styles.heroMiniCard}>
                  <strong>Skúsiť bez záväzku</strong>
                  <span>1. mesiac bez poplatku</span>
                </div>

                <div className={styles.heroMiniCard}>
                  <strong>Správna kategória</strong>
                  <span>Pomôžeme zaradiť dieťa</span>
                </div>

                <div className={styles.heroMiniCard}>
                  <strong>Pre ročníky</strong>
                  <span>2009 a mladší</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Prečo ATU</h2>
          </div>

          <BenefitsCarouselSection items={benefits} />
        </section>


        <section id="kategorie" className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Kategórie</h2>
          </div>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => {
            const content = CATEGORY_CONTENT[category.slug];

            return (
              <Link
                key={category.id}
                href={content?.href || "/kategorie"}
                className={styles.categoryCard}
              >
                <div className={styles.categoryTop}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  <span className={styles.categoryMeta}>
                    ročníky {Math.min(category.birth_year_from, category.birth_year_to)} –{" "}
                    {Math.max(category.birth_year_from, category.birth_year_to)}
                  </span>
                </div>

                <p className={styles.categoryText}>
                  {content?.text || "Viac informácií o kategórii nájdeš po rozkliknutí."}
                </p>

                <div className={styles.categoryArrow}>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
        </section>

        

        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>FAQ</span>
            <h2 className={styles.sectionTitle}>Časté otázky</h2>
          </div>
          <div className={styles.faqList}>
          {faqItems.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span className={styles.faqQuestionText}>{item.question}</span>
                <span className={styles.faqChevron}>+</span>
              </summary>

              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
        </section>

       <section id="kontakt" className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>KONTAKT</span>
          <h2 className={styles.sectionTitle}>Príďte si vyskúšať tréning</h2>
        </div>

        <RecruitmentForm />
      </section>
      </div>

      <Footer />
    </main>
  );
}