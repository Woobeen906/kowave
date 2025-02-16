import React, { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import {
  ConvertWindDirection,
  FormatTime,
  getHumidityEmoji,
  getWeatherEmoji,
  getWindDirectionEmoji,
  getWindEmoji,
  PrecipitationType,
  SkyCondition,
} from "../../Utils";
import locationData from "../../atoms/location.json";
import "./Main.scss";
import { useGetWeatherData } from "../../atoms";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // 초단기 실황 데이터
  const { data: ncstData, nearestRegion } = useGetWeatherData(
    "UltraSrtNcst",
    selectedLocation
  );
  // 단기 예보 데이터
  const { data: fcstData } = useGetWeatherData("VilageFcst", selectedLocation);

  const [currentWeather, setCurrentWeather] = useState({
    locationName: "정보 없음",
    currentTemp: "정보 없음",
    weatherCondition: "정보 없음",
    humidity: "정보 없음",
    windSpeed: "정보 없음",
    windDirection: "정보 없음",
  });

  const [forecastWeather, setForecastWeather] = useState([]);

  const handleSearch = debounce((query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const results = locationData.filter(
      (loc) => loc["3단계"].includes(query) || loc["2단계"].includes(query)
    );
    setSearchResults(results);
  }, 300);

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location["3단계"]);
    setSearchResults([]);
  };

  useEffect(() => {
    if (ncstData) {
      const tempData = ncstData.item.reduce((acc, item) => {
        switch (item.category) {
          case "T1H":
            acc.currentTemp = item.obsrValue + "°";
            break;
          case "PTY":
            acc.weatherCondition = PrecipitationType(item.obsrValue);
            break;
          case "SKY":
            acc.skyCondition = SkyCondition(item.obsrValue);
            break;
          case "REH":
            acc.humidity = item.obsrValue;
            break;
          case "WSD":
            acc.windSpeed = item.obsrValue + " m/s";
            break;
          case "VEC":
            acc.windDirection = ConvertWindDirection(item.obsrValue);
            break;
          default:
            break;
        }
        return acc;
      }, {});

      setCurrentWeather((prevInfo) => ({
        ...prevInfo,
        ...tempData,
        locationName: selectedLocation
          ? selectedLocation["3단계"] || selectedLocation["2단계"]
          : prevInfo.locationName,
      }));
    }

    if (fcstData) {
      const groupedData = fcstData.item.reduce((acc, item) => {
        const key = `${item.fcstDate}-${item.fcstTime}`;
        if (!acc[key])
          acc[key] = { fcstDate: item.fcstDate, fcstTime: item.fcstTime };
        acc[key][item.category] = item.fcstValue;
        return acc;
      }, {});

      const formattedForecast = Object.values(groupedData).map((data) => ({
        fcstDate: data.fcstDate,
        fcstTime: FormatTime(data.fcstTime),
        TMP: data.TMP ? `${data.TMP}` : "정보 없음",
        POP: data.POP ? `${data.POP}%` : "정보 없음",
        PCP: data.PCP ? `${data.PCP} mm` : "정보 없음",
        REH: data.REH ? `${data.REH}%` : "정보 없음",
        SKY: data.SKY || "정보 없음",
        WSD: data.WSD ? `${data.WSD} m/s` : "정보 없음",
      }));

      setForecastWeather(formattedForecast);
      setLoading(false);
    }
  }, [ncstData, fcstData]);

  useEffect(() => {
    if (nearestRegion) {
      setCurrentWeather((prevInfo) => ({
        ...prevInfo,
        locationName: nearestRegion["3단계"] || nearestRegion["2단계"],
      }));
    }
  }, [nearestRegion]);

  const ForecastItem = ({ data }) => (
    <div className="forecast-item">
      <span className="weatherIcon">{data.POP > 0 ? "☔️" : "☀️"}</span>
      <div className="time">{data.fcstTime}</div>
      <div className="temperature">
        {data.TMP < 0 ? "🥶" : "😄"}&nbsp;
        {data.TMP}°C
      </div>
      <div className="rainChance">💧 {data.POP}</div>
    </div>
  );

  const Loader = () => (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );

  return (
    <main className="main">
      <div className="temp">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="search-bar">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="지역 검색..."
              />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((loc) => (
                    <li
                      key={loc["행정구역코드"]}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      {loc["1단계"]} {loc["2단계"]} {loc["3단계"]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <section className="nowTemp">
              <span className="weatherIcon">
                {getWeatherEmoji(currentWeather.weatherCondition)}
              </span>
              <div className="locationName">{currentWeather.locationName}</div>
              <div className="currentTemperature">
                {currentWeather.currentTemp}
              </div>
              <div className="weatherCondition">
                {currentWeather.weatherCondition}
              </div>
              <div className="additionalInfo">
                <div className="humidity">
                  습도: {currentWeather.humidity}%
                  <span className="weatherIcon">
                    {getHumidityEmoji(currentWeather.humidity)}
                  </span>
                </div>

                <div className="windSpeed">
                  풍속: {currentWeather.windSpeed}
                  <span className="weatherIcon">
                    {getWindEmoji(currentWeather.windSpeed)}
                  </span>
                </div>
                <div className="windDirection">
                  풍향: {currentWeather.windDirection}{" "}
                  <span className="weatherIcon">
                    {getWindDirectionEmoji(currentWeather.windDirection)}
                  </span>
                </div>
              </div>
            </section>
            <section className="forecast">
              <div
                className="forecast-container"
                style={{ overflowY: "scroll", maxHeight: "400px" }}
              >
                {forecastWeather.map((data, index) => (
                  <ForecastItem key={index} data={data} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Main;
