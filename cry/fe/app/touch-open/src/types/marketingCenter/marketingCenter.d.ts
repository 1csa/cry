
export interface ListInfoType {
  id: number;
  cover_img_url: [];
  title: string;
  url: string;
  create_time: string;
  op_user?: string
}
export type OpenConfigFormStateType = {
  [key in 'banner' | 'cards']: ListInfoType[];
}


