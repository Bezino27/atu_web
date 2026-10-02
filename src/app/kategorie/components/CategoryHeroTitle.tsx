import heroStyles from "../styles/CategoryHero.module.css";

export function getHeroTitleSizeClass(title: string) {
  const length = title.replace(/\s+/g, "").length;

  if (length <= 4) return heroStyles.heroTitleShort;
  if (length <= 6) return heroStyles.heroTitleMedium;
  if (length <= 9) return heroStyles.heroTitleLong;
  return heroStyles.heroTitleExtraLong;
}

type CategoryHeroTitleProps = {
  title: string;
};

export default function CategoryHeroTitle({ title }: CategoryHeroTitleProps) {
  const normalizedTitle = title.trim();
  const words = normalizedTitle.split(/\s+/);
  const isMultiline = words.length > 1;

  return (
    <h1
      className={`${heroStyles.bannerTitle} ${getHeroTitleSizeClass(normalizedTitle)} ${
        isMultiline ? heroStyles.heroTitleMultiline : ""
      }`}
    >
      {isMultiline
        ? words.map((word, index) => (
            <span className={heroStyles.heroTitleWord} key={`${word}-${index}`}>
              {word}
            </span>
          ))
        : normalizedTitle}
    </h1>
  );
}
