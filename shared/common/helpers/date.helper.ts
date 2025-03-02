export const formatDate = (date: string, locale = "en-US"): string => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    console.warn(`Invalid date: ${date}`);
    return date;
  }
  return parsedDate.toLocaleDateString(locale);
};

export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

export const daysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
