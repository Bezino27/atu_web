"use client";

import {
  type CSSProperties,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./BenefitsCarousel.module.css";

type BenefitIconType =
  | "individual"
  | "coach"
  | "community"
  | "growth"
  | "family"
  | "team"
  | "gift";

type WhyAtuItem = {
  id: number;
  title: string;
  text: string;

  image?: string;
  imageAlt?: string;
  imagePosition?: string;

  icon?: BenefitIconType;
  themeTag?: string;
};

type WhyAtuCarouselProps = {
  items: WhyAtuItem[];
  preTitle?: string;
  title?: string;
};

type BenefitPresentation = {
  image: string;
  imageAlt: string;
  imagePosition: string;
  icon: BenefitIconType;
  themeTag?: string;
};

const NEW_BENEFIT: WhyAtuItem = {
  id: 7007,
  title: "Spolu vyhrávame, spolu prehrávame",
  text: "Učíme sa zvládať výhry aj prehry ako jeden tím.",
  image: "/benefits/spoluprehra.jpg",
  imageAlt: "Hráči ATU spoločne po zápase",
  imagePosition: "50% 50%",
  icon: "team",
};

const BENEFIT_PRESENTATION: Record<string, BenefitPresentation> = {
  "osobný prístup": {
    image: "/benefits/malykidi.jpg",
    imageAlt: "Individuálny prístup k mladému hráčovi ATU",
    imagePosition: "50% 45%",
    icon: "individual",
  },

  "mladí tréneri": {
    image: "/benefits/mladytreneri.jpg",
    imageAlt: "Mladí tréneri ATU s deťmi",
    imagePosition: "50% 42%",
    icon: "coach",
  },

  "dobrá partia": {
    image: "/benefits/tím.jpg",
    imageAlt: "Tím a dobrá partia v ATU",
    imagePosition: "50% 48%",
    icon: "community",
  },

  rozvoj: {
    image: "/benefits/kikokendy.jpg",
    imageAlt: "Rozvoj mladého florbalistu ATU",
    imagePosition: "50% 42%",
    icon: "growth",
  },

  "klubové prostredie": {
    image: "/benefits/rodina.jpg",
    imageAlt: "Klubové a rodinné prostredie ATU",
    imagePosition: "50% 44%",
    icon: "family",
    themeTag: "#ATURODINA",
  },

  "rodinné prostredie": {
    image: "/benefits/rodina.jpg",
    imageAlt: "Klubové a rodinné prostredie ATU",
    imagePosition: "50% 44%",
    icon: "family",
    themeTag: "#ATURODINA",
  },

  "prvý tréning zdarma": {
    image: "/benefits/zadarmo.jpg",
    imageAlt: "Prvý florbalový tréning v ATU",
    imagePosition: "50% 50%",
    icon: "gift",
  },

  "spolu vyhrávame, spolu prehrávame": {
    image: "/benefits/spoluprehra.jpg",
    imageAlt: "Hráči ATU spoločne po zápase",
    imagePosition: "50% 50%",
    icon: "team",
  },
};

function normalizeTitle(value: string) {
  return value.trim().toLocaleLowerCase("sk-SK");
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

function BenefitIcon({
  type,
}: {
  type: BenefitIconType;
}): ReactNode {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  switch (type) {
    case "individual":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M6.8 19c.55-3.15 2.4-5 5.2-5s4.65 1.85 5.2 5" />
          <circle cx="12" cy="12" r="9" opacity="0.35" />
        </svg>
      );

    case "coach":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M4 19c.45-3.1 2.2-5 5-5 1.65 0 3 .65 3.9 1.8" />
          <path d="M15.5 7.5 20 12l-4.5 4.5" />
          <path d="M19.5 12H13" />
        </svg>
      );

    case "community":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="2.7" />
          <circle cx="5.8" cy="10" r="2.1" />
          <circle cx="18.2" cy="10" r="2.1" />
          <path d="M7.1 19c.4-3.15 2.1-5 4.9-5s4.5 1.85 4.9 5" />
          <path d="M2.6 18.5c.25-2.45 1.45-3.9 3.45-3.9.8 0 1.5.2 2.05.6" />
          <path d="M21.4 18.5c-.25-2.45-1.45-3.9-3.45-3.9-.8 0-1.5.2-2.05.6" />
        </svg>
      );

    case "growth":
      return (
        <svg {...commonProps}>
          <path d="M4 19h4v-4H4v4Z" />
          <path d="M10 19h4v-7h-4v7Z" />
          <path d="M16 19h4V8h-4v11Z" />
          <path d="m5 11 5-5 3 3 6-6" />
          <path d="M15.5 3H19v3.5" />
        </svg>
      );

    case "family":
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="8" r="2.6" />
          <circle cx="16" cy="8" r="2.6" />
          <circle cx="12" cy="12" r="2" />
          <path d="M3.5 19c.3-3.25 1.85-5.1 4.5-5.1 1.2 0 2.2.4 3 1.15" />
          <path d="M20.5 19c-.3-3.25-1.85-5.1-4.5-5.1-1.2 0-2.2.4-3 1.15" />
          <path d="M8.5 19c.25-2.35 1.4-3.7 3.5-3.7s3.25 1.35 3.5 3.7" />
        </svg>
      );

    case "team":
      return (
        <svg {...commonProps}>
          <path d="M8.3 12.5 5.5 9.7a2.3 2.3 0 0 1 3.25-3.25L12 9.7l3.25-3.25a2.3 2.3 0 1 1 3.25 3.25l-2.8 2.8" />
          <path d="m8 12 4 4 4-4" />
          <path d="m6.5 14.5 3 3" />
          <path d="m17.5 14.5-3 3" />
          <path d="M9.5 17.5 12 20l2.5-2.5" />
        </svg>
      );

    case "gift":
      return (
        <svg {...commonProps}>
          <path d="M4 10h16v10H4V10Z" />
          <path d="M12 10v10" />
          <path d="M3 7h18v3H3V7Z" />
          <path d="M12 7H8.7C7.2 7 6 5.95 6 4.7 6 3.75 6.8 3 7.8 3 9.8 3 12 7 12 7Z" />
          <path d="M12 7h3.3C16.8 7 18 5.95 18 4.7 18 3.75 17.2 3 16.2 3 14.2 3 12 7 12 7Z" />
        </svg>
      );

    default:
      return null;
  }
}

export default function WhyAtuCarousel({
  items,
  preTitle,
  title = "Prečo ATU",
}: WhyAtuCarouselProps) {
  const preparedItems = useMemo(() => {
    const decorated = items.map((item) => {
      const presentation =
        BENEFIT_PRESENTATION[normalizeTitle(item.title)];

      return {
        ...item,
        image: item.image ?? presentation?.image,
        imageAlt:
          item.imageAlt ??
          presentation?.imageAlt ??
          item.title,
        imagePosition:
          item.imagePosition ??
          presentation?.imagePosition ??
          "50% 50%",
        icon:
          item.icon ??
          presentation?.icon ??
          "community",
        themeTag:
          item.themeTag ??
          presentation?.themeTag,
      };
    });

    const hasNewBenefit = decorated.some(
      (item) =>
        normalizeTitle(item.title) ===
        normalizeTitle(NEW_BENEFIT.title)
    );

    if (!hasNewBenefit) {
      return [...decorated, NEW_BENEFIT];
    }

    return decorated;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(preparedItems.length / 2)
  );

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const mappedItems = useMemo(() => {
    const total = preparedItems.length;

    return preparedItems.map((item, index) => {
      let offset = index - activeIndex;

      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      return {
        ...item,
        index,
        offset,
        absOffset: Math.abs(offset),
        isActive: offset === 0,
      };
    });
  }, [preparedItems, activeIndex]);

  const goPrev = () => {
    setActiveIndex((prev) =>
      mod(prev - 1, preparedItems.length)
    );
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      mod(prev + 1, preparedItems.length)
    );
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current =
      event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchEndX.current =
      event.changedTouches[0].clientX;

    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const delta =
      touchStartX.current - touchEndX.current;

    if (Math.abs(delta) >= 40) {
      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!preparedItems.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div className="sectionHeader">
          {preTitle ? (
            <span className="preTitle">
              {preTitle}
            </span>
          ) : null}

          <h2 className="sectionTitle">
            {title}
          </h2>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={goPrev}
            aria-label="Predchádzajúca karta"
          >
            <span aria-hidden="true">←</span>
          </button>

          <button
            type="button"
            className={styles.arrowButton}
            onClick={goNext}
            aria-label="Ďalšia karta"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Prečo ATU"
      >
        <div className={styles.stage}>
          {mappedItems.map((item) => {
            const hidden = item.absOffset > 2;

            return (
              <article
                key={item.id}
                className={[
                  styles.card,
                  item.isActive
                    ? styles.cardActive
                    : "",
                  hidden
                    ? styles.cardHidden
                    : "",
                ].join(" ")}
                style={
                  {
                    "--offset": item.offset,
                    "--abs-offset": item.absOffset,
                    "--z-index":
                      40 - item.absOffset,
                  } as CSSProperties
                }
                onClick={() =>
                  handleCardClick(item.index)
                }
                aria-hidden={hidden}
              >
                <div className={styles.cardInner}>
                  <div
                    className={styles.photoLayer}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className={
                          styles.cardImage
                        }
                        style={{
                          objectPosition:
                            item.imagePosition,
                        }}
                        draggable={false}
                      />
                    ) : (
                      <div
                        className={
                          styles.photoFallback
                        }
                        aria-hidden="true"
                      >
                        <img
                          src="/logo/znak_atu_black.svg"
                          alt=""
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className={styles.activeShade}
                    aria-hidden="true"
                  />

                  <div
                    className={
                      styles.cardIndex
                    }
                  >
                    {formatIndex(
                      item.index + 1
                    )}
                  </div>

                  <div
                    className={
                      styles.contentPanel
                    }
                  >
                    <div
                      className={
                        styles.benefitBadge
                      }
                    >
                      <BenefitIcon
                        type={
                          item.icon ??
                          "community"
                        }
                      />
                    </div>

                    <div
                      className={
                        styles.textContent
                      }
                    >
                      <h3
                        className={[
                          styles.cardTitle,
                          item.title.length > 22
                            ? styles.cardTitleLong
                            : "",
                        ].join(" ")}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={
                          styles.cardText
                        }
                      >
                        {item.text}
                      </p>

                      {item.themeTag ? (
                        <span
                          className={
                            styles.themeTag
                          }
                        >
                          {item.themeTag}
                        </span>
                      ) : null}
                    </div>

                    <div
                      className={
                        styles.brandFooter
                      }
                    >
                      <span
                        className={
                          styles.brandName
                        }
                      >
                        ATU
                      </span>

                      <span
                        className={
                          styles.brandDivider
                        }
                        aria-hidden="true"
                      />

                      <span
                        className={
                          styles.brandText
                        }
                      >
                        MLÁDEŽ
                      </span>

                      <img
                        src="/logo/znak_atu_black.svg"
                        alt=""
                        className={
                          styles.brandLogo
                        }
                        aria-hidden="true"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.bottomArea}>
          <div className={styles.bottomRow}>
            <div className={styles.counter}>
              <strong>
                {formatIndex(
                  activeIndex + 1
                )}
              </strong>

              <span>
                {" "}
                /{" "}
                {formatIndex(
                  preparedItems.length
                )}
              </span>
            </div>

            <div
              className={styles.dots}
              aria-label="Navigácia carouselu"
            >
              {preparedItems.map(
                (item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      styles.dot,
                      index === activeIndex
                        ? styles.dotActive
                        : "",
                    ].join(" ")}
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`Prejsť na benefit ${
                      index + 1
                    }`}
                  />
                )
              )}
            </div>
          </div>

          <p className={styles.swipeHint}>
            Potiahni alebo klikni na kartu
          </p>
        </div>
      </div>
    </section>
  );
}
