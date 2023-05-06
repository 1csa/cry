import{d as V,l as M,G as P,c as U,u as z,a as y,b as s,w as u,H as K,I as q,J as G,K as H,p as J,q as O,L as j,M as Q,r as _,o as l,F as v,_ as W,e as r,f as C,h as x,i as m,N as X,P as Y}from"./index.2bba2224.js";const Z=m("\u63D0\u4EA4"),ee=m("\u53D6\u6D88"),te=m("\u8865\u8D27"),ae=m("\u9000\u56DE"),ne={name:"ShopInventory"},ie=V({...ne,setup(oe){O();const a=M({shopId:null,op_type:0}),c=P(!1),I=U(()=>[{title:"\u5546\u54C1\u7F16\u7801",dataIndex:"sku",key:"sku",align:"center"},{title:"\u5546\u54C1\u540D\u79F0",dataIndex:"name",key:"name",align:"center"},{title:"\u5C01\u9762\u56FE",dataIndex:"cover_img_url",key:"cover_img_url",align:"center"},{title:"\u5546\u54C1\u7C7B\u76EE",dataIndex:"category",key:"category",align:"center"},{title:"\u989C\u8272",dataIndex:"colour_code",key:"colour_code",align:"center",width:90},{title:"\u5C3A\u7801",dataIndex:"size_code",key:"size_code",align:"center",width:90},{title:"\u5E93\u5B58\u91CF",dataIndex:"stock_count",key:"stock_count",align:"center",width:90},{title:"\u5165\u5E93\u65F6\u95F4",dataIndex:"inbound_time",key:"inbound_time",align:"center"},{title:`${a.op_type===1?"\u8865\u8D27":"\u9000\u56DE"}\u6570\u91CF`,dataIndex:"number",key:"number",align:"center",action:[1,2]}].filter(e=>{const n=e==null?void 0:e.action;if(!n||n.includes(a.op_type))return e})),h=X(),F=t=>{a.shopId=t,k()},{onSearch:S,onReset:k,pagination:D,dataSource:b,getList:E,searchFormRef:se,onTableChange:R,sortedInfo:ue,modelRef:w,validateInfos:$}=z({fetchData:j,formData:h,formatParams(t){const e={...t};return e.shop_id=a.shopId,Q(e),e},listFormatEnum:!0,firstLoaded:!1}),A=t=>{B(t)},d=t=>{if(t==="submit"){c.value=!0;return}if(t==="cancle"){g();return}a.op_type=t},B=async t=>{const e=G.exports.cloneDeep(b.value),n=[];e.map(i=>{i.number>0&&n.push({sku:i.sku,count:Number(i.number)})});let f={op_list:n,shop_id:a.shopId,op_type:a.op_type,express_type:t};await H(f),J.success("\u64CD\u4F5C\u6210\u529F"),c.value=!1,g()},g=()=>{a.op_type=0,E()};return(t,e)=>{const n=_("a-button"),f=_("a-input-number"),i=_("a-table"),L=_("a-card");return l(),y("div",null,[s(K,{fixed:!0,onChange:F},{action:u(()=>[a.op_type?(l(),y(v,{key:0},[s(n,{type:"primary",onClick:e[0]||(e[0]=o=>d("submit"))},{default:u(()=>[Z]),_:1}),s(n,{onClick:e[1]||(e[1]=o=>d("cancle"))},{default:u(()=>[ee]),_:1})],64)):(l(),y(v,{key:1},[s(n,{type:"primary",onClick:e[2]||(e[2]=o=>d(1))},{default:u(()=>[te]),_:1}),s(n,{type:"primary",onClick:e[3]||(e[3]=o=>d(2))},{default:u(()=>[ae]),_:1})],64))]),search:u(()=>[s(W,{"form-data":r(h),modelRef:r(w),validateInfos:r($),onSearch:r(S),onReset:r(k)},null,8,["form-data","modelRef","validateInfos","onSearch","onReset"])]),main:u(()=>[s(L,{class:"table-box"},{default:u(()=>[s(i,{rowKey:"id",columns:r(I),"data-source":r(b),pagination:r(D),bordered:"",onChange:r(R)},{bodyCell:u(({column:o,text:N,record:p})=>[o.dataIndex==="cover_img_url"?(l(),C(Y,{key:0,src:N},null,8,["src"])):x("",!0),o.dataIndex==="number"?(l(),C(f,{key:1,value:p[o.dataIndex],"onUpdate:value":T=>p[o.dataIndex]=T,max:a.op_type===1?p.count:p.stock_count,min:0,precision:0,defaultValue:0},null,8,["value","onUpdate:value","max"])):x("",!0)]),_:1},8,["columns","data-source","pagination","onChange"])]),_:1})]),_:1}),s(q,{type:"all",onSelected:A,visible:c.value,"onUpdate:visible":e[4]||(e[4]=o=>c.value=o)},null,8,["visible"])])}}});export{ie as default};
