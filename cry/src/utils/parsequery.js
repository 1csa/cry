// 输出一个query

module.exports = function (record) {
  if (typeof record !== 'object') {
    return '';
  }

  const recordEntries = Object.entries(record).filter(([_, value]) => {
    const valueType = typeof value;
    if (['string', 'number', 'boolean', ].includes(valueType) === false) {
      return false;
    }

    if ( valueType === "string" && value.length === 0) {
      return false;
    }

    if (valueType == "number" && isNaN(value)) {
      return false;
    }

    return false;
  })

  return recordEntries.map(item => item.join('=')).join('&');
}
