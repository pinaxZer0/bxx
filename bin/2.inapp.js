webpackJsonp([2],{53:function(e,n){"use strict";function t(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(){}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=window.TDGA;u||(u={Account:o,onPageLeave:o,onReward:o,onChargeRequest:o,onChargeSuccess:o,onItemPurchase:o,onMissionBegin:o,onMissionCompleted:o,onEvent:o},u.Account.setLevel=o);var r=function(){function e(){t(this,e),this._delayOp=[],this._inited=!0}return a(e,[{key:"init",value:function(e){this._inited=!0}},{key:"_delay",value:function(e){return this._inited?void e():this._delayOp.push({f:e})}},{key:"userin",value:function(e){this._delay(function(){var n=0;if(window.cordova){var t={Android:1,"BlackBerry 10":2,browser:3,iOS:4,WinCE:5,Tizen:6,"Mac OS X":7};n=t[device.platform]||8}else"wechat"==startup_param.pf&&(n=101);u.Account({accountId:e.id,level:e.level,accountName:e.nickname,gameServer:"通用",accountType:n,gender:startup_param.sex})})}},{key:"userout",value:function(){this._delay(u.onPageLeave.bind(u))}},{key:"levelup",value:function(e){this._delay(u.Account.setLevel.bind(u.Account,e))}},{key:"reward",value:function(e,n){this._delay(u.onReward.bind(u,e,n))}},{key:"beginCharge",value:function(e,n,t,o,i){"string"==typeof t&&(i=o,o=t,t=Math.floor(n/3)),this._delay(function(){u.onChargeRequest({orderId:e,iapId:o,currencyAmount:n,currencyType:"CNY",virtualCurrencyAmount:t,paymentType:i})})}},{key:"endCharge",value:function(e,n){this._delay(function(){u.onChargeSuccess({orderId:e,paymentType:n})})}},{key:"enterGame",value:function(e){this._delay(function(){u.onMissionBegin(e.toString())})}},{key:"startGame",value:function(e,n,t){this._delay(function(){u.onItemPurchase({item:n,itemNumber:1,priceInVirtualCurrency:t}),u.onEvent(n,{})})}},{key:"endGame",value:function(e){this._delay(function(){u.onMissionCompleted(e.toString())})}},{key:"share",value:function(){this._delay(function(){u.onEvent("share",{user:{id:me.id,nickname:me.nickname}})})}},{key:"invite",value:function(e,n){this._delay(function(){u.onEvent("invite",{user:{id:me.id,nickname:me.nickname},table:{id:e,msg:n}})})}},{key:"event",value:function(e,n){this._delay(function(){u.onEvent(e,"object"==("undefined"==typeof n?"undefined":i(n))?n:{data:n})})}}]),e}(),c=new r;window.onunload=c.userout.bind(c),e.exports=c},55:function(e,n,t){"use strict";function o(){}var i=window.tongji=t(53);window.pay=function(e,n,t,a){return!a&&(a=o),tipon?(i.beginCharge(e,n,t,"测试通道"),getAjax("pf/default/pay",{orderid:e,money:n},function(n,t){return n?tipon(n.responseText).popup(a):(tipon("测试版，直接完成充值").popup(a),void i.endCharge(e,"测试通道"))})):void a()},window.share=function(){console.log("share")},window.preShareResult=function(e,n,t,o,i){console.log("shareContent",arguments)}}});