(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{"+ego":function(e,a,t){"use strict";t.r(a);t("S+Hq");var n=t("7xuC"),l=t("ERkP"),r=t.n(l),o=t("gMRz"),c=t.n(o),s=(t("qXJo"),t("rAmn")),m=t("uDfI"),i=(t("oBUM"),()=>{var e="//pandora.yidian-inc.com/tools/admin/login",a=location.href;location.href="".concat(e,"?callback=").concat(a)}),u=e=>{var a=e.children,t=e.user,n=e.dispatch,o=t.currentUser,c=o&&o.isAuthing,m=o&&o.email,u=!m&&!c;return Object(l["useEffect"])(()=>{n({type:"user/fetchCurrent"})},[]),r.a.createElement(r.a.Fragment,null,m?a:u?i():r.a.createElement("div",{className:"page-loading"},r.a.createElement(s["a"],{size:"large",spinning:c})))},d=Object(m["c"])(e=>{var a=e.user;return{user:a}})(u),p=(t("OuEz"),t("nEO1")),g=(t("DoiJ"),t("9xBf")),h=(t("b69p"),t("5oqr")),E=(t("oosw"),t("/Oqt")),y=(t("TPNu"),t("VogX")),b=(t("DjZ7"),t("S0yW")),k=t("daAW"),f=t("O94r"),v=t.n(f),N={appId:"local-groundpush",appName:"\u8eab\u8fb9.\u5730\u63a8\u7ba1\u7406\u5e73\u53f0",logo:"http://si1.go2yd.com/get-image/0bUUxwSrgMi",menus:[{key:"/",icon:"dashboard",name:"\u5168\u5c40\u6570\u636e"},{key:"/statistic",icon:"file-text",name:"\u8be6\u60c5\u6570\u636e",subMenu:[{key:"/statistic",name:"\u56e2\u961f/\u533a\u57df\u7edf\u8ba1"},{key:"/statistic/user",name:"\u7528\u6237\u7edf\u8ba1"}]},{key:"/auth",icon:"control",name:"\u6743\u9650\u7ba1\u7406",subMenu:[{key:"/auth",name:"\u56e2\u961f\u7ba1\u7406"},{key:"/auth/member",name:"\u5730\u63a8\u5458\u7ba1\u7406"}]},{key:"/sign",icon:"compass",name:"\u7b7e\u5230\u7edf\u8ba1"}],layout:{hasSidebar:!0,theme:"dark"}},w=N,S=(t("F72t"),p["a"].Header),x=b["a"].Item,M=b["a"].SubMenu,O=e=>e.map(e=>{return e.subMenu&&e.subMenu.length>0?r.a.createElement(M,{key:e.key,title:r.a.createElement("span",null,r.a.createElement(y["a"],{type:e.icon}),r.a.createElement("span",null,e.name))},O(e.subMenu)):r.a.createElement(x,{key:e.key},r.a.createElement(k["Link"],{to:e.key},r.a.createElement(y["a"],{type:e.icon}),r.a.createElement("span",null,e.name)))});class z extends r.a.Component{render(){var e=this.props,a=this.props.currentUser,t=void 0===a?{}:a,n=r.a.createElement(b["a"],{className:"action-menu-dropdown"},r.a.createElement(x,null,r.a.createElement(y["a"],{type:"mail"}),t.email),r.a.createElement(b["a"].Divider,null),r.a.createElement(x,null,r.a.createElement(y["a"],{type:"rollback"}),r.a.createElement("a",{href:"//pandora.yidian-inc.com"},"\u8fd4\u56de Pandora \u5de5\u5177\u5e73\u53f0"))),l=v()({"global-header":!0,"global-header-dark":"dark"===this.props.theme,"global-header-light":"light"===this.props.theme});return r.a.createElement(S,{className:l},r.a.createElement("div",{className:"global-header-inner"},r.a.createElement("div",{className:"logo"},r.a.createElement(k["Link"],{to:"/"},w.logo?r.a.createElement("img",{src:w.logo.toString(),alt:""}):null,r.a.createElement("h1",null,w.appName))),r.a.createElement(b["a"],{className:"main-menu",theme:this.props.theme,mode:"horizontal",defaultSelectedKeys:e.defaultSelectedKeys},O(w.menus)),r.a.createElement("div",{className:"action-menus"},r.a.createElement(E["a"],{className:"action-menu",overlay:n},r.a.createElement("span",null,r.a.createElement(h["a"],{size:"small",src:t.avatar||"//s.go2yd.com/a/thead_meiguoduizhang.png"}),r.a.createElement("span",null,t.name))),w.helpDoc?r.a.createElement(g["a"],{placement:"bottom",title:"\u4f7f\u7528\u6587\u6863"},r.a.createElement("a",{className:"action-menu",href:w.helpDoc,target:"__blank"},r.a.createElement(y["a"],{type:"question-circle"}))):null)))}}var D=Object(m["c"])(e=>({currentUser:e.user.currentUser}))(z),U=(t("wNoj"),p["a"].Footer),j=()=>{return r.a.createElement(U,{className:"global-footer"},(new Date).getFullYear()," @ \u4e00\u70b9\u8d44\u8baf")},C=j;function I(e){var a=new RegExp("/app/".concat(e,"(/(w*))?")),t=location.pathname.replace(a,"$1");t.endsWith("/")&&(t=t.substring(0,t.length-1));var n=t.split("/");return n=n.length>=2?n.filter(e=>""!==e).map(e=>"/".concat(e)):["/"],{original:t,splited:n}}t("W660");var q=I(w.appId).splited,K=p["a"].Content;class L extends l["Component"]{constructor(){super(...arguments),this.state={collapsed:!1},this.toggleSider=(()=>{this.setState({collapsed:!this.state.collapsed})})}render(){return r.a.createElement(p["a"],{className:"basic-layout"},r.a.createElement(D,{defaultSelectedKeys:q,theme:this.props.theme,collapsed:this.state.collapsed,toggleSider:this.toggleSider}),r.a.createElement(K,{className:"basic-layout-content"},this.props.children),r.a.createElement(C,null))}}var _=L,F=(t("h3zL"),p["a"].Header),R=b["a"].Item,W=e=>{var a=e.user.currentUser,t=void 0===a?{}:a,n=r.a.createElement(b["a"],{className:"action-menu-dropdown"},r.a.createElement(R,null,r.a.createElement(y["a"],{type:"mail"}),t.email),r.a.createElement(b["a"].Divider,null),r.a.createElement(R,null,r.a.createElement(y["a"],{type:"rollback"}),r.a.createElement("a",{href:"/"},"\u8fd4\u56de Pandora \u5de5\u5177\u5e73\u53f0")));return r.a.createElement(F,{className:"global-header"},r.a.createElement(y["a"],{className:"sider-trigger",type:e.collapsed?"menu-unfold":"menu-fold",onClick:e.toggleSider}),r.a.createElement("div",{className:"action-menus"},r.a.createElement(E["a"],{className:"action-menu",overlay:n},r.a.createElement("span",null,r.a.createElement(h["a"],{size:"small",src:t.avatar||"//s.go2yd.com/a/thead_meiguoduizhang.png"}),r.a.createElement("span",null,t.name))),w.helpDoc?r.a.createElement(g["a"],{placement:"bottom",title:"\u4f7f\u7528\u6587\u6863"},r.a.createElement("a",{className:"action-menu",href:w.helpDoc,target:"__blank"},r.a.createElement(y["a"],{type:"question-circle"}))):null))},H=Object(m["c"])(e=>{var a=e.user;return{user:a}})(W),J=(t("l7QO"),p["a"].Sider),P=b["a"].Item,A=b["a"].SubMenu,B=e=>e.map(e=>{return e.subMenu&&e.subMenu.length>0?r.a.createElement(A,{key:e.key,title:r.a.createElement("span",null,r.a.createElement(y["a"],{type:e.icon}),r.a.createElement("span",null,e.name))},B(e.subMenu)):r.a.createElement(P,{key:e.key},r.a.createElement(k["Link"],{to:e.key},e.icon&&r.a.createElement(y["a"],{type:e.icon}),r.a.createElement("span",null,e.name)))}),G=e=>{return r.a.createElement(J,{theme:e.theme,width:"230",trigger:null,collapsible:!0,collapsed:e.collapsed},r.a.createElement("div",{className:"logo"},r.a.createElement(k["Link"],{to:"/"},w.logo?r.a.createElement("img",{src:w.logo.toString(),alt:"",className:"logo-content"}):null,r.a.createElement("h1",null,w.appName))),r.a.createElement(b["a"],{theme:e.theme,mode:"inline",defaultSelectedKeys:e.defaultSelectedKeys},B(w.menus)))},Q=G,X=(t("5RGE"),I(w.appId).splited);class T extends l["Component"]{constructor(){super(...arguments),this.state={collapsed:!0},this.toggleSider=(()=>{this.setState({collapsed:!this.state.collapsed})})}render(){return r.a.createElement(p["a"],{className:"sidebar-layout"},r.a.createElement(Q,{defaultSelectedKeys:X,theme:this.props.theme,collapsed:this.state.collapsed}),r.a.createElement(p["a"],null,r.a.createElement(H,{collapsed:this.state.collapsed,toggleSider:this.toggleSider}),r.a.createElement("div",{style:{height:document.body.clientHeight-124,overflow:"scroll"},className:"sidebar-layout-content"},this.props.children),r.a.createElement(C,null)))}}var V=Object(l["memo"])(T),Y=w.layout,Z=e=>r.a.createElement(d,null,r.a.createElement(n["a"],{locale:c.a},Y.hasSidebar?r.a.createElement(V,{theme:Y.theme},e.children):r.a.createElement(_,{theme:Y.theme},e.children)));a["default"]=Z},"5RGE":function(e,a,t){e.exports={"sidebar-layout":"sidebar-layout","sidebar-layout-content":"sidebar-layout-content","sider-trigger":"sider-trigger"}},F72t:function(e,a,t){e.exports={"basic-layout":"basic-layout","global-header":"global-header","global-header-inner":"global-header-inner",logo:"logo","main-menu":"main-menu","ant-menu-item":"ant-menu-item","action-menus":"action-menus","action-menu":"action-menu","ant-avatar":"ant-avatar","global-header-dark":"global-header-dark","ant-menu-item-selected":"ant-menu-item-selected","global-header-light":"global-header-light","action-menu-dropdown":"action-menu-dropdown","ant-dropdown-menu-item":"ant-dropdown-menu-item"}},W660:function(e,a,t){e.exports={"basic-layout-content":"basic-layout-content","page-header":"page-header","main-content":"main-content","main-content-with-page-header":"main-content-with-page-header","sider-trigger":"sider-trigger"}},h3zL:function(e,a,t){e.exports={"sidebar-layout":"sidebar-layout","global-header":"global-header","action-menus":"action-menus","action-menu":"action-menu","ant-avatar":"ant-avatar","action-menu-dropdown":"action-menu-dropdown","ant-dropdown-menu-item":"ant-dropdown-menu-item"}},l7QO:function(e,a,t){e.exports={"ant-layout-sider":"ant-layout-sider",logo:"logo","logo-content":"logo-content","ant-layout-sider-light":"ant-layout-sider-light"}},oBUM:function(e,a,t){e.exports={"page-loading":"page-loading"}},wNoj:function(e,a,t){e.exports={"global-footer":"global-footer"}}}]);