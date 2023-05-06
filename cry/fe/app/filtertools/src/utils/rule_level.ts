export function fieldReference (key: string, level: any, list: object) {
  if (typeof level === "number") {
    return level
  } else if (typeof level === "string" && level !== "无") {
    let newLevel = level.slice(0, 2)
    let newValue = 0
    list[key].map((item: any) => {
      if (item.level === newLevel) {
        newValue = parseFloat(item.value)
      }
    })
    return newValue
  } else {
    return 0
  }
}
