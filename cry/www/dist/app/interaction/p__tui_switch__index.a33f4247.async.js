(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{"5W1r":function(e,t,a){var n,c,o;(function(a,r){c=[],n=r,o="function"===typeof n?n.apply(t,c):n,void 0===o||(e.exports=o)})(0,function(){var e="http://web-rest.int.yidian-inc.com/api/v1/log-platform/log",t={pandora:{schema:"webuilog",service:"pandora"},oppobrowser:{schema:"webuilog",service:"oppobrowser"},feedback:{schema:"webuilog",service:"feedback"},www:{schema:"webuilog",service:"www"},doris:{schema:"webuilog",service:"doris"},mibrowser:{schema:"webuilog",service:"mibrowser"},huawei:{schema:"webuilog",service:"huawei"},vivo:{schema:"webuilog",service:"vivo"},atlas:{schema:"webuilog",service:"atlas"}};function a(t){var a="";for(var n in t)t[n]&&(a+="".concat(n,"=").concat(encodeURIComponent(t[n]),"&"));return a=a.substring(0,a.length-1),"".concat(e,"?").concat(a)}function n(e){return void 0===e}function c(e){var t=new RegExp(e+"=([^;]*);"),a=t.exec(document.cookie);return a&&a[1]||""}return{getCookie:c,saveLog:function(e,o){var r,i="",s={user:{username:decodeURI(c("nickname"))||decodeURI(c("username"))||"",userid:parseInt(c("YD_PANDORA_UID"))}};n(o)&&(o="pandora"),r=t[o],i=a(r),e=Object.assign({},s,e),fetch(i,{body:JSON.stringify(e),headers:{"content-type":"application/json"},method:"POST",mode:"cors"}).then(()=>{console.info("\u53d1\u9001\u6210\u529f")})}}})},iGOV:function(e,t,a){e.exports={"page-header":"page-header","ant-breadcrumb":"ant-breadcrumb","page-header-title":"page-header-title","ant-layout-content":"ant-layout-content","layout-container":"layout-container"}},tmo2:function(e,t,a){"use strict";a.r(t);a("LCbC");var n=a("NwOV"),c=(a("oj2R"),a("/zI6")),o=(a("YdMF"),a("dVZ9")),r=(a("oeo2"),a("BmDy")),i=(a("vgpD"),a("UL5a")),s=(a("jz31"),a("8VRj")),d=(a("M6c6"),a("jMRu")),l=a("Z32k"),u=a.n(l),h=(a("IJu9"),a("DuHN")),p=a("JGaj"),m=a.n(p),g=(a("zI7Q"),a("SCaQ")),v=(a("ljfu"),a("x2dm")),y=a("ERkP"),w=a.n(y),f=a("uDfI"),C=a("ggb3"),b=a.n(C),E=a("5W1r"),_=(a("iGOV"),v["a"].Option),I="http://operationtoolservice.go2yd.int.yidian-inc.com";class k extends y["Component"]{constructor(e){var t;super(e),t=this,this.accountsColumns=[{title:"\u81ea\u5a92\u4f53ID/UID",dataIndex:"account_id",key:"account_id"},{title:"\u8d26\u53f7\u7c7b\u578b",dataIndex:"type",key:"type"},{title:"\u5f53\u524d\u7c89\u4e1d\u6570",dataIndex:"fans_count",key:"fans_count"},{title:"\u6587\u7ae0\u63a8\u4e00\u63a8\u7f8e\u5316/\u7bc7",dataIndex:"tui_range",key:"tui_range",render:e=>"[".concat(e[0],", ").concat(e[1],"]")},{title:"\u72b6\u6001",dataIndex:"state",key:"state",render:e=>w.a.createElement("span",null,0===e?"\u5df2\u505c\u6b62":1===e?"\u5df2\u5f00\u59cb":"\u5176\u5b83")},{title:"\u64cd\u4f5c\u65f6\u95f4",dataIndex:"update_time",key:"update_time"},{title:"\u64cd\u4f5c\u4eba",dataIndex:"operator",key:"operator",render:(e,t)=>w.a.createElement("div",null,w.a.createElement("div",null,t.operator_name),w.a.createElement("div",null,"UID: ",t.operator_uid))},{title:"\u64cd\u4f5c",dataIndex:"operation",key:"operation",render:(e,t)=>w.a.createElement("div",null,w.a.createElement(g["a"],{type:"primary",disabled:1===t.state,onClick:()=>this.handleUpdateTask(t.account_id,1)},"\u542f\u52a8"),w.a.createElement(g["a"],{type:"danger",disabled:0===t.state,onClick:()=>this.handleUpdateTask(t.account_id,0),style:{marginLeft:10}},"\u505c\u6b62"))}],this.handleUpdateTask=function(){var e=m()(u.a.mark(function e(a,n){var c,o;return u.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return c=t.props.user.currentUser,e.next=3,b.a.get("".concat(I,"/interact/update-tui-account?account_id=").concat(a,"&state=").concat(n,"&operator_name=").concat(null===c||void 0===c?void 0:c.name,"&operator_uid=").concat(null===c||void 0===c?void 0:c.userId));case 3:o=e.sent,0===o.data.code?(t.fetchAccounts(),h["a"].success("".concat(1===n?"\u542f\u52a8":"\u505c\u6b62","\u6210\u529f"))):h["a"].error("".concat(1===n?"\u542f\u52a8":"\u505c\u6b62","\u5931\u8d25\uff1a").concat(o.data.reason)),Object(E["saveLog"])({log_source:{tag:"interaction"},action_method:"update-tui-account",target_data:{account_id:a,state:n,operator_name:null===c||void 0===c?void 0:c.name,operator_uid:null===c||void 0===c?void 0:c.userId,res:o.data}});case 6:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),this.handleGotoSwitchConfig=(()=>{this.props.history.push("/tui_config")}),this.handleShowAddingModal=(()=>{this.setState({addingModalvisible:!0})}),this.handleHideAddingModal=(()=>{this.setState({addingModalvisible:!1})}),this.handleAddTask=m()(u.a.mark(function e(){var a,n,c;return u.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.state.adding,n=t.props.user.currentUser,e.next=4,b.a.get("".concat(I,"/interact/add-tui-accounts?type=").concat(a.type,"&account_ids=").concat(a.account_ids,"&state=").concat(a.state,"&operator_name=").concat(null===n||void 0===n?void 0:n.name,"&operator_uid=").concat(null===n||void 0===n?void 0:n.userId));case 4:c=e.sent,0===c.data.code?(t.fetchAccounts(),t.setState({adding:{type:"UGC",account_ids:"",state:1}}),h["a"].success("\u65b0\u589e\u6210\u529f")):h["a"].error("\u65b0\u589e\u5931\u8d25\uff1a".concat(c.data.reason)),Object(E["saveLog"])({log_source:{tag:"interaction"},action_method:"add-tui-account",target_data:{type:a.type,account_ids:a.account_ids,state:a.state,operator_name:null===n||void 0===n?void 0:n.name,operator_uid:null===n||void 0===n?void 0:n.userId,res:c.data}});case 7:case"end":return e.stop()}},e)})),this.handleAddingModalOK=m()(u.a.mark(function e(){return u.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.handleAddTask();case 2:t.handleHideAddingModal();case 3:case"end":return e.stop()}},e)})),this.handleChangeType=(e=>{this.setState({type:e})}),this.handleChangeAccountId=(e=>{this.setState({account_id:e})}),this.handleChangeStatus=(e=>{this.setState({state:e})}),this.handleChangePage=(e=>{this.setState({offset:10*(e-1)},m()(u.a.mark(function e(){return u.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.fetchAccounts();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})))}),this.handleChangeAddingType=(e=>{var t=this.state.adding;t.type=e,this.setState({adding:t})}),this.handleChangeAddingAccountId=(e=>{var t=this.state.adding;t.account_ids=e,this.setState({adding:t})}),this.handleChangeAddingState=(e=>{var t=this.state.adding;t.state=e.target.value,this.setState({adding:t})}),this.state={accounts:[],addingModalvisible:!1,type:"",account_id:"",state:-1,offset:0,total:0,adding:{type:"UGC",account_ids:"",state:1}}}fetchAccounts(){var e=this;return m()(u.a.mark(function t(){var a,n,c,o,r,i;return u.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return a=e.state,n=a.type,c=a.account_id,o=a.state,r=a.offset,t.next=3,b.a.get("".concat(I,"/interact/get-tui-accounts?type=").concat(n,"&account_id=").concat(0===c.trim().length?-1:c.trim(),"&state=").concat(o,"&offset=").concat(r,"&count=10"));case 3:i=t.sent,0===i.data.code?e.setState({accounts:i.data.result,total:i.data.total}):h["a"].error("\u83b7\u53d6\u5931\u8d25\uff1a".concat(i.data.reason));case 5:case"end":return t.stop()}},t)}))()}componentDidMount(){var e=this;return m()(u.a.mark(function t(){var a;return u.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:a=e.props.auth.currentAuth,(null===a||void 0===a?void 0:a.childAuths.includes("tui"))||e.props.history.push("/no_auth"),e.fetchAccounts();case 3:case"end":return t.stop()}},t)}))()}render(){var e=this.state,t={labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:19}}};return console.log(this.props.user.currentUser),w.a.createElement("div",{className:"main-content-with-page-header"},w.a.createElement(d["a"],null,w.a.createElement(s["a"],null,w.a.createElement(s["a"].Item,null,"\u4eba\u5de5\u5e72\u9884"),w.a.createElement(s["a"].Item,null,"\u63a8\u4e00\u63a8\u5f00\u5173"))),w.a.createElement(d["a"],null,w.a.createElement("div",{style:{overflow:"hidden"}},w.a.createElement(g["a"],{type:"primary",onClick:this.handleGotoSwitchConfig,style:{float:"right"}},"\u914d\u7f6e\u63a8\u4e00\u63a8"),w.a.createElement(g["a"],{type:"primary",icon:"plus",onClick:this.handleShowAddingModal,style:{float:"right",marginRight:"10px"}},"\u65b0\u589e\u64cd\u4f5c"),w.a.createElement(i["a"],{layout:"inline"},w.a.createElement(i["a"].Item,{label:"\u8d26\u53f7\u7c7b\u578b"},w.a.createElement(v["a"],{value:e.type,style:{width:90},onChange:this.handleChangeType},w.a.createElement(_,{value:""},"\u5168\u90e8"),w.a.createElement(_,{value:"UGC"},"UGC"),w.a.createElement(_,{value:"PGC"},"PGC"))),w.a.createElement(i["a"].Item,{label:"\u81ea\u5a92\u4f53ID/UID"},w.a.createElement(r["a"],{value:e.account_id,onChange:e=>this.handleChangeAccountId(e.target.value)})),w.a.createElement(i["a"].Item,{label:"\u72b6\u6001"},w.a.createElement(v["a"],{value:e.state,style:{width:90},onChange:this.handleChangeStatus},w.a.createElement(_,{value:-1},"\u5168\u90e8"),w.a.createElement(_,{value:0},"\u5df2\u505c\u6b62"),w.a.createElement(_,{value:1},"\u5df2\u5f00\u59cb"))),w.a.createElement(i["a"].Item,null,w.a.createElement(g["a"],{type:"primary",onClick:()=>this.fetchAccounts()},"\u67e5\u8be2")))),w.a.createElement(o["a"],{dataSource:e.accounts,columns:this.accountsColumns,rowKey:e=>"".concat(e.account_id).concat(Math.random()),pagination:{total:e.total,onChange:this.handleChangePage,showTotal:(e,t)=>"\u5171".concat(e,"\u6761")},style:{marginTop:"15px"}}),w.a.createElement(c["a"],{title:"\u8d26\u53f7\u63a8\u4e00\u63a8",visible:this.state.addingModalvisible,onOk:this.handleAddingModalOK,onCancel:this.handleHideAddingModal,okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",width:500},w.a.createElement(i["a"],Object.assign({},t),w.a.createElement(i["a"].Item,{label:"\u8d26\u53f7\u7c7b\u578b"},w.a.createElement(v["a"],{value:e.adding.type,style:{width:90},onChange:this.handleChangeAddingType},w.a.createElement(_,{value:"UGC"},"UGC"),w.a.createElement(_,{value:"PGC"},"PGC"))),w.a.createElement(i["a"].Item,{label:"UID"},w.a.createElement(r["a"],{value:e.adding.account_ids,onChange:e=>this.handleChangeAddingAccountId(e.target.value)})),w.a.createElement(i["a"].Item,{label:"\u8fbe\u4eba\u63a8\u4e00\u63a8"},w.a.createElement(n["a"].Group,{onChange:this.handleChangeAddingState,value:e.adding.state},w.a.createElement(n["a"],{value:1},"\u5f00\u59cb"),w.a.createElement(n["a"],{value:0},"\u505c\u6b62")))))))}}t["default"]=Object(f["c"])(e=>{var t=e.user,a=e.auth;return{user:t,auth:a}})(k)}}]);