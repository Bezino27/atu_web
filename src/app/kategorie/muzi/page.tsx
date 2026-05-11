import React from "react";
import styles from "../styles/unified.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./components/nasledujuce_zapasy";
import Image from "next/image";
import Novinky from "./components/novinky";
import TopPlayer from "./components/najlepsi_hrac";
import RecentMatches from "./components/posledne_zapasy";
import Tabulka from "./components/tabulka";
import NextMatchCountdown from "./components/NextMatchCountdown";
import { getSzfbDashboard } from "@/app/lib/szfb";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import { getClubSeason } from "@/app/lib/season";
import { API_URL } from "@/app/lib/api";

type BackendCategory = {
  id: number;
  name: string;
  slug?: string | null;
  season?: string | null;
  description?: string | null;
  birth_year_from: number;
  birth_year_to: number;
  order?: number;
  is_active?: boolean;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
};

const CLUB_SLUG = "atu-kosice";
const CATEGORY_SLUG = "muzi";
const CATEGORY_FALLBACK_NAME = "Muži";
const SZFB_WATCH_ID = 1;

function normalizeText(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function createSlugFromName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function getCategorySlug(category: BackendCategory) {
  return category.slug || createSlugFromName(category.name);
}

function isCurrentCategory(category: BackendCategory) {
  const categorySlug = normalizeText(getCategorySlug(category));
  const categoryName = normalizeText(category.name);

  return (
    categorySlug === CATEGORY_SLUG ||
    categoryName === CATEGORY_SLUG ||
    categoryName === "muzi" ||
    categoryName === "a-tim"
  );
}

function isCurrentCategoryPost(post: Post) {
  const categoryName = normalizeText(post.category?.name);

  return (
    categoryName === "muzi" ||
    categoryName === "a-tim" ||
    categoryName === CATEGORY_SLUG
  );
}

async function getCategories(): Promise<BackendCategory[]> {
  try {
    const res = await fetch(`${API_URL}/public/teams/${CLUB_SLUG}/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export default async function MuziPage() {
  const [szfbDashboard, posts, clubSeason, categories] = await Promise.all([
    getSzfbDashboard(SZFB_WATCH_ID),
    getHomepagePosts(CLUB_SLUG),
    getClubSeason(CLUB_SLUG),
    getCategories(),
  ]);

  const currentCategory = categories.find(isCurrentCategory);
  const categoryName = currentCategory?.name ?? CATEGORY_FALLBACK_NAME;

  const muziPosts = posts.filter(isCurrentCategoryPost);

  const standings = szfbDashboard?.standings ?? [];
  const upcomingMatches = szfbDashboard?.upcoming ?? [];
  const resultMatches = szfbDashboard?.results ?? [];
  const playerStats = szfbDashboard?.player_stats ?? [];

  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName =
    szfbDashboard?.watch?.competition_name || "EXTRALIGA MUŽOV";

  const nextMatch = upcomingMatches[0] ?? null;

  const currentSeason =
    currentCategory?.season ?? clubSeason?.season ?? "2025 / 2026";

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        <section className={styles.heroSection}>
          <div className={styles.bannerContainer}>
            <Image
              src="/images/kategorie/muzi_kader.jpg"
              alt={`ATU Košice ${categoryName}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
              className={styles.heroImg}
            />

            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <span className={styles.heroSubtitle}>
                  Slovenská florbalová extraliga
                </span>

                <h1 className={styles.bannerTitle}>{categoryName}</h1>

                <div className={styles.heroQuickNav}>
                  <a href="#novinky" className={styles.heroQuickLink}>
                    Novinky
                  </a>
                  <a href="#tabulka" className={styles.heroQuickLink}>
                    Tabuľka
                  </a>
                  <a href="#hraci" className={styles.heroQuickLink}>
                    Hráči
                  </a>
                </div>
              </div>

              <div className={styles.heroMiniInfo}>
                <span className={styles.heroMiniLabel}>Sezóna</span>
                <span className={styles.heroMiniValue}>{currentSeason}</span>
              </div>
            </div>
          </div>

          <NextMatchCountdown
            matchDate={nextMatch?.match_date ?? null}
            matchTime={nextMatch?.match_time ?? null}
            opponent={nextMatch?.opponent ?? "Súper bude doplnený"}
            ownTeamName={ownTeamName}
            isHome={nextMatch?.is_home ?? null}
          />
        </section>

        <section id="zapasy" className="sectionContainer">
          <NasledujuceZapasy
            upcomingMatches={upcomingMatches}
            resultMatches={resultMatches}
            ownTeamName={ownTeamName}
            competitionName={competitionName}
          />
        </section>

        <section id="novinky" className="sectionContainer">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">AKTUÁLNE DIANIE</span>
              <h2 className="sectionTitle">
              Najdôležitejšie novinky
            </h2>
            </div>
          </div>

          <Novinky posts={muziPosts} />
        </section>

        {/* # OVERVIEW */}
        <section id="tabulka" className="overviewSection">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">Liga</span>
              <h2 className="sectionTitle">Výsledky</h2>
            </div>
          </div>

          <div className={styles.overviewGrid}>
            <div className={styles.tableColumn}>
              <Tabulka standings={standings} ownTeamName={ownTeamName} />
            </div>

            <div className={styles.matchesColumn}>
              <RecentMatches
                results={resultMatches}
                ownTeamName={ownTeamName}
              />
            </div>
          </div>
        </section>

        <section id="hraci" className="bottomSection">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">Štatistiky tímu</span>
              <h2 className="sectionTitle">Lídri sezóny</h2>
            </div>
          </div>

          <TopPlayer players={playerStats} />
        </section>
      </main>

      <Footer />
    </div>
  );
}