import momenttz from "moment-timezone";

export const localeTime = (time: string | Date): Date => {
  const timeZone = momenttz.tz.guess();
  const localTime = momenttz.utc(time).tz(timeZone).toDate();
  return localTime;
};

export const getWeekDays = (date: moment.Moment): moment.Moment[] => {
  const startOfWeek = date.clone().startOf("isoWeek");
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, "days"));
  return weekDays;
};

export const epochToUTC7Time = (epoch: string, format: string) => {
  const epochNumber = parseFloat(epoch);
  const utc7Moment = momenttz(epochNumber * 1000).tz('Asia/Bangkok');
  const formattedTime = utc7Moment.format(format);
  return formattedTime;
}
