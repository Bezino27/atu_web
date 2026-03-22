import styles from "../../styles/najlepsi_hrac.module.css";

const player = {
  number: 77,
  name: "Ondrej Duda",
  position: "Útočník",
  goals: 12,
  assists: 7,
  shotAcc: "81%",
};

export default function TopPlayer() {
  return (
<div className={styles.mvpCard}>
  {/* Horná časť: Číslo a Text oddelene */}
  <div className={styles.topSection}>
    <div className={styles.numberBox}>
      <span className={styles.bigNumber}>77</span>
    </div>
    
    <div className={styles.infoBox}>
      <span className={styles.mvpTitle}>MVP</span>
      <h2 className={styles.playerName}>Ondrej Duda</h2>
      <span className={styles.playerPosition}>Útočník</span>
    </div>
  </div>

  {/* Štatistiky - teraz majú viac priestoru */}
  <div className={styles.statsGrid}>
    <div className={styles.statBox}>
      <span className={styles.statValue}>12</span>
      <span className={styles.statLabel}>Góly</span>
    </div>
    
    <div className={styles.statBox}>
      <span className={styles.statValue}>7</span>
      <span className={styles.statLabel}>Asistencie</span>
    </div>
    
    <div className={styles.statBox}>
      <span className={styles.statValue}>81%</span>
      <span className={styles.statLabel}>Úsp. striel</span>
    </div>
  </div>
</div>
  );
}