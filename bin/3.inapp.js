webpackJsonp([3,1,4],{

/***/ 84:
/***/ function(module, exports) {

	"use strict";

	startup_param.showRecharge = false;

/***/ },

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var t = __webpack_require__(88);
	module.exports = t;

/***/ },

/***/ 88:
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function noop() {}

	var TDGA = window.TDGA;
	if (!TDGA) {
		TDGA = {
			Account: noop,
			onPageLeave: noop,
			onReward: noop,
			onChargeRequest: noop,
			onChargeSuccess: noop,
			onItemPurchase: noop,
			onMissionBegin: noop,
			onMissionCompleted: noop,
			onEvent: noop
		};
		TDGA.Account.setLevel = noop;
	}

	var Stat = function () {
		function Stat() {
			_classCallCheck(this, Stat);

			this._delayOp = [];
			this._inited = true;
		}

		_createClass(Stat, [{
			key: "init",
			value: function init(key) {
				this._inited = true;
				return;
			}
		}, {
			key: "_delay",
			value: function _delay(f) {
				if (!this._inited) {
					return this._delayOp.push({ f: f });
				}
				f();
			}
		}, {
			key: "userin",
			value: function userin(me) {
				this._delay(function () {
					var qudao = 0;
					if (!!window.cordova) {
						var o = { "Android": 1, "BlackBerry 10": 2, "browser": 3, "iOS": 4, "WinCE": 5, "Tizen": 6, "Mac OS X": 7 };
						qudao = o[device.platform] || 8;
					} else if (startup_param.pf == 'wechat') qudao = 101;
					TDGA.Account({
						accountId: me.id,
						level: me.level,
						accountName: me.nickname,
						gameServer: '通用',
						accountType: qudao,
						gender: startup_param.sex
					});
				});
			}
		}, {
			key: "userout",
			value: function userout() {
				this._delay(TDGA.onPageLeave.bind(TDGA));
			}
		}, {
			key: "levelup",
			value: function levelup(n) {
				this._delay(TDGA.Account.setLevel.bind(TDGA.Account, n));
			}
		}, {
			key: "reward",
			value: function reward(n, reason) {
				this._delay(TDGA.onReward.bind(TDGA, n, reason));
			}
		}, {
			key: "beginCharge",
			value: function beginCharge(orderid, money, tickets, desc, payment) {
				if (typeof tickets == 'string') {
					payment = desc;
					desc = tickets;
					tickets = Math.floor(money / 3);
				}
				this._delay(function () {
					TDGA.onChargeRequest({
						orderId: orderid,
						iapId: desc,
						currencyAmount: money,
						currencyType: 'CNY',
						virtualCurrencyAmount: tickets,
						paymentType: payment
					});
				});
			}
		}, {
			key: "endCharge",
			value: function endCharge(orderid, payment) {
				this._delay(function () {
					TDGA.onChargeSuccess({
						orderId: orderid,
						paymentType: payment
					});
				});
			}
		}, {
			key: "enterGame",
			value: function enterGame(tableid) {
				this._delay(function () {
					TDGA.onMissionBegin(tableid.toString());
				});
			}
		}, {
			key: "startGame",
			value: function startGame(tableid, name, tickets) {
				this._delay(function () {
					TDGA.onItemPurchase({ item: name, itemNumber: 1, priceInVirtualCurrency: tickets });
					TDGA.onEvent(name, {});
				});
			}
		}, {
			key: "endGame",
			value: function endGame(tableid) {
				this._delay(function () {
					TDGA.onMissionCompleted(tableid.toString());
				});
			}
		}, {
			key: "share",
			value: function share() {
				this._delay(function () {
					TDGA.onEvent('share', { user: { id: me.id, nickname: me.nickname } });
				});
			}
		}, {
			key: "invite",
			value: function invite(tableid, tabledesc) {
				this._delay(function () {
					TDGA.onEvent('invite', { user: { id: me.id, nickname: me.nickname }, table: { id: tableid, msg: tabledesc } });
				});
			}
		}, {
			key: "event",
			value: function event(name, data) {
				this._delay(function () {
					TDGA.onEvent(name, (typeof data === "undefined" ? "undefined" : _typeof(data)) == 'object' ? data : { data: data });
				});
			}
			/**
	   * 
	   * @param {number} n , 换多少币
	   * @param {number} m ，上级币的数量
	   * @param {string|null} n_name, 本级货币名称，默认金币
	   * @param {string|null} m_name, 上级货币名称，默认钻石
	   */

		}, {
			key: "changeToVirtualCurrency",
			value: function changeToVirtualCurrency(n, m, n_name, m_name) {
				n_name = n_name || '金币';m_name = m_name || '钻石';
				this._delay(function () {
					var detail = {};
					detail[n_name] = n;
					detail[m_name] = m;
					TDGA.onEvent('buyCoin', detail);
				});
			}
			/**
	   * 消耗虚拟币，如果有3个参数，那么是消耗n*price的币，
	   * @param {string} name 
	   * @param {number} n 
	   * @param {number|null} price 
	   */

		}, {
			key: "consume",
			value: function consume(name, n, price) {
				this._delay(function () {
					TDGA.onItemPurchase(name, n, price);
				});
			}
		}]);

		return Stat;
	}();

	var tongji = new Stat();
	window.onunload = tongji.userout.bind(tongji);

	module.exports = tongji;

/***/ },

/***/ 90:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var tongji = window.tongji = __webpack_require__(87);

	var _ = __webpack_require__(22),
	    noop = _._noop;
	var deviceof;
	switch (device.platform) {
		case 'iOS':
			devicepf = __webpack_require__(92);
			break;
		case 'android':
			devicepf = __webpack_require__(84);
			break;
		default:
			window.pay = function (orderid, money, desc, cb) {
				!cb && (cb = _noop);
				if (tipon) {
					tipon(device.platfomr + '未实现').popup();
				}
				cb('not impl');
			};
			window.share = function () {
				if (tipon) {
					tipon(device.platfomr + '未实现').popup();
				}
			};
			window.preShareResult = function (roomid, setnum, participants, winners, img) {
				if (tipon) {
					tipon(device.platfomr + '未实现').popup();
				}
			};
			break;
	}

	document.addEventListener("pause", function () {
		if (Laya) Laya.SoundManager.muted = true;
	}, false);
	document.addEventListener("resume", function () {
		if (Laya) Laya.SoundManager.muted = false;
	}, false);

	module.exports = {
		onload: function onload() {
			if (devicepf && (typeof devicepf === 'undefined' ? 'undefined' : _typeof(devicepf)) == 'object' && devicepf.onload) devicepf.onload();
		}
	};

/***/ },

/***/ 92:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	startup_param.showRecharge = true;

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
	            getAjax('/pf/apple/pay', data, function (err, r) {
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
	    document.addEventListener('gameLoaded', function () {
	        var wins = __webpack_require__(93);

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
	    });
	}

/***/ }

});