import type { ListInfoType } from './marketingCenter';
import newKey from '@/utils/handleKey';

export const defaultListInfoFn = ():ListInfoType => {
  return {
    id: newKey(),
    cover_img_url: [],
    title: '',
    url: '',
    create_time: '',
  }
}
export const defaultListInfo: ListInfoType = {
  id: 0,
  cover_img_url: [],
  title: '',
  url: '',
  create_time: '',
}
