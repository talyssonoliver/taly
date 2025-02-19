export const fetchReportData = async (
  startDate: string,
  endDate: string
): Promise<object[]> => {
  console.info(`📡 Fetching data from ${startDate} to ${endDate}...`);

  const data = [
    { id: 1, name: "John Doe", date: startDate, amount: 100 },
    { id: 2, name: "Jane Smith", date: endDate, amount: 150 },
  ];

  return data;
};
