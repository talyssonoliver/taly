import dayjs from "dayjs";
import "dayjs/locale/en";

export const formatDate = (date: Date, locale = "en"): string => {
	return dayjs(date).locale(locale).format("MMMM DD, YYYY");
};

export const formatTime = (date: Date, locale = "en"): string => {
	return dayjs(date).locale(locale).format("hh:mm:ss A");
};

export const getCurrentTimestamp = (): string => {
	return dayjs().toISOString();
};

export const addDays = (date: Date, days: number): Date => {
	return dayjs(date).add(days, "day").toDate();
};
