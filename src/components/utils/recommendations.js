export function getRecommendation(issues) {
  if (!issues || issues.length === 0) return null;

  const total = issues.length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;
  const openCount = issues.filter((i) => i.status !== "Resolved").length;

  if (total >= 3) {
    return {
      level: "high",
      message: `Is asset par ${total} issues report ho chuke hain. Repeated failures ka pattern hai — full inspection aur possible replacement schedule karo.`,
    };
  }

  if (openCount >= 2) {
    return {
      level: "medium",
      message: `${openCount} issues abhi bhi open hain. Ye asset priority maintenance list mein daalo.`,
    };
  }

  if (total === 1 && resolved === 1) {
    return {
      level: "low",
      message: "Sirf ek issue tha jo resolve ho chuka — asset stable lag raha hai. Routine check-up kaafi hai.",
    };
  }

  return {
    level: "low",
    message: "Koi major pattern nahi mila. Normal maintenance schedule follow karo.",
  };
}