(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{"+ego":function(e,a,t){"use strict";t.r(a);var n=t("ERkP"),l=t.n(n),r=(t("qXJo"),t("rAmn")),o=t("uDfI"),c=(t("oBUM"),()=>{var e="//pandora.yidian-inc.com/tools/admin/login",a=location.href;location.href="".concat(e,"?callback=").concat(a)}),i=e=>{var a=e.children,t=e.user,o=e.dispatch,i=t.currentUser,s=i&&i.isAuthing,m=i&&i.email,u=!m&&!s;return Object(n["useEffect"])(()=>{o({type:"user/fetchCurrent"})},[]),console.log(m,s,u),l.a.createElement(l.a.Fragment,null,m?a:u?c():l.a.createElement("div",{className:"page-loading"},l.a.createElement(r["a"],{size:"large",spinning:s})))},s=Object(o["c"])(e=>{var a=e.user;return{user:a}})(i),m=(t("w2yj"),t("Sqjh")),u=(t("OuEz"),t("nEO1")),d=t("ggb3"),p=t.n(d),h=(t("DoiJ"),t("9xBf")),g=(t("b69p"),t("5oqr")),E=(t("oosw"),t("/Oqt")),y=(t("TPNu"),t("VogX")),b=(t("DjZ7"),t("S0yW")),k=t("daAW"),v=t("O94r"),f=t.n(v),S=t("wknW"),w=(t("F72t"),u["a"].Header),N=b["a"].Item,_=b["a"].SubMenu,x=e=>e.map(e=>{return e.subMenu&&e.subMenu.length>0?l.a.createElement(_,{key:e.key,title:l.a.createElement("span",null,l.a.createElement(y["a"],{type:e.icon}),l.a.createElement("span",null,e.name))},x(e.subMenu)):l.a.createElement(N,{key:e.key},l.a.createElement(k["Link"],{to:e.key},l.a.createElement(y["a"],{type:e.icon}),l.a.createElement("span",null,e.name)))});class O extends l.a.Component{constructor(){super(...arguments),this.state={current:""},this.handleClick=(e=>{this.setState({current:e.key})})}UNSAFE_componentWillReceiveProps(e){var a=e.defaultSelectedKeys.join("");e.defaultSelectedKeys.join("")!==this.state.current&&this.setState({current:a})}render(){var e=this.props,a=this.props.currentUser,t=void 0===a?{}:a,n=l.a.createElement(b["a"],{className:"action-menu-dropdown"},l.a.createElement(N,null,l.a.createElement(y["a"],{type:"mail"}),t.email),l.a.createElement(b["a"].Divider,null),l.a.createElement(N,null,l.a.createElement(y["a"],{type:"rollback"}),l.a.createElement("a",{href:"//pandora.yidian-inc.com"},"\u8fd4\u56de Pandora \u5de5\u5177\u5e73\u53f0"))),r=f()({"global-header":!0,"global-header-dark":"dark"===this.props.theme,"global-header-light":"light"===this.props.theme});return l.a.createElement(w,{className:r},l.a.createElement("div",{className:"global-header-inner"},l.a.createElement("div",{className:"logo"},l.a.createElement(k["Link"],{to:"/"},S["a"].logo?l.a.createElement("img",{src:S["a"].logo.toString(),alt:""}):null,l.a.createElement("h1",null,S["a"].appName))),l.a.createElement(b["a"],{onClick:this.handleClick,className:"main-menu",theme:this.props.theme,mode:"horizontal",selectedKeys:[this.state.current]},x(e.menus)),l.a.createElement("div",{className:"action-menus"},l.a.createElement(E["a"],{className:"action-menu",overlay:n},l.a.createElement("span",null,l.a.createElement(g["a"],{size:"small",src:t.avatar||"//s.go2yd.com/a/thead_meiguoduizhang.png"}),l.a.createElement("span",null,t.name))),S["a"].helpDoc?l.a.createElement(h["a"],{placement:"bottom",title:"\u4f7f\u7528\u6587\u6863"},l.a.createElement("a",{className:"action-menu",href:S["a"].helpDoc,target:"__blank"},l.a.createElement(y["a"],{type:"question-circle"}))):null)))}}var C=Object(o["c"])(e=>({currentUser:e.user.currentUser}))(O),D=(t("wNoj"),u["a"].Footer),A=()=>{return l.a.createElement(D,{className:"global-footer"},(new Date).getFullYear()," @ \u4e00\u70b9\u8d44\u8baf")},I=A;function U(e){var a=new RegExp("/app/".concat(e,"(/(w*))?")),t=location.pathname.replace(a,"$1");t.endsWith("/")&&(t=t.substring(0,t.length-1));var n=t.split("/");return n=n.length>=2?n.filter(e=>""!==e).map(e=>"/".concat(e)):["/"],{original:t,splited:n}}t("W660");var M=U(S["a"].appId).splited,R=u["a"].Content;class j extends n["Component"]{constructor(){super(...arguments),this.state={collapsed:!1,permission:[],menus:[],location:""},this.toggleSider=(()=>{this.setState({collapsed:!this.state.collapsed})})}UNSAFE_componentWillUpdate(){M=U(S["a"].appId).splited}componentDidMount(){p.a.get("/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=2568660512").then(e=>{if("success"===e.data.status){var a=e.data.result;a.includes("userlist")||a.includes("namelist")?a.includes("userlist")?a.includes("namelist")?a.includes("userCertification")||S["a"].menus.splice(3,1):S["a"].menus.splice(2,1):S["a"].menus.splice(1,1):S["a"].menus.splice(1,2),this.setState({permission:a,menus:S["a"].menus,location:M[0].split("/")[1]})}})}_renderDom(){var e=this.state,a=e.permission,t=e.location;return a.includes(t)||""===t?l.a.createElement(l.a.Fragment,null,l.a.createElement(C,{defaultSelectedKeys:M,theme:this.props.theme,collapsed:this.state.collapsed,toggleSider:this.toggleSider,menus:this.state.menus}),l.a.createElement(R,{className:"basic-layout-content"},this.props.children),l.a.createElement(I,null)):l.a.createElement(m["a"],{status:"403",title:"403",subTitle:l.a.createElement("div",null,"Sorry, \u60a8\u6682\u65f6\u65e0\u76f8\u5173\u6743\u9650, \u7533\u8bf7\u5b8c\u6743\u9650\u540e\u5237\u65b0\u9875\u9762;"," ",l.a.createElement("span",{style:{color:"red"}},"\u5de5\u5177\u540d\u79f0: "),"UGC\u5185\u5bb9\u7ba1\u7406\u5e73\u53f0"),extra:l.a.createElement("a",{href:"http://pandora.yidian-inc.com/tools/admin/manage",target:"__blank"},"\u7533\u8bf7\u6743\u9650")})}render(){return l.a.createElement(u["a"],{className:"basic-layout"},this._renderDom())}}var P=j,z=(t("h3zL"),u["a"].Header),W=b["a"].Item,T=e=>{var a=e.user.currentUser,t=void 0===a?{}:a,n=l.a.createElement(b["a"],{className:"action-menu-dropdown"},l.a.createElement(W,null,l.a.createElement(y["a"],{type:"mail"}),t.email),l.a.createElement(b["a"].Divider,null),l.a.createElement(W,null,l.a.createElement(y["a"],{type:"rollback"}),l.a.createElement("a",{href:"/"},"\u8fd4\u56de Pandora \u5de5\u5177\u5e73\u53f0")));return l.a.createElement(z,{className:"global-header"},l.a.createElement(y["a"],{className:"sider-trigger",type:e.collapsed?"menu-unfold":"menu-fold",onClick:e.toggleSider}),l.a.createElement("div",{className:"action-menus"},l.a.createElement(E["a"],{className:"action-menu",overlay:n},l.a.createElement("span",null,l.a.createElement(g["a"],{size:"small",src:t.avatar||"//s.go2yd.com/a/thead_meiguoduizhang.png"}),l.a.createElement("span",null,t.name))),S["a"].helpDoc?l.a.createElement(h["a"],{placement:"bottom",title:"\u4f7f\u7528\u6587\u6863"},l.a.createElement("a",{className:"action-menu",href:S["a"].helpDoc,target:"__blank"},l.a.createElement(y["a"],{type:"question-circle"}))):null))},F=Object(o["c"])(e=>{var a=e.user;return{user:a}})(T),H=(t("l7QO"),u["a"].Sider),K=b["a"].Item,L=b["a"].SubMenu,q=e=>e.map(e=>{return e.subMenu&&e.subMenu.length>0?l.a.createElement(L,{key:e.key,title:l.a.createElement("span",null,l.a.createElement(y["a"],{type:e.icon}),l.a.createElement("span",null,e.name))},q(e.subMenu)):l.a.createElement(K,{key:e.key},l.a.createElement(k["Link"],{to:e.key},l.a.createElement(y["a"],{type:e.icon}),l.a.createElement("span",null,e.name)))}),G=e=>{return l.a.createElement(H,{theme:e.theme,width:"260",trigger:null,collapsible:!0,collapsed:e.collapsed},l.a.createElement("div",{className:"logo"},l.a.createElement(k["Link"],{to:"/"},S["a"].logo?l.a.createElement("img",{src:S["a"].logo.toString(),alt:""}):null,l.a.createElement("h1",null,S["a"].appName))),l.a.createElement(b["a"],{theme:e.theme,mode:"inline",defaultSelectedKeys:e.defaultSelectedKeys},q(S["a"].menus)))},J=G,B=(t("5RGE"),U(S["a"].appId).splited);class V extends n["Component"]{constructor(){super(...arguments),this.state={collapsed:!1},this.toggleSider=(()=>{this.setState({collapsed:!this.state.collapsed})})}render(){return l.a.createElement(u["a"],{className:"sidebar-layout"},l.a.createElement(J,{defaultSelectedKeys:B,theme:this.props.theme,collapsed:this.state.collapsed}),l.a.createElement(u["a"],null,l.a.createElement(F,{collapsed:this.state.collapsed,toggleSider:this.toggleSider}),this.props.children,l.a.createElement(I,null)))}}var X=V,Z=S["a"].layout,Q=e=>l.a.createElement(s,null,Z.hasSidebar?l.a.createElement(X,{theme:Z.theme},e.children):l.a.createElement(P,{theme:Z.theme},e.children));a["default"]=Q},"5RGE":function(e,a,t){e.exports={"sidebar-layout":"sidebar-layout","main-content":"main-content","main-content-with-page-header":"main-content-with-page-header","sider-trigger":"sider-trigger"}},F72t:function(e,a,t){e.exports={"basic-layout":"basic-layout","global-header":"global-header","global-header-inner":"global-header-inner",logo:"logo","main-menu":"main-menu","ant-menu-item":"ant-menu-item","action-menus":"action-menus","action-menu":"action-menu","ant-avatar":"ant-avatar","global-header-dark":"global-header-dark","ant-menu-item-selected":"ant-menu-item-selected","global-header-light":"global-header-light","action-menu-dropdown":"action-menu-dropdown","ant-dropdown-menu-item":"ant-dropdown-menu-item"}},W660:function(e,a,t){e.exports={"basic-layout-content":"basic-layout-content","page-header":"page-header","main-content":"main-content","main-content-with-page-header":"main-content-with-page-header","sider-trigger":"sider-trigger"}},h3zL:function(e,a,t){e.exports={"sidebar-layout":"sidebar-layout","global-header":"global-header","action-menus":"action-menus","action-menu":"action-menu","ant-avatar":"ant-avatar","action-menu-dropdown":"action-menu-dropdown","ant-dropdown-menu-item":"ant-dropdown-menu-item"}},l7QO:function(e,a,t){e.exports={"ant-layout-sider":"ant-layout-sider",logo:"logo","ant-layout-sider-light":"ant-layout-sider-light"}},oBUM:function(e,a,t){e.exports={"page-loading":"page-loading"}},wNoj:function(e,a,t){e.exports={"global-footer":"global-footer"}},wknW:function(e,a,t){"use strict";var n=!0,l={appId:"ugcReview",appName:"UGC\u5185\u5bb9\u7ba1\u7406\u5e73\u53f0",logo:"http://si1.go2yd.com/get-image/0ZAJxXeZ6iu",menus:[{key:"/",icon:"file-text",name:"\u5185\u5bb9\u7ba1\u7406"},{key:"/userlist",icon:"user",name:"\u7528\u6237\u7ba1\u7406"},{key:"/namelist/white",icon:"unlock",name:"\u9ed1\u767d\u540d\u5355\u7ba1\u7406",subMenu:[{key:"/namelist/white",name:"\u767d\u540d\u5355",icon:"smile"},{key:"/namelist/black",name:"\u9ed1\u540d\u5355",icon:"robot"}]},{key:"/userCertification",icon:"contacts",name:"\u8fbe\u4eba\u8ba4\u8bc1"}],helpDoc:"http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993",layout:{hasSidebar:!1,theme:"dark"},API_HOST:"http://".concat(n?"a4":"a4-1",".go2yd.com"),CPP_HOST:"http://".concat(n?"cl-k8s":"cl-k8s-staging",".yidian-inc.com/apis/cpp-doc"),API_SERVER_A4:"http://a4.go2yd.com/Website",UPLOAD_HOST:n?"http://zeus.v.yidian-inc.com":"http://dev.yidian-inc.com:5000",API_SERVER_A1:"http://".concat(n?"a4":"a4-1",".go2yd.com"),CATEGORIES_HOST:"http://operationtoolservice.".concat(n?"int":"test",".yidian-inc.com"),CERT_HOST:"http://usergradeservice.".concat(n?"int":"test",".yidian-inc.com")};a["a"]=l}}]);