const getWeatherEmoji = (cloud) => {
  if (cloud === "흐림") return "⛅️";
  if (cloud === "구름많음") return "☁️";
  return "☀️";
};

const getWindEmoji = (windSpeed) => {
  if (windSpeed >= 14) return "🌪️";
  if (windSpeed >= 9) return "💨";
  if (windSpeed >= 4) return "🍃";
  return "🌬️";
};

const getWindDirectionEmoji = (wind) => {
  if (wind === "북") return "↑";
  if (wind === "북북동") return "↗";
  if (wind === "북동") return "→";
  if (wind === "동") return "↓";
  if (wind === "동남동") return "↙";
  if (wind === "동북동") return "↘";
  if (wind === "남동") return "←";
  if (wind === "남") return "↑";
  if (wind === "남남동") return "↖";
  if (wind === "남남서") return "↗";
  if (wind === "서남서") return "↘";
  if (wind === "남서") return "→";
  if (wind === "서") return "↓";
  if (wind === "북서") return "←";
  if (wind === "서북서") return "↙";
  if (wind === "북북서") return "↖";
};

const getHumidityEmoji = (humidity) => {
  if (humidity <= 30) return "🔥";
  if (humidity <= 50) return "🌤️";
  if (humidity <= 70) return "🌥️";
  if (humidity <= 90) return "🌧️";
  return "💦 매우 습함";
};

export {
  getWeatherEmoji,
  getWindEmoji,
  getWindDirectionEmoji,
  getHumidityEmoji,
};
