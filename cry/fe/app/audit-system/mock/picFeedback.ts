export default {
  'GET /api/getCount': {
    "errorno":0, //0表示成功 其它值 表示错误
    "desc": "",
    counts: {
      "stts_count_audit": 99, //当前带审核数据条数
      "stt_audited_curauditor_curday": 890,//当前审核员当天的已审核个数，从凌晨零点开始的当天个数,
      "clsexp": [
        {
          id: 1, // 一点资讯
          count: 200
        },
        {
          id: 2, // 身边
          count: 300
        },
        {
          id: 101, // 用户资料
          count: 200
        },
        {
          id: 102, // 图文
          count: 300
        },
        {
          id: 103, // 视频
          count: 200
        },
        {
          id: 104, // 评论
          count: 300
        }
      ]
    }
  },
  'GET /api/infoList': {
    "data": {
      "10001": {
        "cat": [{
            "cn": "一点",
            "id": 1,
            "parent": 10001
          },
          {
            "cn": "身边",
            "id": 2,
            "parent": 10001
          }
        ],
        "classify": 1,
        "cn": "业务ID",
        "id": 10001
      },
      "10002": {
        "cat": [{
            "cn": "用户资料",
            "id": 101,
            "parent": 10002
          },
          {
            "cn": "图文",
            "id": 102,
            "parent": 10002
          },
          {
            "cn": "视频",
            "id": 103,
            "parent": 10002
          },
          {
            "cn": "评论",
            "id": 104,
            "parent": 10002
          }
        ],
        "classify": 1,
        "cn": "业务模块",
        "id": 10002
      },
      "10003": {
        "cat": [{
            "cn": "评论-双审区",
            "id": 1001,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-特备区",
            "id": 1002,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-评论-境外区",
            "id": 1003,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-涉政区",
            "id": 1004,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-意识形态区",
            "id": 1005,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-涉国家领导人区",
            "id": 1006,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-涉国家主权区",
            "id": 1007,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-涉宗教信仰区",
            "id": 1008,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-涉属地管理区",
            "id": 1009,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-社会敏感事件区",
            "id": 1010,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-色情辱骂区",
            "id": 1011,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-违法区",
            "id": 1012,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-文章先审区",
            "id": 1013,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          },
          {
            "cn": "评论-其他区",
            "id": 1014,
            "classify": 0,
            "parent": 10003,
            "priority": 1
          }
        ],
        "classify": 1,
        "cn": "评论分区",
        "id": 10003
      },
      "10004": {
        "cat": [{
            "cn": "文章-色情区",
            "id": 1024,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-常规一区",
            "id": 1025,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-常规二区",
            "id": 1026,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-常规三区",
            "id": 1027,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-高敏A/B",
            "id": 1015,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-特殊备用区",
            "id": 1016,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-高敏二区",
            "id": 1017,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-涉政一区",
            "id": 1018,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-涉政二区",
            "id": 1019,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-版权一区",
            "id": 1020,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-涉政三区",
            "id": 1021,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-虚假新闻区",
            "id": 1022,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          },
          {
            "cn": "文章-标题党区",
            "id": 1023,
            "classify": 0,
            "parent": 10004,
            "priority": 1
          }
        ],
        "classify": 1,
        "cn": "文章分区",
        "id": 10004
      },
      "10005": {
        "cat": [{
            "cn": "视频-黑名单区",
            "id": 1028,
            "classify": 0,
            "parent": 10005,
            "priority": 1
          },
          {
            "cn": "视频-虚假新闻分区",
            "id": 1029,
            "classify": 0,
            "parent": 10005,
            "priority": 1
          },
          {
            "cn": "视频-标题党区",
            "id": 1030,
            "classify": 0,
            "parent": 10005,
            "priority": 1
          }
        ],
        "classify": 1,
        "cn": "视频分区",
        "id": 10005
      },
      "10006": {
        "cat": [{
            "cn": "负反馈",
            "id": 105,
            "classify": 0,
            "parent": 10006
          },
          {
            "cn": "淘好评",
            "id": 106,
            "classify": 0,
            "parent": 10006
          },
          {
            "cn": "召回",
            "id": 107,
            "classify": 0,
            "parent": 10006
          },
          {
            "cn": "自媒体",
            "id": 108,
            "classify": 0,
            "parent": 10006
          }
        ],
        "classify": 1,
        "cn": "子业务",
        "id": 10006
      },
      "10007": {
        "cat": [{
            "cn": "待审核",
            "id": 109,
            "classify": 1,
            "parent": 10007
          },
          {
            "cn": "审核中",
            "id": 110,
            "classify": 2,
            "parent": 10007
          },
          {
            "cn": "审核结束",
            "id": 3010,
            "classify": 3,
            "parent": 10007
          }
        ],
        "classify": 1,
        "cn": "审核状态",
        "id": 10007
      }
    },
      "desc": "",
      "errorno": 0
    }
}