const ConvertWindDirection = (degree) => {
  const value = Math.floor((degree + 22.5 * 0.5) / 22.5);
  const directions = [
    "북",
    "북북동",
    "동북",
    "동동북",
    "동",
    "동남동",
    "남동",
    "남남동",
    "남",
    "남서남",
    "서남",
    "서서남",
    "서",
    "서북서",
    "북서",
    "북북서",
    "북",
  ];
  return directions[value % 16];
};

const SkyCondition = (code) => {
  switch (code) {
    case "1":
      return "맑음";
    case "3":
      return "구름 많음";
    case "4":
      return "흐림";
    default:
      return "알 수 없음";
  }
};

const PrecipitationType = (code) => {
  switch (code) {
    case "0":
      return "맑음";
    case "1":
      return "비";
    case "2":
      return "비/눈";
    case "3":
      return "눈";
    case "4":
      return "소나기";
    default:
      return "알 수 없음";
  }
};

export { ConvertWindDirection, SkyCondition, PrecipitationType };
