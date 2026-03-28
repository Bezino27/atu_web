import styles from "../../styles/najlepsi_hrac.module.css";
import categoriesStyles from "../../styles/kategorie.module.css";
const topScorers = [
  {
    id: 1,
    number: 77,
    name:"Kamil Navrátil ",
    position: "Útočník",
    goals: 114,
    assists: 0,
    points: 114,
  },
  {
    id: 2,
    number: 9,
    name: "Marek Novák",
    position: "Útočník",
    goals: 10,
    assists: 6,
    points: 16,
  },
  {
    id: 3,
    number: 21,
    name: "Peter Kováč",
    position: "Krídlo",
    goals: 8,
    assists: 5,
    points: 13,
  },
];

const mostPenalized = {
  number: 11,
  name: "Jozef lovas",
  position: "Obranca",
  penaltyMinutes: 42,
  penalties: 22,
};

export default function TopPlayer() {
  const [leader, second, third] = topScorers;

  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Štatistiky tímu</span>
        <h2 className={categoriesStyles.sectionTitle}>Lídri sezóny</h2>
      </div>

      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <article className={styles.mainCard}>


            <div className={styles.mainTop}>
              <div className={styles.numberBlock}>
                <span className={styles.bigNumber}>{leader.number}</span>
              </div>

              <div className={styles.playerInfo}>
                <span className={styles.playerTag}>Najproduktívnejší hráč</span>
                <h3 className={styles.playerName}>{leader.name}</h3>
                <p className={styles.playerPosition}>{leader.position}</p>
              </div>
            </div>

            <div className={styles.mainStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{leader.points}</span>
                <span className={styles.statLabel}>Body</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{leader.goals}</span>
                <span className={styles.statLabel}>Góly</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{leader.assists}</span>
                <span className={styles.statLabel}>Asistencie</span>
              </div>
            </div>
          </article>

          <div className={styles.smallCards}>
            {[second, third].map((player, ) => (
              <article key={player.id} className={styles.smallCard}>
                <div className={styles.smallHeader}>
             
                </div>

                <div className={styles.smallNumber}>{player.number}</div>
                <h3 className={styles.smallName}>{player.name}</h3>
                <p className={styles.smallPosition}>{player.position}</p>

                <div className={styles.smallStats}>
                  <div>
                    <span className={styles.smallStatValue}>{player.points}</span>
                    <span className={styles.smallStatLabel}>Body</span>
                  </div>
                  <div>
                    <span className={styles.smallStatValue}>{player.goals}</span>
                    <span className={styles.smallStatLabel}>G</span>
                  </div>
                  <div>
                    <span className={styles.smallStatValue}>{player.assists}</span>
                    <span className={styles.smallStatLabel}>A</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={styles.penaltyCard}>
          <div className={styles.penaltyHeader}>
            <span className={styles.penaltyBadge}>Najvylučovanejší hráč</span>
          </div>

          <div className={styles.penaltyNumber}>{mostPenalized.number}</div>
          <h3 className={styles.penaltyName}>{mostPenalized.name}</h3>
          <p className={styles.penaltyPosition}>{mostPenalized.position}</p>

          <div className={styles.penaltyStats}>
            <div className={styles.penaltyStatBox}>
              <span className={styles.penaltyStatValue}>
                {mostPenalized.penaltyMinutes}
              </span>
              <span className={styles.penaltyStatLabel}>Trestné minúty</span>
            </div>

            <div className={styles.penaltyStatBox}>
              <span className={styles.penaltyStatValue}>
                {mostPenalized.penalties}
              </span>
              <span className={styles.penaltyStatLabel}>Vylúčenia</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}