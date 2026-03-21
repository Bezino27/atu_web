import styles from "./novinky.module.css";

const novinky = [
  {
    id: 1,
    title: "Výhra proti Florku 5:3",
    image: "/images/news1.jpg",
  },
  {
    id: 2,
    title: "Nová posila do tímu",
    image: "/images/news2.jpg",
  },
  {
    id: 3,
    title: "Príprava na play-off",
    image: "/images/news3.jpg",
  },
];

export default function Novinky() {
  return (
    <section className={styles.novinkySection}>
      <div className={styles.container}>
        
        <h2 className={styles.title}>Novinky</h2>

        <div className={styles.grid}>
          {novinky.map((item) => (
            <div key={item.id} className={styles.card}>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}