webpackJsonp([8],{161:function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e){return e.charAt(0).toUpperCase()+e.slice(1)}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=(n(18),n(81)),r=(n(23),n(22)),s=r.fstr,d=r.fstr2num,c=(n(28),n(10),n(96)),u=n(162),h=(u.BeadPlate,u.BigRoad,u.BigEye,laya.net.Loader),g=laya.utils.Handler,f=function(){function e(t){i(this,e),this.opt=t}return o(e,[{key:"assignAllBtns",value:function(){for(var e=this,t=this._view._children,n=/[A-Za-z]\d+/,i=0;i<t.length;i++){var o=t[i].asButton;if(o instanceof fairygui.GButton){var a=function(){if(n.test(o.name))return"continue";var t=o.name.split("."),i=t[1]||1;t=t[0];var a=e._view.getController(t);a?(o.onClick(e,function(){a.selectedIndex=i}),a.setSelectedIndex(0)):o.onClick(e,function(){var e=l(t)+"Win";if(c[e])var n=new c[e];else var n=new c.Win(t);n.modal=!0,n.show()})}();if("continue"===a)continue}}}},{key:"active",value:function(){0==this._view.getController("isAdmin").selectedIndex&&this.enterGame()}},{key:"enterGame",value:function(){fairygui.GRoot.inst.showModalWait(),_socket.sendp({c:"alltables"}),netmsg.once("alltables",this,function(e){fairygui.GRoot.inst.closeModalWait(),console.log(e),this.tables=[];for(var t in e.tables)e.tables[t].roomid=t,this.tables.push(e.tables[t]);var n=this.tables.length;n>1&&console.log("桌子数量不唯一，请检查服务器以及数据库"),_socket.sendp({c:"join",code:this.tables[0].roomid})})}}],[{key:"create",value:function(t,i){"function"==typeof t&&(i=t,t={}),Laya.loader.load([{url:n(152),type:h.IMAGE},{url:n(153),type:h.IMAGE},{url:n(163),type:h.IMAGE},{url:n(155),type:h.BUFFER}],g.create(null,function(){window.magiclink&&magiclink.reg(function(e){console.log("magiclink ret",e),_socket.sendp({c:"join",code:e})});var n=new e(t);fairygui.UIPackage.addPackage("baijiale"),fairygui.UIConfig.buttonSound=null,fairygui.UIConfig.buttonSoundVolumeScale=0;var l=n._view=fairygui.UIPackage.createObject("Package1","hall").asCom;l.getController("isAdmin").selectedIndex=a.isAdmin?1:0;var o=l.getChild("n33");o.removeChildren(),l.getChild("n34").onClick(null,function(){var e=l.getChild("n12").text,t=l.getChild("n7").text;return e||t?(_socket.sendp({c:"userInfo",id:e,nickname:t}),fairygui.GRoot.inst.showModalWait(),void netmsg.once("userInfo",null,function(e){fairygui.GRoot.inst.closeModalWait(),o.removeChildren();var t=fairygui.UIPackage.createObject("Package1","Component6");o.addChild(t),t.getChild("userInfo").getChild("n45").url=e.face,t.getChild("n4").text=e.nickname,t.getChild("n7").text=e.showId,t.getChild("n9").text=s(e.coins),t.getChild("n19").text=s(e.savedMoney||0),t.getChild("n21").text=e.regIP||"",t.getChild("n23").text=e.lastIP||"";var n=t.getChild("n3");n.on("input",null,function(){var e=n.text.replace(/ /g,"");n.text=s(e)});var i=t.getChild("n16");i.on("input",null,function(){var e=i.text.replace(/ /g,"");i.text=s(e)});var l=t.getChild("n10"),a=t.getChild("n11");e.block&&new Date(e.block)>new Date&&(l.selected=!0),e.nochat&&new Date(e.nochat)>new Date&&(a.selected=!0),t.getChild("n2").onClick(null,function(){var n=t.getChild("n3").text.replace(/ /g,"");if(n=Number(n),!isNaN(n)&&n){var i=d(t.getChild("n9").text);if(n<0){if(!confirm("确定要减钱？？！"))return;i+n<0&&(tipon("减分过多，自动调整成"+-i).popup(),n=-i)}if(0==n)return void(t.getChild("n3").text="");_socket.sendp({c:"admin.addcoins",userid:e.id,coins:n}),netmsg.once("admin.addcoins",null,function(e){e.err||(t.getChild("n3").text="",t.getChild("n9").text=s(e.newcoin))})}}),t.getChild("n15").onClick(null,function(){var n=i.text.replace(/ /g,"");if(n=Number(n),!isNaN(n)&&n){var l=d(t.getChild("n19").text);if(n<0){if(!confirm("确定要减钱？？！"))return;l+n<0&&(tipon("减分过多，自动调整成"+-l).popup(),n=-l)}if(0==n)return void(i.text="");_socket.sendp({c:"admin.addsaved",userid:e.id,coins:n}),netmsg.once("admin.addsaved",null,function(e){e.err||(i.text="",t.getChild("n19").text=s(e.newcoin))})}}),l.onClick(null,function(){_socket.sendp({c:"admin.block",userid:e.id,t:l.selected?315532748958:0})}),a.onClick(null,function(){_socket.sendp({c:"admin.nochat",userid:e.id,t:a.selected?315532748958:0})}),t.getChild("n13").onClick(null,function(){_socket.sendp({c:"admin.resetpwd",userid:e.id}),netmsg.once("admin.resetpwd",null,function(e){e.err||prompt("密码已修改，请复制之后发给玩家",e.newpwd)})}),t.getChild("n14").onClick(null,function(){_socket.sendp({c:"admin.resetsecpwd",userid:e.id}),netmsg.once("admin.resetsecpwd",null,function(e){e.err||tipon("密保已重置").popup()})})})):(l.getChild("n12").displayObject.prompt="id或者昵称必须填写一个",l.getChild("n12").text="",void(l.getChild("n7").text=""))});var c=l.getChild("n49");c.setVirtual(),l.getChild("n47").onClick(null,function(){var e=l.getChild("n44").text,t=l.getChild("n40").text;if(e){if(e=new Date(e),"Invalid Date"==e)return l.getChild("n44").text="",void(l.getChild("n44").displayObject.prompt="类似2017-6-7 00:00:00")}else{var n=new Date;e=new Date(""+n.getFullYear()+"-"+(n.getMonth()+1)+"-1")}if(t){if(t=new Date(t),"Invalid Date"==t)return l.getChild("n44").text="",void(l.getChild("n44").displayObject.prompt="类似2017-6-7 12:00:00")}else t=new Date;fairygui.GRoot.inst.showModalWait(),_socket.sendp({c:"admin.addCoinsLog",start:e,end:t}),netmsg.once("admin.addCoinsLog",null,function(e){fairygui.GRoot.inst.closeModalWait(),c.itemRenderer=g.create(null,function(t,n){var i=e.logs[t];n.getChild("n1").text=r.toDateString(i.time),n.getChild("n3").text=i.targetName,n.getChild("n2").text=s(i.coins),n.getChild("n4").text=i.operatorName,n.getChild("n5").text=i.type||""},null,!1),c.numItems=e.logs.length;for(var t=0,n=0;n<e.logs.length;n++)t+=e.logs[n].coins;l.getChild("n51").text="总计 "+s(t),l.getChild("n56").onClick(null,function(){window.open(getAbsUrl("/pf/bacc.hori/downxlsx")+"?token="+e.token+"&userid="+a.id)})})}),function(){var e=l.getChild("n75");e.setVirtual();var t,i,o;e.itemRenderer=g.create(null,function(e,n){var i=t.d[e];n._clickHandler&&n.offClick(null,n._clickHandler),n._clickHandler=function(){l.getController("c1").selectedIndex=0,l.getChild("n12").text=i.showId,l.getChild("n7").text=i.nickname,l.getChild("n34").displayObject.event("click")},n.onClick(null,n._clickHandler),i?(n.getChild("n1").text=r.toDateString(i._t),n.getChild("n3").text=i.nickname+" ID:"+i.showId,n.getChild("n4").text=s(i.coins),n.getChild("n2").text=i.act,n.getChild("n5").text=i.ip||""):(n.getChild("n1").text="--",n.getChild("n3").text="--",n.getChild("n4").text="",n.getChild("n2").text="",n.getChild("n5").text="")},null,!1),l.getChild("n93").onClick(null,function(){var e=Number(l.getChild("n98").text)-1;i&&i(e)}),l.getChild("n94").onClick(null,function(){var e=Number(l.getChild("n98").text)+1;i&&i(e)}),l.getChild("n73").onClick(null,function(){netmsg.off("admin.translog",null,o),l.getChild("n98").off("enter",null,i),l.getChild("n98").off("blur",null,i);var a=l.getChild("n70").text,r=l.getChild("n66").text;if(a){if(a=new Date(a),"Invalid Date"==a)return l.getChild("n70").text="",void(l.getChild("n70").displayObject.prompt="类似2017-6-7 00:00:00")}else{var s=new Date;a=new Date(""+s.getFullYear()+"-"+s.getMonth()+"-"+s.getDate())}if(r){if(r=new Date(r),"Invalid Date"==r)return l.getChild("n66").text="",void(l.getChild("n66").displayObject.prompt="类似2017-6-7 12:00:00")}else r=new Date;var d=l.getChild("n89").text,c=l.getChild("n85").text;fairygui.GRoot.inst.showModalWait(),_socket.sendp({c:"admin.translog",start:a,end:r,showId:d,nickname:c}),o=function(n){fairygui.GRoot.inst.closeModalWait(),t=n,l.getChild("n99").text="/"+Math.ceil(n.len/n.ps),l.getChild("n98").text=Math.floor(n.from/n.ps)+1,e.numItems=n.d.length},n._nmh={"admin.translog":o},netmsg.on("admin.translog",null,o),i=function(e){var e=e||Number(l.getChild("n98").text);e&&t&&(e>Math.ceil(t.len/t.ps)&&(e=Math.ceil(t.len/t.ps),l.getChild("n98").text=e.toString()),_socket.sendp({c:"admin.translog",start:a,end:r,showId:d,nickname:c,setfrom:(e-1)*t.ps}))},l.getChild("n98").on("enter",null,i),l.getChild("n98").on("blur",null,i)})}(),function(){function e(e,t){fairygui.GRoot.inst.showModalWait(),netmsg.off("board",null,n),_socket.sendp({c:"board",type:e}),netmsg.once("board",null,t),n=t}function t(e,t,n){fairygui.GRoot.inst.closeModalWait(),e.itemRenderer=g.create(null,function(e,t){t._clickHandler&&t.offClick(null,t._clickHandler),t._clickHandler=function(){l.getController("c1").selectedIndex=0,l.getChild("n12").text=i.showId,l.getChild("n7").text=i.nickname,l.getChild("n34").displayObject.event("click")},t.onClick(null,t._clickHandler);var i=n.board[e];t.getChild("n3").text=i.nickname+" ID:"+i.showId,t.getChild("n2").text=i[n.type],t.getChild("n4").text=i.regIP||"",t.getChild("n6").text=i.lastIP||"",t.getChild("n1").text=r.toDateString(i.loginTime)},null,!1),e.numItems=n.board.length}var n,i=l.getController("c1");l.getChild("n113").setVirtual(),l.getChild("n135").setVirtual(),i.on("fui_state_changed",null,function(){switch(i.selectedIndex){case 4:e("coins",t.bind(null,l.getChild("n113"),"coins"));break;case 5:e("savedMoney",t.bind(null,l.getChild("n135"),"savedMoney"))}})}(),function(){var e=l.getChild("n144");e.removeChildren();var t=fairygui.UIPackage.createObject("Package1","服务器管理item");t.getChild("n3").text="",t.getChild("n2").text="";var n=t.getChild("n7"),i=t.getChild("n8");n.selected=!1,i.selected=!1,n.onClick(null,function(){_socket.sendp({c:"admin.srv.chat",v:!n.selected})}),i.onClick(null,function(){_socket.sendp({c:"admin.srv.enter",v:!i.selected})}),e.addChild(t),fairygui.GRoot.inst.showModalWait(),_socket.sendp({c:"admin.srv.ls"}),netmsg.on("admin.srv.ls",null,function(e){fairygui.GRoot.inst.closeModalWait(),t.getChild("n3").text="服务器1区",t.getChild("n2").text="金豆"+e.total_profit,n.selected=!e.canchat,i.selected=!e.canenter})}(),l.getChild("n3").onClick(n,n.enterGame),l.getChild("n62").onClick(null,function(){main({showlogin:!0})}),i(null,n)}))}}]),e}();e.exports=f.create},162:function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=n(97),r=function(){function e(t){i(this,e),this.view=t,this.roadBeadPlate=t.getChildAt(0).asCom,this.cols=this._orgCols=Math.max(9,Math.ceil(this.view.width/27)),this.roadBeadPlate.getChild("n90").asList.removeChildren()}return o(e,[{key:"refreshRoad",value:function(e){var t=this.roadBeadPlate.getChild("n90").asList;t.removeChildren();var n=Math.floor(e.length/6)+1,i=Math.max(n,this._orgCols);this.cols=i,n>=this._orgCols?this.view.scrollPane.setPosX(this.roadBeadPlate.width-this.view.width):this.view.scrollPane.setPosX(0);for(var l=t._children.length;l<e.length;l++){var o=fairygui.UIPackage.createObject("Package1","路格1"),a=e[l],r=o.getController("c1");if(r.selectedIndex=0,!a)return;"banker"==a.win?r.selectedIndex=1:"player"==a.win?r.selectedIndex=2:r.selectedIndex=3,a.demo?o.getTransition("t0").play():o.getTransition("t0").stop(),o.getChild("n6").visible=a.bankerPair,o.getChild("n7").visible=a.playerPair,t.addChild(o)}}},{key:"cols",get:function(){return this._cols},set:function(e){this._cols=e,this.roadBeadPlate.width=28*this._cols+1}}]),e}(),s=function(){function e(t){i(this,e),this.view=t,this.roadBig=t.getChildAt(0).asCom,this.cols=this._orgCols=Math.max(24,Math.ceil(this.view.width/13))}return o(e,[{key:"bigRoad",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=(t.columns,t.rows),i=void 0===n?6:n,l=[],o={},r=0,s=void 0,d=[],c=0;return e.forEach(function(e){if("tie"===e.win)l.push(e);else{if(s){var t=a.last(d);"tie"===s.win&&t&&(t.ties=a.cloneDeep(l),l=[],s=t.result),t&&s.win&&s.win!==e.win&&r++}for(var n=r,u=0,h=!1;!h;){var g=n+"."+u,f=n+"."+(u+1);if(a.get(o,g))u+1>=i?n++:a.get(o,f)?a.get(o,f).result.win===e.win?u++:n++:u++;else{var C=a.merge({},{row:u,column:n,logicalColumn:r,ties:a.cloneDeep(l)},{result:e});a.set(o,g,C),d.push(o[n][u]),h=!0}}l=[],c=Math.max(c,n)}s=e}),a.isEmpty(d)&&l.length>0?d.push({ties:a.cloneDeep(l),column:0,row:0,logicalColumn:0,result:{}}):!a.isEmpty(d)&&l.length&&(a.last(d).ties=a.cloneDeep(l)),d.maximumColumnReached=c,d}},{key:"logicalRoad",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=(t.columns,t.rows,[]),i=0,l=void 0;return e.forEach(function(e){"tie"!==e.win&&(l&&l.win&&l.win!==e.win&&i++,n[i]?n[i].push({result:e}):n[i]=[{result:e}],l=e)}),n}},{key:"refreshRoad",value:function(e){var t=this.roadBig,n=this.bigRoad(e),i=Math.max(n.maximumColumnReached,this._orgCols);this.cols=2*Math.floor(i/2)+2,n.maximumColumnReached>=this._orgCols?this.view.scrollPane.setPosX(this.roadBig.width-this.view.width):this.view.scrollPane.setPosX(0),t.removeChildren(2);for(var l=0;l<n.length;l++){var o=fairygui.UIPackage.createObject("Package1","路格2"),a=n[l].result,r=o.getController("c1");null==a.win?r.selectedIndex=0:"banker"==a.win?r.selectedIndex=1:"player"==a.win&&(r.selectedIndex=2),a.demo?o.getTransition("t0").play():o.getTransition("t0").stop(),o.getChild("n68").visible=a.bankerPair,o.getChild("n69").visible=a.playerPair,o.getChild("n72").visible=null!=n[l].ties&&n[l].ties.length>0,o.x=14*n[l].column+2,o.y=14*n[l].row+2,t.addChild(o)}}},{key:"cols",get:function(){return this._cols},set:function(e){this._cols=e,this.roadBig.width=14*this._cols+1}}]),e}(),d=function(){function e(t,n,l){i(this,e),this.view=t,this.road=t.getChildAt(0).asCom,this.circle=n||1,this.cols=this._orgCols=l||Math.max(24,Math.ceil(this.view.width/7))}return o(e,[{key:"makeResult",value:function(e,t){return e<=t?"red":e==t+1?"blue":"red"}},{key:"reverseResult",value:function(e){return"red"==e?"blue":"red"}},{key:"bigEye",value:function(e,t){for(var n=[],i=this.circle;i<e.length;i++){var l=e[i],o=i-this.circle,a=e[o].length-1,r=o-1;if(r>=0){var s=e[r].length-1,d=a+1;n.push(this.reverseResult(this.makeResult(d,s)))}for(var c=1;c<l.length;c++)n.push(this.makeResult(c,a))}return n[n.length-1]={color:n[n.length-1],isDemo:t},this.turn2Map(n)}},{key:"turn2Map",value:function(e){var t=6,n={},i=0,o=void 0,r=[],s=0;return e.forEach(function(e){var d;"object"==("undefined"==typeof e?"undefined":l(e))&&(d=e.isDemo,e=e.color),o&&o!=e&&i++;for(var c=i,u=0,h=!1;!h;){var g=c+"."+u,f=c+"."+(u+1);if(a.get(n,g))u+1>=t?c++:a.get(n,f)?a.get(n,f).result===e?u++:c++:u++;else{var C=a.merge({},{row:u,column:c,logicalColumn:i},{result:e,isDemo:d});a.set(n,g,C),r.push(n[c][u]),h=!0}}o=e,s=Math.max(s,c)}),r.maximumColumnReached=s,r}},{key:"refreshRoad",value:function(e,t){var n=this.road,i=this.bigEye(e,t),l=Math.max(i.maximumColumnReached,this._orgCols);this.cols=2*Math.round(l/2+1),i.maximumColumnReached>=this._orgCols?this.view.scrollPane.setPosX(n.width-this.view.width):this.view.scrollPane.setPosX(0),n.removeChildren(2);for(var o=0;o<i.length;o++){var a=fairygui.UIPackage.createObject("Package1","路格"+(2+this.circle)),r=i[o].result,s=i[o].isDemo,d=a.getController("c1");"red"==r?d.selectedIndex=0:d.selectedIndex=1,s?a.getTransition("t0").play():a.getTransition("t0").stop(),a.x=7*i[o].column+1,a.y=7*i[o].row+1,n.addChild(a)}}},{key:"cols",get:function(){return this._cols},set:function(e){this._cols=e,this.road.width=7*this._cols+1}}]),e}();e.exports={BeadPlate:r,BigRoad:s,BigEye:d}},163:function(e,t,n){e.exports=n.p+"baijiale@atlas_bri047.png?075e169265a5e4a629ae1e83cc66c691"}});