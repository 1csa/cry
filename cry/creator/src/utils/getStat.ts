import fs from 'fs';

export default function pathType(path: string): string {
  try {
    const stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
      return 'isDirectory';
    } else if (stat.isFile()) {
      return 'isFile';
    }
  } catch (error) {
    return '';
  }
}
