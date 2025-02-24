import { useState, useEffect } from "react";
import dayjs from "dayjs";

interface UseCalendarProps {
  initialDate?: dayjs.Dayjs;
}

interface Day {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface UseCalendarReturn {
  currentDate: dayjs.Dayjs;
  calendarDays: Day[][];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  getDaysInMonth: (date: dayjs.Dayjs) => Day[];
}

const useCalendar = (props?: UseCalendarProps): UseCalendarReturn => {
  const { initialDate = dayjs() } = props || {};
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(initialDate);
  const [calendarDays, setCalendarDays] = useState<Day[][]>([]);

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentDate));
  }, [currentDate]);

  const generateCalendarDays = (date: dayjs.Dayjs): Day[][] => {
    const year = date.year();
    const month = date.month();
    const firstDayOfMonth = dayjs(`${year}-${month + 1}-01`).locale("pt-br");
    const startingDayOfWeek = firstDayOfMonth.day();
    const daysInMonth = date.daysInMonth();

    let dayCounter = 1;
    const calendarWeeks: Day[][] = [];

    for (let week = 0; week < 6; week++) {
      // Up to 6 weeks to cover all month layouts
      const weekDays: Day[] = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < startingDayOfWeek) {
          const prevMonthDay = firstDayOfMonth.subtract(
            startingDayOfWeek - dayOfWeek,
            "day"
          );
          weekDays.push({
            date: prevMonthDay,
            isCurrentMonth: false,
            isToday: prevMonthDay.isSame(dayjs(), "day"),
          });
        } else if (dayCounter <= daysInMonth) {
          const currentMonthDay = dayjs(`${year}-${month + 1}-${dayCounter}`);
          weekDays.push({
            date: currentMonthDay,
            isCurrentMonth: true,
            isToday: currentMonthDay.isSame(dayjs(), "day"),
          });
          dayCounter++;
        } else {
          const nextMonthDay = dayjs(`${year}-${month + 1}-${daysInMonth}`).add(
            dayOfWeek - (7 - (daysInMonth - (dayCounter - 1))),
            "day"
          );
          weekDays.push({
            date: nextMonthDay,
            isCurrentMonth: false,
            isToday: nextMonthDay.isSame(dayjs(), "day"),
          });
        }
      }
      calendarWeeks.push(weekDays);
      if (dayCounter > daysInMonth) {
        break;
      }
    }
    return calendarWeeks;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  const getDaysInMonth = (date: dayjs.Dayjs) => {
    const year = date.year();
    const month = date.month();
    const daysArray: Day[] = [];
    for (let day = 1; day <= date.daysInMonth(); day++) {
      const dayDate = dayjs(`${year}-${month + 1}-${day}`).locale("pt-br");
      daysArray.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.isSame(dayjs(), "day"),
      });
    }
    return daysArray;
  };

  return {
    currentDate,
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getDaysInMonth,
  };
};

export default useCalendar;
