import mockjs from "mockjs";

const { mock, Random, } = mockjs;

export default {
  "POST /home/overview": mock({
    "status": "success",
    "data|1-10": [{
      "teamName": "测试推广团队a",//团队名称
      "teamId|1-200": 1,//团队id
      "pushManCount|1-200": 1,//推广人数
      "activationCount|0-100": 1//激活人数
    }]
  }),
  'POST /home/hourData': mock({
    'status': 'success',
    'data': {
      '当日数据|1-24': [{
        "id|1-10": 1,
        "timeKey|1-24": mock('@time(hh:00)'),
        "type": "1",//1、当日数据 2、昨日数据 7、七天前数据
        "teamId":4,
        "activationCount|1-100": 1
      }],
      '昨日数据|1-15': [{
        "id|1-10": 1,
        "timeKey|+1": mock('@time(hh:00)'),
        "type": "2",//1、当日数据 2、昨日数据 7、七天前数据
        "teamId":4,
        "activationCount|1-100": 1
      }],
      '七天前数据|1-24': [{
        "id|1-10": 1,
        "timeKey|+1": mock('@time(hh:00)'),
        "type": "7",//1、当日数据 2、昨日数据 7、七天前数据
        "teamId":4,
        "activationCount|1-100": 1
      }]
    }
  }),
  "POST /home/cityDatas": mock({
    "status": 'success',
    "data|1-4": [{
      "name|+1": ["广州", '清远', '惠州','东莞'],
      "value|1-30": 1
    }]
  }),
  "POST /home/teamDatas": mock({
    "status": 'success',
    "data|1-4": [{
      "name|+1": ["测试推广团队1", '测试推广团队2', '测试推广团队3','测试推广团队4'],
      "value|1-30": 1
    }]
  }),
  "POST /teamStat/dataPage": mock({
    'status': 'success',
    'data': {
      "pageNum": 1,
      "pageSize": 10,
      "size": 28,
      "total": 28,
      "list|28-28": [{
        "timeKey": "2019-10-20",
        "teamName": "测试推广团队a",
        "teamId": 4,
        "activationCount": 10,//激活数
        "cheaterCount": 0,//作弊用户数
        "oneDayRetention": 0.5,//次日留存率
        "sevenDayRetention": 0.2,//7日留存
        "thirtyDayRetention": 0.1//30日留存
      }]
    }
  }),
}
