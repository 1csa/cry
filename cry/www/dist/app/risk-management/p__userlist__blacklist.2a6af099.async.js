(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"/V6n":function(e,a,t){"use strict";t.r(a);t("42uY");var s=t("lGXO"),n=(t("YdMF"),t("dVZ9")),r=(t("oeo2"),t("BmDy")),l=(t("vgpD"),t("UL5a")),i=(t("M6c6"),t("jMRu")),c=(t("zI7Q"),t("SCaQ")),o=(t("i8iW"),t("NjSG")),m=(t("TPNu"),t("VogX")),u=(t("Yzaq"),t("d+ro")),d=t("Z32k"),j=t.n(d),p=(t("IJu9"),t("DuHN")),b=t("JGaj"),h=t.n(b),f=t("maMK"),v=t.n(f),y=(t("ljfu"),t("x2dm")),g=(t("Iaxd"),t("i6l0")),k=t("ERkP"),E=t.n(k),T=t("CN3I"),w=t("wgY5"),O=t.n(w),N=t("nFqN"),I=t("wknW"),z=t("ggb3"),x=t.n(z),S=t("fcGt"),C=g["a"].RangePicker,Y=y["a"].Option,J="YYYY-MM-DD",D="YYYY-MM-DD HH:mm",B=[{name:"USERID",value:"USERID"}],M=e=>{var a=e.form,t=a.getFieldDecorator,d=a.validateFieldsAndScroll,b=(a.resetFields,Object(k["useState"])(!0)),f=v()(b,2),g=f[0],w=f[1],z=Object(k["useState"])(!1),M=v()(z,2),U=M[0],R=M[1],V=Object(k["useState"])(0),P=v()(V,2),Q=P[0],F=P[1],q=Object(k["useState"])({startTime:O()().subtract(30,"days").format(J),endTime:O()().format(J),userId:"",type:"BLACK",dimension:"USERID",offset:0,limit:10}),L=v()(q,2),H=L[0],K=L[1],Z=Object(k["useState"])([]),A=v()(Z,2),G=A[0],W=A[1],X=Object(k["useState"])(!1),_=v()(X,2),$=_[0],ee=_[1];Object(k["useEffect"])(()=>{ae(H)},[$]);var ae=function(){var e=h()(j.a.mark(function e(a){var t,s;return j.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=["startTime","endTime"],t.map(e=>{""===a[e]&&delete a[e]}),e.next=4,x.a.post("/api/proxy/".concat(I["a"].API_HOST,"/nameList/list"),a);case 4:s=e.sent,200===s.data.status?(W(s.data.data.list),F(s.data.data.total)):p["a"].error("\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5"),w(!1);case 7:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),te=(e,a)=>{w(!0);var t=Object.assign({},H);t.offset=e-1,K(t),ee(!$)},se=[{title:"\u7528\u6237ID",dataIndex:"value",key:"value"},{title:"\u5f02\u5e38\u7c7b\u578b",dataIndex:"dimension",key:"dimension"},{title:"\u539f\u56e0",dataIndex:"remarks",key:"remarks"},{title:"\u64cd\u4f5c\u4eba",dataIndex:"createUser",key:"createUser",render:e=>"\u7cfb\u7edf\u8bc6\u522b"===e?E.a.createElement(u["a"],{color:"purple"},E.a.createElement(m["a"],{type:"robot"})," ",e):E.a.createElement(u["a"],{color:"cyan"},E.a.createElement(m["a"],{type:"user"})," ",e)},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"createTime",key:"createTime",render:e=>O()(e).format(D)},{title:"\u64cd\u4f5c",dataIndex:"action",key:"action",width:80,render:(e,a)=>{return E.a.createElement(o["a"],{title:"\u786e\u5b9a\u5220\u9664\u5417\uff1f",placement:"topRight",okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",onConfirm:()=>{ne(a)},icon:E.a.createElement(m["a"],{type:"question-circle-o",style:{color:"red"}})},E.a.createElement(c["a"],{size:"small",icon:"delete",style:{backgroundColor:"#f50",borderColor:"#f50"},type:"primary"},"\u79fb\u9664"))}}],ne=function(){var e=h()(j.a.mark(function e(a){var t,s;return j.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,x.a.post("/api/proxy/".concat(I["a"].API_HOST,"/nameList/updateStatus"),{id:a.id,createUser:decodeURIComponent(Object(S["b"])("nickname"))});case 2:t=e.sent,200===t.data.status?(s=[],s=s.concat(G),s.map((e,t)=>{e.id===a.id&&s.splice(t,1)}),W(s),p["a"].success("\u5220\u9664\u6210\u529f")):p["a"].error("\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");case 4:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),re=()=>{R(!0)},le=e=>{e.preventDefault(),w(!0),d((e,a)=>{if(!e){var t=Object.assign({},H);t.userId=a.userId,t.dimension=a.dimension,K(t),ee(!$)}})},ie=(e,a)=>{var t=Object.assign({},H);t.startTime=a[0],t.endTime=a[1],K(t)},ce=e=>{console.log("onOk: ",e)},oe=E.a.createElement(c["a"],{type:"primary",icon:"plus",onClick:re},"\u52a0\u9ed1\u540d\u5355");return E.a.createElement(E.a.Fragment,null,E.a.createElement("div",{className:"main-content"},E.a.createElement(T["a"],{current:"\u9ed1\u540d\u5355\u7ba1\u7406",home:"\u9ed1\u767d\u540d\u5355",children:oe}),E.a.createElement(i["a"],{bordered:!1,style:{minHeight:380,marginTop:"-25px"}},E.a.createElement(l["a"],{layout:"inline",onSubmit:le,style:{marginBottom:"10px"}},E.a.createElement(l["a"].Item,{label:"userid"},t("userId",{initialValue:H.userId})(E.a.createElement(r["a"],{style:{width:140},placeholder:"\u8bf7\u8f93\u5165userid"}))),E.a.createElement(l["a"].Item,{label:"\u64cd\u4f5c\u65f6\u95f4"},t("creat_time",{initialValue:[O()().subtract(30,"days"),O()()]})(E.a.createElement(C,{format:J,placeholder:["\u5f00\u59cb\u65f6\u95f4","\u7ed3\u675f\u65f6\u95f4"],onChange:ie,onOk:ce,style:{width:"245px"}}))),E.a.createElement(l["a"].Item,{label:"\u5f02\u5e38\u7c7b\u578b"},t("dimension",{initialValue:H.dimension})(E.a.createElement(y["a"],{style:{width:100}},B.map(e=>E.a.createElement(Y,{value:e.value,key:e.value},e.name))))),E.a.createElement(l["a"].Item,null,E.a.createElement(c["a"],{type:"primary",htmlType:"submit"},"\u641c\u7d22"))),E.a.createElement(n["a"],{columns:se,loading:g,dataSource:G,rowKey:e=>e.id,pagination:!1}),E.a.createElement(s["a"],{style:{marginTop:"20px",float:"right"},total:Q,showQuickJumper:!0,onChange:te,current:H.offset+1}),E.a.createElement(N["a"],{adddrawervisible:U,setAdddrawervisible:R,userList:G,setUserList:W,typeList:B,type:"BLACK"}))))},U=l["a"].create({name:"validate_other"})(M);a["default"]=U},CN3I:function(e,a,t){"use strict";t("zAnB");var s=t("cUST"),n=(t("jz31"),t("8VRj")),r=(t("OuEz"),t("nEO1")),l=t("ERkP"),i=t.n(l),c=(t("tbSg"),r["a"].Content);class o extends l["Component"]{render(){var e=this.props;return i.a.createElement("div",{className:"page-header"},i.a.createElement(c,null,i.a.createElement("div",{className:"layout-container",style:{position:"relative"}},i.a.createElement(n["a"],null,i.a.createElement(n["a"].Item,null,e.home),i.a.createElement(n["a"].Item,null,e.current)),i.a.createElement("div",{style:{position:"absolute",right:"0",top:"0"}},e.children)),i.a.createElement(s["a"],{dashed:!0})))}}o.defaultProps={home:"\u9996\u9875",current:"\u5f53\u524d\u9875\u9762\u6807\u9898\u672a\u6307\u5b9a"},a["a"]=o},MROq:function(e,a,t){var s={"./af":"8GSH","./af.js":"8GSH","./ar":"NcOb","./ar-dz":"1ors","./ar-dz.js":"1ors","./ar-kw":"Sc1Y","./ar-kw.js":"Sc1Y","./ar-ly":"GzvP","./ar-ly.js":"GzvP","./ar-ma":"hH25","./ar-ma.js":"hH25","./ar-sa":"u2jB","./ar-sa.js":"u2jB","./ar-tn":"5Mza","./ar-tn.js":"5Mza","./ar.js":"NcOb","./az":"ZVVJ","./az.js":"ZVVJ","./be":"kQaN","./be.js":"kQaN","./bg":"+n5x","./bg.js":"+n5x","./bm":"TTiN","./bm.js":"TTiN","./bn":"aIF2","./bn-bd":"lTqY","./bn-bd.js":"lTqY","./bn.js":"aIF2","./bo":"QWb5","./bo.js":"QWb5","./br":"iQoZ","./br.js":"iQoZ","./bs":"EL7g","./bs.js":"EL7g","./ca":"vd/2","./ca.js":"vd/2","./cs":"K+3W","./cs.js":"K+3W","./cv":"Jt3X","./cv.js":"Jt3X","./cy":"sWi3","./cy.js":"sWi3","./da":"YcFX","./da.js":"YcFX","./de":"BKZ+","./de-at":"Oq9h","./de-at.js":"Oq9h","./de-ch":"hHY4","./de-ch.js":"hHY4","./de.js":"BKZ+","./dv":"w8Ej","./dv.js":"w8Ej","./el":"tSbB","./el.js":"tSbB","./en-au":"HgyJ","./en-au.js":"HgyJ","./en-ca":"ZyTy","./en-ca.js":"ZyTy","./en-gb":"exaB","./en-gb.js":"exaB","./en-ie":"yKzn","./en-ie.js":"yKzn","./en-il":"TB59","./en-il.js":"TB59","./en-in":"S70V","./en-in.js":"S70V","./en-nz":"iDxo","./en-nz.js":"iDxo","./en-sg":"zS0P","./en-sg.js":"zS0P","./eo":"4bvN","./eo.js":"4bvN","./es":"GNPT","./es-do":"R7mU","./es-do.js":"R7mU","./es-mx":"FkqR","./es-mx.js":"FkqR","./es-us":"Nstw","./es-us.js":"Nstw","./es.js":"GNPT","./et":"ZOjb","./et.js":"ZOjb","./eu":"kFC9","./eu.js":"kFC9","./fa":"8Cju","./fa.js":"8Cju","./fi":"vcN1","./fi.js":"vcN1","./fil":"3g1g","./fil.js":"3g1g","./fo":"8Ygf","./fo.js":"8Ygf","./fr":"Y8Ij","./fr-ca":"t+Zl","./fr-ca.js":"t+Zl","./fr-ch":"SPXN","./fr-ch.js":"SPXN","./fr.js":"Y8Ij","./fy":"T3MF","./fy.js":"T3MF","./ga":"NowM","./ga.js":"NowM","./gd":"GJYX","./gd.js":"GJYX","./gl":"MdC8","./gl.js":"MdC8","./gom-deva":"QJjq","./gom-deva.js":"QJjq","./gom-latn":"5j0y","./gom-latn.js":"5j0y","./gu":"fY0S","./gu.js":"fY0S","./he":"ACAV","./he.js":"ACAV","./hi":"3WqV","./hi.js":"3WqV","./hr":"OnNk","./hr.js":"OnNk","./hu":"EQmw","./hu.js":"EQmw","./hy-am":"MNf7","./hy-am.js":"MNf7","./id":"0yow","./id.js":"0yow","./is":"TmOJ","./is.js":"TmOJ","./it":"xD/0","./it-ch":"foQf","./it-ch.js":"foQf","./it.js":"xD/0","./ja":"jOnb","./ja.js":"jOnb","./jv":"lOtj","./jv.js":"lOtj","./ka":"BAN/","./ka.js":"BAN/","./kk":"iNiw","./kk.js":"iNiw","./km":"TUxt","./km.js":"TUxt","./kn":"hQzt","./kn.js":"hQzt","./ko":"ZNZT","./ko.js":"ZNZT","./ku":"S0Tg","./ku.js":"S0Tg","./ky":"JO+T","./ky.js":"JO+T","./lb":"vn/h","./lb.js":"vn/h","./lo":"gnIm","./lo.js":"gnIm","./lt":"6PD3","./lt.js":"6PD3","./lv":"YKe2","./lv.js":"YKe2","./me":"d3TR","./me.js":"d3TR","./mi":"hTlv","./mi.js":"hTlv","./mk":"ffVN","./mk.js":"ffVN","./ml":"ejL1","./ml.js":"ejL1","./mn":"RIsM","./mn.js":"RIsM","./mr":"CPJk","./mr.js":"CPJk","./ms":"d5Hy","./ms-my":"t4T9","./ms-my.js":"t4T9","./ms.js":"d5Hy","./mt":"1KVU","./mt.js":"1KVU","./my":"LsNb","./my.js":"LsNb","./nb":"h+U8","./nb.js":"h+U8","./ne":"2JSI","./ne.js":"2JSI","./nl":"jsZ8","./nl-be":"+h6j","./nl-be.js":"+h6j","./nl.js":"jsZ8","./nn":"mh29","./nn.js":"mh29","./oc-lnc":"zX+o","./oc-lnc.js":"zX+o","./pa-in":"O6bP","./pa-in.js":"O6bP","./pl":"8Bez","./pl.js":"8Bez","./pt":"DDip","./pt-br":"uHm5","./pt-br.js":"uHm5","./pt.js":"DDip","./ro":"baBi","./ro.js":"baBi","./ru":"ecsu","./ru.js":"ecsu","./sd":"e9KM","./sd.js":"e9KM","./se":"CZRU","./se.js":"CZRU","./si":"TO58","./si.js":"TO58","./sk":"K+Lk","./sk.js":"K+Lk","./sl":"QK6v","./sl.js":"QK6v","./sq":"v3Qg","./sq.js":"v3Qg","./sr":"Ndyf","./sr-cyrl":"PGvg","./sr-cyrl.js":"PGvg","./sr.js":"Ndyf","./ss":"2B8G","./ss.js":"2B8G","./sv":"WF5B","./sv.js":"WF5B","./sw":"4VvY","./sw.js":"4VvY","./ta":"dw3T","./ta.js":"dw3T","./te":"4MAb","./te.js":"4MAb","./tet":"/hi0","./tet.js":"/hi0","./tg":"PoVJ","./tg.js":"PoVJ","./th":"OY2w","./th.js":"OY2w","./tk":"zO4H","./tk.js":"zO4H","./tl-ph":"UC+K","./tl-ph.js":"UC+K","./tlh":"cWLW","./tlh.js":"cWLW","./tr":"EqYs","./tr.js":"EqYs","./tzl":"fN8o","./tzl.js":"fN8o","./tzm":"6cYq","./tzm-latn":"pdAN","./tzm-latn.js":"pdAN","./tzm.js":"6cYq","./ug-cn":"J+SV","./ug-cn.js":"J+SV","./uk":"6Olw","./uk.js":"6Olw","./ur":"QNGR","./ur.js":"QNGR","./uz":"hLzJ","./uz-latn":"KqOT","./uz-latn.js":"KqOT","./uz.js":"hLzJ","./vi":"EnIJ","./vi.js":"EnIJ","./x-pseudo":"W7dU","./x-pseudo.js":"W7dU","./yo":"QDhB","./yo.js":"QDhB","./zh-cn":"bjMe","./zh-cn.js":"bjMe","./zh-hk":"JFCg","./zh-hk.js":"JFCg","./zh-mo":"5BRa","./zh-mo.js":"5BRa","./zh-tw":"xBDH","./zh-tw.js":"xBDH"};function n(e){var a=r(e);return t(a)}function r(e){if(!t.o(s,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=r,e.exports=n,n.id="MROq"},"n/bh":function(e,a,t){"use strict";t.d(a,"a",function(){return s}),t.d(a,"b",function(){return n}),t.d(a,"d",function(){return r}),t.d(a,"c",function(){return l});var s={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:12},sm:{span:12}}},n={wrapperCol:{xs:{span:24,offset:0},sm:{span:16,offset:10}}},r={id:-1,aliasName:"",calConditions:"",calFields:"",calInterval:"",countUnit:"s",calMethod:"",featureCnName:"",featureEnName:"",level1Type:"",level2Type:"",rawTableName:""},l=[{name:"\u79d2",value:"s"},{name:"\u5206",value:"min"},{name:"\u5c0f\u65f6",value:"h"},{name:"\u5929",value:"d"}]},nFqN:function(e,a,t){"use strict";t("zI7Q");var s=t("SCaQ"),n=(t("vgpD"),t("UL5a")),r=(t("TPNu"),t("VogX")),l=(t("MC8Q"),t("/n3E")),i=(t("oj2R"),t("/zI6")),c=t("Z32k"),o=t.n(c),m=(t("IJu9"),t("DuHN")),u=t("JGaj"),d=t.n(u),j=(t("ljfu"),t("x2dm")),p=(t("oeo2"),t("BmDy")),b=t("ERkP"),h=t.n(b),f=t("ggb3"),v=t.n(f),y=t("n/bh"),g=t("wknW"),k=t("fcGt"),E=p["a"].TextArea,T=j["a"].Option,w=e=>{var a=e.form,t=a.getFieldDecorator,c=a.validateFieldsAndScroll,u=a.resetFields,b=e.adddrawervisible,f=e.setAdddrawervisible,w=e.userList,O=e.setUserList,N=e.typeList,I=e.type,z=function(){var e=d()(o.a.mark(function e(a){var t,s;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a.type=I,a.createUser=decodeURIComponent(Object(k["b"])("nickname")),e.next=4,v.a.post("/api/proxy/".concat(g["a"].API_HOST,"/nameList/edit"),a);case 4:t=e.sent,200===t.data.status?(s=[],s=s.concat(w),s.unshift(a),O(s),m["a"].success("\u6dfb\u52a0\u6210\u529f"),f(!1)):m["a"].error(t.data.message);case 6:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),x=e=>{e.preventDefault(),c((e,a)=>{e||i["a"].confirm({title:"Confirm",content:"\u786e\u5b9a\u4fdd\u5b58\u5417\uff1f",okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",onOk(){z(a)}})})},S=()=>{f(!1),u()};return h.a.createElement(h.a.Fragment,null,h.a.createElement(l["a"],{title:h.a.createElement("div",null,h.a.createElement(r["a"],{type:"folder-open"})," \u6dfb\u52a0\u6570\u636e"),placement:"right",width:"500",closable:!0,onClose:S,visible:b},h.a.createElement(n["a"],Object.assign({},y["a"],{onSubmit:x}),h.a.createElement(n["a"].Item,{label:"userid"},t("value",{rules:[{required:!0,message:"userid\u5fc5\u987b\u8981\u586b\u5199"}]})(h.a.createElement(p["a"],{placeholder:"\u8bf7\u8f93\u5165uid"}))),h.a.createElement(n["a"].Item,{label:"\u5f02\u5e38\u7c7b\u578b"},t("dimension",{initialValue:N[0].value,rules:[{required:!0,message:"\u5f02\u5e38\u7c7b\u578b\u5fc5\u987b\u8981\u586b\u5199"}]})(h.a.createElement(j["a"],{style:{width:120}},N.map(e=>h.a.createElement(T,{value:e.value,key:e.value},e.name))))),h.a.createElement(n["a"].Item,{label:"\u539f\u56e0"},t("remarks")(h.a.createElement(E,{rows:3,placeholder:"\u8bf7\u8f93\u5165\u539f\u56e0..."}))),h.a.createElement(n["a"].Item,Object.assign({},y["b"]),h.a.createElement(s["a"],{type:"primary",htmlType:"submit"},"\u4fdd\u5b58")))))},O=n["a"].create({name:"validate_other"})(w);a["a"]=O},tbSg:function(e,a,t){e.exports={"page-header":"page-header","ant-breadcrumb":"ant-breadcrumb","page-header-title":"page-header-title","ant-layout-content":"ant-layout-content","layout-container":"layout-container"}}}]);