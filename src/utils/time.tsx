export const getTimeDisplay = (dateVal: number) => {
  const d = new Date(dateVal);
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const nrOfMonthsAfterWhichCommentsAreNotAllowed = 3;
