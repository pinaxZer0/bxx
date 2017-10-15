webpackJsonp([9],{

/***/ 89:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var merge = __webpack_require__(21);
	if (!window.store) alert('cc.fovea.cordova.purchase not installed');else {
	    var _realInAppPurchase = function _realInAppPurchase(orderid, money, desc, cb) {
	        tongji.beginCharge(orderid, appleProducts[orderid].actureMoney, appleProducts[orderid].actureCoins, desc, '苹果商店支付');
	        store.order(orderid);
	    };

	    var appleProducts = {
	        'low': { bundle: 'com.1357g.niuniu.5tickets' },
	        'middle': { bundle: 'com.bjl2000.bacc.middleprice' },
	        'high': { bundle: 'com.bjl2000.bacc.highprice' }
	    };

	    for (var p in appleProducts) {
	        store.register({
	            id: appleProducts[p].bundle, // id without package name!
	            alias: p,
	            type: store.CONSUMABLE
	        });
	        store.when(p).updated(function (pinfo) {
	            console.log(p, 'price', pinfo.price);
	            appleProducts[p] = merge(appleProducts[p], pinfo);
	            if (pinfo.state == 'invalid') return;
	            appleProducts[p].actureMoney = Number(pinfo.price.substr(1));
	            appleProducts[p].actureCoins = pinfo.description.substr(pinfo.description.indexOf('=') + 1);
	        }).approved(function (order) {
	            order.verify();
	        }).verified(function (order) {
	            console.log('finally', order);
	            if (!appleOrderid) return appleOrderCb && appleOrderCb('appleOrderid was not set');
	            var data = { actureMoney: appleProducts[p].actureMoney, orderid: appleOrderid, receipt: order.transaction.appStoreReceipt };
	            getAjax('/g/niuniu.app/pay/apple', data, function (err, r) {
	                err = err || r.err;
	                if (err) {
	                    console.log(err, r);
	                    tipon(err).popup();
	                } else tipon('购买成功').popup();
	                order.finish();
	                tongji.endCharge(appleOrderid, '苹果商店支付');
	                var _cb = appleOrderCb;
	                appleOrderCb = null;
	                _cb && _cb();
	            });
	        }).cancelled(function (order) {
	            var _cb = appleOrderCb;
	            appleOrderCb = null;
	            _cb && _cb();
	        });
	    }

	    store.validator = function (product, callback) {
	        console.log('verify', product);
	        callback(true);
	    };
	    store.error(function (err) {
	        console.log(err);
	    });
	    store.refresh();

	    var payQ = async.queue(function (f, cb) {
	        if (typeof f == 'function') f(cb);else cb();
	    });
	    window.pay = function (orderid, money, desc, cb) {
	        !cb && (cb = _noop);
	        payQ.push(_realInAppPurchase.bind(null, orderid, money, desc), cb);
	    };

	    // change rechargeWin impl
	    var wins = __webpack_require__(94);

	    var RechargeWin = function (_wins$Win) {
	        _inherits(RechargeWin, _wins$Win);

	        function RechargeWin() {
	            _classCallCheck(this, RechargeWin);

	            return _possibleConstructorReturn(this, (RechargeWin.__proto__ || Object.getPrototypeOf(RechargeWin)).call(this, 'recharge'));
	        }

	        _createClass(RechargeWin, [{
	            key: 'onInit',
	            value: function onInit() {
	                _get(RechargeWin.prototype.__proto__ || Object.getPrototypeOf(RechargeWin.prototype), 'onInit', this).call(this);
	                var l = this.contentPane.getChild('n87');
	                var idx = 0;

	                var _loop = function _loop(_p) {
	                    pane = l.getChildAt(idx);

	                    appleProducts[_p].price && (pane.getChild('n85').text = appleProducts[_p].price);
	                    pane.onClick(null, function () {
	                        getAjax('createOrder', { productId: appleProducts[_p].bundle }, function (err, r) {
	                            pay(appleProducts[_p].bundle);
	                        });
	                    });
	                    l.addChild(pane);
	                };

	                for (var _p in appleProducts) {
	                    var pane;

	                    _loop(_p);
	                }
	            }
	        }]);

	        return RechargeWin;
	    }(wins.Win);

	    ;

	    wins.RechargeWin = RechargeWin;
	}

/***/ }

});