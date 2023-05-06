import type { LogisticsInfoType, ProductInfoType } from './purchase';
import newKey from '@/utils/handleKey';

export const defaultProductInfo = ():ProductInfoType => {
  return {
    code: newKey(),
    colour_code: undefined,
    cover_img_url: [],
    name: '',
    number: '',
    size_code: undefined,
    supplier: '',
    cost_amount: undefined
  }
}

export const defaultLogisticsInfo: LogisticsInfoType = {
  no: '',
  fee: '',
  id: 0
}

