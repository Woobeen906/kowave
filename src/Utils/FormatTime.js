const FormatTime = (timeStr) => {
  const hour = parseInt(timeStr.slice(0, 2), 10);
  const period = hour < 12 ? "오전" : "오후";
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${formattedHour}시`;
};
export default FormatTime;
