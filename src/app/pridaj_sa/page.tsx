import Link from "next/link";
import BenefitsCarouselSection from "./BenefitsCarouselSection";
import styles from "./pridaj_sa.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const benefits = [
  {
    title: "Osobný prístup",
    text: "Každé dieťa vnímame individuálne.",
  },
  {
    title: "Mladí tréneri",
    text: "Aktívni, hrajúci a blízki dnešnej hre.",
  },
  {
    title: "Dobrá partia",
    text: "Deti sa u nás cítia prirodzene a bezpečne.",
  },
  {
    title: "Rozvoj",
    text: "Pohyb, technika, disciplína aj návyky.",
  },
  {
    title: "Klubové prostredie",
    text: "Poriadok, systém a kvalitné fungovanie.",
  },
  {
    title: "Prvý tréning zdarma",
    text: "Najprv skúsiť, potom sa rozhodnúť.",
  },
];

const steps = [
  {
    step: "01",
    title: "Napíšete nám",
    text: "Krátko sa ozvete a poradíme.",
  },
  {
    step: "02",
    title: "Prídete skúsiť tréning",
    text: "Dieťa si všetko pozrie priamo v hale.",
  },
  {
    step: "03",
    title: "Zaradíme ho správne",
    text: "Pomôžeme vybrať vhodnú kategóriu.",
  },
];

const categories = [
  {
    title: "Prípravka",
    age: "Začíname hravo",
    text: "Pohyb, koordinácia a prvé návyky.",
    href: "/kategorie/pripravky",
  },
  {
    title: "Mladší žiaci",
    age: "Základy hry",
    text: "Technika, tímovosť a športový rast.",
    href: "/kategorie/mladsi_ziaci",
  },
  {
    title: "Starší žiaci",
    age: "Vyššie tempo",
    text: "Viac zodpovednosti, hry a rozvoja.",
    href: "/kategorie/starsi_ziaci",
  },
  {
    title: "Dorast",
    age: "Výkon aj partia",
    text: "Súťaž, progres a silné klubové prostredie.",
    href: "/kategorie/dorast",
  },
];

const trustPoints = [
  "Dlhodobá práca s deťmi a mládežou",
  "Tréneri, ktorí florbal reálne hrajú",
  "Dôraz na atmosféru aj progres",
];

const faqItems = [
  {
    question: "Môže prísť aj dieťa bez skúseností?",
    answer:
      "Áno. Veľa detí začína úplne od nuly. Dôležitá je chuť hýbať sa a skúsiť niečo nové.",
  },
  {
    question: "Čo si treba priniesť na prvý tréning?",
    answer:
      "Stačí športové oblečenie, halové tenisky a fľaša s vodou. Ostatné vám vysvetlíme.",
  },
  {
    question: "Je prvý tréning zadarmo?",
    answer:
      "Áno. Dieťa si môže tréning najprv vyskúšať bez poplatku a bez záväzku.",
  },
  {
    question: "Koľko stojí členstvo?",
    answer: "Členský poplatok je 150 € na pol roka.",
  },
  {
    question: "Ako vybrať správnu kategóriu?",
    answer:
      "Napíšte nám vek dieťaťa a my vás nasmerujeme na správnu kategóriu.",
  },
  {
    question: "Ako sa prihlásiť alebo ozvať?",
    answer:
      "Najjednoduchšie je poslať meno a email. Následne sa vám ozveme.",
  },
];

export default function PridajSaPage() {
  return (
    <main className={styles.pageContainer}>
      <Header />

      <div className={styles.content}>
        <section className={styles.heroSection}>
          <div className={styles.heroCard}>
            <div className={styles.heroMain}>
              <div className={styles.heroTop}>
                <p className={styles.heroEyebrow}>ATU KOŠICE / MLÁDEŽ</p>

                <h1 className={styles.heroTitle}>Poď hrať florbal</h1>

                <p className={styles.heroText}>
                  Pridaj sa k ATU Košice a vyskúšaj si tréning v kvalitnom
                  klubovom prostredí s osobným prístupom.
                </p>
              </div>

              <div className={styles.heroBottom}>
                <div className={styles.heroActions}>
                  <a href="#kontakt" className={styles.primaryButton}>
                    Chcem skúsiť tréning
                  </a>
                  <a href="#kategorie" className={styles.secondaryButton}>
                    Pozrieť kategórie
                  </a>
                </div>

                <div className={styles.heroMiniInfo}>
                  <div className={styles.heroMiniCard}>
                    <strong>Tréningy</strong>
                    <span>1. mesiac bez poplatku</span>
                  </div>

                  <div className={styles.heroMiniCard}>
                    <strong>Členské</strong>
                    <span>150 € / polrok</span>
                  </div>

                  <div className={styles.heroMiniCard}>
                    <strong>Pre koho</strong>
                    <span>2009 a starší</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.heroVisualCard}>
                <img
                  src="/images/nabor-hero.jpg"
                  alt="Deti na tréningu ATU Košice"
                  className={styles.heroVisualImage}
                />
                <div className={styles.heroVisualOverlay} />

                <div className={styles.heroVisualTopBadge}>
                  <span>ATU Košice</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    <section className={styles.sectionContainer}>
      <BenefitsCarouselSection
        title="Prečo ATU"
        benefits={benefits}
      />
    </section>
        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>JEDNODUCHO</span>
            <h2 className={styles.sectionTitle}>Ako to funguje</h2>
          </div>

          <div className={styles.stepsRow}>
            {steps.map((item) => (
              <article key={item.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="kategorie" className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>KATEGÓRIE</span>
            <h2 className={styles.sectionTitle}>Kam môže dieťa patriť</h2>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <article key={category.title} className={styles.categoryCard}>
                <div className={styles.categoryTop}>
                  <span className={styles.categoryBadge}>{category.age}</span>
                  <h3>{category.title}</h3>
                </div>

                <p>{category.text}</p>

                <Link href={category.href} className={styles.inlineLink}>
                  Prejsť na kategóriu
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>PRÍSTUP KLUBU</span>
            <h2 className={styles.sectionTitle}>Na čom si dávame záležať</h2>
          </div>

          <div className={styles.trustLayout}>
            <div className={styles.trustMain}>
              <p className={styles.trustLead}>
                Chceme, aby sa dieťa zlepšovalo, cítilo sa dobre v kolektíve a
                malo okolo seba ľudí, ktorí mu pomôžu rásť.
              </p>

              <div className={styles.trustList}>
                {trustPoints.map((point) => (
                  <div key={point} className={styles.trustListItem}>
                    <span className={styles.trustDot} />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.trustSide}>
              <div className={styles.trustPanel}>
                <h3>Zábava aj systém</h3>
                <p>Tréning má energiu, ale aj poriadok a jasný cieľ.</p>
              </div>

              <div className={styles.trustPanel}>
                <h3>Klubové prostredie</h3>
                <p>Nejde len o tréning. Dôležité je aj to, ako klub funguje.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>PRAKTICKY</span>
            <h2 className={styles.sectionTitle}>Čo potrebujete vedieť</h2>
          </div>

          <div className={styles.infoLayout}>
            <div className={styles.infoColumn}>
              <article className={styles.infoCard}>
                <h3>Prvý tréning</h3>
                <p>Prvý tréning je zadarmo. Najprv skúsite, potom sa rozhodnete.</p>
              </article>

              <article className={styles.infoCard}>
                <h3>Členstvo</h3>
                <p>Členský poplatok je 150 € na pol roka.</p>
              </article>
            </div>

            <div className={styles.infoColumn}>
              <article className={styles.infoCardHighlight}>
                <h3>Čo si priniesť</h3>
                <p>Športové oblečenie, halové tenisky a fľašu s vodou.</p>
              </article>

              <article className={styles.infoCard}>
                <h3>Neistá kategória?</h3>
                <p>Napíšte nám a pomôžeme vás nasmerovať správne.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>FAQ</span>
            <h2 className={styles.sectionTitle}>Časté otázky</h2>
          </div>

          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <article key={item.question} className={styles.faqItem}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="kontakt" className={styles.sectionContainer}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaText}>
              <span className={styles.preTitle}>KONTAKT</span>
              <h2 className={styles.sectionTitle}>Príďte si vyskúšať tréning</h2>
              <p>
                Stačí poslať meno a email. Ozveme sa vám a poradíme, ako začať.
              </p>

              <div className={styles.contactBox}>
                <div>
                  <strong>Meno trénera</strong>
                  <span>kontakt@email.sk</span>
                </div>
              </div>
            </div>

            <form className={styles.ctaForm}>
              <div className={styles.formField}>
                <label htmlFor="name">Meno</label>
                <input id="name" type="text" placeholder="Vaše meno" />
              </div>

              <div className={styles.formField}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="vas@email.sk" />
              </div>

              <button type="button" className={styles.primaryButton}>
                Chcem skúsiť tréning
              </button>
            </form>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}