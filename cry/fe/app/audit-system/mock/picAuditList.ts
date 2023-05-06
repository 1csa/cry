export default {
  'POST /api/picAuditList': {
    "errorno": 0,//0表示成功 其它值 表示错误
    "desc": "错误描述信息-给人看的",
    "page_id": "sdfkxlsdf",
    "item_num": 100,//数据条数
    "data": [
      {
        business_id: 1,
        business_unit_id: 1,
        data_id: "1",
        docid: "10001",
        material: `{
          "docId": "addaqwe234",
          "comment": "评论内容", 
          "id": 89303,
          "title": "头^像&1",
          "tmrecord": 1601197238,
          "content": "我今太难来^时擦的还很多&",
          "tmmanul": 1601199138,
          "status": "1"
        }`
      },
      {
        business_id: 2,
        business_unit_id: 2,
        data_id: "2",
        docid: "10002",
        material: `{
          "docId": "adda",
          "id": 1233,
          "comment": "评论内容", 
          "title": "头^add像&1",
          "tmrecord": 1601149238,
          "content": "我今太难dadd来^时擦的还很多&",
          "tmmanul": 1601193138,
          "status": "2"
        }`
      },
    ]
  }
}