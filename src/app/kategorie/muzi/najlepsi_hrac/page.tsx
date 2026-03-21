import styles from "./najlepsi_hrac.module.css";

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
    <div className={styles.card}>
      <div className={styles.accentLine} />

      <div className={styles.header}>
        <div className={styles.headerBar} />
        <span className={styles.headerText}>Najlepší hráč</span>
      </div>

      <div className={styles.bigNumber}>{player.number}</div>

      <div className={styles.info}>
        <span className={styles.playerName}>{player.name}</span>
        <span className={styles.playerPosition}>{player.position}</span>
      </div>

      <div className={styles.mvpBadge}>
        <div className={styles.mvpDot} />
        <span className={styles.mvpText}>Hviezda sezóny</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.stats}>
        {[
          { label: "Góly", value: player.goals, accent: true },
          { label: "Asistencie", value: player.assists, accent: false },
          { label: "Úsp. striel.", value: player.shotAcc, accent: true },
        ].map((s, i) => (
          <div key={i} className={styles.stat}>
            <div className={`${styles.statValue} ${s.accent ? styles.statValueAccent : styles.statValueNeutral}`}>
              {s.value}
            </div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}