import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.section}>
          <div className={styles.card}>
            <span className={styles.code}>404</span>
            <h1>Stránka sa nenašla</h1>
            <p>
              Ospravedlňujeme sa, ale stránka alebo článok, ktorý hľadáte,
              neexistuje alebo bol presunutý.
            </p>

            <div className={styles.actions}>
              <Link href="/" className={styles.primaryButton}>
                Späť na domov
              </Link>
              <Link href="/clanky" className={styles.secondaryButton}>
                Zobraziť články
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}