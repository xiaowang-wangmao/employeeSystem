import { log } from "console";

export const enumToObjArray = (enumObject: any): any[] => {
  return Object.keys(enumObject).filter((v) => (isNaN(Number(v)))).map(key => ({
    label: key,
    value: enumObject[key]
  }));
};

/**
 * 将源对象中的基础数据类型的数据，拷贝到目标对象
  * @param target { Object } 目标对象
    * @param source { Object } 源对象
      * @param keys 拷贝的属性名组成的数组，默认取目标对象的所有属性名
        * */
export function pickBasicData<T extends Object>(
  _target: T,
  source: Object,
  keys: string[] = Object.keys(_target),
  replaceEmptyString = true,
): T {
  const target = _target;
  keys.forEach((key) => {
    if (source[key] === null || (typeof target[key] !== 'object' && typeof source[key] !== 'object')) {
      if (source[key] === '' && replaceEmptyString) {
        target[key] = undefined;
      } else {
        target[key] = source[key];
      }
    }
  });
  return target;
}


//格式如20200303的日记 创建Date对象
export function formattedDate(dateString:string) {
  const year = dateString.slice(0, 4);
  
  const month: number = Number(dateString.slice(4, 6)) - 1; // JS中的月份是从0开始的
  
  const day = dateString.slice(6, 8);
  
  return new Date(Number(year), month, Number(day) );
}






