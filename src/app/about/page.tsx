import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "O klube | ATU Košice",
  description:
    "Spoznajte florbalový klub ATU Košice. Naša identita, hodnoty, vízia, tréningový prístup a komunita.",
};

const values = [
  {
    number: "01",
    title: "Tímovosť",
    text: "Veríme, že úspech vzniká zo spolupráce, dôvery a vzájomnej podpory na ihrisku aj mimo neho.",
  },
  {
    number: "02",
    title: "Disciplína",
    text: "Budujeme návyky, zodpovednosť a prístup, ktoré posúvajú hráčov v športe aj v osobnom živote.",
  },
  {
    number: "03",
    title: "Rozvoj",
    text: "Každý hráč má priestor rásť – technicky, fyzicky, mentálne aj charakterovo.",
  },
  {
    number: "04",
    title: "Reprezentácia klubu",
    text: "Chceme reprezentovať Košice a náš klub s rešpektom, energiou a hrdosťou.",
  },
];

const pillars = [
  {
    title: "Kvalitný tréningový proces",
    text: "Na tréningoch sa zameriavame na techniku, herné situácie, kondíciu, rýchlosť a rozhodovanie v zápasových momentoch.",
  },
  {
    title: "Silná klubová kultúra",
    text: "Chceme, aby ATU Košice nebol len tím, ale prostredie, kde sa hráči cítia dobre, bezpečne a motivovane.",
  },
  {
    title: "Práca s mládežou",
    text: "Podporujeme mladých hráčov a vytvárame im priestor, aby sa postupne rozvíjali a našli si vzťah k športu aj tímu.",
  },
  {
    title: "Dlhodobá vízia",
    text: "Naším cieľom je rozvíjať klub stabilne, moderne a tak, aby mal pevné miesto v košickom aj slovenskom florbale.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroInner}>
              <span className={styles.eyebrow}>O klube</span>
              <h1>ATU Košice je viac než len florbalový tím</h1>
              <p className={styles.heroText}>
                Sme komunita hráčov, trénerov, fanúšikov a ľudí, ktorí veria v
                silu športu, tímového ducha a poctivej práce. Naším cieľom je
                budovať kvalitný florbalový klub, ktorý rozvíja hráčov a zároveň
                vytvára silnú identitu v Košiciach.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.statCard}>
                  <strong>1 klub</strong>
                  <span>jedna identita a spoločný smer</span>
                </div>
                <div className={styles.statCard}>
                  <strong>100%</strong>
                  <span>nasadenie v tréningu aj zápase</span>
                </div>
                <div className={styles.statCard}>
                  <strong>Košice</strong>
                  <span>mesto, ktoré reprezentujeme s hrdosťou</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.introGrid}>
              <div className={styles.introCardDark}>
                <span className={styles.cardLabel}>Kto sme</span>
                <h2>Klub postavený na charaktere a energii</h2>
                <p>
                  ATU Košice je florbalový klub, ktorý spája športovú ambíciu,
                  poctivú prácu a komunitného ducha. Chceme vytvárať prostredie,
                  v ktorom sa hráči učia nielen vyhrávať, ale aj spolupracovať,
                  rešpektovať ostatných a neustále na sebe pracovať.
                </p>
              </div>

              <div className={styles.introCardLight}>
                <span className={styles.cardLabelLight}>Naša vízia</span>
                <h2>Moderný a stabilný klub pre súčasných aj budúcich hráčov</h2>
                <p>
                  Našou ambíciou je budovať klub, ktorý má jasnú identitu,
                  kvalitné zázemie a dlhodobú víziu. Chceme byť miestom, kde
                  mladí aj dospelí hráči nájdu priestor na rast, výkonnosť aj
                  radosť z hry.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrowDark}>Naše hodnoty</span>
              <h2>Na čom stojí ATU Košice</h2>
              <p>
                Hodnoty klubu ovplyvňujú náš prístup k tréningom, zápasom,
                komunikácii aj rozvoju hráčov.
              </p>
            </div>

            <div className={styles.valuesGrid}>
              {values.map((value) => (
                <article key={value.number} className={styles.valueCard}>
                  <div className={styles.valueNumber}>{value.number}</div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Ako fungujeme</span>
              <h2>Štyri piliere fungovania klubu</h2>
              <p>
                Budovanie kvalitného klubu nestojí iba na výsledkoch, ale aj na
                každodennej práci a dlhodobom smerovaní.
              </p>
            </div>

            <div className={styles.pillarsGrid}>
              {pillars.map((pillar) => (
                <div key={pillar.title} className={styles.pillarCard}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.storyBox}>
              <div className={styles.storyContent}>
                <span className={styles.storyLabel}>Klubová identita</span>
                <h2>Florbal, komunita a reprezentácia Košíc</h2>
                <p>
                  Veríme, že šport má silu formovať ľudí. Preto chceme, aby
                  každý hráč v ATU Košice cítil, že je súčasťou niečoho väčšieho
                  – tímu, ktorý má energiu, smer a hodnoty. Naša identita nie je
                  iba o logu alebo drese. Je o prístupe, práci a tom, ako sa
                  správame na ihrisku aj mimo neho.
                </p>
                <p>
                  Chceme, aby klub rástol spolu s ľuďmi, ktorí ho tvoria. Preto
                  sa sústredíme na športový progres, moderný prístup a kvalitné
                  prostredie pre všetkých, ktorí chcú byť súčasťou ATU Košice.
                </p>
              </div>

              <div className={styles.storyAside}>
                <div className={styles.quoteCard}>
                  <p>
                    „Nechceme byť len tímom, ktorý hrá zápasy. Chceme byť klubom,
                    ktorý vytvára hodnotu pre hráčov aj komunitu.“
                  </p>
                </div>

                <div className={styles.miniInfo}>
                  <span>ATU Košice</span>
                  <strong>Florbalový klub s víziou</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaBox}>
              <span className={styles.ctaEyebrow}>Pridaj sa k nám</span>
              <h2>Chceš byť súčasťou ATU Košice?</h2>
              <p>
                Radi privítame nových hráčov, fanúšikov aj ľudí, ktorí chcú byť
                súčasťou florbalovej komunity v Košiciach.
              </p>

              <div className={styles.ctaButtons}>
                <a href="mailto:info@atukosice.sk" className={styles.ctaPrimary}>
                  Kontaktovať klub
                </a>
                <a href="" className={styles.ctaSecondary}>
                  Späť na hlavnú stránku
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}