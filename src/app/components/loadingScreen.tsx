import styles from "./loadingScreen.module.css";

type LoadingScreenProps = {
  text?: string;
};

export default function LoadingScreen({
  text = "Načítava sa obsah...",
}: LoadingScreenProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h1 className={styles.title}>ATU KOŠICE</h1>
        <p className={styles.text}>{text}</p>

        <div className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}