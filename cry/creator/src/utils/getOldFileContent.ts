import fs from 'fs';

function getOldFileContent(filePath: string) {
  const data = fs.readFileSync(filePath, 'utf8');
  return data;
}
export default getOldFileContent;
