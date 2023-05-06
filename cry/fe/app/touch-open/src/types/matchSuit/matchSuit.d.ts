export interface FormStateType {
  id: string;
  sku: string;
  name: string;
  suit_name: string;
  category: string[];
  op_user_name: string;
  updateDate: [string, string];
  arriveDate:[string, string];
  withdrawTime: [string, string];
  status: string | undefined;
  number: '' | number;
  silhouette: string[];
}
