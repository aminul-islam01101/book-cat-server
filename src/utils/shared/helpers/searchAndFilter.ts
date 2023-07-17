export const searchFilterCalculator = (
  searchTerm: string | undefined,
  SearchableFields: string[],
  filtersData: { [key: string]: string | number | boolean }
): { $and: object[] } | object => {
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: SearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  // if (Object.keys(filtersData).length) {
  //   andConditions.push(
  //     ...Object.entries(filtersData).map(([field, value]) => {
  //       if (field === 'maxPrice' || field === 'minPrice') {
  //         const operator = field === 'maxPrice' ? '$lte' : '$gte';
  //         return {
  //           price: { [operator]: value },
  //         };
  //       }
  //       return {
  //         [field]: {
  //           $regex: value,
  //           $options: 'i',
  //         },
  //       };
  //     })
  //   );
  // }

  // if (Object.keys(filtersData).length) {
  //   andConditions.push(
  //     ...Object.entries(filtersData).map(([field, value]) => {
  //       if (field === 'publicationYear') {
  //         const year = value.toString();
  //         const startDate = new Date(`${year}-01-01T00:00:00Z`);
  //         const endDate = new Date(`${year}-12-31T23:59:59Z`);
  //         return {
  //           publicationDate: {
  //             $gte: startDate,
  //             $lte: endDate,
  //           },
  //         };
  //       }
  //       return {
  //         [field]: {
  //           $regex: value,
  //           $options: 'i',
  //         },
  //       };
  //     })
  //   );
  // }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  return whereConditions;
};
