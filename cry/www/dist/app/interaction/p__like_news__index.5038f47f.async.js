(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"I+5y":function(t,e,a){"use strict";a("oj2R");var n=a("/zI6"),r=(a("YdMF"),a("dVZ9")),s=(a("M6c6"),a("jMRu")),i=a("Z32k"),o=a.n(i),c=a("JGaj"),l=a.n(c),d=(a("IJu9"),a("DuHN")),h=(a("zI7Q"),a("SCaQ")),u=(a("Yx0K"),a("gJMY")),p=(a("oeo2"),a("BmDy")),g=(a("OuEz"),a("nEO1")),m=a("ERkP"),y=a.n(m),v=a("uDfI"),I=a("ggb3"),w=a.n(I),f=(a("cpx/"),g["a"].Content),k="http://operationtoolservice.go2yd.int.yidian-inc.com";class x extends m["Component"]{constructor(t){super(t),this.historyColumns=[{title:"\u76ee\u6807id",dataIndex:"target_id",key:"target_id"},{title:"\u589e\u52a0\u6570\u91cf",dataIndex:"count",key:"count"},{title:"\u64cd\u4f5c\u4eba",dataIndex:"operator_name",key:"operator_name"},{title:"\u64cd\u4f5c\u65f6\u95f4",dataIndex:"creatAt",key:"creatAt"},{title:"\u72b6\u6001",dataIndex:"status",key:"status",render:t=>y.a.createElement("span",null,"success"===t?"\u5df2\u5b8c\u6210":"\u8fdb\u884c\u4e2d")}],this.targetsColumns=[{title:"\u76ee\u6807Id",dataIndex:"targetId",key:"targetId",render:(t,e,a)=>y.a.createElement(p["a"],{value:t,onChange:t=>this.handleTargetIdChange(t.target.value,a)})},{title:"\u589e\u52a0\u6570\u91cf",dataIndex:"count",key:"count",render:(t,e,a)=>y.a.createElement(u["a"],{value:t,onChange:t=>this.handleCountChange(t,a)})},{key:"action",render:(t,e,a)=>y.a.createElement(h["a"],{disabled:1===this.state.targets.length,type:"danger",size:"small",onClick:()=>this.handleRemoveTarget(a)},"\u5220\u9664")}],this.handleShowModal=(()=>{this.setState({visible:!0})}),this.handleHideModal=(()=>{this.setState({visible:!1})}),this.handleAddTarget=(()=>{var t=this.state.targets;t.push({id:this.state.targets.length,targetId:"",count:0}),this.setState({targets:t})}),this.handleOK=(()=>{for(var t=this.props,e=this.state,a=t.user.currentUser,n=e.targets,r=0;r<n.length;r++){var s=n[r];if(0===s.targetId.trim().length)return void d["a"].error("\u4e0d\u80fd\u5305\u542b\u7a7a\u76ee\u6807Id")}n.forEach(function(){var e=l()(o.a.mark(function e(n){var r,s;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,w.a.get("".concat(k,"/interact/fake-interact"),{params:{op:t.pathname||"",operator_id:a&&a.userId||"",operator_name:a&&a.name||"",target_id:n.targetId,count:n.count}});case 2:r=e.sent,s=r.data,0===s.code?d["a"].success("\u76ee\u6807".concat(n.targetId,"\u8bf7\u6c42\u53d1\u9001\u6210\u529f")):d["a"].error("\u76ee\u6807".concat(n.targetId,"\u8bf7\u6c42\u53d1\u9001\u5931\u8d25\uff1a").concat(s.reason));case 5:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()),this.handleHideModal(),setTimeout(()=>this.fetchHistory(),10)}),this.state={history:[],visible:!1,targets:[{id:0,targetId:"",count:0}]}}fetchHistory(){var t=this;return l()(o.a.mark(function e(){var a,n;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.props.pathname||"",e.next=3,w.a.get("".concat(k,"/interact/get-history?count=200&op=").concat(a));case 3:n=e.sent,0===n.data.code&&t.setState({history:n.data.result});case 5:case"end":return e.stop()}},e)}))()}handleTargetIdChange(t,e){var a=this.state.targets;a[e].targetId=t,this.setState({targets:a})}handleCountChange(t,e){var a=this.state.targets;a[e].count=t,this.setState({targets:a})}handleRemoveTarget(t){var e=this.state.targets;e.splice(t,1),this.setState({targets:e})}componentDidMount(){var t=this;return l()(o.a.mark(function e(){return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:t.fetchHistory();case 1:case"end":return e.stop()}},e)}))()}render(){var t=this.state,e=this.props.pathname||"";return y.a.createElement(f,null,y.a.createElement(s["a"],null,y.a.createElement("div",{style:{overflow:"hidden"}},y.a.createElement(h["a"],{type:"primary",icon:"plus",onClick:this.handleShowModal,style:{float:"right"}},"\u65b0\u589e\u64cd\u4f5c"),"follow_media"===e?y.a.createElement("p",{style:{lineHeight:"30px",color:"red"}},"*\u64cd\u4f5c\u540e\u5219\u589e\u52a0\u7c89\u4e1d\u6570\u7acb\u5373\u751f\u6548"):null),y.a.createElement(r["a"],{dataSource:t.history,columns:this.historyColumns,rowKey:t=>t.id,pagination:{showTotal:(t,e)=>"\u5171".concat(t,"\u6761")},style:{marginTop:"15px"}}),y.a.createElement(n["a"],{title:"\u65b0\u589e\u64cd\u4f5c",visible:this.state.visible,onOk:this.handleOK,onCancel:this.handleHideModal,okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88"},y.a.createElement(r["a"],{columns:this.targetsColumns,dataSource:this.state.targets,pagination:!1,rowKey:t=>t.id}),y.a.createElement(h["a"],{disabled:this.state.targets.length>=20,type:"primary",icon:"plus",size:"small",onClick:this.handleAddTarget,style:{marginTop:"15px",marginLeft:"15px"}},"\u65b0\u589e"))))}}e["a"]=Object(v["c"])(t=>{var e=t.user;return{user:e}})(x)},"cpx/":function(t,e,a){t.exports={"page-header":"page-header","ant-breadcrumb":"ant-breadcrumb","page-header-title":"page-header-title","ant-layout-content":"ant-layout-content","layout-container":"layout-container"}},jIwb:function(t,e,a){"use strict";a.r(e);a("jz31");var n=a("8VRj"),r=(a("M6c6"),a("jMRu")),s=a("Z32k"),i=a.n(s),o=a("JGaj"),c=a.n(o),l=a("ERkP"),d=a.n(l),h=a("I+5y"),u=a("uDfI");class p extends l["Component"]{componentDidMount(){var t=this;return c()(i.a.mark(function e(){var a;return i.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:a=t.props.auth.currentAuth,(null===a||void 0===a?void 0:a.childAuths.includes("like_news"))||t.props.history.push("/no_auth");case 2:case"end":return e.stop()}},e)}))()}render(){return d.a.createElement("div",{className:"main-content-with-page-header"},d.a.createElement(r["a"],null,d.a.createElement(n["a"],null,d.a.createElement(n["a"].Item,null,"\u4eba\u5de5\u5e72\u9884"),d.a.createElement(n["a"].Item,null,"\u6587\u7ae0\u70b9\u8d5e\u6570"))),d.a.createElement(h["a"],{pathname:this.props.location.pathname.substring(1)}))}}e["default"]=Object(u["c"])(t=>{var e=t.user,a=t.auth;return{user:e,auth:a}})(p)}}]);