import heroStyles from "../styles/CategoryHero.module.css";
import CategoryHeroTitle from "./CategoryHeroTitle";

export type CategoryHeroAction = {
  href: string;
  label: string;
};

type CategoryHeroContentProps = {
  title: string;
  description?: string;
  actions: CategoryHeroAction[];
};

export default function CategoryHeroContent({
  title,
  description,
  actions,
}: CategoryHeroContentProps) {
  return (
    <div
      className={`${heroStyles.heroTextContent} ${heroStyles.heroTextContentEditorial}`}
    >
      <CategoryHeroTitle title={title} />

      {description ? (
        <p
          className={`${heroStyles.heroDescription} ${heroStyles.heroDescriptionEditorial}`}
        >
          {description}
        </p>
      ) : null}

      <div className={heroStyles.heroQuickNav}>
        {actions.map((action, index) => (
          <a
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={`${heroStyles.heroQuickLink} ${
              index === 0
                ? heroStyles.heroQuickLinkPrimary
                : heroStyles.heroQuickLinkSecondary
            }`}
          >
            <span className={heroStyles.heroQuickFill} aria-hidden="true" />
            <span className={heroStyles.heroQuickLabel}>
              <span className={heroStyles.heroQuickLabelDefault}>
                {action.label} <span aria-hidden="true">→</span>
              </span>
              <span className={heroStyles.heroQuickLabelHover} aria-hidden="true">
                {action.label} <span aria-hidden="true">→</span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
