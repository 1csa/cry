// 标签的名称和数据组合映射

export const parseTags = (name: Record<string, string>, count: Record<string, string>) => {
  const tagMap = {};

  for (let key in name) {
    tagMap[key] = `${name[key]}_${count[key]}`;
  }

  return tagMap;
}
