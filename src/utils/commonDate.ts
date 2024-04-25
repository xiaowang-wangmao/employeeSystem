

import { getDayList } from '@/api/common';

export const getDateList = () => {
  getDayList({}).then((res) => {
    return res;
  })
}

