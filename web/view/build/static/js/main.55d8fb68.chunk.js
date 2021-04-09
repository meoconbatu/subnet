(this.webpackJsonpview=this.webpackJsonpview||[]).push([[0],{154:function(e,n,t){},184:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t(50),i=t.n(a),c=(t(154),t(55)),s=t(23),o=t(32),l=t(205),u=t(200),d=t(57),b=t.n(d),h=t(77),f=t(204),j=t(201),x=t(185),O=t(202),v=t(186),p=t(198),g=t(56),w=t(5),m=function(e,n){var t,r=n.data,a=r.name,i=r.value,c=r.hasError,s=r.error,l=r.isFormValid;switch(n.type){case"UPDATE":return Object(o.a)(Object(o.a)({},e),{},(t={},Object(h.a)(t,a,{value:i,hasError:c,error:s}),Object(h.a)(t,"isFormValid",l),t));default:return Object(o.a)({},e)}},k=function(e){var n=Object(r.useState)(""),t=Object(s.a)(n,2),a=t[0],i=t[1],c=Object(r.useState)(!1),o=Object(s.a)(c,2),l=o[0],u=o[1],d=Object(r.useReducer)(m,{address:{value:"192.168.0.0",hasError:!1,error:""},prefix:{value:"25",hasError:!1,error:""},isFormValid:!0}),b=Object(s.a)(d,2),h=b[0],k=b[1],C=Object(r.useRef)(null),y=function(){""!==a&&e.onSearch(a)},H=function(e){var n=e.target,t=n.name,r=n.value,a=S(t,r),i=a.hasError,c=a.error,s=!0;for(var o in h){var l=h[o];if(o===t&&i){s=!1;break}if(o!==t&&l.hasError){s=!1;break}}k({type:"UPDATE",data:{name:t,value:r,hasError:i,error:c,isFormValid:s}})},S=function(e,n){var t=!1;switch(e){case"address":/^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$/.test(n)||(t=!0);break;case"prefix":/^([0-9]|[1-2][0-9]|3[0-2])$/.test(n)||(t=!0);break;default:t=!0}return{hasError:t,error:""}};return Object(w.jsxs)(f.a,{columns:2,children:[Object(w.jsx)(f.a.Column,{children:Object(w.jsx)(j.a,{onSubmit:function(){return u(!0)},children:Object(w.jsxs)(j.a.Group,{inline:!0,children:[Object(w.jsx)(j.a.Input,{name:"address",error:h.address.hasError&&!0,label:"CIDR:",width:4,onChange:H,value:h.address.value}),Object(w.jsx)(j.a.Input,{name:"prefix",error:h.prefix.hasError&&!0,label:"/",width:2,onChange:H,value:h.prefix.value}),Object(w.jsx)(x.a,{type:"submit",disabled:!h.isFormValid&&!0,children:"Submit"}),Object(w.jsx)(O.a,{open:l,content:"All subnets will be gone. Continue?",onCancel:function(){u(!1)},onConfirm:function(){e.onSubmit(h.address.value,h.prefix.value),u(!1)}})]})})}),Object(w.jsxs)(f.a.Column,{textAlign:"right",children:[Object(w.jsx)(v.a,{innerRef:C,children:Object(w.jsx)("input",{onChange:function(n){var t=new FileReader;t.readAsText(n.target.files[0],"UTF-8"),t.onload=function(n){e.onUpload(n.target.result)},C.current.value=""},type:"file",style:{display:"none"}})}),Object(w.jsx)(p.a,{style:{margin:"0 .25em 0 0"},onKeyDown:function(e){return"Enter"===e.key?y():null},onChange:function(e){return i(e.target.value)},icon:Object(w.jsx)(g.a,{onClick:y,name:"search",link:!0}),placeholder:"Search..."}),Object(w.jsx)(x.a,{type:"button",onClick:function(e){return C.current.click()},children:"Upload"}),Object(w.jsx)(x.a,{type:"button",onClick:function(){e.onDownload()},children:"Download"})]})]})},C=t(203),y=t(199),H=function e(n,t,r,a,i,c,s,o,l,u){if(null!=t){if(null==t.children){var d=Object(w.jsx)(E,{maxHeight:i.maxHeight,network:n,groupBy:o.root&&s,subnet:t,onNote:i.onNote,onDivide:i.onDivide,parent:a,maxPrefix:l,index:u},t.cidr+n+t.note);return o.root=!1,void r.push(d)}t.children.map((function(d,b){if(0===b){var h=Object(w.jsxs)(C.a.Cell,{active:t.active?"active":"",onClick:function(){i.onJoin(t.cidr,n)},style:{textAlign:"right"},rowSpan:t.numVisibleChild,selectable:t.numVisibleChild>1?"true":"false",children:["/",t.prefix]});t.active&&(h=Object(w.jsx)(v.a,{innerRef:c,children:h})),a=Object(w.jsxs)(w.Fragment,{children:[h,a]})}else a=null;return e(n,d,r,a,i,c,s,o,l,u)}))}},S=function(e){return Object(w.jsx)(x.a,{basic:!0,size:"mini",onClick:function(){e.onDivide(e.subnet.cidr,e.network)},children:"Divide"})},P=function(e){var n=Object(r.useState)(e.subnet.note),t=Object(s.a)(n,2),a=t[0],i=t[1];return Object(w.jsx)(j.a,{children:Object(w.jsx)(y.a,{fluid:!0,rows:1,style:{borderStyle:"none"},onBlur:function(n){e.onChange(e.subnet.cidr,n.target.value,e.network)},onChange:function(e){i(e.target.value)},value:a})})},E=function(e){var n=e.subnet.availableIPMin!==e.subnet.availableIPMax,t=e.maxPrefix-e.subnet.prefix+1+e.maxHeight-(e.maxPrefix-e.network.split("/")[1]+1);return Object(w.jsxs)(C.a.Row,{style:e.groupBy&&0!==e.index?{borderTop:"solid 2px grey"}:null,children:[e.groupBy,Object(w.jsx)(C.a.Cell,{children:e.subnet.cidr}),Object(w.jsx)(C.a.Cell,{children:e.subnet.mask}),Object(w.jsxs)(C.a.Cell,{singleLine:!0,children:[e.subnet.availableIPMin," ",n?"- "+e.subnet.availableIPMax:""]}),Object(w.jsx)(C.a.Cell,{children:e.subnet.hosts}),Object(w.jsx)(C.a.Cell,{children:Object(w.jsx)(P,{onChange:e.onNote,subnet:e.subnet,network:e.network})}),Object(w.jsx)(C.a.Cell,{children:e.subnet.hosts>1&&Object(w.jsx)(S,{onDivide:e.onDivide,subnet:e.subnet,network:e.network})}),Object(w.jsxs)(C.a.Cell,{active:e.subnet.active?"active":"",style:{textAlign:"right"},colSpan:t,children:["/",e.subnet.prefix]}),e.parent]})},D=function(e){var n=Object(r.useRef)(null),t=[];return function(e,n,t){var r,a=0,i=Object(c.a)(e.networks);try{for(i.s();!(r=i.n()).done;){var o=Object(s.a)(r.value,2),l=o[0],u=o[1],d=Object(w.jsx)(C.a.Cell,{rowSpan:u.subnets.numVisibleChild,children:l});H(l,u.subnets,n,null,e,t,d,{root:!0},u.maxPrefix,a),a++}}catch(b){i.e(b)}finally{i.f()}}(e,t,n),Object(r.useEffect)((function(){null!=n.current&&(n.current.focus(),n.current.scrollIntoView(!1))})),Object(w.jsxs)(C.a,{celled:!0,structured:!0,style:{border:"2px solid grey"},children:[Object(w.jsx)(C.a.Header,{children:Object(w.jsxs)(C.a.Row,{children:[Object(w.jsx)(C.a.HeaderCell,{children:"Network address"}),Object(w.jsx)(C.a.HeaderCell,{children:"Subnet address"}),Object(w.jsx)(C.a.HeaderCell,{children:"Netmask"}),Object(w.jsx)(C.a.HeaderCell,{children:"Available IPs"}),Object(w.jsx)(C.a.HeaderCell,{children:"Hosts"}),Object(w.jsx)(C.a.HeaderCell,{children:"Note"}),Object(w.jsx)(C.a.HeaderCell,{}),Object(w.jsx)(C.a.HeaderCell,{colSpan:null!=e.networks?e.maxHeight:1})]})}),Object(w.jsx)(C.a.Body,{children:t})]})},I=function(e,n){switch(n.type){case"submit":return{networks:n.networks,maxHeight:n.maxHeight};case"divide":return{networks:n.networks,maxHeight:n.maxHeight>e.maxHeight?n.maxHeight:e.maxHeight};case"join":return{networks:n.networks,maxHeight:n.maxHeight};case"note":return Object(o.a)(Object(o.a)({},e),{},{networks:n.networks});case"upload":return{networks:n.networks,maxHeight:n.maxHeight};case"search":return Object(o.a)(Object(o.a)({},e),{},{networks:n.networks});default:return Object(o.a)({},e)}};var R=function(){b.a.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded";var e=Object(r.useReducer)(I,{networks:new Map,maxHeight:0}),n=Object(s.a)(e,2),a=n[0],i=n[1],o=t(180),d=function e(n,t,r){if(n.cidr===t)return n.children=r,n.children[0].note=n.note,n.numVisibleChild+=1,1;if(null==n.children)return 0;for(var a=0;a<n.children.length;a++)if(1===e(n.children[a],t,r))return n.numVisibleChild+=1,1;return 0},h=function e(n,t){if(n.cidr===t){n.children=null;var r=n.numVisibleChild;return n.numVisibleChild=1,r-1}if(null==n.children)return 0;for(var a=0;a<n.children.length;a++){var i=e(n.children[a],t);if(n.numVisibleChild-=i,i>0)return i}return 0},f=0,j=function e(n){if(null==n.children)n.prefix>f&&(f=n.prefix);else for(var t=0;t<n.children.length;t++)e(n.children[t])},x=function(e){var n,t=0,r=Object(c.a)(e);try{for(r.s();!(n=r.n()).done;){var a=Object(s.a)(n.value,2),i=(a[0],a[1]);i.maxPrefix-i.subnets.prefix+1>t&&(t=i.maxPrefix-i.subnets.prefix+1)}}catch(o){r.e(o)}finally{r.f()}return t},O=function e(n,t,r){if(n.cidr===t)return n.note=r,!0;if(null==n.children)return!1;for(var a=0;a<n.children.length;a++)if(e(n.children[a],t,r))return!0;return!1},v=function e(n,t){if(n.active&&(n.active=!1),n.cidr===t.cidr&&(n.active=!0),null==n.children)return!1;for(var r=0;r<n.children.length;r++)e(n.children[r],t);return!1};return Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)(l.a,{as:"h1",children:"IPv4 Subnetting"}),Object(w.jsx)(u.a,{hidden:!0}),Object(w.jsx)(k,{onSubmit:function(e,n){b.a.post("/subnet",o.stringify({address:e,prefix:n})).then((function(e){var t=new Map(a.networks);t.set(e.data.cidr,{subnets:e.data,maxPrefix:n}),i({type:"submit",networks:t,maxHeight:x(t)})})).catch((function(e){console.log(e)}))},onDownload:function(){b.a.post("/download",Object.fromEntries(a.networks)).then((function(e){var n=JSON.parse(JSON.stringify(e.data)),t=new Blob([JSON.stringify(n,null,5)],{type:"text/plain"}),r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.setAttribute("download","networks.txt"),a.click()})).catch((function(e){console.log(e)}))},onUpload:function(e){b.a.post("/upload",e).then((function(e){var n=new Map(Object.entries(e.data));i({type:"upload",networks:n,maxHeight:x(n)})})).catch((function(e){console.log(e)}))},onSearch:function(e){null!=a.networks&&b.a.post("/search",{network:Object.fromEntries(a.networks),cidr:e}).then((function(e){var n=new Map(a.networks),t=new Map(Object.entries(e.data));if(0===t.size){var r,o=Object(c.a)(n);try{for(o.s();!(r=o.n()).done;){var l=Object(s.a)(r.value,1)[0];v(n.get(l).subnets,{CIDR:""})}}catch(j){o.e(j)}finally{o.f()}}else{var u,d=Object(c.a)(t);try{for(d.s();!(u=d.n()).done;){var b=Object(s.a)(u.value,2),h=b[0],f=b[1];v(n.get(h).subnets,f)}}catch(j){d.e(j)}finally{d.f()}}i({type:"search",networks:n})})).catch((function(e){var n,t=new Map(a.networks),r=Object(c.a)(t);try{for(r.s();!(n=r.n()).done;){var o=Object(s.a)(n.value,1)[0];v(t.get(o).subnets,{CIDR:""})}}catch(l){r.e(l)}finally{r.f()}i({type:"search",networks:t})}))}}),Object(w.jsx)(u.a,{hidden:!0}),Object(w.jsx)(D,{networks:a.networks,maxHeight:a.maxHeight,onDivide:function(e,n){b.a.post("/divide",o.stringify({cidr:e})).then((function(t){var r=t.data,c=new Map(a.networks);d(c.get(n).subnets,e,r),r[0].prefix>c.get(n).maxPrefix&&(c.get(n).maxPrefix=r[0].prefix),i({type:"divide",networks:c,maxHeight:x(c)})})).catch((function(e){console.log(e)}))},onJoin:function(e,n){var t=new Map(a.networks);h(t.get(n).subnets,e),j(t.get(n).subnets),j(t),t.get(n).maxPrefix=f,i({type:"join",networks:t,maxHeight:x(t)})},onNote:function(e,n,t){var r=new Map(a.networks);O(r.get(t).subnets,e,n),i({type:"note",networks:r})}})]})},V=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,207)).then((function(n){var t=n.getCLS,r=n.getFID,a=n.getFCP,i=n.getLCP,c=n.getTTFB;t(e),r(e),a(e),i(e),c(e)}))};t(183);i.a.render(Object(w.jsx)(R,{}),document.getElementById("root")),V()}},[[184,1,2]]]);
//# sourceMappingURL=main.55d8fb68.chunk.js.map