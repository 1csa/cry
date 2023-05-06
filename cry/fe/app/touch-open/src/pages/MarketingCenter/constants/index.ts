const dateFormat = 'YYYY-MM-DD';
export const fissionSearchFormFn = () => {
  return {
    id: {
      type: 'input',
      initValue: '',
      label: '链接ID',
    },
    suit_id: {
      type: 'input',
      initValue: '',
      label: '套装ID',
    },
    userid: {
      type: 'input',
      initValue: '',
      label: '生成人',
    },
    time: {
      type: 'range-picker',
      initValue: null,
      label: '生成时间',
      originAttrs: {
        valueFormat: dateFormat,
      },
    },
  };
};
