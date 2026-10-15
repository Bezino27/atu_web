import leadersStyles from "../styles/CategoryLeaders.module.css";

type CategoryLeaderPlayerNameProps = {
  name: string;
};

function getPlayerNameSizeClass(nameParts: string[]) {
  const longestPart = Math.max(0, ...nameParts.map((part) => part.length));

  if (longestPart >= 11) return leadersStyles.playerNameLong;
  if (longestPart >= 9) return leadersStyles.playerNameMedium;
  return "";
}

export default function CategoryLeaderPlayerName({
  name,
}: CategoryLeaderPlayerNameProps) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const firstLine = nameParts[0] ?? "";
  const secondLine = nameParts.slice(1).join(" ");

  return (
    <h3
      className={`${leadersStyles.playerName} ${getPlayerNameSizeClass(
        nameParts,
      )}`}
    >
      <span className={leadersStyles.playerNameLine}>{firstLine}</span>
      {secondLine ? (
        <span className={leadersStyles.playerNameLine}>{secondLine}</span>
      ) : null}
    </h3>
  );
}
