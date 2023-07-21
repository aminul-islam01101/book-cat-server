export const monthConverter = (dateStr: string) => {
  const dateParts = dateStr.split(' ');
  const fullMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIndex = fullMonths.indexOf(dateParts[0]);
  const year = dateParts[1];

  // Pad the month index with leading zero if less than 9
  const formattedMonth = monthIndex < 9 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;

  const formattedDate = `${year}-${formattedMonth}`;

  return formattedDate;
};
