export interface OriRcFile extends File {
  uid: string;
}

export interface RcFile extends File {
  uid: string;
}

export interface FileType extends OriRcFile {
  readonly lastModifiedDate: Date;
}

export declare type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface UploadFile<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: FileType;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface UploadChangeParam<T = UploadFile> {
  file: T;
  fileList: UploadFile[];
  event?: {
    percent: number;
  };
}

export interface UploadProgressEvent extends Partial<ProgressEvent> {
  percent?: number;
}

export declare type UploadRequestMethod = 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';

export interface UploadRequestError extends Error {
  status?: number;
  method?: UploadRequestMethod;
  url?: string;
}

export declare type BeforeUploadFileType = File | Blob | boolean | string;

export declare type UploadRequestHeader = Record<string, string>;

export interface UploadRequestOption<T = any> {
  onProgress?: (event: UploadProgressEvent) => void;
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
  data?: Record<string, unknown>;
  filename?: string;
  file: Exclude<BeforeUploadFileType, File | boolean> | RcFile;
  withCredentials?: boolean;
  action: string;
  headers?: UploadRequestHeader;
  method: UploadRequestMethod;
}
