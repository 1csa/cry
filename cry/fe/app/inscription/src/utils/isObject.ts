/**
 * 判定传入的类型是否为kv类型: toString结果为[Object Object]
*/
export default <T=any>(value: unknown): value is Record<string, T> => {
  return Object.prototype.toString.call(value).toLowerCase() === '[object object]';
};
