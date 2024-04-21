export const generateTaskID = (id: number | string, title: string) => {
  return `${id}-${title.slice(0, 4).trim()}`;
};
