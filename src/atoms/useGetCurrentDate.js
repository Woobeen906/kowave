import { useEffect, useState } from "react";

const useGetCurrentDate = () => {
  const [baseTime, setBaseTime] = useState();

  // new Date().getMonth()로 가져온 날짜는 1 작기 때문에 1을 더해줬습니다.
  // 삼항연산자를 사용해 날짜가 한자리 수 인경우 날씨 api에서 요구하는 base_time 형식과 다르기 때문에
  // 앞에 0을 추가하도록 했습니다.
  useEffect(() => {
    const curDate = `${new Date().getFullYear()}${
      new Date().getMonth() > 8
        ? new Date().getMonth() + 1
        : "0" + (new Date().getMonth() + 1)
    }${new Date().getDate()}`;

    const curTime = `${
      new Date().getHours() < 10
        ? "0" + new Date().getHours()
        : new Date().getHours()
    }${
      new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes()
    }`;
    setBaseTime({ curDate: curDate, curTime: curTime });
  }, []);

  return baseTime;
};

export default useGetCurrentDate;
