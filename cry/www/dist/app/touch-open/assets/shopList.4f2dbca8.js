import{d as $,c as M,u as N,l as P,a as T,b as t,w as n,f as i,e as c,h as r,m as U,n as f,p as y,r as s,q as O,s as j,o as u,P as q,v as K,i as k,x as z,k as G}from"./index.2bba2224.js";import{_ as H}from"./GeneralFormModel.vue_vue_type_script_setup_true_lang.102f6014.js";const J=k("\u521B\u5EFA\u95E8\u5E97"),Q=k("\u5220\u9664"),W={name:"ShopList"},X=$({...W,setup(Y){O();const b=M(()=>(x.value,[{title:"\u95E8\u5E97ID",dataIndex:"id",key:"id",align:"center",width:90},{title:"\u95E8\u5E97\u540D\u79F0",dataIndex:"name",key:"name",align:"center"},{title:"\u95E8\u5E97\u5730\u5740",dataIndex:"address",key:"address",align:"center"},{title:"\u95E8\u5E97\u7801",dataIndex:"sign_in_code",key:"sign_in_code",align:"center"},{title:"\u95E8\u5E97\u56FE\u7247",dataIndex:"images",key:"images",align:"center",customRender:({text:e})=>e.length?e[0]:""},{title:"\u95E8\u5E97\u72B6\u6001",dataIndex:"status",key:"status",align:"center"},{title:"\u64CD\u4F5C",dataIndex:"operation",align:"center"}])),{onSearch:Z,onReset:ee,pagination:E,dataSource:C,getList:_,searchFormRef:ae,onTableChange:v,sortedInfo:x,modelRef:te,validateInfos:ne}=N({fetchData:j,formatParams(e){return{...e}},listFormatEnum:!0}),d=P({visible:!1,currentRow:{}}),I=async e=>{let a={...e,cover_img_url:e.cover_img_url&&U(e.cover_img_url),op_type:1};await f(a),y.success("\u521B\u5EFA\u6210\u529F!"),_()},w=async e=>{let a={shop_id:e.id,op_type:2};await f(a),y.success("\u64CD\u4F5C\u6210\u529F!"),_()},F=()=>{d.visible=!1},S=(e={})=>{d.visible=!0,d.currentRow=e},D=async e=>{try{await z({shop_id:e.id,op_type:e.status===2?1:2})}catch{_()}};return(e,a)=>{const h=s("a-col"),g=s("a-button"),R=s("a-space"),A=s("a-row"),B=s("a-switch"),L=s("a-table"),V=s("a-card");return u(),T("div",null,[t(V,{class:"table-box mt20"},{default:n(()=>[t(A,{class:"action-btn-box",justify:"space-between"},{default:n(()=>[t(h),t(h,null,{default:n(()=>[t(R,null,{default:n(()=>[t(g,{type:"primary",onClick:a[0]||(a[0]=l=>S())},{default:n(()=>[J]),_:1})]),_:1})]),_:1})]),_:1}),t(L,{rowKey:"id",columns:c(b),"data-source":c(C),pagination:c(E),bordered:"",onChange:c(v)},{bodyCell:n(({column:l,text:p,record:o})=>[["sign_in_code","images","measure_code"].includes(l.dataIndex)?(u(),i(q,{key:0,src:Array.isArray(p)?p[0]:p},null,8,["src"])):r("",!0),l.dataIndex==="status"?(u(),i(B,{key:1,checked:o.status,"onUpdate:checked":m=>o.status=m,checkedValue:1,unCheckedValue:2,"checked-children":"\u5DF2\u542F\u7528","un-checked-children":"\u5DF2\u505C\u7528",onChange:m=>D(o)},null,8,["checked","onUpdate:checked","onChange"])):r("",!0),l.dataIndex==="operation"?(u(),i(g,{key:2,type:"link",danger:"",class:"action-btn",disabled:o.status===1,onClick:m=>w(o)},{default:n(()=>[Q]),_:2},1032,["disabled","onClick"])):r("",!0)]),_:1},8,["columns","data-source","pagination","onChange"])]),_:1}),d.visible?(u(),i(H,{key:0,title:"\u95E8\u5E97","form-data":c(K),onSuccess:I,onCancel:F},null,8,["form-data"])):r("",!0)])}}});const ce=G(X,[["__scopeId","data-v-f830726c"]]);export{ce as default};