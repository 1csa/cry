(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{JPA3:function(e,t,a){e.exports={gid:"gid","gid-content":"gid-content","ant-card-body":"ant-card-body"}},NZfQ:function(e,t,a){"use strict";a.r(t);a("2qtc");var n=a("kLXV"),r=(a("g9YV"),a("wCAj")),s=(a("+L6B"),a("2/Rp")),c=(a("IzEo"),a("bx4M")),i=a("d6i3"),l=a.n(i),u=(a("miYZ"),a("tsqr")),d=a("1l/V"),o=a.n(d),m=(a("P2fV"),a("NJEC")),p=(a("/zsF"),a("PArb")),g=a("qIgq"),b=a.n(g),f=a("q1tI"),E=a.n(f),w=a("CN3I"),y=a("vbjC"),v=a("TS7C"),h=a("aMlF"),x=a("KYPV"),k=a("A89l"),C=a("dmjX"),j=(a("TpwP"),a("JPA3"),y["a"].Item),S={labelCol:{sm:{span:4}},wrapperCol:{sm:{span:8}}},O={wrapperCol:{sm:{span:8,offset:4}}},I=()=>{var e=Object(f["useState"])(!1),t=b()(e,2),a=t[0],i=t[1],d=Object(f["useState"])([]),g=b()(d,2),I=g[0],P=g[1],V=Object(f["useState"])(0),q=b()(V,2),z=q[0],A=q[1],J=Object(f["useState"])({pageSize:10,total:z,current:1}),N=b()(J,2),T=N[0],M=N[1],L=Object(f["useState"])(!1),R=b()(L,2),Y=R[0],B=R[1],F=Object(f["useState"])(!0),K=b()(F,2),X=K[0],Z=K[1],Q=Object(f["useState"])({}),D=b()(Q,2),G=D[0],H=D[1];Object(f["useEffect"])(()=>{$()},[]);var U=[{title:"\u5e8f\u53f7",key:"index",render:(e,t,a)=>{return(T.current-1)*T.pageSize+a+1}},{title:"gid",dataIndex:"gid",key:"gid"},{title:"gid name",dataIndex:"name",key:"gid name"},{title:"\u72b6\u6001",dataIndex:"status",key:"status",render:(e,t)=>{return 1===e?"\u7ebf\u4e0a\u4f7f\u7528\u4e2d":0===e?"\u7ebf\u4e0a\u672a\u4f7f\u7528\uff0c\u53ef\u590d\u7528":"\u7ebf\u4e0a\u672a\u4f7f\u7528\uff0c\u88ab\u5176\u4ed6\u6a21\u5757\u5199\u6b7b\u7b49\u5bfc\u81f4\u4e0d\u53ef\u590d\u7528"}},{title:"\u64cd\u4f5c",key:"operate",render:(e,t)=>{return E.a.createElement("span",null,E.a.createElement("a",{onClick:()=>ae(t)},"\u7f16\u8f91"),E.a.createElement(p["a"],{type:"vertical"}),[0,1].includes(t.status)&&E.a.createElement(m["a"],{title:"\u786e\u5b9a\u8981".concat(1===t.status?"\u5220\u9664":"\u6062\u590d"," gid \u4e3a ").concat(t.gid,"\uff0cname \u4e3a ").concat(t.name," \u7684\u8bb0\u5f55\u5417?"),okText:"\u786e\u5b9a",cancelText:"\u53d6\u6d88",onConfirm:()=>_(t.gid,1===t.status?0:1)},E.a.createElement("a",null,1===t.status?"\u5220\u9664":"\u6062\u590d")),-1===t.status&&E.a.createElement("span",null,"\u4e0d\u53ef\u6062\u590d"))}}],W=e=>{M(e)},$=function(){var e=o()(l.a.mark(function e(){var t,a,n;return l.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return i(!0),e.next=3,C["e"]();case 3:t=e.sent,a=t.status,n=t.data,"success"===a?(P(n),A(n.length),i(!1)):(i(!1),u["a"].error("\u83b7\u53d6 gid \u5931\u8d25!"));case 7:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),_=function(){var e=o()(l.a.mark(function e(t,a){var n,r;return l.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,C["c"](t,a);case 2:n=e.sent,r=n.status,"success"===r?(u["a"].success("gid \u72b6\u6001\u4fee\u6539\u6210\u529f!"),$()):u["a"].error("gid \u72b6\u6001\u4fee\u6539\u5931\u8d25!");case 5:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),ee=()=>{return X?{gid:void 0,name:"",status:0}:G},te=()=>{B(!0),Z(!0)},ae=e=>{B(!0),H(e),Z(!1)},ne=function(){var e=o()(l.a.mark(function e(t){var a,n,r,s;return l.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!X){e.next=8;break}return e.next=3,C["a"](t);case 3:a=e.sent,n=a.status,"success"===n?(u["a"].success("\u65b0\u589e gid \u6210\u529f!"),$(),B(!1)):u["a"].error("\u65b0\u589e gid \u5931\u8d25!"),e.next=13;break;case 8:return e.next=10,C["h"](t);case 10:r=e.sent,s=r.status,"success"===s?(u["a"].success("\u66f4\u65b0 gid \u6210\u529f!"),$(),B(!1)):u["a"].error("\u66f4\u65b0 gid \u5931\u8d25!");case 13:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();return E.a.createElement("div",{className:"gid"},E.a.createElement(w["a"],{currentMenu:"gid \u7ba1\u7406",currentSubMenu:"\u5217\u8868"}),E.a.createElement(c["a"],{className:"gid-content"},E.a.createElement(s["a"],{type:"primary",icon:"plus",style:{marginBottom:"24px"},onClick:te},"\u65b0\u589e"),E.a.createElement(r["a"],{columns:U,dataSource:I,rowKey:e=>e.gid+"",bordered:!0,pagination:T,loading:a,onChange:W})),E.a.createElement(n["a"],{title:X?"\u65b0\u589e gid":"\u7f16\u8f91 gid",visible:Y,width:1e3,footer:null,onCancel:()=>B(!1)},E.a.createElement(x["c"],{initialValues:ee(),onSubmit:e=>ne(e),enableReinitialize:!0},e=>{var t=e.handleReset;return E.a.createElement(y["a"],Object.assign({},S),E.a.createElement(j,{name:"gid",label:"gid",validate:k["a"]},E.a.createElement(v["a"],{name:"gid",style:{width:"100%"},placeholder:"\u8bf7\u8f93\u5165 gid",disabled:!X})),E.a.createElement(j,{name:"name",label:"gid name",validate:k["b"]},E.a.createElement(h["a"],{name:"name",style:{width:"100%"},placeholder:"\u8bf7\u8f93\u5165 gid name"})),E.a.createElement(j,Object.assign({},O,{name:"operate"}),E.a.createElement(s["a"],{type:"primary",icon:"save",htmlType:"submit"},"\u4fdd\u5b58"),E.a.createElement(s["a"],{type:"primary",icon:"rollback",style:{marginLeft:"20px"},onClick:t},"\u91cd\u7f6e")))})))};t["default"]=I}}]);