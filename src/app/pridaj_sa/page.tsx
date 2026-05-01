import Link from "next/link";
import Image from "next/image";
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
    text: "Aktívni, hrajúci hráči, kamarátski k deťom.",
  },
  {
    id: 3,
    title: "Dobrá partia",
    text: "Priateľské vzťahy medzi deťmi.",
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
    text: "Možnosť vyskúšať si florbal.",
  },
];

type BackendCategory = {
  id: number;
  name: string;
  slug?: string | null;
  season?: string | null;
  description?: string | null;
  birth_year_from: number;
  birth_year_to: number;
  order?: number;
  is_active?: boolean;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
};

type FaqItem = {
  question: string;
  answer: string | string[];
};

function createSlugFromName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function getCategorySlug(category: BackendCategory) {
  return category.slug || createSlugFromName(category.name);
}

function getCategoryHref(category: BackendCategory) {
  return `/kategorie/${getCategorySlug(category)}`;
}

function getCategoryYears(category: BackendCategory) {
  const minYear = Math.min(category.birth_year_from, category.birth_year_to);
  const maxYear = Math.max(category.birth_year_from, category.birth_year_to);

  return `ročníky ${minYear} – ${maxYear}`;
}

async function getCategories(): Promise<BackendCategory[]> {
  try {
    const res = await fetch(`${API_URL}/public/teams/atu-kosice/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

const faqItems: FaqItem[] = [
  {
    question: "Môže prísť aj dieťa bez skúseností?",
    answer:
      "Áno, veľa detí začína úplne od nuly. Dôležitá je chuť hýbať sa a skúsiť niečo nové.",
  },
  {
    question: "Čo si treba priniesť na prvý tréning?",
    answer:
      "Stačí športové oblečenie, halové tenisky a fľaša s vodou. Hokejku a okuliare si môžete požičať.",
  },
  {
    question: "Je prvý tréning zadarmo?",
    answer:
      "Áno, dieťa si môže tréning vyskúšať bez poplatku a bez záväzku.",
  },
  {
    question: "Koľko stojí členstvo?",
    answer: "Členský poplatok je 150 € na pol roka.",
  },
  {
    question: "Kedy a kde sú tréningy?",
    answer: [
      "Prípravka: utorok a piatok o 15:00, Jedlíkova 7.",
      "Mladší žiaci: pondelok a streda o 15:00, Jedlíkova 7.",
      "Starší žiaci: utorok a streda o 17:00, SOŠ Ostrovského; štvrtok o 15:00, Jedlíkova 7.",
      "Dorast: utorok a streda o 18:30, SOŠ Ostrovského; štvrtok o 16:30, Jedlíkova 7.",
    ],
  },
  {
    question: "Ako vybrať správnu kategóriu?",
    answer:
      "Kategória sa vyberá najmä podľa ročníka narodenia dieťaťa. Vyberte si kategóriu podľa zoznamu na stránke, kde sú pri každej kategórii uvedené ročníky narodenia. Ak si nie ste istí, napíšte nám vek alebo ročník narodenia dieťaťa a my vás nasmerujeme na správnu skupinu.",
  },
  {
    question: "Ako sa prihlásiť alebo ozvať?",
    answer: "Použite formulár a my sa vám následne ozveme.",
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
            <Image
              src="/images/nabor-hero.jpg"
              alt="Deti na tréningu ATU Košice"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
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
                  Pridaj sa k ATU Košice a vyskúšaj si tréning v kvalitnom
                  klubovom prostredí s osobným prístupom.
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

          {categories.length > 0 ? (
            <div className={styles.categoriesGrid}>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={getCategoryHref(category)}
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryTop}>
                    <h3 className={styles.categoryTitle}>{category.name}</h3>

                    <span className={styles.categoryMeta}>
                      {getCategoryYears(category)}
                    </span>
                  </div>

                  <p className={styles.categoryText}>
                    {category.description?.trim() ||
                      "Viac informácií o kategórii nájdeš po rozkliknutí."}
                  </p>

                  <div className={styles.categoryArrow}>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>
              Momentálne nie sú dostupné žiadne kategórie.
            </p>
          )}
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
                  <span className={styles.faqQuestionText}>
                    {item.question}
                  </span>
                  <span className={styles.faqChevron}>+</span>
                </summary>

                <div className={styles.faqAnswer}>
                  {Array.isArray(item.answer) ? (
                    <div className={styles.faqAnswerList}>
                      {item.answer.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="kontakt" className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>KONTAKT</span>
            <h2 className={styles.sectionTitle}>
              Príďte si vyskúšať tréning
            </h2>
          </div>

          <RecruitmentForm />
        </section>
      </div>

      <Footer />
    </main>
  );
}