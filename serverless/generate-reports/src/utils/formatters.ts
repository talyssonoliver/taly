export const formatAsJSON = (data: object[]): object => {
  return { report: data };
};

export const formatAsCSV = (data: object[]): string => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
  return `${headers}\n${rows}`;
};
