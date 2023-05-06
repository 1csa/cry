// 通用集合
export type ListTYPE = {
  channelHistory: {
    channel: string
    channelList: {
      id: number
      date: string
      insertCount: number
      updateCount: number
      deleteCount: number
      channel: string
      totalSuccess: string
      totalError: string

    }[]
  }[]
}

export type queryTokenHistoryProps = {
  tokenResult: {
    channelHistory: {
      channel: string
      channelName: string
      channelList: {
        id: number
        date: string
        insertCount: number
        updateCount: number
        deleteCount: number
        channel: string
        channelName: string
      }[]
    }[]
  }
  pushResult: {
    channelHistory: {
      channel: string
      channelName: string
      channelList: {
        date: string
        totalSuccess: string
        totalError: string
        channelName: string
      }[]
    }[]
  }
  pushTypeResult: {
    pushTypeList: {
      date: string
      autoTotal: string
      allBreakTotal: string
      autoBreakTotal: string
      channelName: string
    }[]
  }
}
// 折线图数据格式
export type LineData = {
  date: string
  channel: string
  category: string
  value: number
}[]

// 折线图数据格式
export type LineDataObject = {
  [x: string]: LineData
}

// 通用折现图数据格式(有渠道)
export type GeneralLineData = {
  chartsData: {
    [x: string]: LineData
  };
  channelList: string[]
}
// 折现图数据格式(无渠道)
export type PushTypeResultProps = {
  chartsData: {
    date: string
    channel: string
    category: string
    value: number
  }[];
}

export type queryChannelProps = {
  channels: {
    channel: string
    channelName: string
    childList: {
      send: string
      ok: string
      error: string
      arrive: string
      click: string
      date: string
      channel: string
      channelName: string
    }[]
  }[]
  channelAPPs: {
    channel: string
    channelName: string
    childList: {
      send: string
      ok: string
      error: string
      arrive: string
      click: string
      date: string
      channel: string
      channelName: string
    }[]
  }[]
}
