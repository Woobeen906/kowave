import { useEffect, useState } from "react";
import { CoordToGrid } from "../Utils";

const useGetLocation = () => {
  const { geolocation } = navigator;
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!geolocation) {
      setError("위치를 찾을 수 없습니다.");
      return;
    }

    geolocation.getCurrentPosition(
      (res) => {
        const { latitude, longitude } = res.coords;
        setLocation(CoordToGrid(latitude, longitude));
      },
      (error) => setError(error)
    );
  }, []);

  return { location, error };
};

export default useGetLocation;
