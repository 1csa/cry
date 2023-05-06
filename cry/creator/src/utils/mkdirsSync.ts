import fs from 'fs';
import path from 'path';
import isPathExist from './isPathExist';

export default function mkdirsSync(dirname: string) {
  if (isPathExist(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
