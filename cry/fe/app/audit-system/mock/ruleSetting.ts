export default {
  'GET /api/sensword/subs': {
    "status": "success",
    "code": 200,
    "data": [
      {
        subName: '标题',
        subId: 1,
        enbleStatus: 1
      },
      {
        subName: '简介',
        subId: 2,
        enbleStatus: 1
      },
      {
        subName: '正文',
        subId: 3,
        enbleStatus: 1
      },
      {
        subName: '评论',
        subId: 4,
        enbleStatus: 1
      },
      {
        subName: '私信',
        subId: 5,
        enbleStatus: 1
      },
      {
        subName: '昵称',
        subId: 6,
        enbleStatus: 1
      }
    ]
  },
  'GET /api/sensword/business': {
    "status": "success",
    "code": 200,
    "data": [
      {
        businessName: '一点资讯',
        businessId: 1,
        enbleStatus: 1
      },
      {
        businessName: '身边',
        businessId: 2,
        enbleStatus: 1
      },
      {
        businessName: 'OPPO',
        businessId: 3,
        enbleStatus: 1
      },
      {
        businessName: 'vivo',
        businessId: 4,
        enbleStatus: 1
      },
      {
        businessName: '小米',
        businessId: 5,
        enbleStatus: 1
      },
      {
        businessName: '华为',
        businessId: 6,
        enbleStatus: 1
      }
    ]
  },
  'POST /api/sensword/words': {
    "status": "success",
    "code": 200,
    "data": [
      {
        "wordId": "45zpj4MCQyWK6wcR5be9VA==",
        "word": "习大大",
        exWord: '2131313131',
        "categoryId": "大类——小类",
        actions: [
          {actionType: 1, businessId: 4, sort: 7, subId: 2},
          {actionType: 1, businessId: 2, sort: 10, subId: 5},
          {actionType: 3, businessId: 6, sort: 16, subId: 5},
          {actionType: 1, businessId: 2, sort: 20, subId: 1},
        ],
        actionTables: [
          {
            actionType: 1,
            actionItem: [
              {
                businessName: 'vivo',
                businessId: 2,
                sub: [
                  {
                    subName: '标题',
                    subId: 1,
                  },
                  {
                    subName: '私信',
                    subId: 5,
                  }
                ]
              },
              {
                businessName: 'businessId 4',
                businessId: 4,
                sub: [
                  {
                    subName: 'subId 2',
                    subId: 2,
                  }
                ]
              },
            ]
          },
          {
            actionType: 3,
            actionItem: [
              {
                businessName: '华为',
                businessId: 6,
                sub: [
                  {
                    subName: '私信',
                    subId: 5,
                  }
                ]
              },
            ]
          }
        ],
        "startTime": "1593656742000",
        "endTime": "32503651199000",
        "enableStatus": "1",
        "operationUid": "张三",
        "createTime": "1594002342000",
        "updateTime": "1594175142000",
        remark: '这是备注1'
      },
      {
        "wordId": "45zpj4MCQyWK6wcR5be9VA=2313=",
        "word": "习大大",
        "categoryId": "大类——小类",
        actions: [
          {actionType: 1, businessId: 2, sort: 4, subId: 2},
          {actionType: 1, businessId: 4, sort: 7, subId: 4},
          {actionType: 0, businessId: 1, sort: 8, subId: 1},
          {actionType: 3, businessId: 6, sort: 16, subId: 5},
          {actionType: 1, businessId: 2, sort: 19, subId: 3},
        ],
        actionTables: [
          {
            actionType: 0,
            actionItem: [
              {
                businessName: '一点资讯',
                businessId: 1,
                sub: [
                  {
                    subName: '标题',
                    subId: 1,
                  }
                ]
              },
            ]
          },
          {
            actionType: 1,
            actionItem: [
              {
                businessName: 'businessId 2',
                businessId: 2,
                sub: [
                  {
                    subName: 'subId 2',
                    subId: 2,
                  },
                  {
                    subName: 'subId 3',
                    subId: 3,
                  }
                ]
              },
              {
                businessName: 'vivo',
                businessId: 4,
                sub: [
                  {
                    subName: 'subId 4',
                    subId: 4,
                  }
                ]
              },
            ]
          },
          {
            actionType: 3,
            actionItem: [
              {
                businessName: 'businessId 6',
                businessId: 6,
                sub: [
                  {
                    subName: 'subId 5',
                    subId: 5,
                  }
                ]
              },
            ]
          }
        ],
        "startTime": "1594175142000",
        "endTime": "1596643199000",
        "enableStatus": "1",
        "operationUid": "李四",
        "createTime": "1595125542000",
        "updateTime": "1595384742000",
        remark: '这是备注2'
      }
    ]
  },
  'GET /api/sensword/wordLogs': {
    "status": "success",
    "code": 200,
    "data": [
      {
        "wordId": "lishishuju wordLogs==",
        "word": "wordLogs习大大",
        exWord: '2wordLogs131313131',
        "categoryId": "大类——小类",
        actions: [
          {actionType: 1, businessId: 2, sort: 20, subId: 1},
          {actionType: 1, businessId: 4, sort: 7, subId: 2},
          {actionType: 3, businessId: 6, sort: 16, subId: 5},
          {actionType: 1, businessId: 2, sort: 10, subId: 5},
        ],
        actionTables: [
          {
            actionType: 1,
            actionItem: [
              {
                businessName: 'vivo',
                businessId: 2,
                sub: [
                  {
                    subName: '标题',
                    subId: 1,
                  },
                  {
                    subName: '私信',
                    subId: 5,
                  }
                ]
              },
              {
                businessName: 'businessId 4',
                businessId: 4,
                sub: [
                  {
                    subName: 'subId 2',
                    subId: 2,
                  }
                ]
              },
            ]
          },
          {
            actionType: 3,
            actionItem: [
              {
                businessName: '华为',
                businessId: 6,
                sub: [
                  {
                    subName: '私信',
                    subId: 5,
                  }
                ]
              },
            ]
          }
        ],
        "startTime": "1593656742000",
        "endTime": "32503651199000",
        "enableStatus": "1",
        "operationUid": "张三",
        "createTime": "1594002342000",
        "updateTime": "1594175142000",
        remark: '这是历史备注1'
      },
      {
        "wordId": "45zpj4MCQyWwordLogsK6wcR5be9VA=2313=",
        "word": "习wordLogs大大",
        "categoryId": "大类——小类",
        actions: [
          {actionType: 1, businessId: 2, sort: 19, subId: 3},
          {actionType: 1, businessId: 4, sort: 7, subId: 4},
          {actionType: 3, businessId: 6, sort: 16, subId: 5},
          {actionType: 0, businessId: 1, sort: 8, subId: 1},
          {actionType: 1, businessId: 2, sort: 4, subId: 2},
        ],
        actionTables: [
          {
            actionType: 0,
            actionItem: [
              {
                businessName: '一点资讯',
                businessId: 1,
                sub: [
                  {
                    subName: '标题',
                    subId: 1,
                  }
                ]
              },
            ]
          },
          {
            actionType: 1,
            actionItem: [
              {
                businessName: 'businessId 2',
                businessId: 2,
                sub: [
                  {
                    subName: 'subId 2',
                    subId: 2,
                  },
                  {
                    subName: 'subId 3',
                    subId: 3,
                  }
                ]
              },
              {
                businessName: 'vivo',
                businessId: 4,
                sub: [
                  {
                    subName: 'subId 4',
                    subId: 4,
                  }
                ]
              },
            ]
          },
          {
            actionType: 3,
            actionItem: [
              {
                businessName: 'businessId 6',
                businessId: 6,
                sub: [
                  {
                    subName: 'subId 5',
                    subId: 5,
                  }
                ]
              },
            ]
          }
        ],
        "startTime": "1594175142000",
        "endTime": "1595125542000",
        "enableStatus": "1",
        "operationUid": "李四",
        "createTime": "1595125542000",
        "updateTime": "1595384742000",
        remark: '这是历史备注2'
      }
    ]
  },
  'GET /api/sensword/words/isRepeat': {
    "status": "success",
    "code": 200,
    "data": []
  },
  'GET /api/sensword/category': {
    "status": "success",
    "code": 200,
    "data": [
      {
        categoryPid: 'bigtype1',
        categoryName: '大类1',
        category: [
          {
            categoryId: 'child type1',
            categoryName: '大类1-子类1'
          },
          {
            categoryId: 'child type2',
            categoryName: '大类1-子类2'
          }
        ]
      },
      {
        categoryPid: 'bigtype2',
        categoryName: '大类2',
        category: [
          {
            categoryId: 'child type1',
            categoryName: '大类2-子类1'
          },
          {
            categoryId: 'child type2',
            categoryName: '大类2-子类2'
          }
        ]
      }
    ]
  }
}