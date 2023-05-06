export interface ResponseType<T = any> {
  status: string;
  code?: number;
  data?: T;
  message?: string;
}

export interface ResponseUpload {
  url: string;
  image_id: string;
}