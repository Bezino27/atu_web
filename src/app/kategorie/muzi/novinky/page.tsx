import styles from "./novinky.module.css";
import Image from "next/image";

const novinky = [
  {
    id: 1,
    category: "Hlavná udalosť",
    title: "ATU Košice mieri do play-off. Klub žije florbalom a čaká nás veľký záver sezóny",
    description: "A-tím zvládol dôležitú časť sezóny, mládež pokračuje vo výborných výkonoch a fanúšikov čakajú rozhodujúce zápasy.",
    image: "/images/news_hero.jpg",
    date: "20. marec 2026",
    isHero: true,
  },
  {
    id: 2,
    category: "Výsledok",
    title: "Výhra proti Florku 5:3",
    description: "Skvelý zápas, ATU Košice vyhrali 5:3.",
    image: "/images/news1.jpg",
    date: "25. marec 2026",
  },
  {
    id: 3,
    category: "Prestup",
    title: "Nová posila do tímu",
    description: "Prichádza talentovaný hráč zo zahraničia.",
    image: "/images/news2.jpg",
    date: "20. marec 2026",
  },
  {
    id: 4,
    category: "Tréning",
    title: "Príprava na play-off",
    description: "Tím intenzívne trénuje pred nadchádzajúcimi zápasmi.",
    image: "/images/news3.jpg",
    date: "18. marec 2026",
  },
];

export default function Novinky() {
  const heroNews = novinky.find(n => n.isHero);
  const otherNews = novinky.filter(n => !n.isHero);

  return (
    <section className={styles.novinkySection}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
        <span className={styles.preTitle}>AKTUÁLNE DIANIE</span>
         <h2 className={styles.mainTitle}>Najnovejšie a najdôležitejšie články</h2>
        </div>
        {/* HERO CARD */}
        {heroNews && (
          <div className={styles.heroCard}>
            <div className={styles.imageWrapper}>
              <Image src={heroNews.image} alt={heroNews.title} fill className={styles.img} priority />
              <div className={styles.heroOverlay}>
                <div className={styles.metaRow}>
                  <span className={styles.badge}>{heroNews.category}</span>
                  <span className={styles.dateText}>{heroNews.date}</span>
                </div>
                <h1 className={styles.heroTitle}>{heroNews.title}</h1>
                <p className={styles.heroDescription}>{heroNews.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* GRID CARDS */}
        <div className={styles.grid}>
          {otherNews.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={item.image} alt={item.title} fill className={styles.img} />
                <div className={styles.cardOverlay}>
                  <div className={styles.metaRowSmall}>
                    <span className={styles.badgeSmall}>{item.category}</span>
                    <span className={styles.dateTextSmall}>{item.date}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}