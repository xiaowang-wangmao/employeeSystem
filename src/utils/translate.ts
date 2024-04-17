export const enumToObjArray = (enumObject: any): any[] => {
  return Object.keys(enumObject).filter((v) => (isNaN(Number(v)))).map(key => ({
    label: key,
    value: enumObject[key]
  }));
};