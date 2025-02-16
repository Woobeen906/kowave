import { useState, useEffect } from "react";
import axios from "axios";
import { useGetCurrentDate, useGetLocation } from ".";
import locationData from "./location.json";
import { CalculateDistance, FcstBaseTime, VilageBaseTime } from "../Utils";

const apiKey = process.env.REACT_APP_APIKEY_D;

const useGetWeatherData = (type, selectedLocation = null) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [baseTime, setBaseTime] = useState();
  const [location, setLocation] = useState();
  const [nearestRegion, setNearestRegion] = useState();

  const currentDate = useGetCurrentDate();
  const currentLocation = useGetLocation().location;

  useEffect(() => {
    if (!currentDate) return;

    const closestBaseTime =
      type === "VilageFcst"
        ? FcstBaseTime(currentDate.curTime)
        : VilageBaseTime(currentDate.curTime);

    setBaseTime({
      curDate: currentDate.curDate,
      curTime: closestBaseTime,
    });
  }, [currentDate, type]);

  useEffect(() => {
    if (!currentLocation || selectedLocation) return;
    setLocation(currentLocation);
  }, [currentLocation, selectedLocation]);

  useEffect(() => {
    if (!location || selectedLocation) return;

    let nearest = null;
    let minDistance = Infinity;

    locationData.forEach((loc) => {
      const distance = CalculateDistance(
        location.latitude,
        location.longitude,
        loc["격자 X"],
        loc["격자 Y"]
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = loc;
      }
    });

    if (nearest) setNearestRegion(nearest);
  }, [location, selectedLocation]);

  useEffect(() => {
    if (!baseTime) return;

    const region = selectedLocation || nearestRegion;
    if (!region) return;

    const fetchData = async () => {
      const URL =
        type === "VilageFcst"
          ? "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
          : "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

      try {
        const response = await axios.get(URL, {
          params: {
            serviceKey: apiKey,
            pageNo: "1",
            numOfRows: "1000",
            dataType: "JSON",
            base_date: baseTime.curDate,
            base_time: baseTime.curTime,
            nx: region["격자 X"],
            ny: region["격자 Y"],
          },
        });

        setData(response.data.response.body.items);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, [baseTime, selectedLocation, nearestRegion, type]);

  return { data, error, nearestRegion };
};

export default useGetWeatherData;
