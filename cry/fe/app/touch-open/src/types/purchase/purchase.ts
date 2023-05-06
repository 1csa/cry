export interface FormStateType {
  sku: string;
  name: undefined;
  suit_name: string;
  category: string[];
  op_user_name: string;
  updateDate: [string, string];
  arriveDate:[string, string];
  status: string | undefined
}
export interface ProductInfoType {
  code: number;
  colour_code: string | undefined;
  cover_img_url: [];
  name: string;
  number: string;
  size_code: string | undefined;
  supplier: string
  cost_amount: number | undefined
}

export interface LogisticsInfoType {
  no: string;
  fee: string | undefined;
  id: number
}
