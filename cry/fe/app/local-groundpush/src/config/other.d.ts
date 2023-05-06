export interface CitiesDataType {
  id: number;
  value: string;
  child?: CitiesDataType[]
}

export interface TeamsDataType {
  title: string;
  value: number;
}

export interface PusherDataType {
  id: number;
  name: string;
  phone: string;
}

export interface CommonOtherType {
  id: number;
  value: string;
  child?: CommonOtherType[];
}
