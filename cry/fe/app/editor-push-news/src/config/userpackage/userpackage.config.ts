import { SearchFormProps, UserTagProps } from "./userpackage";
import { getCookieByName} from '@/utils/utils';

export const defaultSearch: SearchFormProps = {
  primaryLabel: '',
  subLabel: '',
  userTagCode: '',
  userId: getCookieByName('userid'),
}

export const defaultUserTag: UserTagProps = {
  userTagCode: '',
  userTagName: '',
  todayIncre: -1
}
