import styles from "./o-klube.module.css";

type MedalType = "gold" | "silver" | "bronze";

type MedalItem = {
  count: string;
  seasons: string[];
  type: MedalType;
};

type Group = {
  title: string;
  items: MedalItem[];
};

const achievementGroups: Group[] = [
  {
    title: "Muži",
    items: [
      {
        count: "1x",
        seasons: ["2015/16"],
        type: "gold",
      },
      {
        count: "3x",
        seasons: ["2003/04", "2005/06", "2014/15"],
        type: "silver",
      },
      {
        count: "6x",
        seasons: [
          "2002/03",
          "2004/05",
          "2006/07",
          "2010/11",
          "2016/17",
          "2021/22",
        ],
        type: "bronze",
      },
    ],
  },
  {
    title: "Juniori",
    items: [
      {
        count: "4x",
        seasons: ["2015/16", "2016/17", "2018/19", "2020/21"],
        type: "gold",
      },
      {
        count: "3x",
        seasons: ["2014/15", "2017/18", "2021/22"],
        type: "silver",
      },
    ],
  },
];

function MedalDot({ type }: { type: MedalType }) {
  return <span className={`${styles.medalDot} ${styles[type]}`} />;
}

export default function AchievementsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.groupsGrid}>
        {achievementGroups.map((group) => (
          <article key={group.title} className={styles.groupCard}>
            <div className={styles.groupHeader}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
            </div>

            <div className={styles.itemsList}>
              {group.items.map((item, index) => (
                <div
                  key={`${group.title}-${item.type}-${index}`}
                  className={styles.achievementItem}
                >
                  <div className={styles.itemLeft}>
                    <div className={styles.itemCountRow}>
                      <span className={styles.itemCount}>{item.count}</span>
                      <MedalDot type={item.type} />
                    </div>
                  </div>

                  <div className={styles.itemRight}>
                    <div className={styles.itemSeasons}>
                      {item.seasons.map((season, seasonIndex) => (
                        <span
                          key={`${group.title}-${item.type}-season-${seasonIndex}`}
                          className={styles.seasonChip}
                        >
                          {season}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}