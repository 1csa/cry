// import { getImgTokenFromCookie, decodeToken } from '@/utils/auth.js';
import { uploadImg } from '@/services/goods';

/**
 * 上传图片
 * @param file Image文件
 * @returns promise 接口返回值
 */

export const UploadImage = (file: File, original: string) => {
  const formData = new FormData();
  formData.append('pic', file);
  formData.append('original_draw', original);
  return uploadImg(formData);
};

/**
 * 上传csv
 * @param file 表格文件
 * @returns promise 接口返回值
 */

// export const UploadCsvFile = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('file_name', file.name);
//   return uploadCsv(formData);
// };
