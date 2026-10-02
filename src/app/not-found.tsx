import Image from "next/image";
import Link from "next/link";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Aurora from "@/app/components/Aurora";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <div className={styles.shell}>
        <Header />

        <main className={styles.page}>
          <div className={styles.auroraBackground} aria-hidden="true">
            <Aurora
              colorStops={["#15181d", "#4a4f59", "#23272d"]}
              blend={0.78}
              amplitude={1.2}
              speed={1.08}
            />
          </div>

          <div className={styles.auroraShade} aria-hidden="true" />

          <div className={styles.logoWatermark} aria-hidden="true">
            <Image
              src="/logo/znak_atu_nove.svg"
              alt=""
              width={1200}
              height={1200}
              priority
            />
          </div>

          <section className={styles.section}>
            <div className={styles.content}>
              <div className={styles.codeRow}>
                <span className={styles.codeLine} />
                <span className={styles.code}>404</span>
                <span className={styles.codeLine} />
              </div>

              <h1>
                <span>Stránka sa</span>
                <span>nenašla</span>
              </h1>

              <p>
                Ospravedlňujeme sa, ale stránka alebo článok, ktorý hľadáte,
                neexistuje alebo bol presunutý.
              </p>

              <div className={styles.actions}>
                <Link href="/" className={styles.primaryButton}>
                  <span>Späť na domov</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>

                <Link href="/clanky" className={styles.secondaryButton}>
                  Zobraziť články
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className={styles.footerWrap}>
        <Footer />
      </div>
    </>
  );
}
