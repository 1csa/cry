export default {
  'POST /api/userprofile': {
    "errorno_desc": 0,
    "errorno": 0,
    "desc": "错误描述信息-给人看的",
    "page_id": "sdfkxlsdf",
    "item_num": 100,
    "data": [
      {
        business_id: 1,
        business_unit_id: 1,
        data_id: "1",
        docid: "10001",
        material: `{
        "user_id":89303,
        "user_nick":"头^像&1",
        "b_user_nick_update":true,
        "user_brief":"我今太难来^时擦的还很多&",
        "b_user_brief_update":true,
        "user_head_image_url":"//static.yidianzixun.com/media/8ae78b5c16e02a44be7fd714f4ad6e7e.jpg",
        "b_user_head_image_url_update":"",
        "sourceInfo": "oppo"
        }`
      },
      {
        business_id: 2,
        business_unit_id: 2,
        data_id: "2",
        docid: "10002",
        material: `{
        "user_id": 23131,
        "user_nick":"头^add像&1",
        "b_user_nick_update":true,
        "user_brief":"我今太难dadd来^时擦的还很多&",
        "b_user_brief_update":true,
        "user_head_image_url":"//static.yidianzixun.com/media/8ae78b5c16e02a44be7fd714f4ad6e7e.jpg",
        "b_user_head_image_url_update":"",
        "sourceInfo": "oppo"
        }`
      },
    ]
  },
  'POST /api/submitTask': {
    "errorno_desc": 0,
    "errorno":0,
    desc: '这是错误原因'
  },
  'GET /api/beginTask': {
    "errorno_desc": 0,
    "errorno": 0,
    "desc": "错误描述信息-给人看的",
    "page_id": "sdfkxlsdf",
    "item_num": 100,
    "data": [
      {
        "nickname": "头^像&1",
        "header_img": "//si1.go2yd.com/get-image/0XpKYK4rRjM",
        "brief": "我今太难来^时擦的还很多&",
        "update_status": ["nick"],
        device: 'oppo',
        "result_tags_nick":[],
        "result_tags_brief":[],
        "result_tags_header_img":[],
      },
      {
        "nickname": "百^度&",
        "header_img": "//si1.go2yd.com/get-image/0XpKYK4rRjM",
        "brief": "我今太难来时擦的还很多",
        "update_status": ["header_img"],
        device: 'oppo',
        "result_tags_nick":[],
        "result_tags_brief":[],
        "result_tags_header_img":[],
      }
    ]
  },
  'GET /api/finishTask': {
    "errorno_desc": 0,
    "errorno":0,
    desc: '这是错误原因'
  }
}