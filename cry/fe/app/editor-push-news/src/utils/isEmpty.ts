import { isNull, isUndefined, isString, isNumber, isArray, isObject } from "@/utils";

export default (value: unknown): boolean => {
  if (isNull(value) || isUndefined(value)) {
    return true;
  }

  if (isString(value) && value.trim().length === 0) {
    return true;
  }

  if (isNumber(value) && Number.isNaN(value)) {
    return true;
  }

  if (isArray(value) && value.length === 0) {
    return true
  }

  if (isObject(value) && Object.keys(value).length === 0) {
    return true;
  }

  return false
}
