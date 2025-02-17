//기상청 기준에 시간이 아닌경우 NO_DATA가 받아지기 때문에
//기상청 api설명서를 기준으로 값을 바꾸는 과정입니다.
const FcstBaseTime = (currentTime) => {
  const baseTimes = [
    "0200",
    "0500",
    "0800",
    "1100",
    "1400",
    "1700",
    "2000",
    "2300",
  ];
  let closestTime = baseTimes[0];

  for (let i = 0; i < baseTimes.length; i++) {
    if (currentTime >= baseTimes[i]) {
      closestTime = baseTimes[i];
    } else {
      break;
    }
  }

  return closestTime;
};

const VilageBaseTime = (curTime) => {
  // 문자열에서 시(hour)와 분(minute) 추출
  const hour = parseInt(curTime.slice(0, 2), 10);
  const minute = parseInt(curTime.slice(2, 4), 10);

  // Base_time 리스트 (시간별 생성 시간 기준)
  const baseTimes = [
    "0000",
    "0100",
    "0200",
    "0300",
    "0400",
    "0500",
    "0600",
    "0700",
    "0800",
    "0900",
    "1000",
    "1100",
    "1200",
    "1300",
    "1400",
    "1500",
    "1600",
    "1700",
    "1800",
    "1900",
    "2000",
    "2100",
    "2200",
    "2300",
  ];

  let nearestBaseTime = baseTimes[hour];

  // API 제공 시간이 지나지 않았다면 이전 시간의 Base_time 선택
  if (minute < 10) {
    nearestBaseTime = baseTimes[hour === 0 ? 23 : hour - 1];
  }

  return nearestBaseTime;
};

export { FcstBaseTime, VilageBaseTime };
