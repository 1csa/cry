import { CardType, CardTemp } from '@/types/card';

function genCardTemp(temp: CardTemp) {
  return `temp_${temp}`
};

export default genCardTemp;
