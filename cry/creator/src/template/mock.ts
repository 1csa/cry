const getMockFile = (apiName: string) => `
export default {
  'GET /api/${apiName}': {}
}
`;
export default getMockFile;
