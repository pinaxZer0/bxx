webpackJsonp([8],Array(158).concat([
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _ = __webpack_require__(93);

	var BeadPlate = function () {
		/**
	  * 
	  * @param {fairygui.GObject} view 
	  */
		function BeadPlate(view) {
			_classCallCheck(this, BeadPlate);

			this.view = view; //.getChild('n2').getChild('n17').getChild('n1');
			this.roadBeadPlate = view.getChildAt(0).asCom;
			this.cols = this._orgCols = Math.max(9, Math.ceil(this.view.width / 27));
			this.roadBeadPlate.getChild('n90').asList.removeChildren();

			var self = this;
		}

		_createClass(BeadPlate, [{
			key: 'refreshRoad',
			value: function refreshRoad(his) {
				var road = this.roadBeadPlate.getChild('n90').asList;
				road.removeChildren();
				// if (his.length<road._children.length) {
				// 	road.removeChildren();
				// 	// this.cols=this._orgCols;
				// 	// return;
				// }
				var curCol = Math.floor(his.length / 6) + 1;
				var width = Math.max(curCol, this._orgCols);
				// if (width>this.cols) {
				this.cols = width;
				if (curCol >= this._orgCols) this.view.scrollPane.setPosX(this.roadBeadPlate.width - this.view.width);else this.view.scrollPane.setPosX(0);
				// }
				for (var i = road._children.length; i < his.length; i++) {
					var obj = fairygui.UIPackage.createObject('Package1', '路格1');
					var pan = his[i];
					var winCtrl = obj.getController('c1');
					winCtrl.selectedIndex = 0;
					if (!pan) return;
					if (pan.win == 'banker') winCtrl.selectedIndex = 1;else if (pan.win == 'player') winCtrl.selectedIndex = 2;else winCtrl.selectedIndex = 3;
					if (pan.demo) obj.getTransition('t0').play();else obj.getTransition('t0').stop();

					obj.getChild('n6').visible = pan.bankerPair;
					obj.getChild('n7').visible = pan.playerPair;
					road.addChild(obj);
				}
			}
		}, {
			key: 'cols',
			get: function get() {
				return this._cols;
			},
			set: function set(n) {
				this._cols = n;
				this.roadBeadPlate.width = 28 * this._cols + 1;
			}
		}]);

		return BeadPlate;
	}();

	var BigRoad = function () {
		function BigRoad(view) {
			_classCallCheck(this, BigRoad);

			this.view = view; //.getChild('n2').getChild('n19').getChild('n19');
			this.roadBig = view.getChildAt(0).asCom;
			this.cols = this._orgCols = Math.max(24, Math.ceil(this.view.width / 13));
			var self = this;
		}

		_createClass(BigRoad, [{
			key: 'bigRoad',
			value: function bigRoad() {
				var gameResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

				var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    _ref$columns = _ref.columns,
				    columns = _ref$columns === undefined ? 12 : _ref$columns,
				    _ref$rows = _ref.rows,
				    rows = _ref$rows === undefined ? 6 : _ref$rows;

				var tieStack = [];
				var placementMap = {};
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;

				gameResults.forEach(function (gameResult) {
					if (gameResult.win === 'tie') {
						tieStack.push(gameResult);
					} else {
						if (lastItem) {
							// Add the ties that happened inbetween the last placed big road item
							// and this new big road item to the last entered big road item.
							var lastItemInResults = _.last(returnList);
							if (lastItem.win === 'tie') {
								if (lastItemInResults) {
									lastItemInResults.ties = _.cloneDeep(tieStack);
									tieStack = [];
									lastItem = lastItemInResults.result;
								}
								// else lastItem.win=null;
							}
							if (lastItemInResults) {
								// If this item is different from the outcome of the last game
								// then we must place it in another column
								if (lastItem.win && lastItem.win !== gameResult.win) {
									logicalColumnNumber++;
								}
							}
						}

						var probeColumn = logicalColumnNumber;
						var probeRow = 0;
						var done = false;

						while (!done) {
							var keySearch = probeColumn + '.' + probeRow;
							var keySearchBelow = probeColumn + '.' + (probeRow + 1);

							// Position available at current probe location
							if (!_.get(placementMap, keySearch)) {
								var newEntry = _.merge({}, {
									row: probeRow,
									column: probeColumn,
									logicalColumn: logicalColumnNumber,
									ties: _.cloneDeep(tieStack)
								}, { result: gameResult });
								_.set(placementMap, keySearch, newEntry);
								returnList.push(placementMap[probeColumn][probeRow]);

								done = true;
							}
							// The spot below would go beyond the table bounds.
							else if (probeRow + 1 >= rows) {
									probeColumn++;
								}
								// The spot below is empty.
								else if (!_.get(placementMap, keySearchBelow)) {
										probeRow++;
									}
									// The result below is the same outcome.
									else if (_.get(placementMap, keySearchBelow).result.win === gameResult.win) {
											probeRow++;
										} else {
											probeColumn++;
										}
						}
						tieStack = [];
						maximumColumnReached = Math.max(maximumColumnReached, probeColumn);
					}

					lastItem = gameResult;
				});
				// There were no outcomes added to the placement map.
				// We only have ties.
				if (_.isEmpty(returnList) && tieStack.length > 0) {
					returnList.push({
						ties: _.cloneDeep(tieStack),
						column: 0,
						row: 0,
						logicalColumn: 0,
						result: {} });
				} else if (!_.isEmpty(returnList) && tieStack.length) {
					_.last(returnList).ties = _.cloneDeep(tieStack);
				}

				returnList.maximumColumnReached = maximumColumnReached;
				return returnList;
			}
		}, {
			key: 'logicalRoad',
			value: function logicalRoad() {
				var gameResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

				var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    _ref2$columns = _ref2.columns,
				    columns = _ref2$columns === undefined ? 12 : _ref2$columns,
				    _ref2$rows = _ref2.rows,
				    rows = _ref2$rows === undefined ? 6 : _ref2$rows;

				var tieStack = [];
				var placementMap = [];
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;

				// Build the logical column definitions that doesn't represent
				// the actual "drawn" roadmap.
				gameResults.forEach(function (gameResult) {
					if (gameResult.win === 'tie') return;else {
						if (lastItem) {
							// Add the ties that happened inbetween the last placed big road item
							// and this new big road item to the last entered big road item.
							// If this item is different from the outcome of the last game
							// then we must place it in another column
							if (lastItem.win && lastItem.win !== gameResult.win) {
								logicalColumnNumber++;
							}
						}

						if (!placementMap[logicalColumnNumber]) placementMap[logicalColumnNumber] = [{ result: gameResult }];else placementMap[logicalColumnNumber].push({ result: gameResult });
					}

					lastItem = gameResult;
				});
				return placementMap;
			}
		}, {
			key: 'refreshRoad',
			value: function refreshRoad(his) {
				var road = this.roadBig;
				// var data=this.bigRoad(his);
				var data = this.bigRoad(his);
				var width = Math.max(data.maximumColumnReached, this._orgCols);
				// if (width>this.cols) {
				this.cols = Math.floor(width / 2) * 2 + 2;
				if (data.maximumColumnReached >= this._orgCols) this.view.scrollPane.setPosX(this.roadBig.width - this.view.width);else this.view.scrollPane.setPosX(0);
				// }
				// if(his.length==0) 
				// if (data.maximumColumnReached>=this.cols-1) {
				// 	this.cols=Math.floor(data.maximumColumnReached/2)*2+2;
				// 	this.view.scrollPane.setPosX(this.roadBig.width-this.view.width);
				// }
				road.removeChildren(2);
				for (var i = 0; i < data.length; i++) {
					var obj = fairygui.UIPackage.createObject('Package1', '路格2');
					var pan = data[i].result;
					var winCtrl = obj.getController('c1');
					if (pan.win == null) winCtrl.selectedIndex = 0;else if (pan.win == 'banker') winCtrl.selectedIndex = 1;else if (pan.win == 'player') winCtrl.selectedIndex = 2;
					if (pan.demo) obj.getTransition('t0').play();else obj.getTransition('t0').stop();

					obj.getChild('n68').visible = pan.bankerPair;
					obj.getChild('n69').visible = pan.playerPair;
					obj.getChild('n72').visible = data[i].ties != null && data[i].ties.length > 0;
					obj.x = data[i].column * 14 + 2;
					obj.y = data[i].row * 14 + 2;
					road.addChild(obj);
				}
			}
		}, {
			key: 'cols',
			get: function get() {
				return this._cols;
			},
			set: function set(n) {
				this._cols = n;
				this.roadBig.width = 14 * this._cols + 1;
			}
		}]);

		return BigRoad;
	}();

	var BigEye = function () {
		function BigEye(view, circle, cols) {
			_classCallCheck(this, BigEye);

			this.view = view;
			this.road = view.getChildAt(0).asCom;
			this.circle = circle || 1;
			this.cols = this._orgCols = cols || Math.max(12 * 2, Math.ceil(this.view.width / 7));
			// if (this.circle==2) this.cols*=2;
			var self = this;
		}

		_createClass(BigEye, [{
			key: 'makeResult',
			value: function makeResult(thisHigh, preHigh) {
				if (thisHigh <= preHigh) return 'red';
				if (thisHigh == preHigh + 1) return 'blue';
				return 'red';
			}
		}, {
			key: 'reverseResult',
			value: function reverseResult(r) {
				if (r == 'red') return 'blue';
				return 'red';
			}
		}, {
			key: 'bigEye',
			value: function bigEye(bigRoadPlacement, withDemo) {
				var tieStack = [];
				var placementMap = {};
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;

				for (var col = this.circle; col < bigRoadPlacement.length; col++) {
					var brCol = bigRoadPlacement[col];
					var compareCol = col - this.circle,
					    high = bigRoadPlacement[compareCol].length - 1;
					// for first cell in each col
					var preCompareCol = compareCol - 1;
					if (preCompareCol >= 0) {
						var preHigh = bigRoadPlacement[preCompareCol].length - 1;
						var firstCellHigh = high + 1;
						returnList.push(this.reverseResult(this.makeResult(firstCellHigh, preHigh)));
					}
					for (var row = 1; row < brCol.length; row++) {
						returnList.push(this.makeResult(row, high));
					}
				}
				returnList[returnList.length - 1] = { color: returnList[returnList.length - 1], isDemo: withDemo };

				return this.turn2Map(returnList);
			}
		}, {
			key: 'turn2Map',
			value: function turn2Map(results) {
				var rows = 6;
				var placementMap = {};
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;
				results.forEach(function (gameResult) {
					var isDemo;
					if ((typeof gameResult === 'undefined' ? 'undefined' : _typeof(gameResult)) == 'object') {
						isDemo = gameResult.isDemo;
						gameResult = gameResult.color;
					}
					if (lastItem && lastItem != gameResult) logicalColumnNumber++;
					var probeColumn = logicalColumnNumber;
					var probeRow = 0;
					var done = false;

					while (!done) {
						var keySearch = probeColumn + '.' + probeRow;
						var keySearchBelow = probeColumn + '.' + (probeRow + 1);

						// Position available at current probe location
						if (!_.get(placementMap, keySearch)) {
							var newEntry = _.merge({}, {
								row: probeRow,
								column: probeColumn,
								logicalColumn: logicalColumnNumber
							}, { result: gameResult, isDemo: isDemo });
							_.set(placementMap, keySearch, newEntry);
							returnList.push(placementMap[probeColumn][probeRow]);

							done = true;
						}
						// The spot below would go beyond the table bounds.
						else if (probeRow + 1 >= rows) {
								probeColumn++;
							}
							// The spot below is empty.
							else if (!_.get(placementMap, keySearchBelow)) {
									probeRow++;
								}
								// The result below is the same outcome.
								else if (_.get(placementMap, keySearchBelow).result === gameResult) {
										probeRow++;
									} else {
										probeColumn++;
									}
					}

					lastItem = gameResult;
					maximumColumnReached = Math.max(maximumColumnReached, probeColumn);
				});

				returnList.maximumColumnReached = maximumColumnReached;
				return returnList;
			}
		}, {
			key: 'refreshRoad',
			value: function refreshRoad(bigRoadPlacement, withDemo) {
				var road = this.road;
				// var data=this.bigRoad(his);
				var data = this.bigEye(bigRoadPlacement, withDemo);
				var width = Math.max(data.maximumColumnReached, this._orgCols);
				// if (width>this.cols) {
				this.cols = Math.round(width / 2 + 1) * 2;
				if (data.maximumColumnReached >= this._orgCols) this.view.scrollPane.setPosX(road.width - this.view.width);else this.view.scrollPane.setPosX(0);
				// }
				// if (data.maximumColumnReached>=this.cols-1) {
				// 	this.cols=Math.floor(data.maximumColumnReached/2)*2+2;
				// 	this.view.scrollPane.setPosX(this.road.width-this.view.width);
				// }
				road.removeChildren(2);
				for (var i = 0; i < data.length; i++) {
					var obj = fairygui.UIPackage.createObject('Package1', '路格' + (2 + this.circle));
					var r = data[i].result,
					    isDemo = data[i].isDemo;
					var winCtrl = obj.getController('c1');
					if (r == 'red') winCtrl.selectedIndex = 0;else winCtrl.selectedIndex = 1;
					if (isDemo) obj.getTransition('t0').play();else obj.getTransition('t0').stop();

					obj.x = data[i].column * 7 + 1;
					obj.y = data[i].row * 7 + 1;
					road.addChild(obj);
				}
				// this.view.scroll
			}
		}, {
			key: 'cols',
			get: function get() {
				return this._cols;
			},
			set: function set(n) {
				this._cols = n;
				this.road.width = 7 * this._cols + 1;
			}
		}]);

		return BigEye;
	}();

	;

	module.exports = {
		BeadPlate: BeadPlate,
		BigRoad: BigRoad,
		BigEye: BigEye
	};

/***/ },
/* 159 */,
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var RoomBase = __webpack_require__(163);
	var merge = __webpack_require__(21),
	    clone = __webpack_require__(10);
	var _ = __webpack_require__(93);
	var toCardUrl = __webpack_require__(210);
	var Loader = laya.net.Loader;
	var Handler = laya.utils.Handler;
	var turf = window.turf = __webpack_require__(211);
	var randomPointsOnPolygon = __webpack_require__(212);
	var wins = __webpack_require__(92);
	var ROAD = __webpack_require__(158),
	    BeadPlate = ROAD.BeadPlate,
	    BigRoad = ROAD.BigRoad,
	    BigEye = ROAD.BigEye;
	var printf = __webpack_require__(23),
	    async = __webpack_require__(18);

	function removeA(arr) {
		var what,
		    a = arguments,
		    L = a.length,
		    ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax = arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	}

	var factor = { xian: 1.02, zhuang: 0.98, xianDui: 11, zhuangDui: 11, he: 8 };
	var coinMap = [1, 5, 10, 50, 100, 1000, 10000, 100000, 500000, 1000000, 5000000];
	var xiazhuPaneMap = { xianDui: 'n300', he: 'n301', zhuangDui: 'n302', xian: 'n303', zhuang: 'n304' };
	var xiazhuSelfPaneMap = { xianDui: 'n309', he: 'n310', zhuangDui: 'n311', xian: 'n312', zhuang: 'n313' };

	var xianqu = turf.polygon([[[385, 304], [579, 304], [579, 409], [448, 409], [385, 369], [385, 304]]]);
	var zhuangqu = turf.polygon([[[645, 304], [868, 304], [853, 369], [815, 409], [645, 409], [645, 304]]]);
	var xianDuiqu = turf.polygon([[[385, 202], [519, 202], [519, 264], [385, 264], [385, 202]]]);
	var hequ = turf.polygon([[[552, 202], [686, 202], [686, 264], [552, 264], [552, 202]]]);
	var zhuangDuiqu = turf.polygon([[[734, 202], [868, 202], [868, 264], [734, 264], [734, 202]]]);

	var cardScore = function cardScore(cards) {
		var ret = 0;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i];
			if (card.description.toLowerCase() === 'ace') ret += 1;else if (card.sort >= 10) ret += 0;else ret += card.sort;
		}
		return ret % 10;
	};

	var __ = __webpack_require__(22),
	    shortenCoinStr = __.shortenCoinStr,
	    fstr = __.fstr;

	function snd(url, last, cb) {
		if (typeof last == 'function') {
			cb = last;
			last = 1000;
		}
		if (!cb) cb = function cb() {};
		if (Laya.SoundManager.soundMuted) return setTimeout(function () {
			console.log(url, 'timeout');
			cb();
		}, last);
		Laya.SoundManager.playSound(url, 1, Handler.create(null, function () {
			console.log(url, 'done');
			cb();
		}));
	}

	var Room = function (_RoomBase) {
		_inherits(Room, _RoomBase);

		function Room(opt) {
			_classCallCheck(this, Room);

			opt.disableRtc = true;

			var _this = _possibleConstructorReturn(this, (Room.__proto__ || Object.getPrototypeOf(Room)).call(this, opt));

			_this._coins = {};
			_this._lastDeal = {};
			_this.chathis = [];
			_this._first_status_chgd = true;
			var self = _this,
			    gd = _this.gamedata;
			_this.gamedata.on('inited', function () {
				self.roadBeadPlate = new BeadPlate(self._view.getChild('n132').getChild('n17').getChild('n1'));
				self.bigRoad = new BigRoad(self._view.getChild('n132').getChild('n19').getChild('n19'));
				self.bigEye = new BigEye(self._view.getChild('n132').getChild('n20').getChild('n20'));
				self.smallRoad = new BigEye(self._view.getChild('n132').getChild('n22').getChild('n23'), 2);
				self.cockroachRoad = new BigEye(self._view.getChild('n132').getChild('n23').getChild('n23'), 3);

				// search first coin
				// var s=self._view.getChild('n35').scrollPane;
				// for (var i=0; i<coinMap.length; i++) {
				// 	if (coinMap[i]>gd.opt.minZhu) break;
				// }
				// i--;
				// if (i>=coinMap.length-5) i=coinMap.length-5;
				// if (i<0) i=0;
				// s.setPosX(i*80+5);
				//self.roadBeadPlate.refreshBeadPlate(self.gamedata.his);
			}).on('statuschgd', function () {
				if (self._first_status_chgd) {
					self._first_status_chgd = false;
					// 第一个status是结算的话，那么保持在 等待上局结束 的状态中（0）
					if (gd.status == 3) return;
				}
				console.log('chg status to', gd.status);
				if (gd.status == 1) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/pleasebet.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
				if (gd.status == 2) {
					self._view.getController('fapai').selectedIndex = 7;
					self._view.getChild('n215').visible = false;
				} else self._view.getController('fapai').selectedIndex = gd.status;
				// self._view.getChild('n79').visible=false;

				switch (gd.status) {
					case 1:
						self._view.getChild('n53').visible = true;
						self._view.getChild('n41').visible = true;
						['n25', 'n26', 'n27'].forEach(function (id) {
							self._view.getChild(id).enabled = true;
						});
						self._lastDeal = {};
						break;
					case 2:
						break;
				}
			}).on('seatschgd', function () {
				gd.emit('playerBankerchgd');
				self.delayUpdateUserIDs();
				self.delayUpdateGuashuaiList();
			}
			// .on('/seats\\.([^\\.]+).user.coinschgd/', function(eventName, userid) {
			// 	if (gd.playerBanker && gd.playerBanker.id==userid) return gd.emit('playerBankerchgd');
			// 	if (gd.enroll.findIndex(function(ele) {return ele.id==userid})>=0) self.delayRefreshGuashuaiList();
			// })
			).on('playerBankerchgd', function () {
				var pb = null;
				if (gd.playerBanker) pb = gd.seats[gd.playerBanker.id];
				if (pb) {
					pb = pb.user;
					if (pb.id == me.id) self._view.getChild('n294').enabled = true;
					self._view.getController('zhuang').selectedIndex = pb.id == me.id ? 1 : 0;
					self._view.getChild('n305').visible = pb.id == me.id;
					self._view.getChild('n258').text = pb.nickname || pb.id;
					self._view.getChild('n66').text = fstr(pb.coins);
					self._view.getChild('n263').text = shortenCoinStr(pb.profit || 0);
					self._view.getChild('n264').text = pb.bankerSets || 1;
				} else {
					self._view.getChild('n294').enabled = true;
					self._view.getController('zhuang').selectedIndex = 0;
					self._view.getChild('n258').text = '--';
					self._view.getChild('n66').text = '';
					self._view.getChild('n263').text = '';
					self._view.getChild('n264').text = '';
					self._view.getChild('n305').visible = false;
				}
			}).on('enrollchgd', function () {
				self._view.getChild('guashuailist').numItems = gd.enroll ? gd.enroll.length : 0;
			}).on('countdownchgd', function () {
				if (gd.countdown > 0 && gd.countdown <= 5) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/clock.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
				self._view.getChild('n175').text = gd.countdown;
				if (gd.countdown <= 5) self._view.getTransition('t7clock').play();
				if (gd.countdown == 0) {
					self._view.getTransition('t13stopxiazhu').play();
				}
				// if (gd.countdown<=0) self._view.getChild('n205').visible=self._view.getChild('n212').visible=false;
			}
			// .on('seatschgd', function() {
			// 	var n=Object.keys(gd.seats).length;
			// 	if (n!=self.getChild('n219').numItems) self.getChild('n219').numItems=n;
			// 	else self.getChild('n219').refreshVirtualList();
			// })
			).on('game.leftCardschgd', function () {
				self._view.getChild('shengpaishu').text = '剩牌数:' + self.gamedata.game.leftCards;
			}).on('optchgd', function chgZhu() {
				// var info=self._view.getChild('n2'), game=self.gamedata.opt;
				// info.getChild('n35').text=game.minZhu+'-'+game.maxZhu;
				// info.getChild('n68').text=game.minDui||1;
				// info.getChild('n70').text=(game.maxHe||750)+'/'+(game.maxDui||950);
				var game = self.gamedata.opt;
				self._view.getChild('n209').text = '限红：' + game.minZhu + '-' + shortenCoinStr(game.maxZhu);
				self._view.getChild('n210').text = printf('和、对子限红：%d-%s/%s', shortenCoinStr(game.minDui), shortenCoinStr(game.maxHe), shortenCoinStr(game.maxDui));
			}).on('hischgd', function (v, withdemo) {
				var info = self._view.getChild('n132'),
				    his = self.gamedata.his;
				if (!withdemo) {
					var last = his[his.length - 1];
					if (last) delete last.demo;
				}
				info.getChild('n57').text = his.length;
				// var beadPlate=self._view.getChild('n132').getChild('n17').getChild('n1').getChild(0).getChild('n90').asList;
				self.roadBeadPlate && self.roadBeadPlate.refreshRoad(his);
				if (self.bigRoad) {
					self.bigRoad.refreshRoad(his, withdemo);
					var br = self.bigRoad.logicalRoad(his);
					self.bigEye && self.bigEye.refreshRoad(br, withdemo);
					self.smallRoad.refreshRoad(br, withdemo);
					self.cockroachRoad.refreshRoad(br, withdemo);
				}
				var bankerWins = 0,
				    playerWins = 0,
				    tieWins = 0,
				    bankerPair = 0,
				    playerPair = 0,
				    tian = 0;
				for (var i = 0; i < his.length; i++) {
					if (his[i].win == 'banker') bankerWins++;else if (his[i].win == 'player') playerWins++;else tieWins++;
					if (his[i].bankerPair) bankerPair++;
					if (his[i].playerPair) playerPair++;
					if (his[i].playerTian) tian++;
					if (his[i].bankerTian) tian++;
				}
				info.getChild('n45').text = bankerWins;
				info.getChild('n47').text = playerWins;
				info.getChild('n49').text = tieWins;
				info.getChild('n51').text = bankerPair;
				info.getChild('n53').text = playerPair;
				info.getChild('n55').text = tian;
			}).on('game.player.cardschgd', function () {
				if (gd.status != 2) return;
				self.pausemsg(function (cb) {
					self._view.getChild('fanpai1').url = toCardUrl(gd.game.player.cards[0]);
					self._view.getChild('fanpai3').url = toCardUrl(gd.game.player.cards[1]);
					self._view.getChild('fanpai5').url = null;

					self._view.getChild('fanpai2').url = toCardUrl(gd.game.banker.cards[0]);
					self._view.getChild('fanpai4').url = toCardUrl(gd.game.banker.cards[1]);
					self._view.getChild('fanpai6').url = null;

					self._view.getChild('n189').text = cardScore(gd.game.player.cards.slice(0, 2));
					self._view.getChild('n193').text = cardScore(gd.game.banker.cards.slice(0, 2));

					self._view.getController('c1').selectedIndex = 0;
					// ['n250', 'n252', 'n253', 'n256', 'n257'].forEach(function(id) {
					// 	self._view.getChild(id).enabled=false;
					// });

					var q = [
					// function waitSomeTime(next) {
					// 	setTimeout(next, 1000);
					// },
					function playTwoCard(next) {
						self._view.getTransition('t6').play();
						// async.parallel([
						function plysnd(cb) {
							return cb();
							snd(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), 1200, function () {
								snd(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), 1200, cb);
							});
						}
						function wait(cb) {
							setTimeout(cb, /*1800*/2500);
						}
						wait(plysnd.bind(null, next));
						// ], function() {next()})
					}, function playPlayerThirdCard(next) {
						if (gd.game.player.cards.length < 3) return next();
						async.parallel([function plysnd(cb) {
							return cb();
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/playmore.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), 1600, cb);
						}, function plyani(cb) {
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/deal.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
							self._view.getChild('fanpai5').url = toCardUrl(gd.game.player.cards[2]);
							self._view.getTransition('t9').play(Handler.create(null, function () {
								self._view.getChild('n189').text = cardScore(gd.game.player.cards);
								cb();
							}));
						}], function () {
							return next();
							snd(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), 1200, next);
						});
					}, function playerBankerThirdCard(next) {
						if (gd.game.banker.cards.length < 3) return next();
						async.parallel([function plysnd(cb) {
							return cb();
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/bankmore.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), 1600, cb);
						}, function plyani(cb) {
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/deal.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
							self._view.getChild('fanpai6').url = toCardUrl(gd.game.banker.cards[2]);
							self._view.getTransition('t10').play(Handler.create(null, function () {
								self._view.getChild('n193').text = cardScore(gd.game.banker.cards);
								cb();
							}));
						}], function () {
							return next();
							snd(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), 1200, next);
						});
					}, function playCardSnd(next) {
						snd(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), 1200, function () {
							snd(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), 1200, next);
						});
					}, function playWhoWin(next) {
						// self._view.getController('fapai').selectedIndex=5;
						var bankers = cardScore(gd.game.banker.cards),
						    players = cardScore(gd.game.player.cards);
						var icon = self._view.getChild('n215'),
						    ctrl = icon.getController('c1');
						icon.visible = true;
						if (bankers > players) {
							ctrl.selectedIndex = 0;
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/bankwin.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
						} else if (bankers == players) {
							ctrl.selectedIndex = 2;
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/tie.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
						} else {
							ctrl.selectedIndex = 1;
							snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/playwin.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
						}
						// self._view.getTransition('t6').play(Handler.create(null, next));
						function playWinArea() {
							var final = gd.his[gd.his.length - 1];
							if (final.win == 'player') self._view.getTransition('t1').play();else if (final.win == 'banker') self._view.getTransition('t2').play();else self._view.getTransition('t4').play();
							// if (final.playerPair) self._view.getTransition('t3').play();
							// if (final.bankerPair) self._view.getTransition('t5').play();
						}
						setTimeout(playWinArea, 300);
						setTimeout(function () {
							icon.visible = false;next();
						}, 1500);
					},
					// function playWinArea(next) {
					// 	var final=gd.his[gd.his.length-1];
					// 	if (final.win=='player') self._view.getTransition('t1').play();
					// 	else if (final.win=='banker') self._view.getTransition('t2').play();
					// 	else self._view.getTransition('t4').play();
					// 	if (final.playerPair) self._view.getTransition('t3').play();
					// 	if (final.bankerPair) self._view.getTransition('t5').play();
					// 	setTimeout(next, 700);
					// },
					function blinkWins(next) {
						var r = gd.his[gd.his.length - 1];
						var snds = [];
						var winArr = [],
						    loseArr,
						    tieArr = [];
						if (r.win == 'tie') {
							winArr.push('he');
							self._view.getTransition('t4').play();
							tieArr = ['zhuang', 'xian'];
						} else {
							if (r.win == 'banker') {
								self._view.getTransition('t2').play();
								winArr.push('zhuang');
							}
							if (r.win == 'player') {
								self._view.getTransition('t1').play();
								winArr.push('xian');
							}
							if (r.playerPair) {
								snds.push(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/playpair.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
								winArr.push('xianDui');
								self._view.getTransition('t3').play();
							}
							if (r.bankerPair) {
								snds.push(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/bankpair.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
								winArr.push('zhuangDui');
								self._view.getTransition('t5').play();
							}
						}

						async.parallel([function plysnd(cb) {
							async.eachLimit(snds, 1, function (sndfile, _cb) {
								snd(sndfile, 1300, _cb);
							}, function () {
								cb();
							});
						}, function wttm(cb) {
							setTimeout(cb, 300);
						}], function () {
							var params = winArr.concat(tieArr);
							params.unshift(['zhuang', 'xian', 'he', 'xianDui', 'zhuangDui']);
							var loseArr = _.without.apply(_, params);
							next(null, winArr, loseArr, tieArr);
						});
					}, function takeCoins(winArr, loseArr, tieArr, next) {
						var fleetCoins = 0;
						loseArr.forEach(function (loseSector) {
							var _loop = function _loop(u) {
								var storedCoins = self._coins[u][loseSector];

								var _loop2 = function _loop2(i) {
									fleetCoins++;
									self.flyCoin(storedCoins[i], { x: 639, y: 107 }, 0, function () {
										// storedCoins[i].visible=false;
										// fairygui.GRoot.inst.removeChild(storedCoins[i]);
										self._view.removeChild(storedCoins[i]);
										storedCoins[i] = null;
									});
								};

								for (var i = 0; i < storedCoins.length; i++) {
									_loop2(i);
								}
							};

							for (var u in self._coins) {
								_loop(u);
							}
						});
						if (fleetCoins > 1) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveMuch.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));else if (fleetCoins == 1) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveOne.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
						setTimeout(next, 500, null, winArr, loseArr, tieArr);
					}, function clearLoseXiazhuPane(winArr, loseArr, tieArr, next) {
						for (var i = 0; i < loseArr.length; i++) {
							var c = self._view.getChild(xiazhuPaneMap[loseArr[i]]);
							c && (c.visible = false);

							c = self._view.getChild(xiazhuSelfPaneMap[loseArr[i]]);
							c && (c.visible = false);
						}
						next(null, winArr, loseArr, tieArr);
					}, function giveCoins(winArr, loseArr, tieArr, next) {
						var maxdelay = 0;
						for (var u in self._coins) {
							var deal = {};
							for (var i = 0; i < winArr.length; i++) {
								deal[winArr[i]] = gd.deal[u][winArr[i]] * factor[winArr[i]];
							}var givenCoins = self.calcCoinsDst(deal);
							var storedCoin = self._coins[u];
							var delay = 70;
							for (var i = 0; i < givenCoins.length; i++) {
								storedCoin[givenCoins[i].t].push(self.makeCoin({ x: 639, y: 107 }, givenCoins[i].p, givenCoins[i].c, delay));
								delay += 70;
								if (delay > 500) delay = 500;
							}
							if (delay > maxdelay) maxdelay = delay;
						}
						if (maxdelay > 70) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveMuch.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));else if (maxdelay == 70) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveOne.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
						setTimeout(next, maxdelay + 450, null, winArr, loseArr, tieArr);
					}, function clearWinXiazhuPane(winArr, loseArr, tieArr, next) {
						var arr = winArr.concat(tieArr);
						for (var i = 0; i < arr.length; i++) {
							var c = self._view.getChild(xiazhuPaneMap[arr[i]]);
							c && (c.visible = false);
							c = self._view.getChild(xiazhuSelfPaneMap[arr[i]]);
							c && (c.visible = false);
						}
						next(null, winArr, loseArr, tieArr);
					}, function toPlayer(winArr, loseArr, tieArr, next) {
						// var myCoin=self._view.getChild('n85');
						// var org=Number(myCoin.text);
						var fleetCoins = 0;
						winArr.concat(tieArr).forEach(function (sector) {
							var _loop3 = function _loop3(u) {
								var storedCoins = self._coins[u][sector];
								dst = u == me.id ? { x: 615, y: 446 } : { x: 222, y: 239 };

								var _loop4 = function _loop4(i) {
									fleetCoins++;
									self.flyCoin(storedCoins[i], dst, 0, function () {
										// storedCoins[i].visible=false;
										// fairygui.GRoot.inst.removeChild(storedCoins[i]);
										self._view.removeChild(storedCoins[i]);
										// if (u==me.id) {
										// 	org+=storedCoins[i].__value;
										// 	myCoin.text=org;
										// }
										storedCoins[i] = null;
									});
								};

								for (var i = 0; i < storedCoins.length; i++) {
									_loop4(i);
								}
							};

							for (var u in self._coins) {
								var dst;

								_loop3(u);
							}
						});
						if (fleetCoins > 1) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveMuch.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));else if (fleetCoins == 1) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveOne.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
						setTimeout(next, 500);
					}, function clearAll(next) {
						self.clearAllCoins();
						next();
					}, function playDropCards(next) {
						self._view.getTransition('t11shoupai').play();
						self._view.getChild('n287').text = fstr(self.setprofit || 0);
						self.setprofit = 0;
						self._view.getChild('n291').text = fstr('' + self.bankerprofit || 0);
						self.bankerprofit = 0;
						self._view.getTransition('t14').play(Handler.create(null, next));
					}, function unfocusClip(next) {
						self._view.getController('c2').selectedIndex = null;
						next();
					}];
					async.waterfall(q, cb);
				});
			}
			// .on('game.player.schgd', function() {
			// 	self._view.getChild('n47').text=gd.game.player.s;
			// 	self._view.getChild('n70').text=gd.game.player.s;
			// })
			// .on('game.banker.schgd', function() {
			// 	self._view.getChild('n48').text=gd.game.banker.s;
			// 	self._view.getChild('n75').text=gd.game.banker.s;
			// })
			).on('/deal\\.([^\\.]+)chgd/', function (eventName, userid) {
				if (gd.status != 1) return;
				var sector = userid.split(/(\\u[A-Fa-f0-9]{4})/g);
				for (var i = 0; i < sector.length; i++) {
					if (sector[i][0] == '\\') {
						sector[i] = String.fromCharCode(parseInt(sector[i].substr(2), 16));
					}
				}
				userid = sector.join('');

				var curDeal = clone(gd.deal[userid]);
				var total_n = 0;
				var lastDeal = self._lastDeal[userid];
				if (userid == me.id) {
					self._handleCoinschgd();
					// for (var qu in curDeal) {
					// 	var n=curDeal[qu];
					// 	var c=self._view.getChild(xiazhuSelfPaneMap[qu]);
					// 	if (!c) continue;
					// 	if (n) {
					// 		c.visible=true;
					// 		c.getChild('n239').text=fstr(''+n);
					// 		c.getTransition('t1').play();
					// 	} else c.visible=false;
					// }
				}
				['xian', 'zhuang', 'he', 'xianDui', 'zhuangDui'].forEach(function (k) {
					total_n += curDeal[k];
				});
				if (total_n > 0) {
					if (lastDeal) {
						['xian', 'zhuang', 'he', 'xianDui', 'zhuangDui'].forEach(function (k) {
							if (curDeal[k] != null) {
								if (lastDeal[k] != null) {
									curDeal[k] -= lastDeal[k];
								}
							}
						});
					}
					['xian', 'zhuang', 'he', 'xianDui', 'zhuangDui'].forEach(function (k) {
						if (curDeal[k]) {
							var isPositive = curDeal[k] > 0;
							// 更改全部下注
							var amount = 0;
							for (var u in gd.deal) {
								amount += gd.deal[u][k];
							}
							var c = self._view.getChild(xiazhuPaneMap[k]);
							if (c) {
								if (amount) {
									c.visible = true;
									c.getChild('n239').text = fstr('' + amount);
									isPositive && c.getTransition('t1').play();
								} else c.visible = false;
							}

							if (userid == me.id) {
								var c = self._view.getChild(xiazhuSelfPaneMap[k]);
								if (c) {
									if (gd.deal[userid][k]) {
										c.visible = true;
										c.getChild('n239').text = fstr('' + gd.deal[userid][k]);
										isPositive && c.getTransition('t1').play();
									} else c.visible = false;
								};
							}
						}
					});

					self._lastDeal[userid] = clone(gd.deal[userid]);
					var coins = self.calcCoinsDst(curDeal);
					if (coins.length == 1) snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveOne.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));else snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipMoveMuch.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
					if (!self._coins[userid]) self._coins[userid] = { xian: [], zhuang: [], xianDui: [], zhuangDui: [], he: [] };
					var storedCoin = self._coins[userid];
					if (userid == me.id) {
						self._myLastXiazhu = clone(gd.deal[userid]);
						// fly from bottom
						for (var i = 0; i < coins.length; i++) {
							storedCoin[coins[i].t].push(self.makeCoin({ x: 615, y: 446 }, coins[i].p, coins[i].c, 70 * i));
						}
						// self._view.getChild('n85').text=self._orgCoins-total_n;
					} else {
						// fly from left side
						for (var i = 0; i < coins.length; i++) {
							storedCoin[coins[i].t].push(self.makeCoin({ x: 222, y: 239 }, coins[i].p, coins[i].c, 70 * i));
						}
					}
				} else {
					// fly back
					self._lastDeal[userid] = clone(gd.deal[userid]);
					var dst = userid == me.id ? { x: 615, y: 446 } : { x: 222, y: 239 };
					snd(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/chipBack.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));

					var _loop5 = function _loop5(_sector) {
						var storedCoin = self._coins[userid][_sector];

						var _loop6 = function _loop6(_i) {
							if (storedCoin[_i]) self.flyCoin(storedCoin[_i], dst, 0, function () {
								// fairygui.GRoot.inst.removeChild(storedCoin[i]);
								self._view.removeChild(storedCoin[_i]);
							});
						};

						for (var _i = 0; _i < storedCoin.length; _i++) {
							_loop6(_i);
						}
						self._coins[userid][_sector] = [];
					};

					for (var _sector in self._coins[userid]) {
						_loop5(_sector);
					}
				}
			});
			return _this;
		}

		/**
	  * 清理所有临时产生的币
	  */


		_createClass(Room, [{
			key: 'clearAllCoins',
			value: function clearAllCoins() {
				var self = this;
				for (var u in self._coins) {
					for (var sector in self._coins[u]) {
						var storedCoin = self._coins[u][sector];
						for (var i = 0; i < storedCoin.length; i++) {
							if (storedCoin[i]) this._view.removeChild(storedCoin[i]);
						}
					}
				}
				self._coins = {};
			}

			/**
	   * 创建一个币，飞到目的地
	   * @typedef {{x:number, y:number}} Point
	   * @param {Point} from start point
	   * @param {Point} to end point
	   * @param {Number} coinType 币值
	   * @return {fairygui.GObject|null}
	   */

		}, {
			key: 'makeCoin',
			value: function makeCoin(from, to, coinType, delay) {
				var c = fairygui.UIPackage.createObject('Package1', '' + coinType + 's');
				if (!c) return null;
				c.x = from.x;c.y = from.y;c.__value = coinType;
				var underThisPane = this._view.getChild('n304');
				this._view.addChildAt(c, this._view.getChildIndex(underThisPane));
				// fairygui.GRoot.inst.addChild(c);
				Laya.Tween.to(c, to, 300, Laya.Ease.quadOut, null, delay);
				return c;
			}
			/**
	   * 飞一个币到指定位置
	   * @param {fairygui.GObject} coin 币 
	   * @param {{x:number, y:number}} to 目的地
	   * @param {number} delay 延时
	   * @param {function|null} cb 回调
	   * @return {void}
	   */

		}, {
			key: 'flyCoin',
			value: function flyCoin(coin, to, delay, cb) {
				Laya.Tween.to(coin, to, 500, Laya.Ease.quadOut, cb ? Handler.create(null, cb) : null, delay);
			}
			/**
	   * 分解用户的投注额。
	   * 中途进入时，用户的deal里面包含总的投注额，因此需要分解成筹码,
	   * 返回[{c:筹码, n:数量},..., total_n:总筹码数]
	   * @param {Number} total 投注总额
	   * @returns {Array<{c:Number, n:Number}, total_n:Number>}  [{c:筹码, n:数量},..., total_n:总筹码数]
	  **/

		}, {
			key: 'analyzeCoin',
			value: function analyzeCoin(total) {
				var r = [];
				var total_n = 0;
				for (var i = coinMap.length - 1; i >= 0; i--) {
					var c = coinMap[i];
					if (total > i) {
						var n = Math.floor(total / c);
						if (n) {
							r.push({ c: c, n: n });
							total_n += n;
						}
						total = total % c;
					}
				}
				r.total_n = total_n;
				return r;
			}
			/**
	   * 计算筹码的分布。
	   * 返回[{c:筹码, p:{x,y}},...]
	   *
	   * @typedef {Array<{c:Number, p:{x:Number, y:Number}>} COIN
	   * @param {{xian:Number, zhuang:Number, he:Number, xianDui:Number, zhuangDui:Number}} deal gamedata.seats.user.deal
	   * @returns {Array<{c:Number, p:{x:Number, y:Number}, t:string}>}
	  **/

		}, {
			key: 'calcCoinsDst',
			value: function calcCoinsDst(deal) {
				var r = [];
				function makeParr(ac, polygon, type) {
					var pts = randomPointsOnPolygon(ac.total_n, polygon);
					var idx = 0;
					var r = [];
					for (var i = 0; i < ac.length; i++) {
						for (var j = 0; j < ac[i].n; j++) {
							var co = pts[idx].geometry.coordinates;
							r.push({ c: ac[i].c, p: { x: co[0], y: co[1] }, t: type });
							idx++;
						}
					}
					return r;
				}
				if (deal.xian) {
					r = makeParr(this.analyzeCoin(deal.xian), xianqu, 'xian');
				}
				if (deal.zhuang) {
					r = r.concat(makeParr(this.analyzeCoin(deal.zhuang), zhuangqu, 'zhuang'));
				}
				if (deal.he) {
					r = r.concat(makeParr(this.analyzeCoin(deal.he), hequ, 'he'));
				}
				if (deal.xianDui) {
					r = r.concat(makeParr(this.analyzeCoin(deal.xianDui), xianDuiqu, 'xianDui'));
				}
				if (deal.zhuangDui) {
					r = r.concat(makeParr(this.analyzeCoin(deal.zhuangDui), zhuangDuiqu, 'zhuangDui'));
				}
				return r;
			}
		}, {
			key: 'renderEnrollList',
			value: function renderEnrollList(idx, obj) {
				var u = this.gamedata.enroll[idx],
				    real_u = this.gamedata.seats[u.id];
				if (real_u) real_u = real_u.user;
				obj.getChild('carry1').text = u.nickname || u.id;
				obj.getChild('C456466').text = real_u ? shortenCoinStr(real_u.coins) : '离线';
				var btn = obj.getChild('n83');
				btn.visible = me.id == u.id;
				if (btn._clickHandler) btn.offClick(null, btn._clickHandler);
				btn._clickHandler = function () {
					_socket.sendp({ c: 'table.enroll', in: false });
				};
				btn.onClick(null, btn._clickHandler);
			}
		}, {
			key: 'renderChatlist',
			value: function renderChatlist(idx, obj) {
				var c = this.chathis[idx];
				if (c.nickname == '富豪' && !this.showBigCoin) {
					obj.getChild('n85').text = '';
					obj.height = -5;
					return;
				}
				if (c.nickname == me.nickname) obj.getChild('n85').text = '[color=#ffffff]【' + c.nickname + '】[/color]  [color=#ffac0b]' + c.str + '[/color]';else obj.getChild('n85').text = '[color=#ffffff]【' + c.nickname + '】[/color]  ' + c.str;
				obj.height = obj.getChild('n85').displayObject.height;
			}
		}, {
			key: 'renderUserlist',
			value: function renderUserlist(idx, obj) {
				var u = this.gamedata.seats[this.userIDs[idx]].user;
				if (me.id == u.id) u = me;
				obj.getChild('n171').url = u.face;
				obj.getChild('n139').text = u.nickname;
				obj.getChild('n173').text = 'ID:' + u.showId;
				obj.getChild('n177').text = '金币:' + fstr(u.coins - (u.lockedCoins || 0));

				if (obj._clickHandler) obj.offClick(null, obj._clickHandler);
				obj._clickHandler = function () {
					var extra = new wins.UserExtraWin(u);
					fairygui.GRoot.inst.showPopup(extra);
				};
				obj.onClick(null, obj._clickHandler);
			}
		}, {
			key: 'renderBeadPlate',
			value: function renderBeadPlate(index, obj) {
				if (!this.gamedata || !this.gamedata.his) return;
				var pan = this.gamedata.his[index];
				var winCtrl = obj.getController('c1');
				winCtrl.selectedIndex = 0;
				if (!pan) return;
				if (pan.win == 'banker') winCtrl.selectedIndex = 0;else if (pan.win == 'player') winCtrl.selectedIndex = 1;else winCtrl.selectedIndex = 2;

				obj.getChild('n6').visible = pan.bankerPair;
				obj.getChild('n7').visible = pan.playerPair;
			}
		}, {
			key: 'getUserMediaRect',
			value: function getUserMediaRect(id) {
				return null;
			}
		}, {
			key: 'getVoiceBtn',
			value: function getVoiceBtn() {
				return null;
			}
		}, {
			key: 'onVideoActived',
			value: function onVideoActived() {}
		}, {
			key: 'msg',
			value: function msg(pack) {
				_get(Room.prototype.__proto__ || Object.getPrototypeOf(Room.prototype), 'msg', this).call(this, pack);
				switch (pack.c) {
					case 'table.userin':
					case 'table.userout':
					case 'userout':
						console.log(pack);
						this.delayUpdateUserIDs();
						break;
					case 'table.chat':
						this.chathis.push({ nickname: pack.nickname, str: pack.str });
						this._view.getChild('talklist').numItems = this.chathis.length;
						this._view.getChild('talklist').scrollToView(this.chathis.length - 1, true);
						break;
					case 'setprofit':
						this.setprofit = pack.p;
						break;
					case 'bankerprofit':
						this.bankerprofit = pack.p;
						break;
				}
				return true;
			}
		}, {
			key: 'delayUpdateGuashuaiList',
			value: function delayUpdateGuashuaiList() {
				if (this._delayRefreshGuashuai) return;
				var self = this;
				this._delayRefreshGuashuai = setTimeout(function () {
					var list = self._view.getChild('guashuailist');
					list.refreshVirtualList();
					self._delayRefreshGuashuai = null;
				}, 100);
			}
		}, {
			key: 'delayUpdateUserIDs',
			value: function delayUpdateUserIDs() {
				if (this._delayRefreshUserIDs) return;
				var self = this;
				this._delayRefreshUserIDs = setTimeout(function () {
					self.userIDs = Object.keys(self.gamedata.seats);
					var n = self.userIDs.length;
					var list = self._view.getChild('n219');
					if (n != list.numItems) list.numItems = n;else list.refreshVirtualList();
					self._delayRefreshUserIDs = null;
				}, 100);
			}
		}, {
			key: 'active',
			value: function active() {
				_get(Room.prototype.__proto__ || Object.getPrototypeOf(Room.prototype), 'active', this).call(this);

				Laya.SoundManager.playMusic(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/snd/ingameBGMMono.mp3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));

				// 每盘所有用户下注的筹码，按照_coins[userid]['xian']=[]的方式存放
				this._coins = {};
				// 每盘所有用户上一次的下注，存放方式如上。上一次值得是上一次收到dealchgd时的下注
				this._lastDeal = {};

				this._first_status_chgd = true;

				// 上一盘的自己下注
				this._myLastXiazhu = {};
				// this._view.getChild('n28').url=null;
				// this._view.getChild('n30').url=null;
				// this._view.getChild('n33').url=null;

				// this._view.getChild('n31').url=null;
				// this._view.getChild('n32').url=null;
				// this._view.getChild('n34').url=null;

				var self = this;
				['n300', 'n301', 'n302', 'n303', 'n304', 'n309', 'n310', 'n311', 'n312', 'n313', 'n293' /*,'n41', 'n53', 'n56', 'n57', 'n58', 'n59', 'n60'*/].forEach(function (id) {
					self._view.getChild(id).visible = false;
				});
				// this._view.getChild('n85').text=me.coins||0;
				// this._orgCoins=me.coins||0;

				this._view.x = 0;
				var self = this;
				this._handleCoinschgd = function () {
					var dealed = 0;
					if (self.gamedata && self.gamedata.status == 1) {
						// var deal=self.gamedata.deal[me.id];
						// if (deal) dealed=deal.xian+deal.zhuang+deal.xianDui+deal.zhuangDui+deal.he;
						dealed = me.lockedCoins || 0;
					}
					self._view.getChild('n262').text = fstr('' + (me.coins - dealed) || 0);
					self.delayUpdateUserIDs();
					// self._view.getChild('guashuailist').refreshVirtualList();
					// if (self.gamedata.playerBanker && self.gamedata.playerBanker.id==me.id) self.gamedata.emit('playerBankerchgd');
				};

				me.on('coinschgd', this._handleCoinschgd);

				this._handleNicknamechgd = function () {
					self._view.getChild('n45').text = me.nickname || me.id;
					self.gamedata.seats && self.gamedata.seats[me.id] && self.gamedata.seats[me.id].user && (self.gamedata.seats[me.id].user.nickname = me.nickname);
					self.delayUpdateUserIDs();
					self.delayUpdateGuashuaiList();
					// self.gamedata.emit('playerBankerchgd');
				};
				me.on('nicknamechgd', this._handleNicknamechgd);

				this._view.getChild('n260').text = me.showId;

				this._handleIconchgd = function () {
					self._view.getChild('userInfo').getChild('n45').url = me.face;
					self.gamedata.seats && self.gamedata.seats[me.id] && self.gamedata.seats[me.id].user && (self.gamedata.seats[me.id].user.face = me.face);
					self.delayUpdateUserIDs();
					// self._view.getChild('guashuailist').refreshVirtualList();
				};
				me.on('facechgd', this._handleIconchgd);

				var sbc;
				try {
					sbc = JSON.parse(localStorage.getItem('showBigCoin'));
				} catch (e) {}
				if (sbc == null) sbc = true;
				this.showBigCoin = sbc;
				this._view.getChild('n296').selected = sbc;

				this.delayUpdateUserIDs();

				this._view.getChild('n305').visible = false; //默认不要显示逃庄，直到自己上庄
			}
		}, {
			key: 'deactive',
			value: function deactive() {
				_get(Room.prototype.__proto__ || Object.getPrototypeOf(Room.prototype), 'deactive', this).call(this);

				this.clearAllCoins();

				me.removeListener('coinschgd', this._handleCoinschgd);
				me.removeListener('nicknamechgd', this._handleNicknamechgd);
				me.removeListener('facechgd', this._handleIconchgd);

				if (this._delayRefreshUserIDs) {
					clearTimeout(this._delayRefreshUserIDs);
					this._delayRefreshUserIDs = null;
				}
				if (this._delayRefreshGuashuai) {
					clearTimeout(this._delayRefreshGuashuai);
					this._delayRefreshGuashuai = null;
				}
			}
		}], [{
			key: 'create',
			value: function create(opt, cb) {
				opt = merge(opt, { seatNumber: 4 });
				Laya.loader.load([{ url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas0.png\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_mtqz7o.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale.fui\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.BUFFER }], Handler.create(null, function () {
					// Laya.loader.load(require("./res/baijiale@atlas_mtqz7o.jpg"));
					var room = new Room(opt);
					fairygui.UIPackage.addPackage('baijiale');
					var _view = room._view = fairygui.UIPackage.createObject('Package1', "游戏主界面").asCom;
					_view.getChild('n31').onClick(null, function () {
						_socket.sendp({ c: 'quitgame' });
						main({ showlogin: true });
					});

					var info = _view.getChild('n132');
					info.getChild('n71').onClick(null, function () {
						var lastpan = room.gamedata.his[room.gamedata.his.length - 1];
						if (lastpan && lastpan.demo) lastpan.win = 'banker';else room.gamedata.his.push({ win: 'banker', demo: true });
						room.gamedata.emit('hischgd', room.gamedata.his, true);
					});
					info.getChild('n72').onClick(null, function () {
						var lastpan = room.gamedata.his[room.gamedata.his.length - 1];
						if (lastpan && lastpan.demo) lastpan.win = 'player';else room.gamedata.his.push({ win: 'player', demo: true });
						room.gamedata.emit('hischgd', room.gamedata.his, true);
					});
					// info.getChild('n84').onClick(null, function() {
					// 	room.gamedata.his.push({win:'tie'});
					// 	room.gamedata.emit('hischgd', room.gamedata);
					// });

					var bar = _view.getChild('chouma');
					// var signal_bg=_view.getChild('n58')/*, signal_fg=_view.getChild('n249')*/;
					var zhuqu = _view.getController('c1'),
					    coinSel = _view.getController('c2');
					var zhuquMap = [null, 'xianDui', 'he', 'zhuangDui', 'xian', 'zhuang'];
					// for (let i=0; i<7; i++) {
					// 	let coin=_view.getChild('n'+(50+i));
					// 	if (!coin instanceof fairygui.GButton) continue;
					// 	coin.onClick(null, function() {
					// 		// signal_bg.x=coin.x-7;//signal_fg.x=coin.x;
					// 		if (!zhuqu.selectedIndex) return;
					// 		var o={c:'table.xiazhu'};
					// 		o[zhuquMap[zhuqu.selectedIndex]]=coinMap[i+4];
					// 		_socket.sendp(o);
					// 	});
					// };

					var _loop7 = function _loop7(i) {
						var qu = _view.getChild('n' + i);
						if (!qu instanceof fairygui.GButton) return 'continue';
						qu.onClick(null, function () {
							if (!coinSel.selectedIndex) return;
							var o = { c: 'table.xiazhu' };
							o[zhuquMap[i - 399]] = coinMap[coinSel.selectedIndex + 3];
							_socket.sendp(o);
						});
					};

					for (var i = 400; i < 405; i++) {
						var _ret7 = _loop7(i);

						if (_ret7 === 'continue') continue;
					}
					_view.getChild('n26').onClick(null, function () {
						if (room.gamedata.status != 1) return;
						var deal = room.gamedata.deal[me.id];
						if (!deal) return;
						if (!deal.xian && !deal.zhuang && !deal.xianDui && !deal.zhuangDui && !deal.he) return;
						_socket.sendp({ c: 'table.confirmXiazhu' });
						['n25', 'n26', 'n27'].forEach(function (n) {
							_view.getChild(n).enabled = false;
						});
					});
					_view.getChild('n27').onClick(null, function () {
						if (room.gamedata.status != 1) return;
						_socket.sendp({ c: 'table.cancelXiazhu' });
					});
					_view.getChild('n25').onClick(null, function () {
						if (room.gamedata.status != 1) return;
						_socket.sendp(merge({ c: 'table.xiazhu' }, room.gamedata.deal[me.id]));
					});

					// userlist
					var list = _view.getChild('n219');
					list.setVirtual();
					list.itemRenderer = Handler.create(room, room.renderUserlist, null, false);
					list.numItems = 0;

					// chat
					function sendchat() {
						var str = _view.getChild('talk').text;
						_view.getChild('talk').text = '';
						if (!str) return;
						_socket.sendp({ c: 'table.chat', str: str });
					}
					_view.getChild('n42').onClick(null, sendchat);
					var chatlist = _view.getChild('talklist');
					chatlist.setVirtual();
					chatlist.itemRenderer = Handler.create(room, room.renderChatlist, null, false);
					chatlist.numItems = 0;

					// enroll
					_view.getChild('n40').onClick(room, function handleEnroll() {
						if (this.gamedata.playerBanker && this.gamedata.playerBanker.id == me.id) return tipon('已经在做帅了').popup();
						if (this.gamedata.enroll.findIndex(function (ele) {
							return ele.id == me.id;
						}) >= 0) return tipon('正在排队，请耐心等待').popup();
						_socket.sendp({ c: 'table.enroll', in: true });
					});
					_view.getChild('n294').onClick(room, function () {
						_view.getChild('n294').enabled = false;
						_socket.sendp({ c: 'table.enroll', in: false });
					});
					var enrollList = _view.getChild('guashuailist');
					enrollList.setVirtual();
					enrollList.itemRenderer = Handler.create(room, room.renderEnrollList, null, false);
					enrollList.numItems = 0;

					//help
					_view.getChild('n0').onClick(room, function () {
						Laya.loader.load([{ url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_kalk9z.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_kalka1.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_kalka2.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_kalka3.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_kalka4.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_lbcf9k.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_lbcf9l.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_lbcf9m.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_lbcf9n.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }, { url: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./res/baijiale@atlas_lbcf9p.jpg\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), type: Loader.IMAGE }], Handler.create(null, function () {
							var win = new wins.Win('helpPane');
							win.modal = true;
							win.show();
						}));
					});

					_view.getChild('talk').on('enter', null, sendchat);

					_view.getChild('n296').onClick(null, function () {
						room.showBigCoin = _view.getChild('n296').selected;
						localStorage.setItem('showBigCoin', room.showBigCoin ? 'true' : 'false');
					});

					// runaway
					_view.getChild('n305').onClick(null, function () {
						_socket.sendp({ c: 'table.runaway' });
					});
					room.afterCreateView();
					cb(null, room);
				}));
			}
		}]);

		return Room;
	}(RoomBase);

	module.exports = Room.create;

/***/ },
/* 161 */,
/* 162 */,
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	// howto
	// 继承RoomBase
	// var RoomBase=require('./roombase.js');
	// var Loader = laya.net.Loader;
	// var Handler = laya.utils.Handler;
	//
	// class Room extends RoomBase {
	// 	constructor(opt) {
	// 		super(opt);
	// 	}
	// 	static create(opt, cb) {
	// 		opt=merge(opt, {seatNumber:4, easyrtcApp:'com.1357g.h5.xxx'});
	// 		Laya.loader.load([
	// 				//{ url: require("./res/hall@h29yzf.mp3"), type: Loader.SOUND },
	// 				{ url: require("./res/hall@atlas_uyrl82.jpg"), type: Loader.IMAGE },
	// 				{ url: require("./res/hall@atlas10.png"), type: Loader.IMAGE },
	// 				{ url: require("./res/hall@atlas0.png"), type: Loader.IMAGE },
	// 				{ url: require("./res/hall.fui"), type: Loader.BUFFER }
	// 			], Handler.create(null, function() {
	// 				var room=new Room(opt);
	// 				fairygui.UIPackage.addPackage('hall');
	// 				var _view =room._view= fairygui.UIPackage.createObject("牛牛", "Component13").asCom;
	// 				window.roomview=_view;
	//
	// 				room.afterCreateView();
	// 				cb(null, room);
	// 			})
	// 		)
	// 	}
	// 	getUserMediaRect(id) {
	// 	}
	// 	getVoiceBtn() {
	// 		return this._view.getChild('voicebtn');
	// 	}
	// 	onVideoActived() {
	// 	}
	//
	// 	以下是可选的
	// 	msg(pack) {
	// 		switch(pack.c) {
	// 			case 'xx':
	// 			break;
	// 			default:
	// 			return super.msg(pack);
	// 		}
	// 	}
	// 	active() {
	// 		super.active();
	//		Laya.stage.addChildAt(bg, 0);
	//		Laya.stage.addChildAt(3d, 1);
	//		//Laya.stage.children[2]==fairygui.com;
	// 	}
	// 	deactive() {
	// 		super.deactive();
	// 	}	
	// }


	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var assert = __webpack_require__(164),
	    merge = __webpack_require__(21),
	    EventEmitter = __webpack_require__(28);
	var me = __webpack_require__(81);
	var wins = __webpack_require__(92);

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var ViewBase = function () {
		function ViewBase() {
			_classCallCheck(this, ViewBase);
		}

		_createClass(ViewBase, [{
			key: 'assignAllBtns',
			value: function assignAllBtns() {
				var _this = this;

				var cl = this._view._children;
				var fairyguiNamedEle = /[A-Za-z]\d+/;
				for (var i = 0; i < cl.length; i++) {
					var btn = cl[i].asButton;
					if (btn instanceof fairygui.GButton) {
						var _ret = function () {
							if (fairyguiNamedEle.test(btn.name)) return 'continue';
							var _n = btn.name.split('.');
							var _idx = _n[1] || 1;
							_n = _n[0];
							var ctrl = _this._view.getController(_n);
							if (ctrl) {
								btn.onClick(_this, function () {
									ctrl.selectedIndex = _idx;
								});
								ctrl.setSelectedIndex(0);
							} else {
								btn.onClick(_this, function () {
									var candiName = capitalizeFirstLetter(_n) + 'Win';
									if (wins[candiName]) {
										var win = new wins[candiName]();
									} else var win = new wins.Win(_n);
									win.modal = true;
									win.show();
								});
							}
						}();

						if (_ret === 'continue') continue;
					}
				}
			}
		}, {
			key: 'active',
			value: function active() {
				console.log('你可以自行实现.active函数');
			}
		}, {
			key: 'deactive',
			value: function deactive() {
				console.log('你可以自行实现.deactive函数');
			}
		}, {
			key: 'msg',
			value: function msg(pack) {
				// pack:{c:'cmd', anything:'anytype', something:'all these was defined by server'}
				console.log('你可以自行实现.msg函数,这里可以处理服务器来的消息');
			}
		}], [{
			key: 'create',
			value: function create(opt, cb) {
				assert.fail('必须自己实现create');
				// 这个函数类似
				// if (typeof opt==='function') {cb=opt; opt={}}
				// Laya.loader.load([
				// 	{ url: require("./res/hall@atlas_7hc2v2.jpg"), type: Loader.IMAGE },
				// 	{ url: require("./res/hall@atlas4.png"), type: Loader.IMAGE },
				// 	{ url: require("./res/hall@atlas0.png"), type: Loader.IMAGE },
				// 	{ url: require("./res/hall.fui"), type: Loader.BUFFER }
				// ], Handler.create(null, function() {
				// 	var ui=new ViewBase();
				// 	ui._view=fairygui.UIPackage.createObject("牛牛", "Component").asCom;
				// 	cb(null, ui);
				// }));
			}
		}]);

		return ViewBase;
	}();

	function walkobj(obj, path, cb) {
		if (obj == null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) != 'object') return;
		for (var k in obj) {
			var safeK = k.replace(/\\/g, '\\u005c').replace(/\./g, '\\u002e');
			var n = path ? path + '.' + safeK : safeK;
			cb(n, obj[k]);
			walkobj(obj[k], n, cb);
		}
	}

	var GameData = function (_EventEmitter) {
		_inherits(GameData, _EventEmitter);

		function GameData() {
			_classCallCheck(this, GameData);

			// this.on('newListener', function(event, listener) {
			// 	listener.call(this, this);
			// });
			var _this2 = _possibleConstructorReturn(this, (GameData.__proto__ || Object.getPrototypeOf(GameData)).call(this));

			var re = _this2._rangeEvents = [];
			_this2.on('newListener', function (event, listener) {
				if (event.indexOf('/') == 0) {
					re.push({ reg: new RegExp(event.substr(1, -2)), k: event });
				}
			});
			_this2.on('removeListener', function (event, listener) {
				var idx = re.findIndex(function (ele) {
					return ele.k == event;
				});
				if (idx >= 0) re.splice(idx, 1);
			});
			return _this2;
		}

		_createClass(GameData, [{
			key: '_enumAttr',
			value: function _enumAttr(obj, path, f) {
				if (obj == null) return;
				if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) != 'object') return;
				for (var e in obj) {
					if (e == '$') continue;
					if (e.indexOf('_') >= 0) continue;
					var safeK = e.replace(/\\/g, '\\u005c').replace(/\./g, '\\u002e');
					var p = path ? path + '.' + safeK : safeK;
					f(p, obj[e]);
					if (_typeof(obj[e]) == 'object') this._enumAttr(obj[e], p, f);
				}
			}
		}, {
			key: '_chkRegEvent',
			value: function _chkRegEvent(p) {
				// if (!this.regEvents) {
				// 	this.regEvents=[];
				// 	for (var k in this._events) {
				// 		if (k.indexOf('/')==0) {
				// 			this.regEvents.push({reg:new RegExp(k.substr(1, -2)), k:k});
				// 		}
				// 	}
				// }
				// for (var i=0; i<this.regEvents.length; i++) {
				// 	// this is a reg
				// 	var r=this.regEvents[i].reg.exec(p);
				// 	if (r) {
				// 		r.unshift(this.regEvents[i].k);
				// 		this.emit.apply(this, r);
				// 	}
				// }
				// var self=this;
				// process.nextTick(function() {
				// 	self.regEvents=null;
				// });
				for (var i = 0; i < this._rangeEvents.length; i++) {
					// this is a reg
					var r = this._rangeEvents[i].reg.exec(p);
					if (r) {
						r.unshift(this._rangeEvents[i].k);
						this.emit.apply(this, r);
					}
				}
			}
		}, {
			key: '_update',
			value: function _update(obj) {
				// console.log('upd scene', obj);
				var _e = Object.keys(obj);
				if (_e.length == 2 && obj.countdown != null) {} else console.log(obj);
				var self = this;
				if (obj.$) {
					if (obj.$.init) {
						for (var k in this) {
							if (typeof this[k] == 'function' || k.indexOf('_') == 0) continue;
							delete this[k];
						}
						merge.recursive(this, obj);
						this.emit('inited', this);
						walkobj(this, null, function (k, v) {
							if (typeof v == 'function' || k.indexOf('_') == 0) return;
							self.emit('' + k + 'chgd', self);
							self._chkRegEvent('' + k + 'chgd');
						});
						// for (var k in this) {
						// 	if (typeof this[k]=='function' || k.indexOf('_')==0) continue;
						// 	this.emit(''+k+'chgd', this);
						// }
						return;
					}
					if (obj.$.delete) {
						var delCmd = obj.$.delete;
						for (var i = 0; i < delCmd.length; i++) {
							var p = delCmd[i];
							this.ensuredelete(p);
							this.emit(p[0] + 'chgd', this);
							this.emit(p + 'chgd', this);

							this._chkRegEvent(p + 'chgd');
						}
					}
					if (obj.$.set) {
						var delCmd = obj.$.set;
						for (var i = 0; i < delCmd.length; i++) {
							var p = delCmd[i];
							this.ensuredelete(p);
						}
					}
					delete obj.$;
				}
				merge.recursive(this, obj);
				this._enumAttr(obj, '', function (path, v) {
					self.emit(path + 'chgd', v);
					self._chkRegEvent(path + 'chgd');
				});
			}
		}, {
			key: 'ensuredelete',
			value: function ensuredelete(p) {
				var o = this;
				for (var i = 0; i < p.length - 1; i++) {
					if (o[p[i]]) o = o[p[i]];else return false;
				}
				if (o) {
					if (Array.isArray(o) && o.length - 1 == p[p.length - 1]) {
						o.length--;
					} else delete o[p[p.length - 1]];
				}
			}
		}]);

		return GameData;
	}(EventEmitter);

	;

	var io = window.io = __webpack_require__(165);
	var easyrtc = __webpack_require__(209);
	var _noop = __webpack_require__(22)._noop;
	var ensureAccessCamera = function () {
		var permissions = !!window.cordova && cordova.plugins.permissions || { checkPermission: function checkPermission(p, cb) {
				cb({ hasPermission: true });
			} };
		function ensureAccessCamera(callback) {
			if (!Laya.Browser.onAndroid) return callback();
			// permissions.checkPermission(permissions.CAMERA, function(status) {
			// if (status.hasPermission) return callback()
			// else 
			permissions.requestPermissions([permissions.RECORD_AUDIO, permissions.CAMERA, permissions.RECORD_AUDIO], function (status) {
				if (status.hasPermission) return callback();
				callback('user canceled');
			}, function () {
				callback('something wrong');
			});
			// }
			// , function() {
			// 	callback('something wrong');
			// });
		}
		return ensureAccessCamera;
	}();
	easyrtc.setSocketUrl('http://ws.1357g.com:19999/');
	easyrtc.setVideoDims(100, 100, 15);
	function easyrtc_connect(appname, cb) {
		if (typeof appname == 'function') {
			cb = appname;appname = null;
		}
		appname = appname || 'com.1357g.h5.niuniu';
		cb = cb || _noop;
		easyrtc.connect(appname, function (myId) {
			console.log('easyrtc connected', appname, myId);
			cb(null, myId);
		}, function (err) {
			cb(err);
		});
	}
	var _cb = console.log.bind(console, 'audioroute ret');
	document.addEventListener('audioroute-changed', function (event) {
		if (event.reason == 'route-config-change') {
			cordova.plugins.audioroute.currentOutputs(function (outs) {
				console.log('audio chg to', outs);
				if (outs == 'builtin-receiver') cordova.plugins.audioroute.overrideOutput('speaker', _cb, _cb);
			}, _cb);
		}
	});

	var sysdiv = document.getElementById('layaContainer'),
	    sysCanvas = document.getElementById('layaCanvas');

	/**
	 * @property {fairygui.GComponent} _view 游戏视图，必须有这个对象
	 * @property {GameData} gamedata 游戏数据，与服务器上的同名对象保持一致
	 * @property {number} _seatNumber 座位数
	 * @property {object} _calls rtc连接
	 */

	var RoomBase = function (_ViewBase) {
		_inherits(RoomBase, _ViewBase);

		function RoomBase(opt) {
			_classCallCheck(this, RoomBase);

			// opt:{seatNumber:3|4|5, easyrtcApp:'com.1357g.h5.xxx'}
			var _this3 = _possibleConstructorReturn(this, (RoomBase.__proto__ || Object.getPrototypeOf(RoomBase)).call(this));

			_this3.gamedata = _this3.scene = new GameData();
			_this3._seatNumber = opt.seatNumber || 1;
			_this3._calls = {};

			var self = _this3,
			    gd = _this3.gamedata;
			gd.on('inited', function () {
				if (opt.disableRtc || opt.easyrtcApp == null) return;
				ensureAccessCamera(function (err) {
					easyrtc.initMediaSource(function () {
						if (self.hasQuit) return;
						self.disableMicrophone();
						self.onVideoActived && self.onVideoActived();
						self.chgVoiceBtnFunc();
						var selfVideo = self.icon2Video(0, true);
						if (!selfVideo) return;
						easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
						easyrtc_connect(opt.easyrtcApp, function (err, myId) {
							if (err) return console.log(err);
							if (self.hasQuit) return;
							self.afterRtcConnected(myId);
							easyrtc.setDisconnectListener(function () {
								easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
								easyrtc_connect(function (err, myId) {
									if (err) return console.log(err);
									self.afterRtcConnected(myId);
								});
							});
						});
					}, _noop);
				});
			});
			return _this3;
		}

		// create之后必须调用这个函数


		_createClass(RoomBase, [{
			key: 'afterCreateView',
			value: function afterCreateView() {
				this.assignAllBtns();
				var voicebtn = this.getVoiceBtn();
				if (!voicebtn) return;
				var _rec = null,
				    _recCanceled = false;
				voicebtn.on('mousedown', null, function () {
					if (window.startRecord) {
						_recCanceled = false;
						Laya.SoundManager.setMusicVolume(0.6);
						setTimeout(function () {
							if (!_recCanceled) {
								window.startRecord();
								Laya.SoundManager.setMusicVolume(0.2);
								if (wins.RecWin) {
									_rec = wins.RecWin.inst;
									_rec.show();
								}
							}
						}, 200);
					}
				});
				voicebtn.on('mouseup', null, function () {
					if (_rec) {
						setTimeout(function () {
							window.stopRecord && window.stopRecord(function (err, token) {
								Laya.SoundManager.setMusicVolume(1);
								if (err) return console.log(err);
								if (token) _socket.sendp({ c: 'table.voice', token: token });
							});
						}, 300);
						_rec.hide();_rec = null;
					} else cancelRec();
				});
				function cancelRec() {
					_recCanceled = true;
					console.log('rec canceled');
					window.stopRecord && window.stopRecord();
					if (_rec) {
						_rec.hide();_rec = null;
					}
					Laya.SoundManager.setMusicVolume(1);
				}
				voicebtn.on('mouseout', null, cancelRec);
			}
			// 必须实现的函数

		}, {
			key: 'getUserMediaRect',
			value: function getUserMediaRect(id) {
				assert.fail('要使用视屏，必须自己实现这个函数。该函数返回对应seat(id)的视频区域，一般而言是用户的头像区');
			}
		}, {
			key: 'getVoiceBtn',
			value: function getVoiceBtn() {
				assert.fail('自行实现这个函数，返回语音按钮');
				// eg. return this._view.getChild('voicebtn');
			}
		}, {
			key: 'onVideoActived',
			value: function onVideoActived() {}
			//启用视频的通知，可以在这里切换语音按键的功能


			// 可以覆盖的函数

		}, {
			key: 'msg',
			value: function msg(pack) {
				var self = this;
				if (pack.gamedata || pack.scene) {
					// console.log(pack);
					this.gamedata._update(pack.gamedata || pack.scene);
				}
				return true;
			}
			/**
	   * 重写这个函数时，一定要super.active();
	   */

		}, {
			key: 'active',
			value: function active() {
				// 你需要自行实现active时的操作，如，将所有显示状态置默认位
				var self = this;
				_socket.sendp({ c: 'createInviteCode' });
				netmsg.once('inviteCode', null, function (msg) {
					self.inviteCode = msg.v;
					window.preInvite && window.preInvite(msg.v, self.opt);
				});
				this.mySeat = null;
				this.video2Icon(0);
				this._calls = {};
			}
		}, {
			key: 'deactive',
			value: function deactive() {
				//me.removeAllListeners();
				this.gamedata.removeAllListeners();
				this.hasQuit = true;
				easyrtc.setDisconnectListener(null);
				easyrtc.disconnect();

				var videos = sysdiv.getElementsByTagName('video');
				for (var i = 0; i < videos.length; i++) {
					sysdiv.removeChild(videos[i]);
				}
				this._calls = {};
			}

			// 辅助函数，可以被你使用
			/** 
	  * 定位自己
	  * 在seats中找到自己的位置，没有就反回-1
	  *
	  * @param {object|[]} seats gamedata.seats
	  * @return {number} 
	  **/

		}, {
			key: 'locateMe',
			value: function locateMe(seats) {
				if (!seats) return -1;
				if (Array.isArray(seats)) {
					for (var i = 0; i < seats.length; i++) {
						var s = seats[i];
						if (s && s.user && s.user.id == me.id) return i;
					}
					return -1;
				} else if ((typeof seats === 'undefined' ? 'undefined' : _typeof(seats)) == 'object') {
					for (var i in seats) {
						var s = seats[i];
						if (s && s.user && s.user.id == me.id) return i;
					}
					return -1;
				}
				return -1;
			}
		}, {
			key: 'createHTMLDiv',
			value: function createHTMLDiv(o) {
				var pos = { x: o.x, y: o.y, w: o.width, h: o.height };
				var ele = $('#layaCanvas');
				var rX = Laya.stage.clientScaleX,
				    rY = Laya.stage.clientScaleY;
				pos.x = pos.x * rX;pos.y = pos.y * rY;pos.w = pos.w * rX;pos.h = pos.h * rY;
				var div = $('<div class="card" style="position:absolute;left:' + pos.x + 'px; top:' + pos.y + 'px; width:' + pos.w + 'px; height:' + pos.h + 'px"/>');
				div.css('transform', ele.css('transform'));
				div.css('transform-origin', '' + -pos.x + 'px ' + -pos.y + 'px');
				$('#layaContainer').append(div);
				return div;
			}
		}, {
			key: 'createHTMLVideo',
			value: function createHTMLVideo(obj) {
				var ho = document.createElement('video');
				var _s = ho.style;
				var rw = sysCanvas.width / (960 * (Laya.Browser.onIOS ? devicePixelRatio : 1));
				var r = sysCanvas.width / (960 * devicePixelRatio);
				var rotate = Number(sysCanvas.style.transform.split(',')[2]) == -1;
				_s.left = (rotate ? -obj.y : obj.x) * r + 'px';_s.top = (rotate ? obj.x : obj.y) * r + 'px';_s.width = obj.width * rw + 'px';_s.height = obj.height * rw + 'px';
				_s.transform = sysCanvas.style.transform;_s.transformOrigin = sysCanvas.style.transformOrigin;
				_s.position = 'absolute';
				_s['z-index'] = 9999999;
				sysdiv.appendChild(ho);
				return ho;
			}
		}, {
			key: 'findUserLocalSeat',
			value: function findUserLocalSeat(userid) {
				var gd = this.gamedata;
				for (var i = 0; i < gd.seats.length; i++) {
					var seat = gd.seats[i];
					if (seat && seat.user.id == userid) return this.serverSeatToLocal(i);
				}
				return null;
			}
		}, {
			key: 'serverSeatToLocal',
			value: function serverSeatToLocal(seat) {
				if (this.mySeat == null) this.mySeat = locateMe(this.gamedata.seats);
				return (this._seatNumber + seat - this.mySeat) % this._seatNumber;
			}
		}, {
			key: 'pausemsg',
			value: function pausemsg(f) {
				var self = this;
				window.msgloop.pause();
				f(function () {
					window.msgloop.resume();
				});
			}

			// 内部函数

		}, {
			key: 'chgVoiceBtnFunc',
			value: function chgVoiceBtnFunc() {
				var self = this;
				window.startRecord = function () {
					self.enableMicrophone();
				};
				window.stopRecord = function (cb) {
					self.enableMicrophone(false);
					if (cb) cb(null);
				};
			}
		}, {
			key: 'afterRtcConnected',
			value: function afterRtcConnected(myId) {
				if (this.hasQuit) return;
				_socket.sendp({ c: 'table.extenddata', rtcid: myId });
				var gd = this.gamedata;
				gd.once('extenddatachgd', function () {
					// 视频连接，后进入的负责呼叫已在房间内的。所以这个事件只处理一次，以后都是由进入的人发起链接。断线用户回来时会再次监听事件
					for (var uid in gd.extenddata) {
						if (uid == me.id) continue;
						easyrtc.call(gd.extenddata[uid], _noop, _noop, _noop);
					}
				});
			}
		}, {
			key: 'icon2Video',
			value: function icon2Video(seat, isMe) {
				var obj = this.getUserMediaRect(seat);
				if (!obj) return null;
				console.log('chg', seat, 'to video');
				var v = createHTMLVideo(obj, isMe);
				this._calls[seat] = v;
				obj.visible = false;
				return v;
			}
		}, {
			key: 'video2Icon',
			value: function video2Icon(seat) {
				var obj = this.getUserMediaRect(seat);
				if (!obj) return null;
				console.log('chg', seat, 'back to icon', obj.url);
				obj.visible = true;
				if (this._calls[seat]) {
					sysdiv.removeChild(this._calls[seat]);
					delete this._calls[seat];
				}
			}
			// 语音键按下的时候enableMicrophone()，放开的时候enableMicrophone(false)

		}, {
			key: 'enableMicrophone',
			value: function enableMicrophone(enable) {
				easyrtc.enableMicrophone(enable == null ? true : enable);
			}
		}, {
			key: 'disableMicrophone',
			value: function disableMicrophone() {
				easyrtc.enableMicrophone(false);
			}
			// 关闭视频，不过这个函数没什么卵用，他只能关闭自己的视频，事实上还是在发送和接收数据

		}, {
			key: 'enableCamera',
			value: function enableCamera(enable) {
				easyrtc.enableCamera(enable == null ? true : enable);
			}
		}, {
			key: 'disableCamera',
			value: function disableCamera() {
				easyrtc.enableCamera(false);
			}
		}], [{
			key: 'create',
			value: function create(opt, cb) {
				assert.fail('必须自己实现create');
			}
		}]);

		return RoomBase;
	}(ViewBase);

	module.exports = RoomBase;

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
	// original notice:

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	function compare(a, b) {
	  if (a === b) {
	    return 0;
	  }

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }

	  if (x < y) {
	    return -1;
	  }
	  if (y < x) {
	    return 1;
	  }
	  return 0;
	}
	function isBuffer(b) {
	  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
	    return global.Buffer.isBuffer(b);
	  }
	  return !!(b != null && b._isBuffer);
	}

	// based on node assert, original notice:

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	var util = __webpack_require__(24);
	var hasOwn = Object.prototype.hasOwnProperty;
	var pSlice = Array.prototype.slice;
	var functionsHaveNames = (function () {
	  return function foo() {}.name === 'foo';
	}());
	function pToString (obj) {
	  return Object.prototype.toString.call(obj);
	}
	function isView(arrbuf) {
	  if (isBuffer(arrbuf)) {
	    return false;
	  }
	  if (typeof global.ArrayBuffer !== 'function') {
	    return false;
	  }
	  if (typeof ArrayBuffer.isView === 'function') {
	    return ArrayBuffer.isView(arrbuf);
	  }
	  if (!arrbuf) {
	    return false;
	  }
	  if (arrbuf instanceof DataView) {
	    return true;
	  }
	  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	var regex = /\s*function\s+([^\(\s]*)\s*/;
	// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
	function getName(func) {
	  if (!util.isFunction(func)) {
	    return;
	  }
	  if (functionsHaveNames) {
	    return func.name;
	  }
	  var str = func.toString();
	  var match = str.match(regex);
	  return match && match[1];
	}
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = getName(stackStartFunction);
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function truncate(s, n) {
	  if (typeof s === 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	function inspect(something) {
	  if (functionsHaveNames || !util.isFunction(something)) {
	    return util.inspect(something);
	  }
	  var rawname = getName(something);
	  var name = rawname ? ': ' + rawname : '';
	  return '[Function' +  name + ']';
	}
	function getMessage(self) {
	  return truncate(inspect(self.actual), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(inspect(self.expected), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	  }
	};

	function _deepEqual(actual, expected, strict, memos) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (isBuffer(actual) && isBuffer(expected)) {
	    return compare(actual, expected) === 0;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if ((actual === null || typeof actual !== 'object') &&
	             (expected === null || typeof expected !== 'object')) {
	    return strict ? actual === expected : actual == expected;

	  // If both values are instances of typed arrays, wrap their underlying
	  // ArrayBuffers in a Buffer each to increase performance
	  // This optimization requires the arrays to have the same type as checked by
	  // Object.prototype.toString (aka pToString). Never perform binary
	  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	  // bit patterns are not identical.
	  } else if (isView(actual) && isView(expected) &&
	             pToString(actual) === pToString(expected) &&
	             !(actual instanceof Float32Array ||
	               actual instanceof Float64Array)) {
	    return compare(new Uint8Array(actual.buffer),
	                   new Uint8Array(expected.buffer)) === 0;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else if (isBuffer(actual) !== isBuffer(expected)) {
	    return false;
	  } else {
	    memos = memos || {actual: [], expected: []};

	    var actualIndex = memos.actual.indexOf(actual);
	    if (actualIndex !== -1) {
	      if (actualIndex === memos.expected.indexOf(expected)) {
	        return true;
	      }
	    }

	    memos.actual.push(actual);
	    memos.expected.push(expected);

	    return objEquiv(actual, expected, strict, memos);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b, strict, actualVisitedObjects) {
	  if (a === null || a === undefined || b === null || b === undefined)
	    return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b))
	    return a === b;
	  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	    return false;
	  var aIsArgs = isArguments(a);
	  var bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b, strict);
	  }
	  var ka = objectKeys(a);
	  var kb = objectKeys(b);
	  var key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length !== kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] !== kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	      return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	  }
	}


	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  }

	  try {
	    if (actual instanceof expected) {
	      return true;
	    }
	  } catch (e) {
	    // Ignore.  The instanceof check doesn't work for arrow functions.
	  }

	  if (Error.isPrototypeOf(expected)) {
	    return false;
	  }

	  return expected.call({}, actual) === true;
	}

	function _tryBlock(block) {
	  var error;
	  try {
	    block();
	  } catch (e) {
	    error = e;
	  }
	  return error;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof block !== 'function') {
	    throw new TypeError('"block" argument must be a function');
	  }

	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }

	  actual = _tryBlock(block);

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  var userProvidedMessage = typeof message === 'string';
	  var isUnwantedException = !shouldThrow && util.isError(actual);
	  var isUnexpectedException = !shouldThrow && actual && !expected;

	  if ((isUnwantedException &&
	      userProvidedMessage &&
	      expectedException(actual, expected)) ||
	      isUnexpectedException) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws(true, block, error, message);
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws(false, block, error, message);
	};

	assert.ifError = function(err) { if (err) throw err; };

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(166);
	var parser = __webpack_require__(171);
	var Manager = __webpack_require__(177);
	var debug = __webpack_require__(168)('socket.io-client');

	/**
	 * Module exports.
	 */

	module.exports = exports = lookup;

	/**
	 * Managers cache.
	 */

	var cache = exports.managers = {};

	/**
	 * Looks up an existing `Manager` for multiplexing.
	 * If the user summons:
	 *
	 *   `io('http://localhost/a');`
	 *   `io('http://localhost/b');`
	 *
	 * We reuse the existing instance based on same scheme/port/host,
	 * and we initialize sockets for each namespace.
	 *
	 * @api public
	 */

	function lookup (uri, opts) {
	  if (typeof uri === 'object') {
	    opts = uri;
	    uri = undefined;
	  }

	  opts = opts || {};

	  var parsed = url(uri);
	  var source = parsed.source;
	  var id = parsed.id;
	  var path = parsed.path;
	  var sameNamespace = cache[id] && path in cache[id].nsps;
	  var newConnection = opts.forceNew || opts['force new connection'] ||
	                      false === opts.multiplex || sameNamespace;

	  var io;

	  if (newConnection) {
	    debug('ignoring socket cache for %s', source);
	    io = Manager(source, opts);
	  } else {
	    if (!cache[id]) {
	      debug('new io instance for %s', source);
	      cache[id] = Manager(source, opts);
	    }
	    io = cache[id];
	  }
	  if (parsed.query && !opts.query) {
	    opts.query = parsed.query;
	  }
	  return io.socket(parsed.path, opts);
	}

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = parser.protocol;

	/**
	 * `connect`.
	 *
	 * @param {String} uri
	 * @api public
	 */

	exports.connect = lookup;

	/**
	 * Expose constructors for standalone build.
	 *
	 * @api public
	 */

	exports.Manager = __webpack_require__(177);
	exports.Socket = __webpack_require__(204);


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module dependencies.
	 */

	var parseuri = __webpack_require__(167);
	var debug = __webpack_require__(168)('socket.io-client:url');

	/**
	 * Module exports.
	 */

	module.exports = url;

	/**
	 * URL parser.
	 *
	 * @param {String} url
	 * @param {Object} An object meant to mimic window.location.
	 *                 Defaults to window.location.
	 * @api public
	 */

	function url (uri, loc) {
	  var obj = uri;

	  // default to window.location
	  loc = loc || global.location;
	  if (null == uri) uri = loc.protocol + '//' + loc.host;

	  // relative path support
	  if ('string' === typeof uri) {
	    if ('/' === uri.charAt(0)) {
	      if ('/' === uri.charAt(1)) {
	        uri = loc.protocol + uri;
	      } else {
	        uri = loc.host + uri;
	      }
	    }

	    if (!/^(https?|wss?):\/\//.test(uri)) {
	      debug('protocol-less url %s', uri);
	      if ('undefined' !== typeof loc) {
	        uri = loc.protocol + '//' + uri;
	      } else {
	        uri = 'https://' + uri;
	      }
	    }

	    // parse
	    debug('parse %s', uri);
	    obj = parseuri(uri);
	  }

	  // make sure we treat `localhost:80` and `localhost` equally
	  if (!obj.port) {
	    if (/^(http|ws)$/.test(obj.protocol)) {
	      obj.port = '80';
	    } else if (/^(http|ws)s$/.test(obj.protocol)) {
	      obj.port = '443';
	    }
	  }

	  obj.path = obj.path || '/';

	  var ipv6 = obj.host.indexOf(':') !== -1;
	  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

	  // define unique id
	  obj.id = obj.protocol + '://' + host + ':' + obj.port;
	  // define href
	  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

	  return obj;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 167 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');

	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }

	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;

	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }

	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }

	    return uri;
	};


/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(169);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return;

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit')

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(170);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */

	exports.formatters = {};

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */

	function selectColor(namespace) {
	  var hash = 0, i;

	  for (i in namespace) {
	    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }

	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function createDebug(namespace) {

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);

	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }

	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  exports.names = [];
	  exports.skips = [];

	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 170 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var debug = __webpack_require__(168)('socket.io-parser');
	var Emitter = __webpack_require__(172);
	var hasBin = __webpack_require__(173);
	var binary = __webpack_require__(175);
	var isBuf = __webpack_require__(176);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = 4;

	/**
	 * Packet types.
	 *
	 * @api public
	 */

	exports.types = [
	  'CONNECT',
	  'DISCONNECT',
	  'EVENT',
	  'ACK',
	  'ERROR',
	  'BINARY_EVENT',
	  'BINARY_ACK'
	];

	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */

	exports.CONNECT = 0;

	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */

	exports.DISCONNECT = 1;

	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */

	exports.EVENT = 2;

	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */

	exports.ACK = 3;

	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */

	exports.ERROR = 4;

	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */

	exports.BINARY_EVENT = 5;

	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */

	exports.BINARY_ACK = 6;

	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */

	exports.Encoder = Encoder;

	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */

	exports.Decoder = Decoder;

	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */

	function Encoder() {}

	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */

	Encoder.prototype.encode = function(obj, callback){
	  if ((obj.type === exports.EVENT || obj.type === exports.ACK) && hasBin(obj.data)) {
	    obj.type = obj.type === exports.EVENT ? exports.BINARY_EVENT : exports.BINARY_ACK;
	  }

	  debug('encoding packet %j', obj);

	  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
	    encodeAsBinary(obj, callback);
	  }
	  else {
	    var encoding = encodeAsString(obj);
	    callback([encoding]);
	  }
	};

	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */

	function encodeAsString(obj) {

	  // first is type
	  var str = '' + obj.type;

	  // attachments if we have them
	  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
	    str += obj.attachments + '-';
	  }

	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' !== obj.nsp) {
	    str += obj.nsp + ',';
	  }

	  // immediately followed by the id
	  if (null != obj.id) {
	    str += obj.id;
	  }

	  // json data
	  if (null != obj.data) {
	    str += JSON.stringify(obj.data);
	  }

	  debug('encoded %j as %s', obj, str);
	  return str;
	}

	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */

	function encodeAsBinary(obj, callback) {

	  function writeEncoding(bloblessData) {
	    var deconstruction = binary.deconstructPacket(bloblessData);
	    var pack = encodeAsString(deconstruction.packet);
	    var buffers = deconstruction.buffers;

	    buffers.unshift(pack); // add packet info to beginning of data list
	    callback(buffers); // write all the buffers
	  }

	  binary.removeBlobs(obj, writeEncoding);
	}

	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */

	function Decoder() {
	  this.reconstructor = null;
	}

	/**
	 * Mix in `Emitter` with Decoder.
	 */

	Emitter(Decoder.prototype);

	/**
	 * Decodes an ecoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */

	Decoder.prototype.add = function(obj) {
	  var packet;
	  if (typeof obj === 'string') {
	    packet = decodeString(obj);
	    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
	      this.reconstructor = new BinaryReconstructor(packet);

	      // no attachments, labeled binary but no binary data to follow
	      if (this.reconstructor.reconPack.attachments === 0) {
	        this.emit('decoded', packet);
	      }
	    } else { // non-binary full packet
	      this.emit('decoded', packet);
	    }
	  }
	  else if (isBuf(obj) || obj.base64) { // raw binary data
	    if (!this.reconstructor) {
	      throw new Error('got binary data when not reconstructing a packet');
	    } else {
	      packet = this.reconstructor.takeBinaryData(obj);
	      if (packet) { // received final buffer
	        this.reconstructor = null;
	        this.emit('decoded', packet);
	      }
	    }
	  }
	  else {
	    throw new Error('Unknown type: ' + obj);
	  }
	};

	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */

	function decodeString(str) {
	  var i = 0;
	  // look up type
	  var p = {
	    type: Number(str.charAt(0))
	  };

	  if (null == exports.types[p.type]) return error();

	  // look up attachments if type binary
	  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
	    var buf = '';
	    while (str.charAt(++i) !== '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) !== '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }

	  // look up namespace (if any)
	  if ('/' === str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' === c) break;
	      p.nsp += c;
	      if (i === str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }

	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i === str.length) break;
	    }
	    p.id = Number(p.id);
	  }

	  // look up json data
	  if (str.charAt(++i)) {
	    p = tryParse(p, str.substr(i));
	  }

	  debug('decoded %s as %j', str, p);
	  return p;
	}

	function tryParse(p, str) {
	  try {
	    p.data = JSON.parse(str);
	  } catch(e){
	    return error();
	  }
	  return p; 
	}

	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */

	Decoder.prototype.destroy = function() {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};

	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */

	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}

	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */

	BinaryReconstructor.prototype.takeBinaryData = function(binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};

	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */

	BinaryReconstructor.prototype.finishedReconstruction = function() {
	  this.reconPack = null;
	  this.buffers = [];
	};

	function error() {
	  return {
	    type: exports.ERROR,
	    data: 'parser error'
	  };
	}


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global Blob File */

	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(174);

	var toString = Object.prototype.toString;
	var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
	var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Supports Buffer, ArrayBuffer, Blob and File.
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary (obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  if (isArray(obj)) {
	    for (var i = 0, l = obj.length; i < l; i++) {
	      if (hasBinary(obj[i])) {
	        return true;
	      }
	    }
	    return false;
	  }

	  if ((typeof global.Buffer === 'function' && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
	     (typeof global.ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
	     (withNativeBlob && obj instanceof Blob) ||
	     (withNativeFile && obj instanceof File)
	    ) {
	    return true;
	  }

	  // see: https://github.com/Automattic/has-binary/pull/4
	  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
	    return hasBinary(obj.toJSON(), true);
	  }

	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
	      return true;
	    }
	  }

	  return false;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 174 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

	/**
	 * Module requirements
	 */

	var isArray = __webpack_require__(174);
	var isBuf = __webpack_require__(176);
	var toString = Object.prototype.toString;
	var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
	var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

	/**
	 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
	 * Anything with blobs or files should be fed through removeBlobs before coming
	 * here.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @api public
	 */

	exports.deconstructPacket = function(packet) {
	  var buffers = [];
	  var packetData = packet.data;
	  var pack = packet;
	  pack.data = _deconstructPacket(packetData, buffers);
	  pack.attachments = buffers.length; // number of binary 'attachments'
	  return {packet: pack, buffers: buffers};
	};

	function _deconstructPacket(data, buffers) {
	  if (!data) return data;

	  if (isBuf(data)) {
	    var placeholder = { _placeholder: true, num: buffers.length };
	    buffers.push(data);
	    return placeholder;
	  } else if (isArray(data)) {
	    var newData = new Array(data.length);
	    for (var i = 0; i < data.length; i++) {
	      newData[i] = _deconstructPacket(data[i], buffers);
	    }
	    return newData;
	  } else if (typeof data === 'object' && !(data instanceof Date)) {
	    var newData = {};
	    for (var key in data) {
	      newData[key] = _deconstructPacket(data[key], buffers);
	    }
	    return newData;
	  }
	  return data;
	}

	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @api public
	 */

	exports.reconstructPacket = function(packet, buffers) {
	  packet.data = _reconstructPacket(packet.data, buffers);
	  packet.attachments = undefined; // no longer useful
	  return packet;
	};

	function _reconstructPacket(data, buffers) {
	  if (!data) return data;

	  if (data && data._placeholder) {
	    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
	  } else if (isArray(data)) {
	    for (var i = 0; i < data.length; i++) {
	      data[i] = _reconstructPacket(data[i], buffers);
	    }
	  } else if (typeof data === 'object') {
	    for (var key in data) {
	      data[key] = _reconstructPacket(data[key], buffers);
	    }
	  }

	  return data;
	}

	/**
	 * Asynchronously removes Blobs or Files from data via
	 * FileReader's readAsArrayBuffer method. Used before encoding
	 * data as msgpack. Calls callback with the blobless data.
	 *
	 * @param {Object} data
	 * @param {Function} callback
	 * @api private
	 */

	exports.removeBlobs = function(data, callback) {
	  function _removeBlobs(obj, curKey, containingObject) {
	    if (!obj) return obj;

	    // convert any blob
	    if ((withNativeBlob && obj instanceof Blob) ||
	        (withNativeFile && obj instanceof File)) {
	      pendingBlobs++;

	      // async filereader
	      var fileReader = new FileReader();
	      fileReader.onload = function() { // this.result == arraybuffer
	        if (containingObject) {
	          containingObject[curKey] = this.result;
	        }
	        else {
	          bloblessData = this.result;
	        }

	        // if nothing pending its callback time
	        if(! --pendingBlobs) {
	          callback(bloblessData);
	        }
	      };

	      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
	    } else if (isArray(obj)) { // handle array
	      for (var i = 0; i < obj.length; i++) {
	        _removeBlobs(obj[i], i, obj);
	      }
	    } else if (typeof obj === 'object' && !isBuf(obj)) { // and object
	      for (var key in obj) {
	        _removeBlobs(obj[key], key, obj);
	      }
	    }
	  }

	  var pendingBlobs = 0;
	  var bloblessData = data;
	  _removeBlobs(bloblessData);
	  if (!pendingBlobs) {
	    callback(bloblessData);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 176 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	module.exports = isBuf;

	/**
	 * Returns true if obj is a buffer or an arraybuffer.
	 *
	 * @api private
	 */

	function isBuf(obj) {
	  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var eio = __webpack_require__(178);
	var Socket = __webpack_require__(204);
	var Emitter = __webpack_require__(172);
	var parser = __webpack_require__(171);
	var on = __webpack_require__(206);
	var bind = __webpack_require__(207);
	var debug = __webpack_require__(168)('socket.io-client:manager');
	var indexOf = __webpack_require__(202);
	var Backoff = __webpack_require__(208);

	/**
	 * IE6+ hasOwnProperty
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Module exports
	 */

	module.exports = Manager;

	/**
	 * `Manager` constructor.
	 *
	 * @param {String} engine instance or engine uri/opts
	 * @param {Object} options
	 * @api public
	 */

	function Manager (uri, opts) {
	  if (!(this instanceof Manager)) return new Manager(uri, opts);
	  if (uri && ('object' === typeof uri)) {
	    opts = uri;
	    uri = undefined;
	  }
	  opts = opts || {};

	  opts.path = opts.path || '/socket.io';
	  this.nsps = {};
	  this.subs = [];
	  this.opts = opts;
	  this.reconnection(opts.reconnection !== false);
	  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	  this.reconnectionDelay(opts.reconnectionDelay || 1000);
	  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	  this.randomizationFactor(opts.randomizationFactor || 0.5);
	  this.backoff = new Backoff({
	    min: this.reconnectionDelay(),
	    max: this.reconnectionDelayMax(),
	    jitter: this.randomizationFactor()
	  });
	  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	  this.readyState = 'closed';
	  this.uri = uri;
	  this.connecting = [];
	  this.lastPing = null;
	  this.encoding = false;
	  this.packetBuffer = [];
	  var _parser = opts.parser || parser;
	  this.encoder = new _parser.Encoder();
	  this.decoder = new _parser.Decoder();
	  this.autoConnect = opts.autoConnect !== false;
	  if (this.autoConnect) this.open();
	}

	/**
	 * Propagate given event to sockets and emit on `this`
	 *
	 * @api private
	 */

	Manager.prototype.emitAll = function () {
	  this.emit.apply(this, arguments);
	  for (var nsp in this.nsps) {
	    if (has.call(this.nsps, nsp)) {
	      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
	    }
	  }
	};

	/**
	 * Update `socket.id` of all sockets
	 *
	 * @api private
	 */

	Manager.prototype.updateSocketIds = function () {
	  for (var nsp in this.nsps) {
	    if (has.call(this.nsps, nsp)) {
	      this.nsps[nsp].id = this.generateId(nsp);
	    }
	  }
	};

	/**
	 * generate `socket.id` for the given `nsp`
	 *
	 * @param {String} nsp
	 * @return {String}
	 * @api private
	 */

	Manager.prototype.generateId = function (nsp) {
	  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
	};

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Manager.prototype);

	/**
	 * Sets the `reconnection` config.
	 *
	 * @param {Boolean} true/false if it should automatically reconnect
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnection = function (v) {
	  if (!arguments.length) return this._reconnection;
	  this._reconnection = !!v;
	  return this;
	};

	/**
	 * Sets the reconnection attempts config.
	 *
	 * @param {Number} max reconnection attempts before giving up
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionAttempts = function (v) {
	  if (!arguments.length) return this._reconnectionAttempts;
	  this._reconnectionAttempts = v;
	  return this;
	};

	/**
	 * Sets the delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelay = function (v) {
	  if (!arguments.length) return this._reconnectionDelay;
	  this._reconnectionDelay = v;
	  this.backoff && this.backoff.setMin(v);
	  return this;
	};

	Manager.prototype.randomizationFactor = function (v) {
	  if (!arguments.length) return this._randomizationFactor;
	  this._randomizationFactor = v;
	  this.backoff && this.backoff.setJitter(v);
	  return this;
	};

	/**
	 * Sets the maximum delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelayMax = function (v) {
	  if (!arguments.length) return this._reconnectionDelayMax;
	  this._reconnectionDelayMax = v;
	  this.backoff && this.backoff.setMax(v);
	  return this;
	};

	/**
	 * Sets the connection timeout. `false` to disable
	 *
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.timeout = function (v) {
	  if (!arguments.length) return this._timeout;
	  this._timeout = v;
	  return this;
	};

	/**
	 * Starts trying to reconnect if reconnection is enabled and we have not
	 * started reconnecting yet
	 *
	 * @api private
	 */

	Manager.prototype.maybeReconnectOnOpen = function () {
	  // Only try to reconnect if it's the first time we're connecting
	  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
	    // keeps reconnection from firing twice for the same reconnection loop
	    this.reconnect();
	  }
	};

	/**
	 * Sets the current transport `socket`.
	 *
	 * @param {Function} optional, callback
	 * @return {Manager} self
	 * @api public
	 */

	Manager.prototype.open =
	Manager.prototype.connect = function (fn, opts) {
	  debug('readyState %s', this.readyState);
	  if (~this.readyState.indexOf('open')) return this;

	  debug('opening %s', this.uri);
	  this.engine = eio(this.uri, this.opts);
	  var socket = this.engine;
	  var self = this;
	  this.readyState = 'opening';
	  this.skipReconnect = false;

	  // emit `open`
	  var openSub = on(socket, 'open', function () {
	    self.onopen();
	    fn && fn();
	  });

	  // emit `connect_error`
	  var errorSub = on(socket, 'error', function (data) {
	    debug('connect_error');
	    self.cleanup();
	    self.readyState = 'closed';
	    self.emitAll('connect_error', data);
	    if (fn) {
	      var err = new Error('Connection error');
	      err.data = data;
	      fn(err);
	    } else {
	      // Only do this if there is no fn to handle the error
	      self.maybeReconnectOnOpen();
	    }
	  });

	  // emit `connect_timeout`
	  if (false !== this._timeout) {
	    var timeout = this._timeout;
	    debug('connect attempt will timeout after %d', timeout);

	    // set timer
	    var timer = setTimeout(function () {
	      debug('connect attempt timed out after %d', timeout);
	      openSub.destroy();
	      socket.close();
	      socket.emit('error', 'timeout');
	      self.emitAll('connect_timeout', timeout);
	    }, timeout);

	    this.subs.push({
	      destroy: function () {
	        clearTimeout(timer);
	      }
	    });
	  }

	  this.subs.push(openSub);
	  this.subs.push(errorSub);

	  return this;
	};

	/**
	 * Called upon transport open.
	 *
	 * @api private
	 */

	Manager.prototype.onopen = function () {
	  debug('open');

	  // clear old subs
	  this.cleanup();

	  // mark as open
	  this.readyState = 'open';
	  this.emit('open');

	  // add new subs
	  var socket = this.engine;
	  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
	  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
	  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
	  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
	  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
	  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
	};

	/**
	 * Called upon a ping.
	 *
	 * @api private
	 */

	Manager.prototype.onping = function () {
	  this.lastPing = new Date();
	  this.emitAll('ping');
	};

	/**
	 * Called upon a packet.
	 *
	 * @api private
	 */

	Manager.prototype.onpong = function () {
	  this.emitAll('pong', new Date() - this.lastPing);
	};

	/**
	 * Called with data.
	 *
	 * @api private
	 */

	Manager.prototype.ondata = function (data) {
	  this.decoder.add(data);
	};

	/**
	 * Called when parser fully decodes a packet.
	 *
	 * @api private
	 */

	Manager.prototype.ondecoded = function (packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon socket error.
	 *
	 * @api private
	 */

	Manager.prototype.onerror = function (err) {
	  debug('error', err);
	  this.emitAll('error', err);
	};

	/**
	 * Creates a new socket for the given `nsp`.
	 *
	 * @return {Socket}
	 * @api public
	 */

	Manager.prototype.socket = function (nsp, opts) {
	  var socket = this.nsps[nsp];
	  if (!socket) {
	    socket = new Socket(this, nsp, opts);
	    this.nsps[nsp] = socket;
	    var self = this;
	    socket.on('connecting', onConnecting);
	    socket.on('connect', function () {
	      socket.id = self.generateId(nsp);
	    });

	    if (this.autoConnect) {
	      // manually call here since connecting event is fired before listening
	      onConnecting();
	    }
	  }

	  function onConnecting () {
	    if (!~indexOf(self.connecting, socket)) {
	      self.connecting.push(socket);
	    }
	  }

	  return socket;
	};

	/**
	 * Called upon a socket close.
	 *
	 * @param {Socket} socket
	 */

	Manager.prototype.destroy = function (socket) {
	  var index = indexOf(this.connecting, socket);
	  if (~index) this.connecting.splice(index, 1);
	  if (this.connecting.length) return;

	  this.close();
	};

	/**
	 * Writes a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Manager.prototype.packet = function (packet) {
	  debug('writing packet %j', packet);
	  var self = this;
	  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

	  if (!self.encoding) {
	    // encode, then write to engine with result
	    self.encoding = true;
	    this.encoder.encode(packet, function (encodedPackets) {
	      for (var i = 0; i < encodedPackets.length; i++) {
	        self.engine.write(encodedPackets[i], packet.options);
	      }
	      self.encoding = false;
	      self.processPacketQueue();
	    });
	  } else { // add packet to the queue
	    self.packetBuffer.push(packet);
	  }
	};

	/**
	 * If packet buffer is non-empty, begins encoding the
	 * next packet in line.
	 *
	 * @api private
	 */

	Manager.prototype.processPacketQueue = function () {
	  if (this.packetBuffer.length > 0 && !this.encoding) {
	    var pack = this.packetBuffer.shift();
	    this.packet(pack);
	  }
	};

	/**
	 * Clean up transport subscriptions and packet buffer.
	 *
	 * @api private
	 */

	Manager.prototype.cleanup = function () {
	  debug('cleanup');

	  var subsLength = this.subs.length;
	  for (var i = 0; i < subsLength; i++) {
	    var sub = this.subs.shift();
	    sub.destroy();
	  }

	  this.packetBuffer = [];
	  this.encoding = false;
	  this.lastPing = null;

	  this.decoder.destroy();
	};

	/**
	 * Close the current socket.
	 *
	 * @api private
	 */

	Manager.prototype.close =
	Manager.prototype.disconnect = function () {
	  debug('disconnect');
	  this.skipReconnect = true;
	  this.reconnecting = false;
	  if ('opening' === this.readyState) {
	    // `onclose` will not fire because
	    // an open event never happened
	    this.cleanup();
	  }
	  this.backoff.reset();
	  this.readyState = 'closed';
	  if (this.engine) this.engine.close();
	};

	/**
	 * Called upon engine close.
	 *
	 * @api private
	 */

	Manager.prototype.onclose = function (reason) {
	  debug('onclose');

	  this.cleanup();
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.emit('close', reason);

	  if (this._reconnection && !this.skipReconnect) {
	    this.reconnect();
	  }
	};

	/**
	 * Attempt a reconnection.
	 *
	 * @api private
	 */

	Manager.prototype.reconnect = function () {
	  if (this.reconnecting || this.skipReconnect) return this;

	  var self = this;

	  if (this.backoff.attempts >= this._reconnectionAttempts) {
	    debug('reconnect failed');
	    this.backoff.reset();
	    this.emitAll('reconnect_failed');
	    this.reconnecting = false;
	  } else {
	    var delay = this.backoff.duration();
	    debug('will wait %dms before reconnect attempt', delay);

	    this.reconnecting = true;
	    var timer = setTimeout(function () {
	      if (self.skipReconnect) return;

	      debug('attempting reconnect');
	      self.emitAll('reconnect_attempt', self.backoff.attempts);
	      self.emitAll('reconnecting', self.backoff.attempts);

	      // check again for the case socket closed in above events
	      if (self.skipReconnect) return;

	      self.open(function (err) {
	        if (err) {
	          debug('reconnect attempt error');
	          self.reconnecting = false;
	          self.reconnect();
	          self.emitAll('reconnect_error', err.data);
	        } else {
	          debug('reconnect success');
	          self.onreconnect();
	        }
	      });
	    }, delay);

	    this.subs.push({
	      destroy: function () {
	        clearTimeout(timer);
	      }
	    });
	  }
	};

	/**
	 * Called upon successful reconnect.
	 *
	 * @api private
	 */

	Manager.prototype.onreconnect = function () {
	  var attempt = this.backoff.attempts;
	  this.reconnecting = false;
	  this.backoff.reset();
	  this.updateSocketIds();
	  this.emitAll('reconnect', attempt);
	};


/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(179);


/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(180);

	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(187);


/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var transports = __webpack_require__(181);
	var Emitter = __webpack_require__(172);
	var debug = __webpack_require__(168)('engine.io-client:socket');
	var index = __webpack_require__(202);
	var parser = __webpack_require__(187);
	var parseuri = __webpack_require__(167);
	var parsejson = __webpack_require__(203);
	var parseqs = __webpack_require__(196);

	/**
	 * Module exports.
	 */

	module.exports = Socket;

	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */

	function Socket (uri, opts) {
	  if (!(this instanceof Socket)) return new Socket(uri, opts);

	  opts = opts || {};

	  if (uri && 'object' === typeof uri) {
	    opts = uri;
	    uri = null;
	  }

	  if (uri) {
	    uri = parseuri(uri);
	    opts.hostname = uri.host;
	    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  } else if (opts.host) {
	    opts.hostname = parseuri(opts.host).host;
	  }

	  this.secure = null != opts.secure ? opts.secure
	    : (global.location && 'https:' === location.protocol);

	  if (opts.hostname && !opts.port) {
	    // if no port is specified manually, use the protocol default
	    opts.port = this.secure ? '443' : '80';
	  }

	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port
	      ? location.port
	      : (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.transportOptions = opts.transportOptions || {};
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.prevBufferLen = 0;
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
	  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

	  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
	  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
	    this.perMessageDeflate.threshold = 1024;
	  }

	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
	  this.forceNode = !!opts.forceNode;

	  // other options for Node.js client
	  var freeGlobal = typeof global === 'object' && global;
	  if (freeGlobal.global === freeGlobal) {
	    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
	      this.extraHeaders = opts.extraHeaders;
	    }

	    if (opts.localAddress) {
	      this.localAddress = opts.localAddress;
	    }
	  }

	  // set on handshake
	  this.id = null;
	  this.upgrades = null;
	  this.pingInterval = null;
	  this.pingTimeout = null;

	  // set on heartbeat
	  this.pingIntervalTimer = null;
	  this.pingTimeoutTimer = null;

	  this.open();
	}

	Socket.priorWebsocketSuccess = false;

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	Socket.protocol = parser.protocol; // this is an int

	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */

	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(186);
	Socket.transports = __webpack_require__(181);
	Socket.parser = __webpack_require__(187);

	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */

	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);

	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;

	  // transport name
	  query.transport = name;

	  // per-transport options
	  var options = this.transportOptions[name] || {};

	  // session id if we already have one
	  if (this.id) query.sid = this.id;

	  var transport = new transports[name]({
	    query: query,
	    socket: this,
	    agent: options.agent || this.agent,
	    hostname: options.hostname || this.hostname,
	    port: options.port || this.port,
	    secure: options.secure || this.secure,
	    path: options.path || this.path,
	    forceJSONP: options.forceJSONP || this.forceJSONP,
	    jsonp: options.jsonp || this.jsonp,
	    forceBase64: options.forceBase64 || this.forceBase64,
	    enablesXDR: options.enablesXDR || this.enablesXDR,
	    timestampRequests: options.timestampRequests || this.timestampRequests,
	    timestampParam: options.timestampParam || this.timestampParam,
	    policyPort: options.policyPort || this.policyPort,
	    pfx: options.pfx || this.pfx,
	    key: options.key || this.key,
	    passphrase: options.passphrase || this.passphrase,
	    cert: options.cert || this.cert,
	    ca: options.ca || this.ca,
	    ciphers: options.ciphers || this.ciphers,
	    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
	    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
	    extraHeaders: options.extraHeaders || this.extraHeaders,
	    forceNode: options.forceNode || this.forceNode,
	    localAddress: options.localAddress || this.localAddress,
	    requestTimeout: options.requestTimeout || this.requestTimeout,
	    protocols: options.protocols || void (0)
	  });

	  return transport;
	};

	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}

	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
	    transport = 'websocket';
	  } else if (0 === this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function () {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';

	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }

	  transport.open();
	  this.setTransport(transport);
	};

	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */

	Socket.prototype.setTransport = function (transport) {
	  debug('setting transport %s', transport.name);
	  var self = this;

	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }

	  // set up transport
	  this.transport = transport;

	  // set up transport listeners
	  transport
	  .on('drain', function () {
	    self.onDrain();
	  })
	  .on('packet', function (packet) {
	    self.onPacket(packet);
	  })
	  .on('error', function (e) {
	    self.onError(e);
	  })
	  .on('close', function () {
	    self.onClose('transport close');
	  });
	};

	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */

	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 });
	  var failed = false;
	  var self = this;

	  Socket.priorWebsocketSuccess = false;

	  function onTransportOpen () {
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;

	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' === msg.type && 'probe' === msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' === self.readyState) return;
	          debug('changing transport and sending upgrade packet');

	          cleanup();

	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }

	  function freezeTransport () {
	    if (failed) return;

	    // Any callback called by transport should be ignored since now
	    failed = true;

	    cleanup();

	    transport.close();
	    transport = null;
	  }

	  // Handle any error that happens while probing
	  function onerror (err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;

	    freezeTransport();

	    debug('probe transport "%s" failed because of error: %s', name, err);

	    self.emit('upgradeError', error);
	  }

	  function onTransportClose () {
	    onerror('transport closed');
	  }

	  // When the socket is closed while we're probing
	  function onclose () {
	    onerror('socket closed');
	  }

	  // When the socket is upgraded while we're probing
	  function onupgrade (to) {
	    if (transport && to.name !== transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }

	  // Remove all listeners on the transport and on self
	  function cleanup () {
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }

	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);

	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);

	  transport.open();
	};

	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */

	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
	  this.emit('open');
	  this.flush();

	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};

	/**
	 * Handles a packet.
	 *
	 * @api private
	 */

	Socket.prototype.onPacket = function (packet) {
	  if ('opening' === this.readyState || 'open' === this.readyState ||
	      'closing' === this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

	    this.emit('packet', packet);

	    // Socket is live - any packet counts
	    this.emit('heartbeat');

	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;

	      case 'pong':
	        this.setPing();
	        this.emit('pong');
	        break;

	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.onError(err);
	        break;

	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};

	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */

	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if ('closed' === this.readyState) return;
	  this.setPing();

	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};

	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */

	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' === self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};

	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */

	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};

	/**
	* Sends a ping packet.
	*
	* @api private
	*/

	Socket.prototype.ping = function () {
	  var self = this;
	  this.sendPacket('ping', function () {
	    self.emit('ping');
	  });
	};

	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */

	Socket.prototype.onDrain = function () {
	  this.writeBuffer.splice(0, this.prevBufferLen);

	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;

	  if (0 === this.writeBuffer.length) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};

	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */

	Socket.prototype.flush = function () {
	  if ('closed' !== this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};

	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @param {Object} options.
	 * @return {Socket} for chaining.
	 * @api public
	 */

	Socket.prototype.write =
	Socket.prototype.send = function (msg, options, fn) {
	  this.sendPacket('message', msg, options, fn);
	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Object} options.
	 * @param {Function} callback function.
	 * @api private
	 */

	Socket.prototype.sendPacket = function (type, data, options, fn) {
	  if ('function' === typeof data) {
	    fn = data;
	    data = undefined;
	  }

	  if ('function' === typeof options) {
	    fn = options;
	    options = null;
	  }

	  if ('closing' === this.readyState || 'closed' === this.readyState) {
	    return;
	  }

	  options = options || {};
	  options.compress = false !== options.compress;

	  var packet = {
	    type: type,
	    data: data,
	    options: options
	  };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  if (fn) this.once('flush', fn);
	  this.flush();
	};

	/**
	 * Closes the connection.
	 *
	 * @api private
	 */

	Socket.prototype.close = function () {
	  if ('opening' === this.readyState || 'open' === this.readyState) {
	    this.readyState = 'closing';

	    var self = this;

	    if (this.writeBuffer.length) {
	      this.once('drain', function () {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }

	  function close () {
	    self.onClose('forced close');
	    debug('socket closing - telling transport to close');
	    self.transport.close();
	  }

	  function cleanupAndClose () {
	    self.removeListener('upgrade', cleanupAndClose);
	    self.removeListener('upgradeError', cleanupAndClose);
	    close();
	  }

	  function waitForUpgrade () {
	    // wait for upgrade to finish since we can't send packets while pausing a transport
	    self.once('upgrade', cleanupAndClose);
	    self.once('upgradeError', cleanupAndClose);
	  }

	  return this;
	};

	/**
	 * Called upon transport error
	 *
	 * @api private
	 */

	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};

	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */

	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;

	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);

	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');

	    // ensure transport won't stay open
	    this.transport.close();

	    // ignore further transport communication
	    this.transport.removeAllListeners();

	    // set ready state
	    this.readyState = 'closed';

	    // clear session id
	    this.id = null;

	    // emit close event
	    this.emit('close', reason, desc);

	    // clean buffers after, so users can still
	    // grab the buffers on `close` event
	    self.writeBuffer = [];
	    self.prevBufferLen = 0;
	  }
	};

	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */

	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i < j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */

	var XMLHttpRequest = __webpack_require__(182);
	var XHR = __webpack_require__(184);
	var JSONP = __webpack_require__(199);
	var websocket = __webpack_require__(200);

	/**
	 * Export transports.
	 */

	exports.polling = polling;
	exports.websocket = websocket;

	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */

	function polling (opts) {
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;

	  if (global.location) {
	    var isSSL = 'https:' === location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    xd = opts.hostname !== location.hostname || port !== opts.port;
	    xs = opts.secure !== isSSL;
	  }

	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);

	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// browser shim for xmlhttprequest module

	var hasCORS = __webpack_require__(183);

	module.exports = function (opts) {
	  var xdomain = opts.xdomain;

	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;

	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;

	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }

	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }

	  if (!xdomain) {
	    try {
	      return new global[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
	    } catch (e) { }
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 183 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */

	try {
	  module.exports = typeof XMLHttpRequest !== 'undefined' &&
	    'withCredentials' in new XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */

	var XMLHttpRequest = __webpack_require__(182);
	var Polling = __webpack_require__(185);
	var Emitter = __webpack_require__(172);
	var inherit = __webpack_require__(197);
	var debug = __webpack_require__(168)('engine.io-client:polling-xhr');

	/**
	 * Module exports.
	 */

	module.exports = XHR;
	module.exports.Request = Request;

	/**
	 * Empty function
	 */

	function empty () {}

	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function XHR (opts) {
	  Polling.call(this, opts);
	  this.requestTimeout = opts.requestTimeout;
	  this.extraHeaders = opts.extraHeaders;

	  if (global.location) {
	    var isSSL = 'https:' === location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    this.xd = opts.hostname !== global.location.hostname ||
	      port !== opts.port;
	    this.xs = opts.secure !== isSSL;
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(XHR, Polling);

	/**
	 * XHR supports binary
	 */

	XHR.prototype.supportsBinary = true;

	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */

	XHR.prototype.request = function (opts) {
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	  opts.requestTimeout = this.requestTimeout;

	  // other options for Node.js client
	  opts.extraHeaders = this.extraHeaders;

	  return new Request(opts);
	};

	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */

	XHR.prototype.doWrite = function (data, fn) {
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function (err) {
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	XHR.prototype.doPoll = function () {
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function (data) {
	    self.onData(data);
	  });
	  req.on('error', function (err) {
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};

	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */

	function Request (opts) {
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined !== opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;
	  this.requestTimeout = opts.requestTimeout;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;

	  this.create();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */

	Request.prototype.create = function () {
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;

	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    try {
	      if (this.extraHeaders) {
	        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
	        for (var i in this.extraHeaders) {
	          if (this.extraHeaders.hasOwnProperty(i)) {
	            xhr.setRequestHeader(i, this.extraHeaders[i]);
	          }
	        }
	      }
	    } catch (e) {}

	    if ('POST' === this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }

	    try {
	      xhr.setRequestHeader('Accept', '*/*');
	    } catch (e) {}

	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }

	    if (this.requestTimeout) {
	      xhr.timeout = this.requestTimeout;
	    }

	    if (this.hasXDR()) {
	      xhr.onload = function () {
	        self.onLoad();
	      };
	      xhr.onerror = function () {
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function () {
	        if (xhr.readyState === 2) {
	          var contentType;
	          try {
	            contentType = xhr.getResponseHeader('Content-Type');
	          } catch (e) {}
	          if (contentType === 'application/octet-stream') {
	            xhr.responseType = 'arraybuffer';
	          }
	        }
	        if (4 !== xhr.readyState) return;
	        if (200 === xhr.status || 1223 === xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function () {
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }

	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function () {
	      self.onError(e);
	    }, 0);
	    return;
	  }

	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};

	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */

	Request.prototype.onSuccess = function () {
	  this.emit('success');
	  this.cleanup();
	};

	/**
	 * Called if we have data.
	 *
	 * @api private
	 */

	Request.prototype.onData = function (data) {
	  this.emit('data', data);
	  this.onSuccess();
	};

	/**
	 * Called upon error.
	 *
	 * @api private
	 */

	Request.prototype.onError = function (err) {
	  this.emit('error', err);
	  this.cleanup(true);
	};

	/**
	 * Cleans up house.
	 *
	 * @api private
	 */

	Request.prototype.cleanup = function (fromError) {
	  if ('undefined' === typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }

	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch (e) {}
	  }

	  if (global.document) {
	    delete Request.requests[this.index];
	  }

	  this.xhr = null;
	};

	/**
	 * Called upon load.
	 *
	 * @api private
	 */

	Request.prototype.onLoad = function () {
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type');
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response || this.xhr.responseText;
	    } else {
	      data = this.xhr.responseText;
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};

	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */

	Request.prototype.hasXDR = function () {
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};

	/**
	 * Aborts the request.
	 *
	 * @api public
	 */

	Request.prototype.abort = function () {
	  this.cleanup();
	};

	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */

	Request.requestsCount = 0;
	Request.requests = {};

	if (global.document) {
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}

	function unloadHandler () {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(186);
	var parseqs = __webpack_require__(196);
	var parser = __webpack_require__(187);
	var inherit = __webpack_require__(197);
	var yeast = __webpack_require__(198);
	var debug = __webpack_require__(168)('engine.io-client:polling');

	/**
	 * Module exports.
	 */

	module.exports = Polling;

	/**
	 * Is XHR2 supported?
	 */

	var hasXHR2 = (function () {
	  var XMLHttpRequest = __webpack_require__(182);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();

	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */

	function Polling (opts) {
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(Polling, Transport);

	/**
	 * Transport name.
	 */

	Polling.prototype.name = 'polling';

	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */

	Polling.prototype.doOpen = function () {
	  this.poll();
	};

	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */

	Polling.prototype.pause = function (onPause) {
	  var self = this;

	  this.readyState = 'pausing';

	  function pause () {
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }

	  if (this.polling || !this.writable) {
	    var total = 0;

	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function () {
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }

	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function () {
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};

	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */

	Polling.prototype.poll = function () {
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};

	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */

	Polling.prototype.onData = function (data) {
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function (packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' === self.readyState) {
	      self.onOpen();
	    }

	    // if its a close packet, we close the ongoing requests
	    if ('close' === packet.type) {
	      self.onClose();
	      return false;
	    }

	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };

	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);

	  // if an event did not trigger closing
	  if ('closed' !== this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');

	    if ('open' === this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};

	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */

	Polling.prototype.doClose = function () {
	  var self = this;

	  function close () {
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }

	  if ('open' === this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};

	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */

	Polling.prototype.write = function (packets) {
	  var self = this;
	  this.writable = false;
	  var callbackfn = function () {
	    self.writable = true;
	    self.emit('drain');
	  };

	  parser.encodePayload(packets, this.supportsBinary, function (data) {
	    self.doWrite(data, callbackfn);
	  });
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	Polling.prototype.uri = function () {
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';

	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }

	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // avoid port if default for schema
	  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
	     ('http' === schema && Number(this.port) !== 80))) {
	    port = ':' + this.port;
	  }

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};


/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(187);
	var Emitter = __webpack_require__(172);

	/**
	 * Module exports.
	 */

	module.exports = Transport;

	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */

	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	  this.forceNode = opts.forceNode;

	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;
	  this.localAddress = opts.localAddress;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Transport.prototype);

	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */

	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};

	/**
	 * Opens the transport.
	 *
	 * @api public
	 */

	Transport.prototype.open = function () {
	  if ('closed' === this.readyState || '' === this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }

	  return this;
	};

	/**
	 * Closes the transport.
	 *
	 * @api private
	 */

	Transport.prototype.close = function () {
	  if ('opening' === this.readyState || 'open' === this.readyState) {
	    this.doClose();
	    this.onClose();
	  }

	  return this;
	};

	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */

	Transport.prototype.send = function (packets) {
	  if ('open' === this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};

	/**
	 * Called upon open
	 *
	 * @api private
	 */

	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};

	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */

	Transport.prototype.onData = function (data) {
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};

	/**
	 * Called with a decoded packet.
	 */

	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon close.
	 *
	 * @api private
	 */

	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var keys = __webpack_require__(188);
	var hasBinary = __webpack_require__(189);
	var sliceBuffer = __webpack_require__(191);
	var after = __webpack_require__(192);
	var utf8 = __webpack_require__(193);

	var base64encoder;
	if (global && global.ArrayBuffer) {
	  base64encoder = __webpack_require__(194);
	}

	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */

	var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;

	/**
	 * Current protocol version.
	 */

	exports.protocol = 3;

	/**
	 * Packet types.
	 */

	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};

	var packetslist = keys(packets);

	/**
	 * Premade error packet.
	 */

	var err = { type: 'error', data: 'parser error' };

	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */

	var Blob = __webpack_require__(195);

	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */

	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if (typeof supportsBinary === 'function') {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }

	  if (typeof utf8encode === 'function') {
	    callback = utf8encode;
	    utf8encode = null;
	  }

	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;

	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }

	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }

	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];

	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
	  }

	  return callback('' + encoded);

	};

	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}

	/**
	 * Encode packet helpers for binary types
	 */

	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);

	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }

	  return callback(resultBuffer.buffer);
	}

	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}

	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }

	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);

	  return callback(blob);
	}

	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */

	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof global.Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }

	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};

	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */

	exports.decodePacket = function (data, binaryType, utf8decode) {
	  if (data === undefined) {
	    return err;
	  }
	  // String data
	  if (typeof data === 'string') {
	    if (data.charAt(0) === 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }

	    if (utf8decode) {
	      data = tryDecode(data);
	      if (data === false) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);

	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }

	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }

	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};

	function tryDecode(data) {
	  try {
	    data = utf8.decode(data, { strict: false });
	  } catch (e) {
	    return false;
	  }
	  return data;
	}

	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */

	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!base64encoder) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }

	  var data = base64encoder.decode(msg.substr(1));

	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }

	  return { type: type, data: data };
	};

	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */

	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary === 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }

	  var isBinary = hasBinary(packets);

	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }

	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }

	  if (!packets.length) {
	    return callback('0:');
	  }

	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};

	/**
	 * Async array map using after
	 */

	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);

	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };

	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}

	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */

	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data !== 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }

	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var packet;
	  if (data === '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	  var length = '', n, msg;

	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);

	    if (chr !== ':') {
	      length += chr;
	      continue;
	    }

	    if (length === '' || (length != (n = Number(length)))) {
	      // parser error - ignoring payload
	      return callback(err, 0, 1);
	    }

	    msg = data.substr(i + 1, n);

	    if (length != msg.length) {
	      // parser error - ignoring payload
	      return callback(err, 0, 1);
	    }

	    if (msg.length) {
	      packet = exports.decodePacket(msg, binaryType, false);

	      if (err.type === packet.type && err.data === packet.data) {
	        // parser error in individual packet - ignoring payload
	        return callback(err, 0, 1);
	      }

	      var ret = callback(packet, i + n, l);
	      if (false === ret) return;
	    }

	    // advance cursor
	    i += n;
	    length = '';
	  }

	  if (length !== '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	};

	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */

	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }

	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);

	    var resultArray = new Uint8Array(totalLength);

	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }

	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }

	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;

	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });

	    return callback(resultArray.buffer);
	  });
	};

	/**
	 * Encode as Blob
	 */

	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }

	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;

	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;

	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};

	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */

	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var bufferTail = data;
	  var buffers = [];

	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';

	    for (var i = 1; ; i++) {
	      if (tailArray[i] === 255) break;

	      // 310 = char length of Number.MAX_VALUE
	      if (msgLength.length > 310) {
	        return callback(err, 0, 1);
	      }

	      msgLength += tailArray[i];
	    }

	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);

	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }

	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }

	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 188 */
/***/ function(module, exports) {

	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */

	module.exports = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;

	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global Blob File */

	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(190);

	var toString = Object.prototype.toString;
	var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
	var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Supports Buffer, ArrayBuffer, Blob and File.
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary (obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  if (isArray(obj)) {
	    for (var i = 0, l = obj.length; i < l; i++) {
	      if (hasBinary(obj[i])) {
	        return true;
	      }
	    }
	    return false;
	  }

	  if ((typeof global.Buffer === 'function' && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
	     (typeof global.ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
	     (withNativeBlob && obj instanceof Blob) ||
	     (withNativeFile && obj instanceof File)
	    ) {
	    return true;
	  }

	  // see: https://github.com/Automattic/has-binary/pull/4
	  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
	    return hasBinary(obj.toJSON(), true);
	  }

	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
	      return true;
	    }
	  }

	  return false;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 190 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 191 */
/***/ function(module, exports) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */

	module.exports = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;

	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }

	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }

	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 192 */
/***/ function(module, exports) {

	module.exports = after

	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count

	    return (count === 0) ? callback() : proxy

	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count

	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}

	function noop() {}


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/utf8js v2.1.2 by @mathias */
	;(function(root) {

		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;

		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;

		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}

		/*--------------------------------------------------------------------------*/

		var stringFromCharCode = String.fromCharCode;

		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}

		function checkScalarValue(codePoint, strict) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				if (strict) {
					throw Error(
						'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
						' is not a scalar value'
					);
				}
				return false;
			}
			return true;
		}
		/*--------------------------------------------------------------------------*/

		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}

		function encodeCodePoint(codePoint, strict) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				if (!checkScalarValue(codePoint, strict)) {
					codePoint = 0xFFFD;
				}
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}

		function utf8encode(string, opts) {
			opts = opts || {};
			var strict = false !== opts.strict;

			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint, strict);
			}
			return byteString;
		}

		/*--------------------------------------------------------------------------*/

		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}

			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}

			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}

		function decodeSymbol(strict) {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;

			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}

			if (byteIndex == byteCount) {
				return false;
			}

			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}

			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}

			throw Error('Invalid UTF-8 detected');
		}

		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString, opts) {
			opts = opts || {};
			var strict = false !== opts.strict;

			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol(strict)) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}

		/*--------------------------------------------------------------------------*/

		var utf8 = {
			'version': '2.1.2',
			'encode': utf8encode,
			'decode': utf8decode
		};

		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module), (function() { return this; }())))

/***/ },
/* 194 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(){
	  "use strict";

	  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	  // Use a lookup table to find the index.
	  var lookup = new Uint8Array(256);
	  for (var i = 0; i < chars.length; i++) {
	    lookup[chars.charCodeAt(i)] = i;
	  }

	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";

	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }

	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }

	    return base64;
	  };

	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;

	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }

	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);

	    for (i = 0; i < len; i+=4) {
	      encoded1 = lookup[base64.charCodeAt(i)];
	      encoded2 = lookup[base64.charCodeAt(i+1)];
	      encoded3 = lookup[base64.charCodeAt(i+2)];
	      encoded4 = lookup[base64.charCodeAt(i+3)];

	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }

	    return arraybuffer;
	  };
	})();


/***/ },
/* 195 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */

	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;

	/**
	 * Check if Blob constructor is supported
	 */

	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */

	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if BlobBuilder is supported
	 */

	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;

	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */

	function mapArrayBufferViews(ary) {
	  for (var i = 0; i < ary.length; i++) {
	    var chunk = ary[i];
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;

	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }

	      ary[i] = buf;
	    }
	  }
	}

	function BlobBuilderConstructor(ary, options) {
	  options = options || {};

	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary);

	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }

	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};

	function BlobConstructor(ary, options) {
	  mapArrayBufferViews(ary);
	  return new Blob(ary, options || {});
	};

	module.exports = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 196 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */

	exports.encode = function (obj) {
	  var str = '';

	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }

	  return str;
	};

	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */

	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 197 */
/***/ function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 198 */
/***/ function(module, exports) {

	'use strict';

	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
	  , length = 64
	  , map = {}
	  , seed = 0
	  , i = 0
	  , prev;

	/**
	 * Return a string representing the specified number.
	 *
	 * @param {Number} num The number to convert.
	 * @returns {String} The string representation of the number.
	 * @api public
	 */
	function encode(num) {
	  var encoded = '';

	  do {
	    encoded = alphabet[num % length] + encoded;
	    num = Math.floor(num / length);
	  } while (num > 0);

	  return encoded;
	}

	/**
	 * Return the integer value specified by the given string.
	 *
	 * @param {String} str The string to convert.
	 * @returns {Number} The integer value represented by the string.
	 * @api public
	 */
	function decode(str) {
	  var decoded = 0;

	  for (i = 0; i < str.length; i++) {
	    decoded = decoded * length + map[str.charAt(i)];
	  }

	  return decoded;
	}

	/**
	 * Yeast: A tiny growing id generator.
	 *
	 * @returns {String} A unique id.
	 * @api public
	 */
	function yeast() {
	  var now = encode(+new Date());

	  if (now !== prev) return seed = 0, prev = now;
	  return now +'.'+ encode(seed++);
	}

	//
	// Map each character to its index.
	//
	for (; i < length; i++) map[alphabet[i]] = i;

	//
	// Expose the `yeast`, `encode` and `decode` functions.
	//
	yeast.encode = encode;
	yeast.decode = decode;
	module.exports = yeast;


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */

	var Polling = __webpack_require__(185);
	var inherit = __webpack_require__(197);

	/**
	 * Module exports.
	 */

	module.exports = JSONPPolling;

	/**
	 * Cached regular expressions.
	 */

	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;

	/**
	 * Global JSONP callbacks.
	 */

	var callbacks;

	/**
	 * Noop.
	 */

	function empty () { }

	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */

	function JSONPPolling (opts) {
	  Polling.call(this, opts);

	  this.query = this.query || {};

	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }

	  // callback identifier
	  this.index = callbacks.length;

	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });

	  // append to query string
	  this.query.j = this.index;

	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(JSONPPolling, Polling);

	/*
	 * JSONP only supports binary as base64 encoded strings
	 */

	JSONPPolling.prototype.supportsBinary = false;

	/**
	 * Closes the socket.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }

	  Polling.prototype.doClose.call(this);
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');

	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function (e) {
	    self.onError('jsonp poll error', e);
	  };

	  var insertAt = document.getElementsByTagName('script')[0];
	  if (insertAt) {
	    insertAt.parentNode.insertBefore(script, insertAt);
	  } else {
	    (document.head || document.body).appendChild(script);
	  }
	  this.script = script;

	  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};

	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */

	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;

	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;

	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);

	    this.form = form;
	    this.area = area;
	  }

	  this.form.action = this.uri();

	  function complete () {
	    initIframe();
	    fn();
	  }

	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }

	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }

	    iframe.id = self.iframeId;

	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }

	  initIframe();

	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');

	  try {
	    this.form.submit();
	  } catch (e) {}

	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function () {
	      if (self.iframe.readyState === 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(186);
	var parser = __webpack_require__(187);
	var parseqs = __webpack_require__(196);
	var inherit = __webpack_require__(197);
	var yeast = __webpack_require__(198);
	var debug = __webpack_require__(168)('engine.io-client:websocket');
	var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
	var NodeWebSocket;
	if (typeof window === 'undefined') {
	  try {
	    NodeWebSocket = __webpack_require__(201);
	  } catch (e) { }
	}

	/**
	 * Get either the `WebSocket` or `MozWebSocket` globals
	 * in the browser or try to resolve WebSocket-compatible
	 * interface exposed by `ws` for Node-like environment.
	 */

	var WebSocket = BrowserWebSocket;
	if (!WebSocket && typeof window === 'undefined') {
	  WebSocket = NodeWebSocket;
	}

	/**
	 * Module exports.
	 */

	module.exports = WS;

	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */

	function WS (opts) {
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  this.perMessageDeflate = opts.perMessageDeflate;
	  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
	  this.protocols = opts.protocols;
	  if (!this.usingBrowserWebSocket) {
	    WebSocket = NodeWebSocket;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(WS, Transport);

	/**
	 * Transport name.
	 *
	 * @api public
	 */

	WS.prototype.name = 'websocket';

	/*
	 * WebSockets support binary
	 */

	WS.prototype.supportsBinary = true;

	/**
	 * Opens socket.
	 *
	 * @api private
	 */

	WS.prototype.doOpen = function () {
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }

	  var uri = this.uri();
	  var protocols = this.protocols;
	  var opts = {
	    agent: this.agent,
	    perMessageDeflate: this.perMessageDeflate
	  };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;
	  if (this.extraHeaders) {
	    opts.headers = this.extraHeaders;
	  }
	  if (this.localAddress) {
	    opts.localAddress = this.localAddress;
	  }

	  try {
	    this.ws = this.usingBrowserWebSocket ? (protocols ? new WebSocket(uri, protocols) : new WebSocket(uri)) : new WebSocket(uri, protocols, opts);
	  } catch (err) {
	    return this.emit('error', err);
	  }

	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }

	  if (this.ws.supports && this.ws.supports.binary) {
	    this.supportsBinary = true;
	    this.ws.binaryType = 'nodebuffer';
	  } else {
	    this.ws.binaryType = 'arraybuffer';
	  }

	  this.addEventListeners();
	};

	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */

	WS.prototype.addEventListeners = function () {
	  var self = this;

	  this.ws.onopen = function () {
	    self.onOpen();
	  };
	  this.ws.onclose = function () {
	    self.onClose();
	  };
	  this.ws.onmessage = function (ev) {
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function (e) {
	    self.onError('websocket error', e);
	  };
	};

	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */

	WS.prototype.write = function (packets) {
	  var self = this;
	  this.writable = false;

	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  var total = packets.length;
	  for (var i = 0, l = total; i < l; i++) {
	    (function (packet) {
	      parser.encodePacket(packet, self.supportsBinary, function (data) {
	        if (!self.usingBrowserWebSocket) {
	          // always create a new object (GH-437)
	          var opts = {};
	          if (packet.options) {
	            opts.compress = packet.options.compress;
	          }

	          if (self.perMessageDeflate) {
	            var len = 'string' === typeof data ? global.Buffer.byteLength(data) : data.length;
	            if (len < self.perMessageDeflate.threshold) {
	              opts.compress = false;
	            }
	          }
	        }

	        // Sometimes the websocket has already been closed but the browser didn't
	        // have a chance of informing us about it yet, in that case send will
	        // throw an error
	        try {
	          if (self.usingBrowserWebSocket) {
	            // TypeError is thrown when passing the second argument on Safari
	            self.ws.send(data);
	          } else {
	            self.ws.send(data, opts);
	          }
	        } catch (e) {
	          debug('websocket closed before onclose event');
	        }

	        --total || done();
	      });
	    })(packets[i]);
	  }

	  function done () {
	    self.emit('flush');

	    // fake drain
	    // defer to next tick to allow Socket to clear writeBuffer
	    setTimeout(function () {
	      self.writable = true;
	      self.emit('drain');
	    }, 0);
	  }
	};

	/**
	 * Called upon close
	 *
	 * @api private
	 */

	WS.prototype.onClose = function () {
	  Transport.prototype.onClose.call(this);
	};

	/**
	 * Closes socket.
	 *
	 * @api private
	 */

	WS.prototype.doClose = function () {
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	WS.prototype.uri = function () {
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';

	  // avoid port if default for schema
	  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
	    ('ws' === schema && Number(this.port) !== 80))) {
	    port = ':' + this.port;
	  }

	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }

	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};

	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */

	WS.prototype.check = function () {
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 201 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 202 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 203 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */

	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;

	module.exports = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }

	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }

	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(171);
	var Emitter = __webpack_require__(172);
	var toArray = __webpack_require__(205);
	var on = __webpack_require__(206);
	var bind = __webpack_require__(207);
	var debug = __webpack_require__(168)('socket.io-client:socket');
	var parseqs = __webpack_require__(196);

	/**
	 * Module exports.
	 */

	module.exports = exports = Socket;

	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */

	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  connecting: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1,
	  ping: 1,
	  pong: 1
	};

	/**
	 * Shortcut to `Emitter#emit`.
	 */

	var emit = Emitter.prototype.emit;

	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */

	function Socket (io, nsp, opts) {
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	  if (opts && opts.query) {
	    this.query = opts.query;
	  }
	  if (this.io.autoConnect) this.open();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */

	Socket.prototype.subEvents = function () {
	  if (this.subs) return;

	  var io = this.io;
	  this.subs = [
	    on(io, 'open', bind(this, 'onopen')),
	    on(io, 'packet', bind(this, 'onpacket')),
	    on(io, 'close', bind(this, 'onclose'))
	  ];
	};

	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */

	Socket.prototype.open =
	Socket.prototype.connect = function () {
	  if (this.connected) return this;

	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' === this.io.readyState) this.onopen();
	  this.emit('connecting');
	  return this;
	};

	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.send = function () {
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};

	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.emit = function (ev) {
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }

	  var args = toArray(arguments);
	  var packet = { type: parser.EVENT, data: args };

	  packet.options = {};
	  packet.options.compress = !this.flags || false !== this.flags.compress;

	  // event ack callback
	  if ('function' === typeof args[args.length - 1]) {
	    debug('emitting packet with ack id %d', this.ids);
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }

	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }

	  delete this.flags;

	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.packet = function (packet) {
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};

	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */

	Socket.prototype.onopen = function () {
	  debug('transport is open - connecting');

	  // write connect packet if necessary
	  if ('/' !== this.nsp) {
	    if (this.query) {
	      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
	      debug('sending connect packet with query %s', query);
	      this.packet({type: parser.CONNECT, query: query});
	    } else {
	      this.packet({type: parser.CONNECT});
	    }
	  }
	};

	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */

	Socket.prototype.onclose = function (reason) {
	  debug('close (%s)', reason);
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};

	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onpacket = function (packet) {
	  if (packet.nsp !== this.nsp) return;

	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;

	    case parser.EVENT:
	      this.onevent(packet);
	      break;

	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;

	    case parser.ACK:
	      this.onack(packet);
	      break;

	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;

	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;

	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};

	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onevent = function (packet) {
	  var args = packet.data || [];
	  debug('emitting event %j', args);

	  if (null != packet.id) {
	    debug('attaching ack callback to event');
	    args.push(this.ack(packet.id));
	  }

	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};

	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */

	Socket.prototype.ack = function (id) {
	  var self = this;
	  var sent = false;
	  return function () {
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	    debug('sending ack %j', args);

	    self.packet({
	      type: parser.ACK,
	      id: id,
	      data: args
	    });
	  };
	};

	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onack = function (packet) {
	  var ack = this.acks[packet.id];
	  if ('function' === typeof ack) {
	    debug('calling ack %s with %j', packet.id, packet.data);
	    ack.apply(this, packet.data);
	    delete this.acks[packet.id];
	  } else {
	    debug('bad ack %s', packet.id);
	  }
	};

	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */

	Socket.prototype.onconnect = function () {
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};

	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */

	Socket.prototype.emitBuffered = function () {
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];

	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};

	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */

	Socket.prototype.ondisconnect = function () {
	  debug('server disconnect (%s)', this.nsp);
	  this.destroy();
	  this.onclose('io server disconnect');
	};

	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */

	Socket.prototype.destroy = function () {
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }

	  this.io.destroy(this);
	};

	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.close =
	Socket.prototype.disconnect = function () {
	  if (this.connected) {
	    debug('performing disconnect (%s)', this.nsp);
	    this.packet({ type: parser.DISCONNECT });
	  }

	  // remove socket from pool
	  this.destroy();

	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};

	/**
	 * Sets the compress flag.
	 *
	 * @param {Boolean} if `true`, compresses the sending data
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.compress = function (compress) {
	  this.flags = this.flags || {};
	  this.flags.compress = compress;
	  return this;
	};


/***/ },
/* 205 */
/***/ function(module, exports) {

	module.exports = toArray

	function toArray(list, index) {
	    var array = []

	    index = index || 0

	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }

	    return array
	}


/***/ },
/* 206 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */

	module.exports = on;

	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */

	function on (obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function () {
	      obj.removeListener(ev, fn);
	    }
	  };
	}


/***/ },
/* 207 */
/***/ function(module, exports) {

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 208 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Backoff`.
	 */

	module.exports = Backoff;

	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}

	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */

	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};

	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */

	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};

	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};

	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};

	/**
	 * Set the jitter
	 *
	 * @api public
	 */

	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};



/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_LOCAL_MODULE_0__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_LOCAL_MODULE_1__;var require;var require;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_LOCAL_MODULE_2__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/* global define, module, require */
	/*!
	  Script: easyrtc_lang.js

	    Provides lang file.

	  About: License

	    Copyright (c) 2016, Priologic Software Inc.
	    All rights reserved.

	    Redistribution and use in source and binary forms, with or without
	    modification, are permitted provided that the following conditions are met:

	        * Redistributions of source code must retain the above copyright notice,
	          this list of conditions and the following disclaimer.
	        * Redistributions in binary form must reproduce the above copyright
	          notice, this list of conditions and the following disclaimer in the
	          documentation and/or other materials provided with the distribution.

	    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	    ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	    CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	    INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	    CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	    POSSIBILITY OF SUCH DAMAGE.
	*/
	(function (root, factory) {
	    if (true) {
	        //RequireJS (AMD) build system
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_LOCAL_MODULE_0__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__));
	    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	        //CommonJS build system
	        module.exports = factory();
	    } else {
	        root.easyrtc_lang = factory();
	    }
	})(undefined, function (undefined) {

	    "use strict";

	    return {
	        "unableToEnterRoom": "Unable to enter room {0} because {1}",
	        "resolutionWarning": "Requested video size of {0}x{1} but got size of {2}x{3}",
	        "badUserName": "Illegal username {0}",
	        "localMediaError": "Error getting local media stream: {0}",
	        "miscSignalError": "Miscellaneous error from signalling server. It may be ignorable.",
	        "noServer": "Unable to reach the EasyRTC signalling server.",
	        "badsocket": "Socket.io connect event fired with bad websocket.",
	        "icf": "Internal communications failure",
	        "statsNotSupported": "call statistics not supported by this browser, try Chrome.",
	        "noWebrtcSupport": "Your browser doesn't appear to support WebRTC.",
	        "gumFailed": "Failed to get access to local media. Error code was {0}.",
	        "requireAudioOrVideo": "At least one of audio and video must be provided"
	    };
	});
	(function (f) {
	    if (( false ? 'undefined' : _typeof(exports)) === "object" && typeof module !== "undefined") {
	        module.exports = f();
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_LOCAL_MODULE_1__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__));
	    } else {
	        var g;if (typeof window !== "undefined") {
	            g = window;
	        } else if (typeof global !== "undefined") {
	            g = global;
	        } else if (typeof self !== "undefined") {
	            g = self;
	        } else {
	            g = this;
	        }g.adapter = f();
	    }
	})(function () {
	    var define, module, exports;return function e(t, n, r) {
	        function s(o, u) {
	            if (!n[o]) {
	                if (!t[o]) {
	                    var a = typeof require == "function" && require;if (!u && a) return require(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
	                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
	                    var n = t[o][1][e];return s(n ? n : e);
	                }, l, l.exports, e, t, n, r);
	            }return n[o].exports;
	        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
	            s(r[o]);
	        }return s;
	    }({ 1: [function (require, module, exports) {
	            /* eslint-env node */

	            // SDP helpers.
	            var SDPUtils = {};

	            // Generate an alphanumeric identifier for cname or mids.
	            // TODO: use UUIDs instead? https://gist.github.com/jed/982883
	            SDPUtils.generateIdentifier = function () {
	                return Math.random().toString(36).substr(2, 10);
	            };

	            // The RTCP CNAME used by all peerconnections from the same JS.
	            SDPUtils.localCName = SDPUtils.generateIdentifier();

	            // Splits SDP into lines, dealing with both CRLF and LF.
	            SDPUtils.splitLines = function (blob) {
	                return blob.trim().split('\n').map(function (line) {
	                    return line.trim();
	                });
	            };
	            // Splits SDP into sessionpart and mediasections. Ensures CRLF.
	            SDPUtils.splitSections = function (blob) {
	                var parts = blob.split('\nm=');
	                return parts.map(function (part, index) {
	                    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
	                });
	            };

	            // Returns lines that start with a certain prefix.
	            SDPUtils.matchPrefix = function (blob, prefix) {
	                return SDPUtils.splitLines(blob).filter(function (line) {
	                    return line.indexOf(prefix) === 0;
	                });
	            };

	            // Parses an ICE candidate line. Sample input:
	            // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
	            // rport 55996"
	            SDPUtils.parseCandidate = function (line) {
	                var parts;
	                // Parse both variants.
	                if (line.indexOf('a=candidate:') === 0) {
	                    parts = line.substring(12).split(' ');
	                } else {
	                    parts = line.substring(10).split(' ');
	                }

	                var candidate = {
	                    foundation: parts[0],
	                    component: parts[1],
	                    protocol: parts[2].toLowerCase(),
	                    priority: parseInt(parts[3], 10),
	                    ip: parts[4],
	                    port: parseInt(parts[5], 10),
	                    // skip parts[6] == 'typ'
	                    type: parts[7]
	                };

	                for (var i = 8; i < parts.length; i += 2) {
	                    switch (parts[i]) {
	                        case 'raddr':
	                            candidate.relatedAddress = parts[i + 1];
	                            break;
	                        case 'rport':
	                            candidate.relatedPort = parseInt(parts[i + 1], 10);
	                            break;
	                        case 'tcptype':
	                            candidate.tcpType = parts[i + 1];
	                            break;
	                        default:
	                            // Unknown extensions are silently ignored.
	                            break;
	                    }
	                }
	                return candidate;
	            };

	            // Translates a candidate object into SDP candidate attribute.
	            SDPUtils.writeCandidate = function (candidate) {
	                var sdp = [];
	                sdp.push(candidate.foundation);
	                sdp.push(candidate.component);
	                sdp.push(candidate.protocol.toUpperCase());
	                sdp.push(candidate.priority);
	                sdp.push(candidate.ip);
	                sdp.push(candidate.port);

	                var type = candidate.type;
	                sdp.push('typ');
	                sdp.push(type);
	                if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
	                    sdp.push('raddr');
	                    sdp.push(candidate.relatedAddress); // was: relAddr
	                    sdp.push('rport');
	                    sdp.push(candidate.relatedPort); // was: relPort
	                }
	                if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
	                    sdp.push('tcptype');
	                    sdp.push(candidate.tcpType);
	                }
	                return 'candidate:' + sdp.join(' ');
	            };

	            // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
	            // a=rtpmap:111 opus/48000/2
	            SDPUtils.parseRtpMap = function (line) {
	                var parts = line.substr(9).split(' ');
	                var parsed = {
	                    payloadType: parseInt(parts.shift(), 10 // was: id
	                    ) };

	                parts = parts[0].split('/');

	                parsed.name = parts[0];
	                parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
	                // was: channels
	                parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
	                return parsed;
	            };

	            // Generate an a=rtpmap line from RTCRtpCodecCapability or
	            // RTCRtpCodecParameters.
	            SDPUtils.writeRtpMap = function (codec) {
	                var pt = codec.payloadType;
	                if (codec.preferredPayloadType !== undefined) {
	                    pt = codec.preferredPayloadType;
	                }
	                return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
	            };

	            // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
	            // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
	            SDPUtils.parseExtmap = function (line) {
	                var parts = line.substr(9).split(' ');
	                return {
	                    id: parseInt(parts[0], 10),
	                    uri: parts[1]
	                };
	            };

	            // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
	            // RTCRtpHeaderExtension.
	            SDPUtils.writeExtmap = function (headerExtension) {
	                return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + ' ' + headerExtension.uri + '\r\n';
	            };

	            // Parses an ftmp line, returns dictionary. Sample input:
	            // a=fmtp:96 vbr=on;cng=on
	            // Also deals with vbr=on; cng=on
	            SDPUtils.parseFmtp = function (line) {
	                var parsed = {};
	                var kv;
	                var parts = line.substr(line.indexOf(' ') + 1).split(';');
	                for (var j = 0; j < parts.length; j++) {
	                    kv = parts[j].trim().split('=');
	                    parsed[kv[0].trim()] = kv[1];
	                }
	                return parsed;
	            };

	            // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
	            SDPUtils.writeFmtp = function (codec) {
	                var line = '';
	                var pt = codec.payloadType;
	                if (codec.preferredPayloadType !== undefined) {
	                    pt = codec.preferredPayloadType;
	                }
	                if (codec.parameters && Object.keys(codec.parameters).length) {
	                    var params = [];
	                    Object.keys(codec.parameters).forEach(function (param) {
	                        params.push(param + '=' + codec.parameters[param]);
	                    });
	                    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
	                }
	                return line;
	            };

	            // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
	            // a=rtcp-fb:98 nack rpsi
	            SDPUtils.parseRtcpFb = function (line) {
	                var parts = line.substr(line.indexOf(' ') + 1).split(' ');
	                return {
	                    type: parts.shift(),
	                    parameter: parts.join(' ')
	                };
	            };
	            // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
	            SDPUtils.writeRtcpFb = function (codec) {
	                var lines = '';
	                var pt = codec.payloadType;
	                if (codec.preferredPayloadType !== undefined) {
	                    pt = codec.preferredPayloadType;
	                }
	                if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
	                    // FIXME: special handling for trr-int?
	                    codec.rtcpFeedback.forEach(function (fb) {
	                        lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
	                    });
	                }
	                return lines;
	            };

	            // Parses an RFC 5576 ssrc media attribute. Sample input:
	            // a=ssrc:3735928559 cname:something
	            SDPUtils.parseSsrcMedia = function (line) {
	                var sp = line.indexOf(' ');
	                var parts = {
	                    ssrc: parseInt(line.substr(7, sp - 7), 10)
	                };
	                var colon = line.indexOf(':', sp);
	                if (colon > -1) {
	                    parts.attribute = line.substr(sp + 1, colon - sp - 1);
	                    parts.value = line.substr(colon + 1);
	                } else {
	                    parts.attribute = line.substr(sp + 1);
	                }
	                return parts;
	            };

	            // Extracts DTLS parameters from SDP media section or sessionpart.
	            // FIXME: for consistency with other functions this should only
	            //   get the fingerprint line as input. See also getIceParameters.
	            SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
	                var lines = SDPUtils.splitLines(mediaSection);
	                // Search in session part, too.
	                lines = lines.concat(SDPUtils.splitLines(sessionpart));
	                var fpLine = lines.filter(function (line) {
	                    return line.indexOf('a=fingerprint:') === 0;
	                })[0].substr(14);
	                // Note: a=setup line is ignored since we use the 'auto' role.
	                var dtlsParameters = {
	                    role: 'auto',
	                    fingerprints: [{
	                        algorithm: fpLine.split(' ')[0],
	                        value: fpLine.split(' ')[1]
	                    }]
	                };
	                return dtlsParameters;
	            };

	            // Serializes DTLS parameters to SDP.
	            SDPUtils.writeDtlsParameters = function (params, setupType) {
	                var sdp = 'a=setup:' + setupType + '\r\n';
	                params.fingerprints.forEach(function (fp) {
	                    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
	                });
	                return sdp;
	            };
	            // Parses ICE information from SDP media section or sessionpart.
	            // FIXME: for consistency with other functions this should only
	            //   get the ice-ufrag and ice-pwd lines as input.
	            SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
	                var lines = SDPUtils.splitLines(mediaSection);
	                // Search in session part, too.
	                lines = lines.concat(SDPUtils.splitLines(sessionpart));
	                var iceParameters = {
	                    usernameFragment: lines.filter(function (line) {
	                        return line.indexOf('a=ice-ufrag:') === 0;
	                    })[0].substr(12),
	                    password: lines.filter(function (line) {
	                        return line.indexOf('a=ice-pwd:') === 0;
	                    })[0].substr(10)
	                };
	                return iceParameters;
	            };

	            // Serializes ICE parameters to SDP.
	            SDPUtils.writeIceParameters = function (params) {
	                return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
	            };

	            // Parses the SDP media section and returns RTCRtpParameters.
	            SDPUtils.parseRtpParameters = function (mediaSection) {
	                var description = {
	                    codecs: [],
	                    headerExtensions: [],
	                    fecMechanisms: [],
	                    rtcp: []
	                };
	                var lines = SDPUtils.splitLines(mediaSection);
	                var mline = lines[0].split(' ');
	                for (var i = 3; i < mline.length; i++) {
	                    // find all codecs from mline[3..]
	                    var pt = mline[i];
	                    var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
	                    if (rtpmapline) {
	                        var codec = SDPUtils.parseRtpMap(rtpmapline);
	                        var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
	                        // Only the first a=fmtp:<pt> is considered.
	                        codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
	                        codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
	                        description.codecs.push(codec);
	                        // parse FEC mechanisms from rtpmap lines.
	                        switch (codec.name.toUpperCase()) {
	                            case 'RED':
	                            case 'ULPFEC':
	                                description.fecMechanisms.push(codec.name.toUpperCase());
	                                break;
	                            default:
	                                // only RED and ULPFEC are recognized as FEC mechanisms.
	                                break;
	                        }
	                    }
	                }
	                SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
	                    description.headerExtensions.push(SDPUtils.parseExtmap(line));
	                });
	                // FIXME: parse rtcp.
	                return description;
	            };

	            // Generates parts of the SDP media section describing the capabilities /
	            // parameters.
	            SDPUtils.writeRtpDescription = function (kind, caps) {
	                var sdp = '';

	                // Build the mline.
	                sdp += 'm=' + kind + ' ';
	                sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
	                sdp += ' UDP/TLS/RTP/SAVPF ';
	                sdp += caps.codecs.map(function (codec) {
	                    if (codec.preferredPayloadType !== undefined) {
	                        return codec.preferredPayloadType;
	                    }
	                    return codec.payloadType;
	                }).join(' ') + '\r\n';

	                sdp += 'c=IN IP4 0.0.0.0\r\n';
	                sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

	                // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
	                caps.codecs.forEach(function (codec) {
	                    sdp += SDPUtils.writeRtpMap(codec);
	                    sdp += SDPUtils.writeFmtp(codec);
	                    sdp += SDPUtils.writeRtcpFb(codec);
	                });
	                // FIXME: add headerExtensions, fecMechanismş and rtcp.
	                sdp += 'a=rtcp-mux\r\n';
	                return sdp;
	            };

	            // Parses the SDP media section and returns an array of
	            // RTCRtpEncodingParameters.
	            SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
	                var encodingParameters = [];
	                var description = SDPUtils.parseRtpParameters(mediaSection);
	                var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
	                var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

	                // filter a=ssrc:... cname:, ignore PlanB-msid
	                var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
	                    return SDPUtils.parseSsrcMedia(line);
	                }).filter(function (parts) {
	                    return parts.attribute === 'cname';
	                });
	                var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
	                var secondarySsrc;

	                var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
	                    var parts = line.split(' ');
	                    parts.shift();
	                    return parts.map(function (part) {
	                        return parseInt(part, 10);
	                    });
	                });
	                if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
	                    secondarySsrc = flows[0][1];
	                }

	                description.codecs.forEach(function (codec) {
	                    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
	                        var encParam = {
	                            ssrc: primarySsrc,
	                            codecPayloadType: parseInt(codec.parameters.apt, 10),
	                            rtx: {
	                                payloadType: codec.payloadType,
	                                ssrc: secondarySsrc
	                            }
	                        };
	                        encodingParameters.push(encParam);
	                        if (hasRed) {
	                            encParam = JSON.parse(JSON.stringify(encParam));
	                            encParam.fec = {
	                                ssrc: secondarySsrc,
	                                mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
	                            };
	                            encodingParameters.push(encParam);
	                        }
	                    }
	                });
	                if (encodingParameters.length === 0 && primarySsrc) {
	                    encodingParameters.push({
	                        ssrc: primarySsrc
	                    });
	                }

	                // we support both b=AS and b=TIAS but interpret AS as TIAS.
	                var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
	                if (bandwidth.length) {
	                    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
	                        bandwidth = parseInt(bandwidth[0].substr(7), 10);
	                    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
	                        bandwidth = parseInt(bandwidth[0].substr(5), 10);
	                    }
	                    encodingParameters.forEach(function (params) {
	                        params.maxBitrate = bandwidth;
	                    });
	                }
	                return encodingParameters;
	            };

	            SDPUtils.writeSessionBoilerplate = function () {
	                // FIXME: sess-id should be an NTP timestamp.
	                return 'v=0\r\n' + 'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
	            };

	            SDPUtils.writeMediaSection = function (transceiver, caps, type, stream) {
	                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

	                // Map ICE parameters (ufrag, pwd) to SDP.
	                sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());

	                // Map DTLS parameters to SDP.
	                sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : 'active');

	                sdp += 'a=mid:' + transceiver.mid + '\r\n';

	                if (transceiver.rtpSender && transceiver.rtpReceiver) {
	                    sdp += 'a=sendrecv\r\n';
	                } else if (transceiver.rtpSender) {
	                    sdp += 'a=sendonly\r\n';
	                } else if (transceiver.rtpReceiver) {
	                    sdp += 'a=recvonly\r\n';
	                } else {
	                    sdp += 'a=inactive\r\n';
	                }

	                // FIXME: for RTX there might be multiple SSRCs. Not implemented in Edge yet.
	                if (transceiver.rtpSender) {
	                    var msid = 'msid:' + stream.id + ' ' + transceiver.rtpSender.track.id + '\r\n';
	                    sdp += 'a=' + msid;
	                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid;
	                }
	                // FIXME: this should be written by writeRtpDescription.
	                sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
	                return sdp;
	            };

	            // Gets the direction from the mediaSection or the sessionpart.
	            SDPUtils.getDirection = function (mediaSection, sessionpart) {
	                // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
	                var lines = SDPUtils.splitLines(mediaSection);
	                for (var i = 0; i < lines.length; i++) {
	                    switch (lines[i]) {
	                        case 'a=sendrecv':
	                        case 'a=sendonly':
	                        case 'a=recvonly':
	                        case 'a=inactive':
	                            return lines[i].substr(2);
	                        default:
	                        // FIXME: What should happen here?
	                    }
	                }
	                if (sessionpart) {
	                    return SDPUtils.getDirection(sessionpart);
	                }
	                return 'sendrecv';
	            };

	            // Expose public methods.
	            module.exports = SDPUtils;
	        }, {}], 2: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            // Shimming starts here.
	            (function () {
	                // Utils.
	                var logging = require('./utils').log;
	                var browserDetails = require('./utils').browserDetails;
	                // Export to the adapter global object visible in the browser.
	                module.exports.browserDetails = browserDetails;
	                module.exports.extractVersion = require('./utils').extractVersion;
	                module.exports.disableLog = require('./utils').disableLog;

	                // Uncomment the line below if you want logging to occur, including logging
	                // for the switch statement below. Can also be turned on in the browser via
	                // adapter.disableLog(false), but then logging from the switch statement below
	                // will not appear.
	                // require('./utils').disableLog(false);

	                // Browser shims.
	                var chromeShim = require('./chrome/chrome_shim') || null;
	                var edgeShim = require('./edge/edge_shim') || null;
	                var firefoxShim = require('./firefox/firefox_shim') || null;
	                var safariShim = require('./safari/safari_shim') || null;

	                // Shim browser if found.
	                switch (browserDetails.browser) {
	                    case 'opera': // fallthrough as it uses chrome shims
	                    case 'chrome':
	                        if (!chromeShim || !chromeShim.shimPeerConnection) {
	                            logging('Chrome shim is not included in this adapter release.');
	                            return;
	                        }
	                        logging('adapter.js shimming chrome.');
	                        // Export to the adapter global object visible in the browser.
	                        module.exports.browserShim = chromeShim;

	                        chromeShim.shimGetUserMedia();
	                        chromeShim.shimMediaStream();
	                        chromeShim.shimSourceObject();
	                        chromeShim.shimPeerConnection();
	                        chromeShim.shimOnTrack();
	                        break;
	                    case 'firefox':
	                        if (!firefoxShim || !firefoxShim.shimPeerConnection) {
	                            logging('Firefox shim is not included in this adapter release.');
	                            return;
	                        }
	                        logging('adapter.js shimming firefox.');
	                        // Export to the adapter global object visible in the browser.
	                        module.exports.browserShim = firefoxShim;

	                        firefoxShim.shimGetUserMedia();
	                        firefoxShim.shimSourceObject();
	                        firefoxShim.shimPeerConnection();
	                        firefoxShim.shimOnTrack();
	                        break;
	                    case 'edge':
	                        if (!edgeShim || !edgeShim.shimPeerConnection) {
	                            logging('MS edge shim is not included in this adapter release.');
	                            return;
	                        }
	                        logging('adapter.js shimming edge.');
	                        // Export to the adapter global object visible in the browser.
	                        module.exports.browserShim = edgeShim;

	                        edgeShim.shimGetUserMedia();
	                        edgeShim.shimPeerConnection();
	                        break;
	                    case 'safari':
	                        if (!safariShim) {
	                            logging('Safari shim is not included in this adapter release.');
	                            return;
	                        }
	                        logging('adapter.js shimming safari.');
	                        // Export to the adapter global object visible in the browser.
	                        module.exports.browserShim = safariShim;

	                        safariShim.shimGetUserMedia();
	                        break;
	                    default:
	                        logging('Unsupported browser!');
	                }
	            })();
	        }, { "./chrome/chrome_shim": 3, "./edge/edge_shim": 5, "./firefox/firefox_shim": 7, "./safari/safari_shim": 9, "./utils": 10 }], 3: [function (require, module, exports) {

	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            var logging = require('../utils.js').log;
	            var browserDetails = require('../utils.js').browserDetails;

	            var chromeShim = {
	                shimMediaStream: function shimMediaStream() {
	                    window.MediaStream = window.MediaStream || window.webkitMediaStream;
	                },

	                shimOnTrack: function shimOnTrack() {
	                    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
	                        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	                            get: function get() {
	                                return this._ontrack;
	                            },
	                            set: function set(f) {
	                                var self = this;
	                                if (this._ontrack) {
	                                    this.removeEventListener('track', this._ontrack);
	                                    this.removeEventListener('addstream', this._ontrackpoly);
	                                }
	                                this.addEventListener('track', this._ontrack = f);
	                                this.addEventListener('addstream', this._ontrackpoly = function (e) {
	                                    // onaddstream does not fire when a track is added to an existing
	                                    // stream. But stream.onaddtrack is implemented so we use that.
	                                    e.stream.addEventListener('addtrack', function (te) {
	                                        var event = new Event('track');
	                                        event.track = te.track;
	                                        event.receiver = { track: te.track };
	                                        event.streams = [e.stream];
	                                        self.dispatchEvent(event);
	                                    });
	                                    e.stream.getTracks().forEach(function (track) {
	                                        var event = new Event('track');
	                                        event.track = track;
	                                        event.receiver = { track: track };
	                                        event.streams = [e.stream];
	                                        this.dispatchEvent(event);
	                                    }.bind(this));
	                                }.bind(this));
	                            }
	                        });
	                    }
	                },

	                shimSourceObject: function shimSourceObject() {
	                    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	                        if (window.HTMLMediaElement && !('srcObject' in window.HTMLMediaElement.prototype)) {
	                            // Shim the srcObject property, once, when HTMLMediaElement is found.
	                            Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	                                get: function get() {
	                                    return this._srcObject;
	                                },
	                                set: function set(stream) {
	                                    var self = this;
	                                    // Use _srcObject as a private property for this shim
	                                    this._srcObject = stream;
	                                    if (this.src) {
	                                        URL.revokeObjectURL(this.src);
	                                    }

	                                    if (!stream) {
	                                        this.src = '';
	                                        return;
	                                    }
	                                    this.src = URL.createObjectURL(stream);
	                                    // We need to recreate the blob url when a track is added or
	                                    // removed. Doing it manually since we want to avoid a recursion.
	                                    stream.addEventListener('addtrack', function () {
	                                        if (self.src) {
	                                            URL.revokeObjectURL(self.src);
	                                        }
	                                        self.src = URL.createObjectURL(stream);
	                                    });
	                                    stream.addEventListener('removetrack', function () {
	                                        if (self.src) {
	                                            URL.revokeObjectURL(self.src);
	                                        }
	                                        self.src = URL.createObjectURL(stream);
	                                    });
	                                }
	                            });
	                        }
	                    }
	                },

	                shimPeerConnection: function shimPeerConnection() {
	                    // The RTCPeerConnection object.
	                    window.RTCPeerConnection = function (pcConfig, pcConstraints) {
	                        // Translate iceTransportPolicy to iceTransports,
	                        // see https://code.google.com/p/webrtc/issues/detail?id=4869
	                        logging('PeerConnection');
	                        if (pcConfig && pcConfig.iceTransportPolicy) {
	                            pcConfig.iceTransports = pcConfig.iceTransportPolicy;
	                        }

	                        var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
	                        var origGetStats = pc.getStats.bind(pc);
	                        pc.getStats = function (selector, successCallback, errorCallback) {
	                            var self = this;
	                            var args = arguments;

	                            // If selector is a function then we are in the old style stats so just
	                            // pass back the original getStats format to avoid breaking old users.
	                            if (arguments.length > 0 && typeof selector === 'function') {
	                                return origGetStats(selector, successCallback);
	                            }

	                            var fixChromeStats_ = function fixChromeStats_(response) {
	                                var standardReport = {};
	                                var reports = response.result();
	                                reports.forEach(function (report) {
	                                    var standardStats = {
	                                        id: report.id,
	                                        timestamp: report.timestamp,
	                                        type: report.type
	                                    };
	                                    report.names().forEach(function (name) {
	                                        standardStats[name] = report.stat(name);
	                                    });
	                                    standardReport[standardStats.id] = standardStats;
	                                });

	                                return standardReport;
	                            };

	                            // shim getStats with maplike support
	                            var makeMapStats = function makeMapStats(stats, legacyStats) {
	                                var map = new Map(Object.keys(stats).map(function (key) {
	                                    return [key, stats[key]];
	                                }));
	                                legacyStats = legacyStats || stats;
	                                Object.keys(legacyStats).forEach(function (key) {
	                                    map[key] = legacyStats[key];
	                                });
	                                return map;
	                            };

	                            if (arguments.length >= 2) {
	                                var successCallbackWrapper_ = function successCallbackWrapper_(response) {
	                                    args[1](makeMapStats(fixChromeStats_(response)));
	                                };

	                                return origGetStats.apply(this, [successCallbackWrapper_, arguments[0]]);
	                            }

	                            // promise-support
	                            return new Promise(function (resolve, reject) {
	                                if (args.length === 1 && (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object') {
	                                    origGetStats.apply(self, [function (response) {
	                                        resolve(makeMapStats(fixChromeStats_(response)));
	                                    }, reject]);
	                                } else {
	                                    // Preserve legacy chrome stats only on legacy access of stats obj
	                                    origGetStats.apply(self, [function (response) {
	                                        resolve(makeMapStats(fixChromeStats_(response), response.result()));
	                                    }, reject]);
	                                }
	                            }).then(successCallback, errorCallback);
	                        };

	                        return pc;
	                    };
	                    window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;

	                    // wrap static methods. Currently just generateCertificate.
	                    if (webkitRTCPeerConnection.generateCertificate) {
	                        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	                            get: function get() {
	                                return webkitRTCPeerConnection.generateCertificate;
	                            }
	                        });
	                    }

	                    ['createOffer', 'createAnswer'].forEach(function (method) {
	                        var nativeMethod = webkitRTCPeerConnection.prototype[method];
	                        webkitRTCPeerConnection.prototype[method] = function () {
	                            var self = this;
	                            if (arguments.length < 1 || arguments.length === 1 && _typeof(arguments[0]) === 'object') {
	                                var opts = arguments.length === 1 ? arguments[0] : undefined;
	                                return new Promise(function (resolve, reject) {
	                                    nativeMethod.apply(self, [resolve, reject, opts]);
	                                });
	                            }
	                            return nativeMethod.apply(this, arguments);
	                        };
	                    });

	                    // add promise support -- natively available in Chrome 51
	                    if (browserDetails.version < 51) {
	                        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
	                            var nativeMethod = webkitRTCPeerConnection.prototype[method];
	                            webkitRTCPeerConnection.prototype[method] = function () {
	                                var args = arguments;
	                                var self = this;
	                                var promise = new Promise(function (resolve, reject) {
	                                    nativeMethod.apply(self, [args[0], resolve, reject]);
	                                });
	                                if (args.length < 2) {
	                                    return promise;
	                                }
	                                return promise.then(function () {
	                                    args[1].apply(null, []);
	                                }, function (err) {
	                                    if (args.length >= 3) {
	                                        args[2].apply(null, [err]);
	                                    }
	                                });
	                            };
	                        });
	                    }

	                    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
	                    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
	                        var nativeMethod = webkitRTCPeerConnection.prototype[method];
	                        webkitRTCPeerConnection.prototype[method] = function () {
	                            arguments[0] = new (method === 'addIceCandidate' ? RTCIceCandidate : RTCSessionDescription)(arguments[0]);
	                            return nativeMethod.apply(this, arguments);
	                        };
	                    });

	                    // support for addIceCandidate(null or undefined)
	                    var nativeAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;
	                    RTCPeerConnection.prototype.addIceCandidate = function () {
	                        if (!arguments[0]) {
	                            if (arguments[1]) {
	                                arguments[1].apply(null);
	                            }
	                            return Promise.resolve();
	                        }
	                        return nativeAddIceCandidate.apply(this, arguments);
	                    };
	                }
	            };

	            // Expose public methods.
	            module.exports = {
	                shimMediaStream: chromeShim.shimMediaStream,
	                shimOnTrack: chromeShim.shimOnTrack,
	                shimSourceObject: chromeShim.shimSourceObject,
	                shimPeerConnection: chromeShim.shimPeerConnection,
	                shimGetUserMedia: require('./getusermedia')
	            };
	        }, { "../utils.js": 10, "./getusermedia": 4 }], 4: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            var logging = require('../utils.js').log;

	            // Expose public methods.
	            module.exports = function () {
	                var constraintsToChrome_ = function constraintsToChrome_(c) {
	                    if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
	                        return c;
	                    }
	                    var cc = {};
	                    Object.keys(c).forEach(function (key) {
	                        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	                            return;
	                        }
	                        var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
	                        if (r.exact !== undefined && typeof r.exact === 'number') {
	                            r.min = r.max = r.exact;
	                        }
	                        var oldname_ = function oldname_(prefix, name) {
	                            if (prefix) {
	                                return prefix + name.charAt(0).toUpperCase() + name.slice(1);
	                            }
	                            return name === 'deviceId' ? 'sourceId' : name;
	                        };
	                        if (r.ideal !== undefined) {
	                            cc.optional = cc.optional || [];
	                            var oc = {};
	                            if (typeof r.ideal === 'number') {
	                                oc[oldname_('min', key)] = r.ideal;
	                                cc.optional.push(oc);
	                                oc = {};
	                                oc[oldname_('max', key)] = r.ideal;
	                                cc.optional.push(oc);
	                            } else {
	                                oc[oldname_('', key)] = r.ideal;
	                                cc.optional.push(oc);
	                            }
	                        }
	                        if (r.exact !== undefined && typeof r.exact !== 'number') {
	                            cc.mandatory = cc.mandatory || {};
	                            cc.mandatory[oldname_('', key)] = r.exact;
	                        } else {
	                            ['min', 'max'].forEach(function (mix) {
	                                if (r[mix] !== undefined) {
	                                    cc.mandatory = cc.mandatory || {};
	                                    cc.mandatory[oldname_(mix, key)] = r[mix];
	                                }
	                            });
	                        }
	                    });
	                    if (c.advanced) {
	                        cc.optional = (cc.optional || []).concat(c.advanced);
	                    }
	                    return cc;
	                };

	                var shimConstraints_ = function shimConstraints_(constraints, func) {
	                    constraints = JSON.parse(JSON.stringify(constraints));
	                    if (constraints && constraints.audio) {
	                        constraints.audio = constraintsToChrome_(constraints.audio);
	                    }
	                    if (constraints && _typeof(constraints.video) === 'object') {
	                        // Shim facingMode for mobile, where it defaults to "user".
	                        var face = constraints.video.facingMode;
	                        face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : { ideal: face });

	                        if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode)) {
	                            delete constraints.video.facingMode;
	                            if (face.exact === 'environment' || face.ideal === 'environment') {
	                                // Look for "back" in label, or use last cam (typically back cam).
	                                return navigator.mediaDevices.enumerateDevices().then(function (devices) {
	                                    devices = devices.filter(function (d) {
	                                        return d.kind === 'videoinput';
	                                    });
	                                    var back = devices.find(function (d) {
	                                        return d.label.toLowerCase().indexOf('back') !== -1;
	                                    }) || devices.length && devices[devices.length - 1];
	                                    if (back) {
	                                        constraints.video.deviceId = face.exact ? { exact: back.deviceId } : { ideal: back.deviceId };
	                                    }
	                                    constraints.video = constraintsToChrome_(constraints.video);
	                                    logging('chrome: ' + JSON.stringify(constraints));
	                                    return func(constraints);
	                                });
	                            }
	                        }
	                        constraints.video = constraintsToChrome_(constraints.video);
	                    }
	                    logging('chrome: ' + JSON.stringify(constraints));
	                    return func(constraints);
	                };

	                var shimError_ = function shimError_(e) {
	                    return {
	                        name: {
	                            PermissionDeniedError: 'NotAllowedError',
	                            ConstraintNotSatisfiedError: 'OverconstrainedError'
	                        }[e.name] || e.name,
	                        message: e.message,
	                        constraint: e.constraintName,
	                        toString: function toString() {
	                            return this.name + (this.message && ': ') + this.message;
	                        }
	                    };
	                };

	                var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
	                    shimConstraints_(constraints, function (c) {
	                        navigator.webkitGetUserMedia(c, onSuccess, function (e) {
	                            onError(shimError_(e));
	                        });
	                    });
	                };

	                navigator.getUserMedia = getUserMedia_;

	                // Returns the result of getUserMedia as a Promise.
	                var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
	                    return new Promise(function (resolve, reject) {
	                        navigator.getUserMedia(constraints, resolve, reject);
	                    });
	                };

	                if (!navigator.mediaDevices) {
	                    navigator.mediaDevices = {
	                        getUserMedia: getUserMediaPromise_,
	                        enumerateDevices: function enumerateDevices() {
	                            return new Promise(function (resolve) {
	                                var kinds = { audio: 'audioinput', video: 'videoinput' };
	                                return MediaStreamTrack.getSources(function (devices) {
	                                    resolve(devices.map(function (device) {
	                                        return { label: device.label,
	                                            kind: kinds[device.kind],
	                                            deviceId: device.id,
	                                            groupId: '' };
	                                    }));
	                                });
	                            });
	                        }
	                    };
	                }

	                // A shim for getUserMedia method on the mediaDevices object.
	                // TODO(KaptenJansson) remove once implemented in Chrome stable.
	                if (!navigator.mediaDevices.getUserMedia) {
	                    navigator.mediaDevices.getUserMedia = function (constraints) {
	                        return getUserMediaPromise_(constraints);
	                    };
	                } else {
	                    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
	                    // function which returns a Promise, it does not accept spec-style
	                    // constraints.
	                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	                    navigator.mediaDevices.getUserMedia = function (cs) {
	                        return shimConstraints_(cs, function (c) {
	                            return origGetUserMedia(c).then(function (stream) {
	                                if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
	                                    stream.getTracks().forEach(function (track) {
	                                        track.stop();
	                                    });
	                                    throw new DOMException('', 'NotFoundError');
	                                }
	                                return stream;
	                            }, function (e) {
	                                return Promise.reject(shimError_(e));
	                            });
	                        });
	                    };
	                }

	                // Dummy devicechange event methods.
	                // TODO(KaptenJansson) remove once implemented in Chrome stable.
	                if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
	                    navigator.mediaDevices.addEventListener = function () {
	                        logging('Dummy mediaDevices.addEventListener called.');
	                    };
	                }
	                if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
	                    navigator.mediaDevices.removeEventListener = function () {
	                        logging('Dummy mediaDevices.removeEventListener called.');
	                    };
	                }
	            };
	        }, { "../utils.js": 10 }], 5: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            var SDPUtils = require('sdp');
	            var browserDetails = require('../utils').browserDetails;

	            var edgeShim = {
	                shimPeerConnection: function shimPeerConnection() {
	                    if (window.RTCIceGatherer) {
	                        // ORTC defines an RTCIceCandidate object but no constructor.
	                        // Not implemented in Edge.
	                        if (!window.RTCIceCandidate) {
	                            window.RTCIceCandidate = function (args) {
	                                return args;
	                            };
	                        }
	                        // ORTC does not have a session description object but
	                        // other browsers (i.e. Chrome) that will support both PC and ORTC
	                        // in the future might have this defined already.
	                        if (!window.RTCSessionDescription) {
	                            window.RTCSessionDescription = function (args) {
	                                return args;
	                            };
	                        }
	                        // this adds an additional event listener to MediaStrackTrack that signals
	                        // when a tracks enabled property was changed.
	                        var origMSTEnabled = Object.getOwnPropertyDescriptor(MediaStreamTrack.prototype, 'enabled');
	                        Object.defineProperty(MediaStreamTrack.prototype, 'enabled', {
	                            set: function set(value) {
	                                origMSTEnabled.set.call(this, value);
	                                var ev = new Event('enabled');
	                                ev.enabled = value;
	                                this.dispatchEvent(ev);
	                            }
	                        });
	                    }

	                    window.RTCPeerConnection = function (config) {
	                        var self = this;

	                        var _eventTarget = document.createDocumentFragment();
	                        ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function (method) {
	                            self[method] = _eventTarget[method].bind(_eventTarget);
	                        });

	                        this.onicecandidate = null;
	                        this.onaddstream = null;
	                        this.ontrack = null;
	                        this.onremovestream = null;
	                        this.onsignalingstatechange = null;
	                        this.oniceconnectionstatechange = null;
	                        this.onnegotiationneeded = null;
	                        this.ondatachannel = null;

	                        this.localStreams = [];
	                        this.remoteStreams = [];
	                        this.getLocalStreams = function () {
	                            return self.localStreams;
	                        };
	                        this.getRemoteStreams = function () {
	                            return self.remoteStreams;
	                        };

	                        this.localDescription = new RTCSessionDescription({
	                            type: '',
	                            sdp: ''
	                        });
	                        this.remoteDescription = new RTCSessionDescription({
	                            type: '',
	                            sdp: ''
	                        });
	                        this.signalingState = 'stable';
	                        this.iceConnectionState = 'new';
	                        this.iceGatheringState = 'new';

	                        this.iceOptions = {
	                            gatherPolicy: 'all',
	                            iceServers: []
	                        };
	                        if (config && config.iceTransportPolicy) {
	                            switch (config.iceTransportPolicy) {
	                                case 'all':
	                                case 'relay':
	                                    this.iceOptions.gatherPolicy = config.iceTransportPolicy;
	                                    break;
	                                case 'none':
	                                    // FIXME: remove once implementation and spec have added this.
	                                    throw new TypeError('iceTransportPolicy "none" not supported');
	                                default:
	                                    // don't set iceTransportPolicy.
	                                    break;
	                            }
	                        }
	                        this.usingBundle = config && config.bundlePolicy === 'max-bundle';

	                        if (config && config.iceServers) {
	                            // Edge does not like
	                            // 1) stun:
	                            // 2) turn: that does not have all of turn:host:port?transport=udp
	                            // 3) turn: with ipv6 addresses
	                            var iceServers = JSON.parse(JSON.stringify(config.iceServers));
	                            this.iceOptions.iceServers = iceServers.filter(function (server) {
	                                if (server && server.urls) {
	                                    var urls = server.urls;
	                                    if (typeof urls === 'string') {
	                                        urls = [urls];
	                                    }
	                                    urls = urls.filter(function (url) {
	                                        return url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1 && url.indexOf('turn:[') === -1 || url.indexOf('stun:') === 0 && browserDetails.version >= 14393;
	                                    })[0];
	                                    return !!urls;
	                                }
	                                return false;
	                            });
	                        }
	                        this._config = config;

	                        // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
	                        // everything that is needed to describe a SDP m-line.
	                        this.transceivers = [];

	                        // since the iceGatherer is currently created in createOffer but we
	                        // must not emit candidates until after setLocalDescription we buffer
	                        // them in this array.
	                        this._localIceCandidatesBuffer = [];
	                    };

	                    window.RTCPeerConnection.prototype._emitBufferedCandidates = function () {
	                        var self = this;
	                        var sections = SDPUtils.splitSections(self.localDescription.sdp);
	                        // FIXME: need to apply ice candidates in a way which is async but
	                        // in-order
	                        this._localIceCandidatesBuffer.forEach(function (event) {
	                            var end = !event.candidate || Object.keys(event.candidate).length === 0;
	                            if (end) {
	                                for (var j = 1; j < sections.length; j++) {
	                                    if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
	                                        sections[j] += 'a=end-of-candidates\r\n';
	                                    }
	                                }
	                            } else if (event.candidate.candidate.indexOf('typ endOfCandidates') === -1) {
	                                sections[event.candidate.sdpMLineIndex + 1] += 'a=' + event.candidate.candidate + '\r\n';
	                            }
	                            self.localDescription.sdp = sections.join('');
	                            self.dispatchEvent(event);
	                            if (self.onicecandidate !== null) {
	                                self.onicecandidate(event);
	                            }
	                            if (!event.candidate && self.iceGatheringState !== 'complete') {
	                                var complete = self.transceivers.every(function (transceiver) {
	                                    return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
	                                });
	                                if (complete) {
	                                    self.iceGatheringState = 'complete';
	                                }
	                            }
	                        });
	                        this._localIceCandidatesBuffer = [];
	                    };

	                    window.RTCPeerConnection.prototype.getConfiguration = function () {
	                        return this._config;
	                    };

	                    window.RTCPeerConnection.prototype.addStream = function (stream) {
	                        // Clone is necessary for local demos mostly, attaching directly
	                        // to two different senders does not work (build 10547).
	                        var clonedStream = stream.clone();
	                        stream.getTracks().forEach(function (track, idx) {
	                            var clonedTrack = clonedStream.getTracks()[idx];
	                            track.addEventListener('enabled', function (event) {
	                                clonedTrack.enabled = event.enabled;
	                            });
	                        });
	                        this.localStreams.push(clonedStream);
	                        this._maybeFireNegotiationNeeded();
	                    };

	                    window.RTCPeerConnection.prototype.removeStream = function (stream) {
	                        var idx = this.localStreams.indexOf(stream);
	                        if (idx > -1) {
	                            this.localStreams.splice(idx, 1);
	                            this._maybeFireNegotiationNeeded();
	                        }
	                    };

	                    window.RTCPeerConnection.prototype.getSenders = function () {
	                        return this.transceivers.filter(function (transceiver) {
	                            return !!transceiver.rtpSender;
	                        }).map(function (transceiver) {
	                            return transceiver.rtpSender;
	                        });
	                    };

	                    window.RTCPeerConnection.prototype.getReceivers = function () {
	                        return this.transceivers.filter(function (transceiver) {
	                            return !!transceiver.rtpReceiver;
	                        }).map(function (transceiver) {
	                            return transceiver.rtpReceiver;
	                        });
	                    };

	                    // Determines the intersection of local and remote capabilities.
	                    window.RTCPeerConnection.prototype._getCommonCapabilities = function (localCapabilities, remoteCapabilities) {
	                        var commonCapabilities = {
	                            codecs: [],
	                            headerExtensions: [],
	                            fecMechanisms: []
	                        };
	                        localCapabilities.codecs.forEach(function (lCodec) {
	                            for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
	                                var rCodec = remoteCapabilities.codecs[i];
	                                if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
	                                    // number of channels is the highest common number of channels
	                                    rCodec.numChannels = Math.min(lCodec.numChannels, rCodec.numChannels);
	                                    // push rCodec so we reply with offerer payload type
	                                    commonCapabilities.codecs.push(rCodec);

	                                    // determine common feedback mechanisms
	                                    rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function (fb) {
	                                        for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
	                                            if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
	                                                return true;
	                                            }
	                                        }
	                                        return false;
	                                    });
	                                    // FIXME: also need to determine .parameters
	                                    //  see https://github.com/openpeer/ortc/issues/569
	                                    break;
	                                }
	                            }
	                        });

	                        localCapabilities.headerExtensions.forEach(function (lHeaderExtension) {
	                            for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
	                                var rHeaderExtension = remoteCapabilities.headerExtensions[i];
	                                if (lHeaderExtension.uri === rHeaderExtension.uri) {
	                                    commonCapabilities.headerExtensions.push(rHeaderExtension);
	                                    break;
	                                }
	                            }
	                        });

	                        // FIXME: fecMechanisms
	                        return commonCapabilities;
	                    };

	                    // Create ICE gatherer, ICE transport and DTLS transport.
	                    window.RTCPeerConnection.prototype._createIceAndDtlsTransports = function (mid, sdpMLineIndex) {
	                        var self = this;
	                        var iceGatherer = new RTCIceGatherer(self.iceOptions);
	                        var iceTransport = new RTCIceTransport(iceGatherer);
	                        iceGatherer.onlocalcandidate = function (evt) {
	                            var event = new Event('icecandidate');
	                            event.candidate = { sdpMid: mid, sdpMLineIndex: sdpMLineIndex };

	                            var cand = evt.candidate;
	                            var end = !cand || Object.keys(cand).length === 0;
	                            // Edge emits an empty object for RTCIceCandidateComplete‥
	                            if (end) {
	                                // polyfill since RTCIceGatherer.state is not implemented in
	                                // Edge 10547 yet.
	                                if (iceGatherer.state === undefined) {
	                                    iceGatherer.state = 'completed';
	                                }

	                                // Emit a candidate with type endOfCandidates to make the samples
	                                // work. Edge requires addIceCandidate with this empty candidate
	                                // to start checking. The real solution is to signal
	                                // end-of-candidates to the other side when getting the null
	                                // candidate but some apps (like the samples) don't do that.
	                                event.candidate.candidate = 'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates';
	                            } else {
	                                // RTCIceCandidate doesn't have a component, needs to be added
	                                cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
	                                event.candidate.candidate = SDPUtils.writeCandidate(cand);
	                            }

	                            // update local description.
	                            var sections = SDPUtils.splitSections(self.localDescription.sdp);
	                            if (event.candidate.candidate.indexOf('typ endOfCandidates') === -1) {
	                                sections[event.candidate.sdpMLineIndex + 1] += 'a=' + event.candidate.candidate + '\r\n';
	                            } else {
	                                sections[event.candidate.sdpMLineIndex + 1] += 'a=end-of-candidates\r\n';
	                            }
	                            self.localDescription.sdp = sections.join('');

	                            var complete = self.transceivers.every(function (transceiver) {
	                                return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
	                            });

	                            // Emit candidate if localDescription is set.
	                            // Also emits null candidate when all gatherers are complete.
	                            switch (self.iceGatheringState) {
	                                case 'new':
	                                    self._localIceCandidatesBuffer.push(event);
	                                    if (end && complete) {
	                                        self._localIceCandidatesBuffer.push(new Event('icecandidate'));
	                                    }
	                                    break;
	                                case 'gathering':
	                                    self._emitBufferedCandidates();
	                                    self.dispatchEvent(event);
	                                    if (self.onicecandidate !== null) {
	                                        self.onicecandidate(event);
	                                    }
	                                    if (complete) {
	                                        self.dispatchEvent(new Event('icecandidate'));
	                                        if (self.onicecandidate !== null) {
	                                            self.onicecandidate(new Event('icecandidate'));
	                                        }
	                                        self.iceGatheringState = 'complete';
	                                    }
	                                    break;
	                                case 'complete':
	                                    // should not happen... currently!
	                                    break;
	                                default:
	                                    // no-op.
	                                    break;
	                            }
	                        };
	                        iceTransport.onicestatechange = function () {
	                            self._updateConnectionState();
	                        };

	                        var dtlsTransport = new RTCDtlsTransport(iceTransport);
	                        dtlsTransport.ondtlsstatechange = function () {
	                            self._updateConnectionState();
	                        };
	                        dtlsTransport.onerror = function () {
	                            // onerror does not set state to failed by itself.
	                            dtlsTransport.state = 'failed';
	                            self._updateConnectionState();
	                        };

	                        return {
	                            iceGatherer: iceGatherer,
	                            iceTransport: iceTransport,
	                            dtlsTransport: dtlsTransport
	                        };
	                    };

	                    // Start the RTP Sender and Receiver for a transceiver.
	                    window.RTCPeerConnection.prototype._transceive = function (transceiver, send, recv) {
	                        var params = this._getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
	                        if (send && transceiver.rtpSender) {
	                            params.encodings = transceiver.sendEncodingParameters;
	                            params.rtcp = {
	                                cname: SDPUtils.localCName
	                            };
	                            if (transceiver.recvEncodingParameters.length) {
	                                params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
	                            }
	                            transceiver.rtpSender.send(params);
	                        }
	                        if (recv && transceiver.rtpReceiver) {
	                            // remove RTX field in Edge 14942
	                            if (transceiver.kind === 'video' && transceiver.recvEncodingParameters) {
	                                transceiver.recvEncodingParameters.forEach(function (p) {
	                                    delete p.rtx;
	                                });
	                            }
	                            params.encodings = transceiver.recvEncodingParameters;
	                            params.rtcp = {
	                                cname: transceiver.cname
	                            };
	                            if (transceiver.sendEncodingParameters.length) {
	                                params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
	                            }
	                            transceiver.rtpReceiver.receive(params);
	                        }
	                    };

	                    window.RTCPeerConnection.prototype.setLocalDescription = function (description) {
	                        var self = this;
	                        var sections;
	                        var sessionpart;
	                        if (description.type === 'offer') {
	                            // FIXME: What was the purpose of this empty if statement?
	                            // if (!this._pendingOffer) {
	                            // } else {
	                            if (this._pendingOffer) {
	                                // VERY limited support for SDP munging. Limited to:
	                                // * changing the order of codecs
	                                sections = SDPUtils.splitSections(description.sdp);
	                                sessionpart = sections.shift();
	                                sections.forEach(function (mediaSection, sdpMLineIndex) {
	                                    var caps = SDPUtils.parseRtpParameters(mediaSection);
	                                    self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
	                                });
	                                this.transceivers = this._pendingOffer;
	                                delete this._pendingOffer;
	                            }
	                        } else if (description.type === 'answer') {
	                            sections = SDPUtils.splitSections(self.remoteDescription.sdp);
	                            sessionpart = sections.shift();
	                            var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
	                            sections.forEach(function (mediaSection, sdpMLineIndex) {
	                                var transceiver = self.transceivers[sdpMLineIndex];
	                                var iceGatherer = transceiver.iceGatherer;
	                                var iceTransport = transceiver.iceTransport;
	                                var dtlsTransport = transceiver.dtlsTransport;
	                                var localCapabilities = transceiver.localCapabilities;
	                                var remoteCapabilities = transceiver.remoteCapabilities;

	                                var rejected = mediaSection.split('\n', 1)[0].split(' ', 2)[1] === '0';

	                                if (!rejected && !transceiver.isDatachannel) {
	                                    var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
	                                    if (isIceLite) {
	                                        var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function (cand) {
	                                            return SDPUtils.parseCandidate(cand);
	                                        }).filter(function (cand) {
	                                            return cand.component === '1';
	                                        });
	                                        // ice-lite only includes host candidates in the SDP so we can
	                                        // use setRemoteCandidates (which implies an
	                                        // RTCIceCandidateComplete)
	                                        if (cands.length) {
	                                            iceTransport.setRemoteCandidates(cands);
	                                        }
	                                    }
	                                    var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
	                                    if (isIceLite) {
	                                        remoteDtlsParameters.role = 'server';
	                                    }

	                                    if (!self.usingBundle || sdpMLineIndex === 0) {
	                                        iceTransport.start(iceGatherer, remoteIceParameters, isIceLite ? 'controlling' : 'controlled');
	                                        dtlsTransport.start(remoteDtlsParameters);
	                                    }

	                                    // Calculate intersection of capabilities.
	                                    var params = self._getCommonCapabilities(localCapabilities, remoteCapabilities);

	                                    // Start the RTCRtpSender. The RTCRtpReceiver for this
	                                    // transceiver has already been started in setRemoteDescription.
	                                    self._transceive(transceiver, params.codecs.length > 0, false);
	                                }
	                            });
	                        }

	                        this.localDescription = {
	                            type: description.type,
	                            sdp: description.sdp
	                        };
	                        switch (description.type) {
	                            case 'offer':
	                                this._updateSignalingState('have-local-offer');
	                                break;
	                            case 'answer':
	                                this._updateSignalingState('stable');
	                                break;
	                            default:
	                                throw new TypeError('unsupported type "' + description.type + '"');
	                        }

	                        // If a success callback was provided, emit ICE candidates after it
	                        // has been executed. Otherwise, emit callback after the Promise is
	                        // resolved.
	                        var hasCallback = arguments.length > 1 && typeof arguments[1] === 'function';
	                        if (hasCallback) {
	                            var cb = arguments[1];
	                            window.setTimeout(function () {
	                                cb();
	                                if (self.iceGatheringState === 'new') {
	                                    self.iceGatheringState = 'gathering';
	                                }
	                                self._emitBufferedCandidates();
	                            }, 0);
	                        }
	                        var p = Promise.resolve();
	                        p.then(function () {
	                            if (!hasCallback) {
	                                if (self.iceGatheringState === 'new') {
	                                    self.iceGatheringState = 'gathering';
	                                }
	                                // Usually candidates will be emitted earlier.
	                                window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
	                            }
	                        });
	                        return p;
	                    };

	                    window.RTCPeerConnection.prototype.setRemoteDescription = function (description) {
	                        var self = this;
	                        var stream = new MediaStream();
	                        var receiverList = [];
	                        var sections = SDPUtils.splitSections(description.sdp);
	                        var sessionpart = sections.shift();
	                        var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
	                        this.usingBundle = SDPUtils.matchPrefix(sessionpart, 'a=group:BUNDLE ').length > 0;
	                        sections.forEach(function (mediaSection, sdpMLineIndex) {
	                            var lines = SDPUtils.splitLines(mediaSection);
	                            var mline = lines[0].substr(2).split(' ');
	                            var kind = mline[0];
	                            var rejected = mline[1] === '0';
	                            var direction = SDPUtils.getDirection(mediaSection, sessionpart);

	                            var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:');
	                            if (mid.length) {
	                                mid = mid[0].substr(6);
	                            } else {
	                                mid = SDPUtils.generateIdentifier();
	                            }

	                            // Reject datachannels which are not implemented yet.
	                            if (kind === 'application' && mline[2] === 'DTLS/SCTP') {
	                                self.transceivers[sdpMLineIndex] = {
	                                    mid: mid,
	                                    isDatachannel: true
	                                };
	                                return;
	                            }

	                            var transceiver;
	                            var iceGatherer;
	                            var iceTransport;
	                            var dtlsTransport;
	                            var rtpSender;
	                            var rtpReceiver;
	                            var sendEncodingParameters;
	                            var recvEncodingParameters;
	                            var localCapabilities;

	                            var track;
	                            // FIXME: ensure the mediaSection has rtcp-mux set.
	                            var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
	                            var remoteIceParameters;
	                            var remoteDtlsParameters;
	                            if (!rejected) {
	                                remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
	                                remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
	                                remoteDtlsParameters.role = 'client';
	                            }
	                            recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);

	                            var cname;
	                            // Gets the first SSRC. Note that with RTX there might be multiple
	                            // SSRCs.
	                            var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
	                                return SDPUtils.parseSsrcMedia(line);
	                            }).filter(function (obj) {
	                                return obj.attribute === 'cname';
	                            })[0];
	                            if (remoteSsrc) {
	                                cname = remoteSsrc.value;
	                            }

	                            var isComplete = SDPUtils.matchPrefix(mediaSection, 'a=end-of-candidates', sessionpart).length > 0;
	                            var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function (cand) {
	                                return SDPUtils.parseCandidate(cand);
	                            }).filter(function (cand) {
	                                return cand.component === '1';
	                            });
	                            if (description.type === 'offer' && !rejected) {
	                                var transports = self.usingBundle && sdpMLineIndex > 0 ? {
	                                    iceGatherer: self.transceivers[0].iceGatherer,
	                                    iceTransport: self.transceivers[0].iceTransport,
	                                    dtlsTransport: self.transceivers[0].dtlsTransport
	                                } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

	                                if (isComplete) {
	                                    transports.iceTransport.setRemoteCandidates(cands);
	                                }

	                                localCapabilities = RTCRtpReceiver.getCapabilities(kind);

	                                // filter RTX until additional stuff needed for RTX is implemented
	                                // in adapter.js
	                                localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
	                                    return codec.name !== 'rtx';
	                                });

	                                sendEncodingParameters = [{
	                                    ssrc: (2 * sdpMLineIndex + 2) * 1001
	                                }];

	                                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);

	                                track = rtpReceiver.track;
	                                receiverList.push([track, rtpReceiver]);
	                                // FIXME: not correct when there are multiple streams but that is
	                                // not currently supported in this shim.
	                                stream.addTrack(track);

	                                // FIXME: look at direction.
	                                if (self.localStreams.length > 0 && self.localStreams[0].getTracks().length >= sdpMLineIndex) {
	                                    var localTrack;
	                                    if (kind === 'audio') {
	                                        localTrack = self.localStreams[0].getAudioTracks()[0];
	                                    } else if (kind === 'video') {
	                                        localTrack = self.localStreams[0].getVideoTracks()[0];
	                                    }
	                                    if (localTrack) {
	                                        rtpSender = new RTCRtpSender(localTrack, transports.dtlsTransport);
	                                    }
	                                }

	                                self.transceivers[sdpMLineIndex] = {
	                                    iceGatherer: transports.iceGatherer,
	                                    iceTransport: transports.iceTransport,
	                                    dtlsTransport: transports.dtlsTransport,
	                                    localCapabilities: localCapabilities,
	                                    remoteCapabilities: remoteCapabilities,
	                                    rtpSender: rtpSender,
	                                    rtpReceiver: rtpReceiver,
	                                    kind: kind,
	                                    mid: mid,
	                                    cname: cname,
	                                    sendEncodingParameters: sendEncodingParameters,
	                                    recvEncodingParameters: recvEncodingParameters
	                                };
	                                // Start the RTCRtpReceiver now. The RTPSender is started in
	                                // setLocalDescription.
	                                self._transceive(self.transceivers[sdpMLineIndex], false, direction === 'sendrecv' || direction === 'sendonly');
	                            } else if (description.type === 'answer' && !rejected) {
	                                transceiver = self.transceivers[sdpMLineIndex];
	                                iceGatherer = transceiver.iceGatherer;
	                                iceTransport = transceiver.iceTransport;
	                                dtlsTransport = transceiver.dtlsTransport;
	                                rtpSender = transceiver.rtpSender;
	                                rtpReceiver = transceiver.rtpReceiver;
	                                sendEncodingParameters = transceiver.sendEncodingParameters;
	                                localCapabilities = transceiver.localCapabilities;

	                                self.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
	                                self.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
	                                self.transceivers[sdpMLineIndex].cname = cname;

	                                if ((isIceLite || isComplete) && cands.length) {
	                                    iceTransport.setRemoteCandidates(cands);
	                                }
	                                if (!self.usingBundle || sdpMLineIndex === 0) {
	                                    iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
	                                    dtlsTransport.start(remoteDtlsParameters);
	                                }

	                                self._transceive(transceiver, direction === 'sendrecv' || direction === 'recvonly', direction === 'sendrecv' || direction === 'sendonly');

	                                if (rtpReceiver && (direction === 'sendrecv' || direction === 'sendonly')) {
	                                    track = rtpReceiver.track;
	                                    receiverList.push([track, rtpReceiver]);
	                                    stream.addTrack(track);
	                                } else {
	                                    // FIXME: actually the receiver should be created later.
	                                    delete transceiver.rtpReceiver;
	                                }
	                            }
	                        });

	                        this.remoteDescription = {
	                            type: description.type,
	                            sdp: description.sdp
	                        };
	                        switch (description.type) {
	                            case 'offer':
	                                this._updateSignalingState('have-remote-offer');
	                                break;
	                            case 'answer':
	                                this._updateSignalingState('stable');
	                                break;
	                            default:
	                                throw new TypeError('unsupported type "' + description.type + '"');
	                        }
	                        if (stream.getTracks().length) {
	                            self.remoteStreams.push(stream);
	                            window.setTimeout(function () {
	                                var event = new Event('addstream');
	                                event.stream = stream;
	                                self.dispatchEvent(event);
	                                if (self.onaddstream !== null) {
	                                    window.setTimeout(function () {
	                                        self.onaddstream(event);
	                                    }, 0);
	                                }

	                                receiverList.forEach(function (item) {
	                                    var track = item[0];
	                                    var receiver = item[1];
	                                    var trackEvent = new Event('track');
	                                    trackEvent.track = track;
	                                    trackEvent.receiver = receiver;
	                                    trackEvent.streams = [stream];
	                                    self.dispatchEvent(event);
	                                    if (self.ontrack !== null) {
	                                        window.setTimeout(function () {
	                                            self.ontrack(trackEvent);
	                                        }, 0);
	                                    }
	                                });
	                            }, 0);
	                        }
	                        if (arguments.length > 1 && typeof arguments[1] === 'function') {
	                            window.setTimeout(arguments[1], 0);
	                        }
	                        return Promise.resolve();
	                    };

	                    window.RTCPeerConnection.prototype.close = function () {
	                        this.transceivers.forEach(function (transceiver) {
	                            /* not yet
	                            if (transceiver.iceGatherer) {
	                              transceiver.iceGatherer.close();
	                            }
	                            */
	                            if (transceiver.iceTransport) {
	                                transceiver.iceTransport.stop();
	                            }
	                            if (transceiver.dtlsTransport) {
	                                transceiver.dtlsTransport.stop();
	                            }
	                            if (transceiver.rtpSender) {
	                                transceiver.rtpSender.stop();
	                            }
	                            if (transceiver.rtpReceiver) {
	                                transceiver.rtpReceiver.stop();
	                            }
	                        });
	                        // FIXME: clean up tracks, local streams, remote streams, etc
	                        this._updateSignalingState('closed');
	                    };

	                    // Update the signaling state.
	                    window.RTCPeerConnection.prototype._updateSignalingState = function (newState) {
	                        this.signalingState = newState;
	                        var event = new Event('signalingstatechange');
	                        this.dispatchEvent(event);
	                        if (this.onsignalingstatechange !== null) {
	                            this.onsignalingstatechange(event);
	                        }
	                    };

	                    // Determine whether to fire the negotiationneeded event.
	                    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function () {
	                        // Fire away (for now).
	                        var event = new Event('negotiationneeded');
	                        this.dispatchEvent(event);
	                        if (this.onnegotiationneeded !== null) {
	                            this.onnegotiationneeded(event);
	                        }
	                    };

	                    // Update the connection state.
	                    window.RTCPeerConnection.prototype._updateConnectionState = function () {
	                        var self = this;
	                        var newState;
	                        var states = {
	                            'new': 0,
	                            closed: 0,
	                            connecting: 0,
	                            checking: 0,
	                            connected: 0,
	                            completed: 0,
	                            failed: 0
	                        };
	                        this.transceivers.forEach(function (transceiver) {
	                            states[transceiver.iceTransport.state]++;
	                            states[transceiver.dtlsTransport.state]++;
	                        });
	                        // ICETransport.completed and connected are the same for this purpose.
	                        states.connected += states.completed;

	                        newState = 'new';
	                        if (states.failed > 0) {
	                            newState = 'failed';
	                        } else if (states.connecting > 0 || states.checking > 0) {
	                            newState = 'connecting';
	                        } else if (states.disconnected > 0) {
	                            newState = 'disconnected';
	                        } else if (states.new > 0) {
	                            newState = 'new';
	                        } else if (states.connected > 0 || states.completed > 0) {
	                            newState = 'connected';
	                        }

	                        if (newState !== self.iceConnectionState) {
	                            self.iceConnectionState = newState;
	                            var event = new Event('iceconnectionstatechange');
	                            this.dispatchEvent(event);
	                            if (this.oniceconnectionstatechange !== null) {
	                                this.oniceconnectionstatechange(event);
	                            }
	                        }
	                    };

	                    window.RTCPeerConnection.prototype.createOffer = function () {
	                        var self = this;
	                        if (this._pendingOffer) {
	                            throw new Error('createOffer called while there is a pending offer.');
	                        }
	                        var offerOptions;
	                        if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	                            offerOptions = arguments[0];
	                        } else if (arguments.length === 3) {
	                            offerOptions = arguments[2];
	                        }

	                        var tracks = [];
	                        var numAudioTracks = 0;
	                        var numVideoTracks = 0;
	                        // Default to sendrecv.
	                        if (this.localStreams.length) {
	                            numAudioTracks = this.localStreams[0].getAudioTracks().length;
	                            numVideoTracks = this.localStreams[0].getVideoTracks().length;
	                        }
	                        // Determine number of audio and video tracks we need to send/recv.
	                        if (offerOptions) {
	                            // Reject Chrome legacy constraints.
	                            if (offerOptions.mandatory || offerOptions.optional) {
	                                throw new TypeError('Legacy mandatory/optional constraints not supported.');
	                            }
	                            if (offerOptions.offerToReceiveAudio !== undefined) {
	                                numAudioTracks = offerOptions.offerToReceiveAudio;
	                            }
	                            if (offerOptions.offerToReceiveVideo !== undefined) {
	                                numVideoTracks = offerOptions.offerToReceiveVideo;
	                            }
	                        }
	                        if (this.localStreams.length) {
	                            // Push local streams.
	                            this.localStreams[0].getTracks().forEach(function (track) {
	                                tracks.push({
	                                    kind: track.kind,
	                                    track: track,
	                                    wantReceive: track.kind === 'audio' ? numAudioTracks > 0 : numVideoTracks > 0
	                                });
	                                if (track.kind === 'audio') {
	                                    numAudioTracks--;
	                                } else if (track.kind === 'video') {
	                                    numVideoTracks--;
	                                }
	                            });
	                        }
	                        // Create M-lines for recvonly streams.
	                        while (numAudioTracks > 0 || numVideoTracks > 0) {
	                            if (numAudioTracks > 0) {
	                                tracks.push({
	                                    kind: 'audio',
	                                    wantReceive: true
	                                });
	                                numAudioTracks--;
	                            }
	                            if (numVideoTracks > 0) {
	                                tracks.push({
	                                    kind: 'video',
	                                    wantReceive: true
	                                });
	                                numVideoTracks--;
	                            }
	                        }

	                        var sdp = SDPUtils.writeSessionBoilerplate();
	                        var transceivers = [];
	                        tracks.forEach(function (mline, sdpMLineIndex) {
	                            // For each track, create an ice gatherer, ice transport,
	                            // dtls transport, potentially rtpsender and rtpreceiver.
	                            var track = mline.track;
	                            var kind = mline.kind;
	                            var mid = SDPUtils.generateIdentifier();

	                            var transports = self.usingBundle && sdpMLineIndex > 0 ? {
	                                iceGatherer: transceivers[0].iceGatherer,
	                                iceTransport: transceivers[0].iceTransport,
	                                dtlsTransport: transceivers[0].dtlsTransport
	                            } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

	                            var localCapabilities = RTCRtpSender.getCapabilities(kind);
	                            // filter RTX until additional stuff needed for RTX is implemented
	                            // in adapter.js
	                            localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
	                                return codec.name !== 'rtx';
	                            });
	                            localCapabilities.codecs.forEach(function (codec) {
	                                // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
	                                // by adding level-asymmetry-allowed=1
	                                if (codec.name === 'H264' && codec.parameters['level-asymmetry-allowed'] === undefined) {
	                                    codec.parameters['level-asymmetry-allowed'] = '1';
	                                }
	                            });

	                            var rtpSender;
	                            var rtpReceiver;

	                            // generate an ssrc now, to be used later in rtpSender.send
	                            var sendEncodingParameters = [{
	                                ssrc: (2 * sdpMLineIndex + 1) * 1001
	                            }];
	                            if (track) {
	                                rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
	                            }

	                            if (mline.wantReceive) {
	                                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
	                            }

	                            transceivers[sdpMLineIndex] = {
	                                iceGatherer: transports.iceGatherer,
	                                iceTransport: transports.iceTransport,
	                                dtlsTransport: transports.dtlsTransport,
	                                localCapabilities: localCapabilities,
	                                remoteCapabilities: null,
	                                rtpSender: rtpSender,
	                                rtpReceiver: rtpReceiver,
	                                kind: kind,
	                                mid: mid,
	                                sendEncodingParameters: sendEncodingParameters,
	                                recvEncodingParameters: null
	                            };
	                        });
	                        if (this.usingBundle) {
	                            sdp += 'a=group:BUNDLE ' + transceivers.map(function (t) {
	                                return t.mid;
	                            }).join(' ') + '\r\n';
	                        }
	                        tracks.forEach(function (mline, sdpMLineIndex) {
	                            var transceiver = transceivers[sdpMLineIndex];
	                            sdp += SDPUtils.writeMediaSection(transceiver, transceiver.localCapabilities, 'offer', self.localStreams[0]);
	                        });

	                        this._pendingOffer = transceivers;
	                        var desc = new RTCSessionDescription({
	                            type: 'offer',
	                            sdp: sdp
	                        });
	                        if (arguments.length && typeof arguments[0] === 'function') {
	                            window.setTimeout(arguments[0], 0, desc);
	                        }
	                        return Promise.resolve(desc);
	                    };

	                    window.RTCPeerConnection.prototype.createAnswer = function () {
	                        var self = this;

	                        var sdp = SDPUtils.writeSessionBoilerplate();
	                        if (this.usingBundle) {
	                            sdp += 'a=group:BUNDLE ' + this.transceivers.map(function (t) {
	                                return t.mid;
	                            }).join(' ') + '\r\n';
	                        }
	                        this.transceivers.forEach(function (transceiver) {
	                            if (transceiver.isDatachannel) {
	                                sdp += 'm=application 0 DTLS/SCTP 5000\r\n' + 'c=IN IP4 0.0.0.0\r\n' + 'a=mid:' + transceiver.mid + '\r\n';
	                                return;
	                            }
	                            // Calculate intersection of capabilities.
	                            var commonCapabilities = self._getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);

	                            sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities, 'answer', self.localStreams[0]);
	                        });

	                        var desc = new RTCSessionDescription({
	                            type: 'answer',
	                            sdp: sdp
	                        });
	                        if (arguments.length && typeof arguments[0] === 'function') {
	                            window.setTimeout(arguments[0], 0, desc);
	                        }
	                        return Promise.resolve(desc);
	                    };

	                    window.RTCPeerConnection.prototype.addIceCandidate = function (candidate) {
	                        if (!candidate) {
	                            this.transceivers.forEach(function (transceiver) {
	                                transceiver.iceTransport.addRemoteCandidate({});
	                            });
	                        } else {
	                            var mLineIndex = candidate.sdpMLineIndex;
	                            if (candidate.sdpMid) {
	                                for (var i = 0; i < this.transceivers.length; i++) {
	                                    if (this.transceivers[i].mid === candidate.sdpMid) {
	                                        mLineIndex = i;
	                                        break;
	                                    }
	                                }
	                            }
	                            var transceiver = this.transceivers[mLineIndex];
	                            if (transceiver) {
	                                var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {};
	                                // Ignore Chrome's invalid candidates since Edge does not like them.
	                                if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
	                                    return;
	                                }
	                                // Ignore RTCP candidates, we assume RTCP-MUX.
	                                if (cand.component !== '1') {
	                                    return;
	                                }
	                                // A dirty hack to make samples work.
	                                if (cand.type === 'endOfCandidates') {
	                                    cand = {};
	                                }
	                                transceiver.iceTransport.addRemoteCandidate(cand);

	                                // update the remoteDescription.
	                                var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
	                                sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim() : 'a=end-of-candidates') + '\r\n';
	                                this.remoteDescription.sdp = sections.join('');
	                            }
	                        }
	                        if (arguments.length > 1 && typeof arguments[1] === 'function') {
	                            window.setTimeout(arguments[1], 0);
	                        }
	                        return Promise.resolve();
	                    };

	                    window.RTCPeerConnection.prototype.getStats = function () {
	                        var promises = [];
	                        this.transceivers.forEach(function (transceiver) {
	                            ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport', 'dtlsTransport'].forEach(function (method) {
	                                if (transceiver[method]) {
	                                    promises.push(transceiver[method].getStats());
	                                }
	                            });
	                        });
	                        var cb = arguments.length > 1 && typeof arguments[1] === 'function' && arguments[1];
	                        return new Promise(function (resolve) {
	                            // shim getStats with maplike support
	                            var results = new Map();
	                            Promise.all(promises).then(function (res) {
	                                res.forEach(function (result) {
	                                    Object.keys(result).forEach(function (id) {
	                                        results.set(id, result[id]);
	                                        results[id] = result[id];
	                                    });
	                                });
	                                if (cb) {
	                                    window.setTimeout(cb, 0, results);
	                                }
	                                resolve(results);
	                            });
	                        });
	                    };
	                }
	            };

	            // Expose public methods.
	            module.exports = {
	                shimPeerConnection: edgeShim.shimPeerConnection,
	                shimGetUserMedia: require('./getusermedia')
	            };
	        }, { "../utils": 10, "./getusermedia": 6, "sdp": 1 }], 6: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            // Expose public methods.
	            module.exports = function () {
	                var shimError_ = function shimError_(e) {
	                    return {
	                        name: { PermissionDeniedError: 'NotAllowedError' }[e.name] || e.name,
	                        message: e.message,
	                        constraint: e.constraint,
	                        toString: function toString() {
	                            return this.name;
	                        }
	                    };
	                };

	                // getUserMedia error shim.
	                var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	                navigator.mediaDevices.getUserMedia = function (c) {
	                    return origGetUserMedia(c).catch(function (e) {
	                        return Promise.reject(shimError_(e));
	                    });
	                };
	            };
	        }, {}], 7: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            var browserDetails = require('../utils').browserDetails;

	            var firefoxShim = {
	                shimOnTrack: function shimOnTrack() {
	                    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
	                        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	                            get: function get() {
	                                return this._ontrack;
	                            },
	                            set: function set(f) {
	                                if (this._ontrack) {
	                                    this.removeEventListener('track', this._ontrack);
	                                    this.removeEventListener('addstream', this._ontrackpoly);
	                                }
	                                this.addEventListener('track', this._ontrack = f);
	                                this.addEventListener('addstream', this._ontrackpoly = function (e) {
	                                    e.stream.getTracks().forEach(function (track) {
	                                        var event = new Event('track');
	                                        event.track = track;
	                                        event.receiver = { track: track };
	                                        event.streams = [e.stream];
	                                        this.dispatchEvent(event);
	                                    }.bind(this));
	                                }.bind(this));
	                            }
	                        });
	                    }
	                },

	                shimSourceObject: function shimSourceObject() {
	                    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
	                    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	                        if (window.HTMLMediaElement && !('srcObject' in window.HTMLMediaElement.prototype)) {
	                            // Shim the srcObject property, once, when HTMLMediaElement is found.
	                            Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	                                get: function get() {
	                                    return this.mozSrcObject;
	                                },
	                                set: function set(stream) {
	                                    this.mozSrcObject = stream;
	                                }
	                            });
	                        }
	                    }
	                },

	                shimPeerConnection: function shimPeerConnection() {
	                    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
	                        return; // probably media.peerconnection.enabled=false in about:config
	                    }
	                    // The RTCPeerConnection object.
	                    if (!window.RTCPeerConnection) {
	                        window.RTCPeerConnection = function (pcConfig, pcConstraints) {
	                            if (browserDetails.version < 38) {
	                                // .urls is not supported in FF < 38.
	                                // create RTCIceServers with a single url.
	                                if (pcConfig && pcConfig.iceServers) {
	                                    var newIceServers = [];
	                                    for (var i = 0; i < pcConfig.iceServers.length; i++) {
	                                        var server = pcConfig.iceServers[i];
	                                        if (server.hasOwnProperty('urls')) {
	                                            for (var j = 0; j < server.urls.length; j++) {
	                                                var newServer = {
	                                                    url: server.urls[j]
	                                                };
	                                                if (server.urls[j].indexOf('turn') === 0) {
	                                                    newServer.username = server.username;
	                                                    newServer.credential = server.credential;
	                                                }
	                                                newIceServers.push(newServer);
	                                            }
	                                        } else {
	                                            newIceServers.push(pcConfig.iceServers[i]);
	                                        }
	                                    }
	                                    pcConfig.iceServers = newIceServers;
	                                }
	                            }
	                            return new mozRTCPeerConnection(pcConfig, pcConstraints);
	                        };
	                        window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;

	                        // wrap static methods. Currently just generateCertificate.
	                        if (mozRTCPeerConnection.generateCertificate) {
	                            Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	                                get: function get() {
	                                    return mozRTCPeerConnection.generateCertificate;
	                                }
	                            });
	                        }

	                        window.RTCSessionDescription = mozRTCSessionDescription;
	                        window.RTCIceCandidate = mozRTCIceCandidate;
	                    }

	                    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
	                    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
	                        var nativeMethod = RTCPeerConnection.prototype[method];
	                        RTCPeerConnection.prototype[method] = function () {
	                            arguments[0] = new (method === 'addIceCandidate' ? RTCIceCandidate : RTCSessionDescription)(arguments[0]);
	                            return nativeMethod.apply(this, arguments);
	                        };
	                    });

	                    // support for addIceCandidate(null or undefined)
	                    var nativeAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;
	                    RTCPeerConnection.prototype.addIceCandidate = function () {
	                        if (!arguments[0]) {
	                            if (arguments[1]) {
	                                arguments[1].apply(null);
	                            }
	                            return Promise.resolve();
	                        }
	                        return nativeAddIceCandidate.apply(this, arguments);
	                    };

	                    if (browserDetails.version < 48) {
	                        // shim getStats with maplike support
	                        var makeMapStats = function makeMapStats(stats) {
	                            var map = new Map();
	                            Object.keys(stats).forEach(function (key) {
	                                map.set(key, stats[key]);
	                                map[key] = stats[key];
	                            });
	                            return map;
	                        };

	                        var nativeGetStats = RTCPeerConnection.prototype.getStats;
	                        RTCPeerConnection.prototype.getStats = function (selector, onSucc, onErr) {
	                            return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
	                                return makeMapStats(stats);
	                            }).then(onSucc, onErr);
	                        };
	                    }
	                }
	            };

	            // Expose public methods.
	            module.exports = {
	                shimOnTrack: firefoxShim.shimOnTrack,
	                shimSourceObject: firefoxShim.shimSourceObject,
	                shimPeerConnection: firefoxShim.shimPeerConnection,
	                shimGetUserMedia: require('./getusermedia')
	            };
	        }, { "../utils": 10, "./getusermedia": 8 }], 8: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            var logging = require('../utils').log;
	            var browserDetails = require('../utils').browserDetails;

	            // Expose public methods.
	            module.exports = function () {
	                var shimError_ = function shimError_(e) {
	                    return {
	                        name: {
	                            SecurityError: 'NotAllowedError',
	                            PermissionDeniedError: 'NotAllowedError'
	                        }[e.name] || e.name,
	                        message: {
	                            'The operation is insecure.': 'The request is not allowed by the ' + 'user agent or the platform in the current context.'
	                        }[e.message] || e.message,
	                        constraint: e.constraint,
	                        toString: function toString() {
	                            return this.name + (this.message && ': ') + this.message;
	                        }
	                    };
	                };

	                // getUserMedia constraints shim.
	                var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
	                    var constraintsToFF37_ = function constraintsToFF37_(c) {
	                        if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.require) {
	                            return c;
	                        }
	                        var require = [];
	                        Object.keys(c).forEach(function (key) {
	                            if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	                                return;
	                            }
	                            var r = c[key] = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
	                            if (r.min !== undefined || r.max !== undefined || r.exact !== undefined) {
	                                require.push(key);
	                            }
	                            if (r.exact !== undefined) {
	                                if (typeof r.exact === 'number') {
	                                    r.min = r.max = r.exact;
	                                } else {
	                                    c[key] = r.exact;
	                                }
	                                delete r.exact;
	                            }
	                            if (r.ideal !== undefined) {
	                                c.advanced = c.advanced || [];
	                                var oc = {};
	                                if (typeof r.ideal === 'number') {
	                                    oc[key] = { min: r.ideal, max: r.ideal };
	                                } else {
	                                    oc[key] = r.ideal;
	                                }
	                                c.advanced.push(oc);
	                                delete r.ideal;
	                                if (!Object.keys(r).length) {
	                                    delete c[key];
	                                }
	                            }
	                        });
	                        if (require.length) {
	                            c.require = require;
	                        }
	                        return c;
	                    };
	                    constraints = JSON.parse(JSON.stringify(constraints));
	                    if (browserDetails.version < 38) {
	                        logging('spec: ' + JSON.stringify(constraints));
	                        if (constraints.audio) {
	                            constraints.audio = constraintsToFF37_(constraints.audio);
	                        }
	                        if (constraints.video) {
	                            constraints.video = constraintsToFF37_(constraints.video);
	                        }
	                        logging('ff37: ' + JSON.stringify(constraints));
	                    }
	                    return navigator.mozGetUserMedia(constraints, onSuccess, function (e) {
	                        onError(shimError_(e));
	                    });
	                };

	                // Returns the result of getUserMedia as a Promise.
	                var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
	                    return new Promise(function (resolve, reject) {
	                        getUserMedia_(constraints, resolve, reject);
	                    });
	                };

	                // Shim for mediaDevices on older versions.
	                if (!navigator.mediaDevices) {
	                    navigator.mediaDevices = { getUserMedia: getUserMediaPromise_,
	                        addEventListener: function addEventListener() {},
	                        removeEventListener: function removeEventListener() {}
	                    };
	                }
	                navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
	                    return new Promise(function (resolve) {
	                        var infos = [{ kind: 'audioinput', deviceId: 'default', label: '', groupId: '' }, { kind: 'videoinput', deviceId: 'default', label: '', groupId: '' }];
	                        resolve(infos);
	                    });
	                };

	                if (browserDetails.version < 41) {
	                    // Work around http://bugzil.la/1169665
	                    var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
	                    navigator.mediaDevices.enumerateDevices = function () {
	                        return orgEnumerateDevices().then(undefined, function (e) {
	                            if (e.name === 'NotFoundError') {
	                                return [];
	                            }
	                            throw e;
	                        });
	                    };
	                }
	                if (browserDetails.version < 49) {
	                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	                    navigator.mediaDevices.getUserMedia = function (c) {
	                        return origGetUserMedia(c).then(function (stream) {
	                            // Work around https://bugzil.la/802326
	                            if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
	                                stream.getTracks().forEach(function (track) {
	                                    track.stop();
	                                });
	                                throw new DOMException('The object can not be found here.', 'NotFoundError');
	                            }
	                            return stream;
	                        }, function (e) {
	                            return Promise.reject(shimError_(e));
	                        });
	                    };
	                }
	                navigator.getUserMedia = function (constraints, onSuccess, onError) {
	                    if (browserDetails.version < 44) {
	                        return getUserMedia_(constraints, onSuccess, onError);
	                    }
	                    // Replace Firefox 44+'s deprecation warning with unprefixed version.
	                    console.warn('navigator.getUserMedia has been replaced by ' + 'navigator.mediaDevices.getUserMedia');
	                    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
	                };
	            };
	        }, { "../utils": 10 }], 9: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */

	            var safariShim = {
	                // TODO: DrAlex, should be here, double check against LayoutTests
	                // shimOnTrack: function() { },

	                // TODO: once the back-end for the mac port is done, add.
	                // TODO: check for webkitGTK+
	                // shimPeerConnection: function() { },

	                shimGetUserMedia: function shimGetUserMedia() {
	                    navigator.getUserMedia = navigator.webkitGetUserMedia;
	                }
	            };

	            // Expose public methods.
	            module.exports = {
	                shimGetUserMedia: safariShim.shimGetUserMedia
	                // TODO
	                // shimOnTrack: safariShim.shimOnTrack,
	                // shimPeerConnection: safariShim.shimPeerConnection
	            };
	        }, {}], 10: [function (require, module, exports) {
	            /*
	             *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	             *
	             *  Use of this source code is governed by a BSD-style license
	             *  that can be found in the LICENSE file in the root of the source
	             *  tree.
	             */
	            /* eslint-env node */

	            var logDisabled_ = true;

	            // Utility methods.
	            var utils = {
	                disableLog: function disableLog(bool) {
	                    if (typeof bool !== 'boolean') {
	                        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
	                    }
	                    logDisabled_ = bool;
	                    return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
	                },

	                log: function log() {
	                    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	                        if (logDisabled_) {
	                            return;
	                        }
	                        if (typeof console !== 'undefined' && typeof console.log === 'function') {
	                            console.log.apply(console, arguments);
	                        }
	                    }
	                },

	                /**
	                 * Extract browser version out of the provided user agent string.
	                 *
	                 * @param {!string} uastring userAgent string.
	                 * @param {!string} expr Regular expression used as match criteria.
	                 * @param {!number} pos position in the version string to be returned.
	                 * @return {!number} browser version.
	                 */
	                extractVersion: function extractVersion(uastring, expr, pos) {
	                    var match = uastring.match(expr);
	                    return match && match.length >= pos && parseInt(match[pos], 10);
	                },

	                /**
	                 * Browser detector.
	                 *
	                 * @return {object} result containing browser and version
	                 *     properties.
	                 */
	                detectBrowser: function detectBrowser() {
	                    // Returned result object.
	                    var result = {};
	                    result.browser = null;
	                    result.version = null;

	                    // Fail early if it's not a browser
	                    if (typeof window === 'undefined' || !window.navigator) {
	                        result.browser = 'Not a browser.';
	                        return result;
	                    }

	                    // Firefox.
	                    if (navigator.mozGetUserMedia) {
	                        result.browser = 'firefox';
	                        result.version = this.extractVersion(navigator.userAgent, /Firefox\/([0-9]+)\./, 1);

	                        // all webkit-based browsers
	                    } else if (navigator.webkitGetUserMedia) {
	                        // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
	                        if (window.webkitRTCPeerConnection) {
	                            result.browser = 'chrome';
	                            result.version = this.extractVersion(navigator.userAgent, /Chrom(e|ium)\/([0-9]+)\./, 2);

	                            // Safari or unknown webkit-based
	                            // for the time being Safari has support for MediaStreams but not webRTC
	                        } else {
	                            // Safari UA substrings of interest for reference:
	                            // - webkit version:           AppleWebKit/602.1.25 (also used in Op,Cr)
	                            // - safari UI version:        Version/9.0.3 (unique to Safari)
	                            // - safari UI webkit version: Safari/601.4.4 (also used in Op,Cr)
	                            //
	                            // if the webkit version and safari UI webkit versions are equals,
	                            // ... this is a stable version.
	                            //
	                            // only the internal webkit version is important today to know if
	                            // media streams are supported
	                            //
	                            if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
	                                result.browser = 'safari';
	                                result.version = this.extractVersion(navigator.userAgent, /AppleWebKit\/([0-9]+)\./, 1);

	                                // unknown webkit-based browser
	                            } else {
	                                result.browser = 'Unsupported webkit-based browser ' + 'with GUM support but no WebRTC support.';
	                                return result;
	                            }
	                        }

	                        // Edge.
	                    } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
	                        result.browser = 'edge';
	                        result.version = this.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);

	                        // Default fallthrough: not supported.
	                    } else {
	                        result.browser = 'Not a supported browser.';
	                        return result;
	                    }

	                    return result;
	                }
	            };

	            // Export.
	            module.exports = {
	                log: utils.log,
	                disableLog: utils.disableLog,
	                browserDetails: utils.detectBrowser(),
	                extractVersion: utils.extractVersion
	            };
	        }, {}] }, {}, [2])(2);
	});
	/* global define, module, require, console, MediaStreamTrack, createIceServer, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription */
	/*!
	  Script: easyrtc.js

	    Provides client side support for the EasyRTC framework.
	    See the easyrtc_client_api.md and easyrtc_client_tutorial.md
	    for more details.

	  About: License

	    Copyright (c) 2016, Priologic Software Inc.
	    All rights reserved.

	    Redistribution and use in source and binary forms, with or without
	    modification, are permitted provided that the following conditions are met:

	        * Redistributions of source code must retain the above copyright notice,
	          this list of conditions and the following disclaimer.
	        * Redistributions in binary form must reproduce the above copyright
	          notice, this list of conditions and the following disclaimer in the
	          documentation and/or other materials provided with the distribution.

	    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	    ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	    CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	    INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	    CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	    POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (root, factory) {
	    if (true) {
	        //RequireJS (AMD) build system
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__, __webpack_require__(165)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_LOCAL_MODULE_2__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__));
	    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	        //CommonJS build system
	        module.exports = factory(require('easyrtc_lang'), require('webrtc-adapter'), require('socket.io-cient'));
	    } else {
	        //Vanilla JS, ensure dependencies are loaded correctly
	        if (typeof window.io === 'undefined' || !window.io) {
	            throw new Error("easyrtc requires socket.io");
	        }
	        root.easyrtc = factory(window.easyrtc_lang, window.adapter, window.io);
	    }
	})(undefined, function (easyrtc_lang, adapter, io, undefined) {

	    /**
	     * @class Easyrtc.
	     *
	     * @returns {Easyrtc} the new easyrtc instance.
	     *
	     * @constructs Easyrtc
	     */
	    var Easyrtc = function Easyrtc() {

	        var self = this;

	        function logDebug(message, obj) {
	            if (self.debugPrinter) {
	                self.debugPrinter(message, obj);
	            }
	        }

	        function isEmptyObj(obj) {
	            if (obj === null || obj === undefined) {
	                return true;
	            }
	            var key;
	            for (key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    return false;
	                }
	            }
	            return true;
	        }

	        /** @private */
	        var autoInitUserMedia = true;
	        /** @private */
	        var sdpLocalFilter = null;
	        /** @private */
	        var sdpRemoteFilter = null;
	        /** @private */
	        var iceCandidateFilter = null;
	        /** @private */
	        var iceConnectionStateChangeListener = null;
	        var signalingStateChangeListener = null;
	        /** @private */
	        var connectionOptions = {
	            'connect timeout': 10000,
	            'force new connection': true
	        };

	        /** @private */
	        //
	        // this function replaces the deprecated MediaStream.stop method
	        //
	        function stopStream(stream) {
	            var i;
	            var tracks;

	            tracks = stream.getAudioTracks();
	            for (i = 0; i < tracks.length; i++) {
	                try {
	                    tracks[i].stop();
	                } catch (err) {}
	            }
	            tracks = stream.getVideoTracks();
	            for (i = 0; i < tracks.length; i++) {
	                try {
	                    tracks[i].stop();
	                } catch (err) {}
	            }

	            if (typeof stream.stop === 'function') {
	                try {
	                    stream.stop();
	                } catch (err) {}
	            }
	        }

	        /**
	         * Sets functions which filter sdp records before calling setLocalDescription or setRemoteDescription.
	         * This is advanced functionality which can break things, easily. See the easyrtc_rates.js file for a
	         * filter builder.
	         * @param {Function} localFilter a function that takes an sdp string and returns an sdp string.
	         * @param {Function} remoteFilter a function that takes an sdp string and returns an sdp string.
	         */
	        this.setSdpFilters = function (localFilter, remoteFilter) {
	            sdpLocalFilter = localFilter;
	            sdpRemoteFilter = remoteFilter;
	        };

	        /**
	         * Sets a function to warn about the peer connection closing.
	         *  @param {Function} handler: a function that gets an easyrtcid as an argument.
	         */
	        this.setPeerClosedListener = function (handler) {
	            this.onPeerClosed = handler;
	        };

	        /**
	         * Sets a function to warn about the peer connection open.
	         *  @param {Function} handler: a function that gets an easyrtcid as an argument.
	         */
	        this.setPeerOpenListener = function (handler) {
	            this.onPeerOpen = handler;
	        };

	        /**
	         * Sets a function to receive warnings about the peer connection
	         * failing. The peer connection may recover by itself.
	         *  @param {Function} failingHandler: a function that gets an easyrtcid as an argument.
	         *  @param {Function} recoveredHandler: a function that gets an easyrtcid as an argument.
	         */
	        this.setPeerFailingListener = function (failingHandler, recoveredHandler) {
	            this.onPeerFailing = failingHandler;
	            this.onPeerRecovered = recoveredHandler;
	        };

	        /**
	         * Sets a function which filters IceCandidate records being sent or received.
	         *
	         * Candidate records can be received while they are being generated locally (before being
	         * sent to a peer), and after they are received by the peer. The filter receives two arguments, the candidate record and a boolean
	         * flag that is true for a candidate being received from another peer,
	         * and false for a candidate that was generated locally. The candidate record has the form:
	         *  {type: 'candidate', label: sdpMLineIndex, id: sdpMid, candidate: candidateString}
	         * The function should return one of the following: the input candidate record, a modified candidate record, or null (indicating that the
	         * candidate should be discarded).
	         * @param {Function} filter
	         */
	        this.setIceCandidateFilter = function (filter) {
	            iceCandidateFilter = filter;
	        };

	        /**
	         * Sets a function that listens on IceConnectionStateChange events.
	         *
	         * During ICE negotiation the peer connection fires the iceconnectionstatechange event.
	         * It is sometimes useful for the application to learn about these changes, especially if the ICE connection fails.
	         * The function should accept three parameters: the easyrtc id of the peer, the iceconnectionstatechange event target and the iceconnectionstate.
	         * @param {Function} listener
	         */
	        this.setIceConnectionStateChangeListener = function (listener) {
	            iceConnectionStateChangeListener = listener;
	        };

	        /**
	         * Sets a function that listens on SignalingStateChange events.
	         *
	         * During ICE negotiation the peer connection fires the signalingstatechange event.
	         * The function should accept three parameters: the easyrtc id of the peer, the signalingstatechange event target and the signalingstate.
	         * @param {Function} listener
	         */
	        this.setSignalingStateChangeListener = function (listener) {
	            signalingStateChangeListener = listener;
	        };

	        /**
	         * Controls whether a default local media stream should be acquired automatically during calls and accepts
	         * if a list of streamNames is not supplied. The default is true, which mimics the behaviour of earlier releases
	         * that didn't support multiple streams. This function should be called before easyrtc.call or before entering an
	         * accept  callback.
	         * @param {Boolean} flag true to allocate a default local media stream.
	         */
	        this.setAutoInitUserMedia = function (flag) {
	            autoInitUserMedia = !!flag;
	        };

	        /**
	         * This function performs a printf like formatting. It actually takes an unlimited
	         * number of arguments, the declared arguments arg1, arg2, arg3 are present just for
	         * documentation purposes.
	         * @param {String} format A string like "abcd{1}efg{2}hij{1}."
	         * @param {String} arg1 The value that replaces {1}
	         * @param {String} arg2 The value that replaces {2}
	         * @param {String} arg3 The value that replaces {3}
	         * @returns {String} the formatted string.
	         */
	        this.format = function (format, arg1, arg2, arg3) {
	            var formatted = arguments[0];
	            for (var i = 1; i < arguments.length; i++) {
	                var regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
	                formatted = formatted.replace(regexp, arguments[i]);
	            }
	            return formatted;
	        };

	        /**
	         * This function checks if a socket is actually connected.
	         * @private
	         * @param {Object} socket a socket.io socket.
	         * @return true if the socket exists and is connected, false otherwise.
	        */
	        function isSocketConnected(socket) {
	            return socket && (socket.socket && socket.socket.connected || socket.connected);
	        }

	        /** @private */
	        //
	        // Maps a key to a language specific string using the easyrtc_lang map.
	        // Defaults to the key if the key can not be found, but outputs a warning in that case.
	        // This function is only used internally by easyrtc.js
	        //
	        var haveAudioVideo = {
	            audio: false,
	            video: false
	        };

	        /**
	         * @private
	         * @param {String} key
	         */
	        this.getConstantString = function (key) {
	            if (easyrtc_lang[key]) {
	                return easyrtc_lang[key];
	            } else {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Could not find key='" + key + "' in easyrtc_lang");
	                return key;
	            }
	        };

	        /** @private */
	        //
	        // this is a list of the events supported by the generalized event listener.
	        //
	        var allowedEvents = {
	            roomOccupant: true, // this receives the list of everybody in any room you belong to
	            roomOccupants: true // this receives a {roomName:..., occupants:...} value for a specific room
	        };

	        /** @private */
	        //
	        // A map of eventListeners. The key is the event type.
	        //
	        var eventListeners = {};

	        /**
	         * This function checks if an attempt was made to add an event listener or
	         * or emit an unlisted event, since such is typically a typo.
	         * @private
	         * @param {String} eventName
	         * @param {String} callingFunction the name of the calling function.
	         */
	        function event(eventName, callingFunction) {
	            if (typeof eventName !== 'string') {
	                self.showError(self.errCodes.DEVELOPER_ERR, callingFunction + " called without a string as the first argument");
	                throw "developer error";
	            }
	            if (!allowedEvents[eventName]) {
	                self.showError(self.errCodes.DEVELOPER_ERR, callingFunction + " called with a bad event name = " + eventName);
	                throw "developer error";
	            }
	        }

	        /**
	         * Adds an event listener for a particular type of event.
	         * Currently the only eventName supported is "roomOccupant".
	         * @param {String} eventName the type of the event
	         * @param {Function} eventListener the function that expects the event.
	         * The eventListener gets called with the eventName as it's first argument, and the event
	         * data as it's second argument.
	         * @returns {void}
	         */
	        this.addEventListener = function (eventName, eventListener) {
	            event(eventName, "addEventListener");
	            if (typeof eventListener !== 'function') {
	                self.showError(self.errCodes.DEVELOPER_ERR, "addEventListener called with a non-function for second argument");
	                throw "developer error";
	            }
	            //
	            // remove the event listener if it's already present so we don't end up with two copies
	            //
	            self.removeEventListener(eventName, eventListener);
	            if (!eventListeners[eventName]) {
	                eventListeners[eventName] = [];
	            }
	            eventListeners[eventName][eventListeners[eventName].length] = eventListener;
	        };

	        /**
	         * Removes an event listener.
	         * @param {String} eventName
	         * @param {Function} eventListener
	         */
	        this.removeEventListener = function (eventName, eventListener) {
	            event(eventName, "removeEventListener");
	            var listeners = eventListeners[eventName];
	            var i = 0;
	            if (listeners) {
	                for (i = 0; i < listeners.length; i++) {
	                    if (listeners[i] === eventListener) {
	                        if (i < listeners.length - 1) {
	                            listeners[i] = listeners[listeners.length - 1];
	                        }
	                        listeners.length = listeners.length - 1;
	                    }
	                }
	            }
	        };

	        /**
	         * Emits an event, or in other words, calls all the eventListeners for a
	         * particular event.
	         * @param {String} eventName
	         * @param {Object} eventData
	         */
	        this.emitEvent = function (eventName, eventData) {
	            event(eventName, "emitEvent");
	            var listeners = eventListeners[eventName];
	            var i = 0;
	            if (listeners) {
	                for (i = 0; i < listeners.length; i++) {
	                    listeners[i](eventName, eventData);
	                }
	            }
	        };

	        /**
	         * Error codes that the EasyRTC will use in the errorCode field of error object passed
	         * to error handler set by easyrtc.setOnError. The error codes are short printable strings.
	         * @type Object
	         */
	        this.errCodes = {
	            BAD_NAME: "BAD_NAME", // a user name wasn't of the desired form
	            CALL_ERR: "CALL_ERR", // something went wrong creating the peer connection
	            DEVELOPER_ERR: "DEVELOPER_ERR", // the developer using the EasyRTC library made a mistake
	            SYSTEM_ERR: "SYSTEM_ERR", // probably an error related to the network
	            CONNECT_ERR: "CONNECT_ERR", // error occurred when trying to create a connection
	            MEDIA_ERR: "MEDIA_ERR", // unable to get the local media
	            MEDIA_WARNING: "MEDIA_WARNING", // didn't get the desired resolution
	            INTERNAL_ERR: "INTERNAL_ERR",
	            PEER_GONE: "PEER_GONE", // peer doesn't exist
	            ALREADY_CONNECTED: "ALREADY_CONNECTED",
	            BAD_CREDENTIAL: "BAD_CREDENTIAL",
	            ICECANDIDATE_ERR: "ICECANDIDATE_ERR",
	            NOVIABLEICE: "NOVIABLEICE",
	            SIGNAL_ERR: "SIGNAL_ERR"
	        };

	        this.apiVersion = "1.1.0";

	        /** Most basic message acknowledgment object */
	        this.ackMessage = { msgType: "ack" };

	        /** Regular expression pattern for user ids. This will need modification to support non US character sets */
	        this.usernameRegExp = /^(.){1,64}$/;

	        /** Default cookieId name */
	        this.cookieId = "easyrtcsid";

	        /** @private */
	        var username = null;

	        /** Flag to indicate that user is currently logging out */
	        this.loggingOut = false;

	        /** @private */
	        this.disconnecting = false;

	        /** @private */
	        //
	        // A map of ids to local media streams.
	        //
	        var namedLocalMediaStreams = {};

	        /** @private */
	        var sessionFields = [];

	        /** @private */
	        var receivedMediaConstraints = {};

	        /**
	         * Control whether the client requests audio from a peer during a call.
	         * Must be called before the call to have an effect.
	         * @param value - true to receive audio, false otherwise. The default is true.
	         */
	        this.enableAudioReceive = function (value) {
	            if (adapter && adapter.browserDetails && (adapter.browserDetails.browser === "firefox" || adapter.browserDetails.browser === "edge")) {
	                receivedMediaConstraints.offerToReceiveAudio = value;
	            } else {
	                receivedMediaConstraints.mandatory = receivedMediaConstraints.mandatory || {};
	                receivedMediaConstraints.mandatory.OfferToReceiveAudio = value;
	            }
	        };

	        /**
	         * Control whether the client requests video from a peer during a call.
	         * Must be called before the call to have an effect.
	         * @param value - true to receive video, false otherwise. The default is true.
	         */
	        this.enableVideoReceive = function (value) {
	            if (adapter && adapter.browserDetails && (adapter.browserDetails.browser === "firefox" || adapter.browserDetails.browser === "edge")) {
	                receivedMediaConstraints.offerToReceiveVideo = value;
	            } else {
	                receivedMediaConstraints.mandatory = receivedMediaConstraints.mandatory || {};
	                receivedMediaConstraints.mandatory.OfferToReceiveVideo = value;
	            }
	        };

	        // True by default
	        // TODO should not be true by default only for legacy
	        this.enableAudioReceive(true);
	        this.enableVideoReceive(true);

	        function getSourceList(callback, sourceType) {
	            navigator.mediaDevices.enumerateDevices().then(function (values) {
	                var results = [];
	                for (var i = 0; i < values.length; i++) {
	                    var source = values[i];
	                    if (source.kind === sourceType) {
	                        source.id = source.deviceId; //backwards compatibility
	                        results.push(source);
	                    }
	                }
	                callback(results);
	            }).catch(function (reason) {
	                logDebug("Unable to enumerate devices (" + reason + ")");
	            });
	        }

	        /**
	         * Sets the audio output device of a Video object. 
	         * That is to say, this controls what speakers get the sound.
	         * In theory, this works on Chrome but probably doesn't work anywhere else yet.
	         * This code was cribbed from https://webrtc.github.io/samples/src/content/devices/multi/.
	         *  @param {Object} element an HTML5 video element
	         *  @param {String} sinkId a deviceid from getAudioSinkList
	         */
	        this.setAudioOutput = function (element, sinkId) {
	            if (typeof element.sinkId !== 'undefined') {
	                element.setSinkId(sinkId).then(function () {
	                    logDebug('Success, audio output device attached: ' + sinkId + ' to ' + 'element with ' + element.title + ' as source.');
	                }).catch(function (error) {
	                    var errorMessage = error;
	                    if (error.name === 'SecurityError') {
	                        errorMessage = 'You need to use HTTPS for selecting audio output ' + 'device: ' + error;
	                    }
	                    logDebug(errorMessage);
	                });
	            } else {
	                logDebug('Browser does not support output device selection.');
	            }
	        };

	        /**
	         * Gets a list of the available audio sinks (ie, speakers)
	         * @param {Function} callback receives list of {deviceId:String, groupId:String, label:String, kind:"audio"}
	         * @example  easyrtc.getAudioSinkList( function(list) {
	         *               var i;
	         *               for( i = 0; i < list.length; i++ ) {
	         *                   console.log("label=" + list[i].label + ", id= " + list[i].deviceId);
	         *               }
	         *          });
	         */
	        this.getAudioSinkList = function (callback) {
	            getSourceList(callback, "audiooutput");
	        };
	        /**
	         * Gets a list of the available audio sources (ie, microphones)
	         * @param {Function} callback receives list of {deviceId:String, groupId:String, label:String, kind:"audio"}
	         * @example  easyrtc.getAudioSourceList( function(list) {
	         *               var i;
	         *               for( i = 0; i < list.length; i++ ) {
	         *                   console.log("label=" + list[i].label + ", id= " + list[i].deviceId);
	         *               }
	         *          });
	         */
	        this.getAudioSourceList = function (callback) {
	            getSourceList(callback, "audioinput");
	        };

	        /**
	         * Gets a list of the available video sources (ie, cameras)
	         * @param {Function} callback receives list of {deviceId:String, groupId:String, label:String, kind:"video"}
	         * @example  easyrtc.getVideoSourceList( function(list) {
	         *               var i;
	         *               for( i = 0; i < list.length; i++ ) {
	         *                   console.log("label=" + list[i].label + ", id= " + list[i].deviceId);
	         *               }
	         *          });
	         */
	        this.getVideoSourceList = function (callback) {
	            getSourceList(callback, "videoinput");
	        };

	        /** @private */
	        var dataChannelName = "dc";
	        /** @private */
	        var oldConfig = {};
	        /** @private */
	        var offersPending = {};
	        /** @private */
	        var credential = null;

	        /** @private */
	        self.audioEnabled = true;
	        /** @private */
	        self.videoEnabled = true;
	        /** @private */
	        this.debugPrinter = null;
	        /** Your easyrtcid */
	        this.myEasyrtcid = "";

	        /** The height of the local media stream video in pixels. This field is set an indeterminate period
	         * of time after easyrtc.initMediaSource succeeds. Note: in actuality, the dimensions of a video stream
	         * change dynamically in response to external factors, you should check the videoWidth and videoHeight attributes
	         * of your video objects before you use them for pixel specific operations.
	         */
	        this.nativeVideoHeight = 0;

	        /** This constant determines how long (in bytes) a message can be before being split in chunks of that size.
	        * This is because there is a limitation of the length of the message you can send on the
	        * data channel between browsers.
	        */
	        this.maxP2PMessageLength = 1000;

	        /** The width of the local media stream video in pixels. This field is set an indeterminate period
	         * of time after easyrtc.initMediaSource succeeds.  Note: in actuality, the dimensions of a video stream
	         * change dynamically in response to external factors, you should check the videoWidth and videoHeight attributes
	         * of your video objects before you use them for pixel specific operations.
	         */
	        this.nativeVideoWidth = 0;

	        /** The rooms the user is in. This only applies to room oriented applications and is set at the same
	         * time a token is received.
	         */
	        this.roomJoin = {};

	        /** Checks if the supplied string is a valid user name (standard identifier rules)
	         * @param {String} name
	         * @return {Boolean} true for a valid user name
	         * @example
	         *    var name = document.getElementById('nameField').value;
	         *    if( !easyrtc.isNameValid(name)){
	         *        console.error("Bad user name");
	         *    }
	         */
	        this.isNameValid = function (name) {
	            return self.usernameRegExp.test(name);
	        };

	        /**
	         * This function sets the name of the cookie that client side library will look for
	         * and transmit back to the server as it's easyrtcsid in the first message.
	         * @param {String} cookieId
	         */
	        this.setCookieId = function (cookieId) {
	            self.cookieId = cookieId;
	        };

	        /** @private */
	        this._desiredVideoProperties = {}; // default camera

	        /**
	         * Specify particular video source. Call this before you call easyrtc.initMediaSource().
	         * @param {String} videoSrcId is a id value from one of the entries fetched by getVideoSourceList. null for default.
	         * @example easyrtc.setVideoSource( videoSrcId);
	         */
	        this.setVideoSource = function (videoSrcId) {
	            self._desiredVideoProperties.videoSrcId = videoSrcId;
	            delete self._desiredVideoProperties.screenCapture;
	        };

	        /** @private */
	        this._desiredAudioProperties = {}; // default camera

	        /**
	         * Specify particular video source. Call this before you call easyrtc.initMediaSource().
	         * @param {String} audioSrcId is a id value from one of the entries fetched by getAudioSourceList. null for default.
	         * @example easyrtc.setAudioSource( audioSrcId);
	         */
	        this.setAudioSource = function (audioSrcId) {
	            self._desiredAudioProperties.audioSrcId = audioSrcId;
	        };

	        /** This function is used to set the dimensions of the local camera, usually to get HD.
	         *  If called, it must be called before calling easyrtc.initMediaSource (explicitly or implicitly).
	         *  assuming it is supported. If you don't pass any parameters, it will use default camera dimensions.
	         * @param {Number} width in pixels
	         * @param {Number} height in pixels
	         * @param {number} frameRate is optional
	         * @example
	         *    easyrtc.setVideoDims(1280,720);
	         * @example
	         *    easyrtc.setVideoDims();
	         */
	        this.setVideoDims = function (width, height, frameRate) {
	            self._desiredVideoProperties.width = width;
	            self._desiredVideoProperties.height = height;
	            if (frameRate !== undefined) {
	                self._desiredVideoProperties.frameRate = frameRate;
	            }
	        };

	        /** This function requests that screen capturing be used to provide the local media source
	         * rather than a webcam. If you have multiple screens, they are composited side by side.
	         * Note: this functionality is not supported by Firefox, has to be called before calling initMediaSource (or easyApp), we don't currently supply a way to
	         * turn it off (once it's on), only works if the website is hosted SSL (https), and the image quality is rather
	         * poor going across a network because it tries to transmit so much data. In short, screen sharing
	         * through WebRTC isn't worth using at this point, but it is provided here so people can try it out.
	         * @example
	         *    easyrtc.setScreenCapture();
	         * @deprecated: use easyrtc.initScreenCapture (same parameters as easyrtc.initMediaSource.
	         */
	        this.setScreenCapture = function (enableScreenCapture) {
	            self._desiredVideoProperties.screenCapture = enableScreenCapture !== false;
	        };

	        /**
	         * Builds the constraint object passed to getUserMedia.
	         * @returns {Object} mediaConstraints
	         */
	        self.getUserMediaConstraints = function () {
	            var constraints = {};
	            //
	            // _presetMediaConstraints allow you to provide your own constraints to be used
	            // with initMediaSource.
	            //
	            if (self._presetMediaConstraints) {
	                constraints = self._presetMediaConstraints;
	                delete self._presetMediaConstraints;
	                return constraints;
	            } else if (self._desiredVideoProperties.screenCapture) {
	                return {
	                    video: {
	                        mandatory: {
	                            chromeMediaSource: 'screen',
	                            maxWidth: screen.width,
	                            maxHeight: screen.height,
	                            minWidth: screen.width,
	                            minHeight: screen.height,
	                            minFrameRate: 1,
	                            maxFrameRate: 5 },
	                        optional: []
	                    },
	                    audio: false
	                };
	            } else if (!self.videoEnabled) {
	                constraints.video = false;
	            } else {

	                // Tested Firefox 49 and MS Edge require minFrameRate and maxFrameRate 
	                // instead max,min,ideal that cause GetUserMedia failure.
	                // Until confirmed both browser support idea,max and min we need this.
	                if (adapter && adapter.browserDetails && (adapter.browserDetails.browser === "firefox" || adapter.browserDetails.browser === "edge")) {
	                    constraints.video = {};
	                    if (self._desiredVideoProperties.width) {
	                        constraints.video.width = self._desiredVideoProperties.width;
	                    }
	                    if (self._desiredVideoProperties.height) {
	                        constraints.video.height = self._desiredVideoProperties.height;
	                    }
	                    if (self._desiredVideoProperties.frameRate) {
	                        constraints.video.frameRate = {
	                            minFrameRate: self._desiredVideoProperties.frameRate,
	                            maxFrameRate: self._desiredVideoProperties.frameRate
	                        };
	                    }
	                    if (self._desiredVideoProperties.videoSrcId) {
	                        constraints.video.deviceId = self._desiredVideoProperties.videoSrcId;
	                    }

	                    // chrome and opera
	                } else {
	                    constraints.video = {};
	                    if (self._desiredVideoProperties.width) {
	                        constraints.video.width = {
	                            max: self._desiredVideoProperties.width,
	                            min: self._desiredVideoProperties.width,
	                            ideal: self._desiredVideoProperties.width
	                        };
	                    }
	                    if (self._desiredVideoProperties.height) {
	                        constraints.video.height = {
	                            max: self._desiredVideoProperties.height,
	                            min: self._desiredVideoProperties.height,
	                            ideal: self._desiredVideoProperties.height
	                        };
	                    }
	                    if (self._desiredVideoProperties.frameRate) {
	                        constraints.video.frameRate = {
	                            max: self._desiredVideoProperties.frameRate,
	                            ideal: self._desiredVideoProperties.frameRate
	                        };
	                    }
	                    if (self._desiredVideoProperties.videoSrcId) {
	                        constraints.video.deviceId = self._desiredVideoProperties.videoSrcId;
	                    }
	                    // hack for opera
	                    if (Object.keys(constraints.video).length === 0) {
	                        constraints.video = true;
	                    }
	                }
	            }

	            if (!self.audioEnabled) {
	                constraints.audio = false;
	            } else {
	                if (adapter && adapter.browserDetails && adapter.browserDetails.browser === "firefox") {
	                    constraints.audio = {};
	                    if (self._desiredAudioProperties.audioSrcId) {
	                        constraints.audio.deviceId = self._desiredAudioProperties.audioSrcId;
	                    }
	                } else {
	                    // chrome and opera
	                    constraints.audio = { mandatory: {}, optional: [] };
	                    if (self._desiredAudioProperties.audioSrcId) {
	                        constraints.audio.optional = constraints.audio.optional || [];
	                        constraints.audio.optional.push({ deviceId: self._desiredAudioProperties.audioSrcId });
	                    }
	                }
	            }
	            return constraints;
	        };

	        /** Set the application name. Applications can only communicate with other applications
	         * that share the same API Key and application name. There is no predefined set of application
	         * names. Maximum length is
	         * @param {String} name
	         * @example
	         *    easyrtc.setApplicationName('simpleAudioVideo');
	         */
	        this.setApplicationName = function (name) {
	            self.applicationName = name;
	        };

	        /** Enable or disable logging to the console.
	         * Note: if you want to control the printing of debug messages, override the
	         *    easyrtc.debugPrinter variable with a function that takes a message string as it's argument.
	         *    This is exactly what easyrtc.enableDebug does when it's enable argument is true.
	         * @param {Boolean} enable - true to turn on debugging, false to turn off debugging. Default is false.
	         * @example
	         *    easyrtc.enableDebug(true);
	         */
	        this.enableDebug = function (enable) {
	            if (enable) {
	                self.debugPrinter = function (message, obj) {
	                    var now = new Date().toISOString();
	                    var stackString = new Error().stack;
	                    var srcLine = "location unknown";
	                    if (stackString) {
	                        var stackFrameStrings = stackString.split('\n');
	                        srcLine = "";
	                        if (stackFrameStrings.length >= 5) {
	                            srcLine = stackFrameStrings[4];
	                        }
	                    }

	                    console.log("debug " + now + " : " + message + " [" + srcLine + "]");

	                    if (typeof obj !== 'undefined') {
	                        console.log("debug " + now + " : ", obj);
	                    }
	                };
	            } else {
	                self.debugPrinter = null;
	            }
	        };

	        /**
	         * Determines if the local browser supports WebRTC GetUserMedia (access to camera and microphone).
	         * @returns {Boolean} True getUserMedia is supported.
	         */
	        this.supportsGetUserMedia = function () {
	            return typeof navigator.getUserMedia !== 'undefined';
	        };

	        /**
	         * Determines if the local browser supports WebRTC Peer connections to the extent of being able to do video chats.
	         * @returns {Boolean} True if Peer connections are supported.
	         */
	        this.supportsPeerConnections = function () {
	            return typeof RTCPeerConnection !== 'undefined';
	        };

	        /** Determines whether the current browser supports the new data channels.
	         * EasyRTC will not open up connections with the old data channels.
	         * @returns {Boolean}
	         */
	        this.supportsDataChannels = function () {

	            var hasCreateDataChannel = false;

	            if (self.supportsPeerConnections()) {
	                try {
	                    var peer = new RTCPeerConnection({ iceServers: [] }, {});
	                    hasCreateDataChannel = typeof peer.createDataChannel !== 'undefined';
	                    peer.close();
	                } catch (err) {
	                    // Ignore possible RTCPeerConnection.close error
	                    // hasCreateDataChannel should reflect the feature state still.
	                }
	            }

	            return hasCreateDataChannel;
	        };

	        /** @private */
	        //
	        // Experimental function to determine if statistics gathering is supported.
	        //
	        this.supportsStatistics = function () {

	            var hasGetStats = false;

	            if (self.supportsPeerConnections()) {
	                try {
	                    var peer = new RTCPeerConnection({ iceServers: [] }, {});
	                    hasGetStats = typeof peer.getStats !== 'undefined';
	                    peer.close();
	                } catch (err) {
	                    // Ingore possible RTCPeerConnection.close error
	                    // hasCreateDataChannel should reflect the feature state still.
	                }
	            }

	            return hasGetStats;
	        };

	        /** @private
	         * @param {Array} pc_config ice configuration array
	         * @param {Object} optionalStuff peer constraints.
	         */
	        this.createRTCPeerConnection = function (pc_config, optionalStuff) {
	            if (self.supportsPeerConnections()) {
	                return new RTCPeerConnection(pc_config, optionalStuff);
	            } else {
	                throw "Your browser doesn't support webRTC (RTCPeerConnection)";
	            }
	        };

	        //
	        // this should really be part of adapter.js
	        // Versions of chrome < 31 don't support reliable data channels transport.
	        // Firefox does.
	        //
	        this.getDatachannelConstraints = function () {
	            return {
	                reliable: adapter && adapter.browserDetails && adapter.browserDetails.browser !== "chrome" && adapter.browserDetails.version < 31
	            };
	        };

	        /** @private */
	        haveAudioVideo = {
	            audio: false,
	            video: false
	        };
	        /** @private */
	        var dataEnabled = false;
	        /** @private */
	        var serverPath = null; // this was null, but that was generating an error.
	        /** @private */
	        var roomOccupantListener = null;
	        /** @private */
	        var onDataChannelOpen = null;
	        /** @private */
	        var onDataChannelClose = null;
	        /** @private */
	        var lastLoggedInList = {};
	        /** @private */
	        var receivePeer = { msgTypes: {} };
	        /** @private */
	        var receiveServerCB = null;
	        /** @private */
	        // dummy placeholder for when we aren't connected
	        var updateConfigurationInfo = function updateConfigurationInfo() {};
	        /** @private */
	        //
	        //
	        //  peerConns is a map from caller names to the below object structure
	        //     {  startedAV: boolean,  -- true if we have traded audio/video streams
	        //        dataChannelS: RTPDataChannel for outgoing messages if present
	        //        dataChannelR: RTPDataChannel for incoming messages if present
	        //        dataChannelReady: true if the data channel can be used for sending yet
	        //        connectTime: timestamp when the connection was started
	        //        sharingAudio: true if audio is being shared
	        //        sharingVideo: true if video is being shared
	        //        cancelled: temporarily true if a connection was cancelled by the peer asking to initiate it
	        //        candidatesToSend: SDP candidates temporarily queued
	        //        streamsAddedAcks: ack callbacks waiting for stream received messages
	        //        pc: RTCPeerConnection
	        //        mediaStream: mediaStream
	        //     function callSuccessCB(string) - see the easyrtc.call documentation.
	        //        function callFailureCB(errorCode, string) - see the easyrtc.call documentation.
	        //        function wasAcceptedCB(boolean,string) - see the easyrtc.call documentation.
	        //     }
	        //
	        var peerConns = {};
	        /** @private */
	        //
	        // a map keeping track of whom we've requested a call with so we don't try to
	        // call them a second time before they've responded.
	        //
	        var acceptancePending = {};

	        /** @private
	         * @param {string} caller
	         * @param {Function} helper
	         */
	        this.acceptCheck = function (caller, helper) {
	            helper(true);
	        };

	        /** @private
	         * @param {string} easyrtcid
	         * @param {HTMLMediaStream} stream
	         */
	        this.streamAcceptor = function (easyrtcid, stream) {};

	        /** @private
	         * @param {string} easyrtcid
	         */
	        this.onStreamClosed = function (easyrtcid) {};

	        /** @private
	         * @param {string} easyrtcid
	         */
	        this.callCancelled = function (easyrtcid) {};

	        /**
	         * This function gets the raw RTCPeerConnection for a given easyrtcid
	         * @param {String} easyrtcid
	         * @param {RTCPeerConnection} for that easyrtcid, or null if no connection exists
	         * Submitted by Fabian Bernhard.
	         */
	        this.getPeerConnectionByUserId = function (userId) {
	            if (peerConns && peerConns[userId]) {
	                return peerConns[userId].pc;
	            }
	            return null;
	        };

	        var chromeStatsFilter = [{
	            "googTransmitBitrate": "transmitBitRate",
	            "googActualEncBitrate": "encodeRate",
	            "googAvailableSendBandwidth": "availableSendRate"
	        }, {
	            "googCodecName": "audioCodec",
	            "googTypingNoiseState": "typingNoise",
	            "packetsSent": "audioPacketsSent",
	            "bytesSent": "audioBytesSent"
	        }, {
	            "googCodecName": "videoCodec",
	            "googFrameRateSent": "outFrameRate",
	            "packetsSent": "videoPacketsSent",
	            "bytesSent": "videoBytesSent"
	        }, {
	            "packetsLost": "videoPacketsLost",
	            "packetsReceived": "videoPacketsReceived",
	            "bytesReceived": "videoBytesReceived",
	            "googFrameRateOutput": "frameRateOut"
	        }, {
	            "packetsLost": "audioPacketsLost",
	            "packetsReceived": "audioPacketsReceived",
	            "bytesReceived": "audioBytesReceived",
	            "audioOutputLevel": "audioOutputLevel"
	        }, {
	            "googRemoteAddress": "remoteAddress",
	            "googActiveConnection": "activeConnection"
	        }, {
	            "audioInputLevel": "audioInputLevel"
	        }];

	        var firefoxStatsFilter = {
	            "outboundrtp_audio.bytesSent": "audioBytesSent",
	            "outboundrtp_video.bytesSent": "videoBytesSent",
	            "inboundrtp_video.bytesReceived": "videoBytesReceived",
	            "inboundrtp_audio.bytesReceived": "audioBytesReceived",
	            "outboundrtp_audio.packetsSent": "audioPacketsSent",
	            "outboundrtp_video.packetsSent": "videoPacketsSent",
	            "inboundrtp_video.packetsReceived": "videoPacketsReceived",
	            "inboundrtp_audio.packetsReceived": "audioPacketsReceived",
	            "inboundrtp_video.packetsLost": "videoPacketsLost",
	            "inboundrtp_audio.packetsLost": "audioPacketsLost",
	            "firefoxRemoteAddress": "remoteAddress"
	        };

	        var standardStatsFilter = adapter && adapter.browserDetails && adapter.browserDetails.browser === "firefox" ? firefoxStatsFilter : chromeStatsFilter;

	        function getFirefoxPeerStatistics(peerId, callback, filter) {

	            if (!peerConns[peerId]) {
	                callback(peerId, { "connected": false });
	            } else if (peerConns[peerId].pc.getStats) {
	                peerConns[peerId].pc.getStats(null, function (stats) {
	                    var items = {};
	                    var candidates = {};
	                    var activeId = null;
	                    var srcKey;
	                    //
	                    // the stats objects has a group of entries. Each entry is either an rtcp, rtp entry
	                    // or a candidate entry.
	                    //
	                    if (stats) {
	                        stats.forEach(function (entry) {
	                            var majorKey;
	                            var subKey;
	                            if (entry.type.match(/boundrtp/)) {
	                                if (entry.id.match(/audio/)) {
	                                    majorKey = entry.type + "_audio";
	                                } else if (entry.id.match(/video/)) {
	                                    majorKey = entry.type + "_video";
	                                } else {
	                                    return;
	                                }
	                                for (subKey in entry) {
	                                    if (entry.hasOwnProperty(subKey)) {
	                                        items[majorKey + "." + subKey] = entry[subKey];
	                                    }
	                                }
	                            } else {
	                                if (entry.hasOwnProperty("ipAddress") && entry.id) {
	                                    candidates[entry.id] = entry.ipAddress + ":" + entry.portNumber;
	                                } else if (entry.hasOwnProperty("selected") && entry.hasOwnProperty("remoteCandidateId") && entry.selected) {
	                                    activeId = entry.remoteCandidateId;
	                                }
	                            }
	                        });
	                    }

	                    if (activeId) {
	                        items["firefoxRemoteAddress"] = candidates[activeId];
	                    }
	                    if (!filter) {
	                        callback(peerId, items);
	                    } else {
	                        var filteredItems = {};
	                        for (srcKey in filter) {
	                            if (filter.hasOwnProperty(srcKey) && items.hasOwnProperty(srcKey)) {
	                                filteredItems[filter[srcKey]] = items[srcKey];
	                            }
	                        }
	                        callback(peerId, filteredItems);
	                    }
	                }, function (error) {
	                    logDebug("unable to get statistics");
	                });
	            } else {
	                callback(peerId, { "statistics": self.getConstantString("statsNotSupported") });
	            }
	        }

	        function getChromePeerStatistics(peerId, callback, filter) {

	            if (!peerConns[peerId]) {
	                callback(peerId, { "connected": false });
	            } else if (peerConns[peerId].pc.getStats) {

	                peerConns[peerId].pc.getStats(function (stats) {

	                    var localStats = {};
	                    var part,
	                        parts = stats.result();
	                    var i, j;
	                    var itemKeys;
	                    var itemKey;
	                    var names;
	                    var userKey;
	                    var partNames = [];
	                    var partList;
	                    var bestBytes = 0;
	                    var bestI;
	                    var turnAddress = null;
	                    var hasActive, curReceived;
	                    var localAddress, remoteAddress;
	                    if (!filter) {
	                        for (i = 0; i < parts.length; i++) {
	                            names = parts[i].names();
	                            for (j = 0; j < names.length; j++) {
	                                itemKey = names[j];
	                                localStats[parts[i].id + "." + itemKey] = parts[i].stat(itemKey);
	                            }
	                        }
	                    } else {
	                        for (i = 0; i < parts.length; i++) {
	                            partNames[i] = {};
	                            //
	                            // convert the names into a dictionary
	                            //
	                            names = parts[i].names();
	                            for (j = 0; j < names.length; j++) {
	                                partNames[i][names[j]] = true;
	                            }

	                            //
	                            // a chrome-firefox connection results in several activeConnections.
	                            // we only want one, so we look for the one with the most data being received on it.
	                            //
	                            if (partNames[i].googRemoteAddress && partNames[i].googActiveConnection) {
	                                hasActive = parts[i].stat("googActiveConnection");
	                                if (hasActive === true || hasActive === "true") {
	                                    curReceived = parseInt(parts[i].stat("bytesReceived")) + parseInt(parts[i].stat("bytesSent"));
	                                    if (curReceived > bestBytes) {
	                                        bestI = i;
	                                        bestBytes = curReceived;
	                                    }
	                                }
	                            }
	                        }

	                        for (i = 0; i < parts.length; i++) {
	                            //
	                            // discard info from any inactive connection.
	                            //
	                            if (partNames[i].googActiveConnection) {
	                                if (i !== bestI) {
	                                    partNames[i] = {};
	                                } else {
	                                    localAddress = parts[i].stat("googLocalAddress").split(":")[0];
	                                    remoteAddress = parts[i].stat("googRemoteAddress").split(":")[0];
	                                    if (self.isTurnServer(localAddress)) {
	                                        turnAddress = localAddress;
	                                    } else if (self.isTurnServer(remoteAddress)) {
	                                        turnAddress = remoteAddress;
	                                    }
	                                }
	                            }
	                        }

	                        for (i = 0; i < filter.length; i++) {
	                            itemKeys = filter[i];
	                            partList = [];
	                            part = null;
	                            for (j = 0; j < parts.length; j++) {
	                                var fullMatch = true;
	                                for (itemKey in itemKeys) {
	                                    if (itemKeys.hasOwnProperty(itemKey) && !partNames[j][itemKey]) {
	                                        fullMatch = false;
	                                        break;
	                                    }
	                                }
	                                if (fullMatch && parts[j]) {
	                                    partList.push(parts[j]);
	                                }
	                            }
	                            if (partList.length === 1) {
	                                for (j = 0; j < partList.length; j++) {
	                                    part = partList[j];
	                                    if (part) {
	                                        for (itemKey in itemKeys) {
	                                            if (itemKeys.hasOwnProperty(itemKey)) {
	                                                userKey = itemKeys[itemKey];
	                                                localStats[userKey] = part.stat(itemKey);
	                                            }
	                                        }
	                                    }
	                                }
	                            } else if (partList.length > 1) {
	                                for (itemKey in itemKeys) {
	                                    if (itemKeys.hasOwnProperty(itemKey)) {
	                                        localStats[itemKeys[itemKey]] = [];
	                                    }
	                                }
	                                for (j = 0; j < partList.length; j++) {
	                                    part = partList[j];
	                                    for (itemKey in itemKeys) {
	                                        if (itemKeys.hasOwnProperty(itemKey)) {
	                                            userKey = itemKeys[itemKey];
	                                            localStats[userKey].push(part.stat(itemKey));
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                    }

	                    if (localStats.remoteAddress && turnAddress) {
	                        localStats.remoteAddress = turnAddress;
	                    }
	                    callback(peerId, localStats);
	                });
	            } else {
	                callback(peerId, { "statistics": self.getConstantString("statsNotSupported") });
	            }
	        }

	        /**
	         * This function gets the statistics for a particular peer connection.
	         * @param {String} easyrtcid
	         * @param {Function} callback gets the easyrtcid for the peer and a map of {userDefinedKey: value}. If there is no peer connection to easyrtcid, then the map will
	         *  have a value of {connected:false}.
	         * @param {Object} filter depends on whether Chrome or Firefox is used. See the default filters for guidance.
	         * It is still experimental.
	         */
	        this.getPeerStatistics = function (easyrtcid, callback, filter) {
	            if (adapter && adapter.browserDetails && adapter.browserDetails.browser === "firefox") {
	                getFirefoxPeerStatistics(easyrtcid, callback, filter);
	            } else {
	                getChromePeerStatistics(easyrtcid, callback, filter);
	            }
	        };

	        /**
	         * @private
	         * @param roomName
	         * @param fields
	         */
	        function sendRoomApiFields(roomName, fields) {
	            var fieldAsString = JSON.stringify(fields);
	            JSON.parse(fieldAsString);
	            var dataToShip = {
	                msgType: "setRoomApiField",
	                msgData: {
	                    setRoomApiField: {
	                        roomName: roomName,
	                        field: fields
	                    }
	                }
	            };
	            self.webSocket.json.emit("easyrtcCmd", dataToShip, function (ackMsg) {
	                if (ackMsg.msgType === "error") {
	                    self.showError(ackMsg.msgData.errorCode, ackMsg.msgData.errorText);
	                }
	            });
	        }

	        /** @private */
	        var roomApiFieldTimer = null;

	        /**
	         * @private
	         * @param {String} roomName
	         */
	        function enqueueSendRoomApi(roomName) {
	            //
	            // Rather than issue the send request immediately, we set a timer so we can accumulate other
	            // calls
	            //
	            if (roomApiFieldTimer) {
	                clearTimeout(roomApiFieldTimer);
	            }
	            roomApiFieldTimer = setTimeout(function () {
	                sendRoomApiFields(roomName, self._roomApiFields[roomName]);
	                roomApiFieldTimer = null;
	            }, 10);
	        }

	        /** Provide a set of application defined fields that will be part of this instances
	         * configuration information. This data will get sent to other peers via the websocket
	         * path.
	         * @param {String} roomName - the room the field is attached to.
	         * @param {String} fieldName - the name of the field.
	         * @param {Object} fieldValue - the value of the field.
	         * @example
	         *   easyrtc.setRoomApiField("trekkieRoom",  "favorite_alien", "Mr Spock");
	         *   easyrtc.setRoomOccupantListener( function(roomName, list){
	         *      for( var i in list ){
	         *         console.log("easyrtcid=" + i + " favorite alien is " + list[i].apiFields.favorite_alien);
	         *      }
	         *   });
	         */
	        this.setRoomApiField = function (roomName, fieldName, fieldValue) {
	            //
	            // if we're not connected yet, we'll just cache the fields until we are.
	            //
	            if (!self._roomApiFields) {
	                self._roomApiFields = {};
	            }
	            if (!fieldName && !fieldValue) {
	                delete self._roomApiFields[roomName];
	                return;
	            }

	            if (!self._roomApiFields[roomName]) {
	                self._roomApiFields[roomName] = {};
	            }
	            if (fieldValue !== undefined && fieldValue !== null) {
	                if ((typeof fieldValue === 'undefined' ? 'undefined' : _typeof(fieldValue)) === "object") {
	                    try {
	                        JSON.stringify(fieldValue);
	                    } catch (jsonError) {
	                        self.showError(self.errCodes.DEVELOPER_ERR, "easyrtc.setRoomApiField passed bad object ");
	                        return;
	                    }
	                }
	                self._roomApiFields[roomName][fieldName] = { fieldName: fieldName, fieldValue: fieldValue };
	            } else {
	                delete self._roomApiFields[roomName][fieldName];
	            }
	            if (self.webSocketConnected) {
	                enqueueSendRoomApi(roomName);
	            }
	        };

	        /**
	         * Default error reporting function. The default implementation displays error messages
	         * in a programmatically created div with the id easyrtcErrorDialog. The div has title
	         * component with a class name of easyrtcErrorDialog_title. The error messages get added to a
	         * container with the id easyrtcErrorDialog_body. Each error message is a text node inside a div
	         * with a class of easyrtcErrorDialog_element. There is an "okay" button with the className of easyrtcErrorDialog_okayButton.
	         * @param {String} messageCode An error message code
	         * @param {String} message the error message text without any markup.
	         * @example
	         *     easyrtc.showError("BAD_NAME", "Invalid username");
	         */
	        this.showError = function (messageCode, message) {
	            self.onError({ errorCode: messageCode, errorText: message });
	        };

	        /**
	         * @private
	         * @param errorObject
	         */
	        this.onError = function (errorObject) {
	            logDebug("saw error " + errorObject.errorText);

	            var errorDiv = document.getElementById('easyrtcErrorDialog');
	            var errorBody;
	            if (!errorDiv) {
	                errorDiv = document.createElement("div");
	                errorDiv.id = 'easyrtcErrorDialog';
	                var title = document.createElement("div");
	                title.innerHTML = "Error messages";
	                title.className = "easyrtcErrorDialog_title";
	                errorDiv.appendChild(title);
	                errorBody = document.createElement("div");
	                errorBody.id = "easyrtcErrorDialog_body";
	                errorDiv.appendChild(errorBody);
	                var clearButton = document.createElement("button");
	                clearButton.appendChild(document.createTextNode("Okay"));
	                clearButton.className = "easyrtcErrorDialog_okayButton";
	                clearButton.onclick = function () {
	                    errorBody.innerHTML = ""; // remove all inner nodes
	                    errorDiv.style.display = "none";
	                };
	                errorDiv.appendChild(clearButton);
	                document.body.appendChild(errorDiv);
	            }

	            errorBody = document.getElementById("easyrtcErrorDialog_body");
	            var messageNode = document.createElement("div");
	            messageNode.className = 'easyrtcErrorDialog_element';
	            messageNode.appendChild(document.createTextNode(errorObject.errorText));
	            errorBody.appendChild(messageNode);
	            errorDiv.style.display = "block";
	        };

	        /** @private
	         * @param mediaStream */
	        //
	        // easyrtc.createObjectURL builds a URL from a media stream.
	        // Arguments:
	        //     mediaStream - a media stream object.
	        // The video object in Chrome expects a URL.
	        //
	        this.createObjectURL = function (mediaStream) {
	            var errMessage;
	            if (window.URL && window.URL.createObjectURL) {
	                return window.URL.createObjectURL(mediaStream);
	            } else if (window.webkitURL && window.webkitURL.createObjectURL) {
	                return window.webkit.createObjectURL(mediaStream);
	            } else {
	                errMessage = "Your browsers does not support URL.createObjectURL.";
	                logDebug("saw exception " + errMessage);
	                throw errMessage;
	            }
	        };

	        /**
	         * A convenience function to ensure that a string doesn't have symbols that will be interpreted by HTML.
	         * @param {String} idString
	         * @return {String} The cleaned string.
	         * @example
	         *   console.log( easyrtc.cleanId('&hello'));
	         */
	        this.cleanId = function (idString) {
	            var MAP = {
	                '&': '&amp;',
	                '<': '&lt;',
	                '>': '&gt;'
	            };
	            return idString.replace(/[&<>]/g, function (c) {
	                return MAP[c];
	            });
	        };

	        /**
	         * Set a callback that will be invoked when the application enters or leaves a room.
	         * @param {Function} handler - the first parameter is true for entering a room, false for leaving a room. The second parameter is the room name.
	         * @example
	         *   easyrtc.setRoomEntryListener(function(entry, roomName){
	         *       if( entry ){
	         *           console.log("entering room " + roomName);
	         *       }
	         *       else{
	         *           console.log("leaving room " + roomName);
	         *       }
	         *   });
	         */
	        self.setRoomEntryListener = function (handler) {
	            self.roomEntryListener = handler;
	        };

	        /**
	         * Set the callback that will be invoked when the list of people logged in changes.
	         * The callback expects to receive a room name argument, and
	         * a map whose ideas are easyrtcids and whose values are in turn maps
	         * supplying user specific information. The inner maps have the following keys:
	         * username, applicationName, browserFamily, browserMajor, osFamily, osMajor, deviceFamily.
	         * The third argument is the listener is the innerMap for the connections own data (not needed by most applications).
	         * @param {Function} listener
	         * @example
	         *   easyrtc.setRoomOccupantListener( function(roomName, list, selfInfo){
	         *      for( var i in list ){
	         *         ("easyrtcid=" + i + " belongs to user " + list[i].username);
	         *      }
	         *   });
	         */
	        self.setRoomOccupantListener = function (listener) {
	            roomOccupantListener = listener;
	        };

	        /**
	         * Sets a callback that is called when a data channel is open and ready to send data.
	         * The callback will be called with an easyrtcid as it's sole argument.
	         * @param {Function} listener
	         * @example
	         *    easyrtc.setDataChannelOpenListener( function(easyrtcid){
	         *         easyrtc.sendDataP2P(easyrtcid, "greeting", "hello");
	         *    });
	         */
	        this.setDataChannelOpenListener = function (listener) {
	            onDataChannelOpen = listener;
	        };

	        /** Sets a callback that is called when a previously open data channel closes.
	         * The callback will be called with an easyrtcid as it's sole argument.
	         * @param {Function} listener
	         * @example
	         *    easyrtc.setDataChannelCloseListener( function(easyrtcid){
	         *            ("No longer connected to " + easyrtc.idToName(easyrtcid));
	         *    });
	         */
	        this.setDataChannelCloseListener = function (listener) {
	            onDataChannelClose = listener;
	        };

	        /** Returns the number of live peer connections the client has.
	         * @return {Number}
	         * @example
	         *    ("You have " + easyrtc.getConnectionCount() + " peer connections");
	         */
	        this.getConnectionCount = function () {
	            var count = 0;
	            var i;
	            for (i in peerConns) {
	                if (peerConns.hasOwnProperty(i)) {
	                    if (self.getConnectStatus(i) === self.IS_CONNECTED) {
	                        count++;
	                    }
	                }
	            }
	            return count;
	        };

	        /** Sets the maximum length in bytes of P2P messages that can be sent.
	         * @param {Number} maxLength maximum length to set
	         * @example
	         *     easyrtc.setMaxP2PMessageLength(10000);
	         */
	        this.setMaxP2PMessageLength = function (maxLength) {
	            this.maxP2PMessageLength = maxLength;
	        };

	        /** Sets whether audio is transmitted by the local user in any subsequent calls.
	         * @param {Boolean} enabled true to include audio, false to exclude audio. The default is true.
	         * @example
	         *      easyrtc.enableAudio(false);
	         */
	        this.enableAudio = function (enabled) {
	            self.audioEnabled = enabled;
	        };

	        /**
	         *Sets whether video is transmitted by the local user in any subsequent calls.
	         * @param {Boolean} enabled - true to include video, false to exclude video. The default is true.
	         * @example
	         *      easyrtc.enableVideo(false);
	         */
	        this.enableVideo = function (enabled) {
	            self.videoEnabled = enabled;
	        };

	        /**
	         * Sets whether WebRTC data channels are used to send inter-client messages.
	         * This is only the messages that applications explicitly send to other applications, not the WebRTC signaling messages.
	         * @param {Boolean} enabled  true to use data channels, false otherwise. The default is false.
	         * @example
	         *     easyrtc.enableDataChannels(true);
	         */
	        this.enableDataChannels = function (enabled) {
	            dataEnabled = enabled;
	        };

	        /**
	         * @private
	         * @param {Boolean} enable
	         * @param {Array} tracks - an array of MediaStreamTrack
	         */
	        function enableMediaTracks(enable, tracks) {
	            var i;
	            if (tracks) {
	                for (i = 0; i < tracks.length; i++) {
	                    var track = tracks[i];
	                    track.enabled = enable;
	                }
	            }
	        }

	        /** @private */
	        //
	        // fetches a stream by name. Treat a null/undefined streamName as "default".
	        //
	        function getLocalMediaStreamByName(streamName) {
	            if (!streamName) {
	                streamName = "default";
	            }
	            if (namedLocalMediaStreams.hasOwnProperty(streamName)) {
	                return namedLocalMediaStreams[streamName];
	            } else {
	                return null;
	            }
	        }

	        /**
	         * Returns the user assigned id's of currently active local media streams.
	         * @return {Array}
	         */
	        this.getLocalMediaIds = function () {
	            return Object.keys(namedLocalMediaStreams);
	        };

	        /** @private */
	        function buildMediaIds() {
	            var mediaMap = {};
	            var streamName;
	            for (streamName in namedLocalMediaStreams) {
	                if (namedLocalMediaStreams.hasOwnProperty(streamName)) {
	                    mediaMap[streamName] = namedLocalMediaStreams[streamName].id || "default";
	                }
	            }
	            return mediaMap;
	        }

	        /** @private */
	        function registerLocalMediaStreamByName(stream, streamName) {
	            var roomName;
	            if (!streamName) {
	                streamName = "default";
	            }
	            stream.streamName = streamName;
	            namedLocalMediaStreams[streamName] = stream;
	            if (streamName !== "default") {
	                var mediaIds = buildMediaIds(),
	                    roomData = self.roomData;
	                for (roomName in roomData) {
	                    if (roomData.hasOwnProperty(roomName)) {
	                        self.setRoomApiField(roomName, "mediaIds", mediaIds);
	                    }
	                }
	            }
	        }

	        /**
	         * Allow an externally created mediastream (ie, created by another
	         * library) to be used within easyrtc. Tracking when it closes
	         * must be done by the supplying party.
	         */
	        this.register3rdPartyLocalMediaStream = function (stream, streamName) {
	            return registerLocalMediaStreamByName(stream, streamName);
	        };

	        /** @private */
	        //
	        // look up a stream's name from the stream.id
	        //
	        function getNameOfRemoteStream(easyrtcId, webrtcStreamId) {
	            var roomName;
	            var mediaIds;
	            var streamName;
	            if (!webrtcStreamId) {
	                webrtcStreamId = "default";
	            }
	            if (peerConns[easyrtcId]) {
	                streamName = peerConns[easyrtcId].remoteStreamIdToName[webrtcStreamId];
	                if (streamName) {
	                    return streamName;
	                }
	            }

	            for (roomName in self.roomData) {
	                if (self.roomData.hasOwnProperty(roomName)) {
	                    mediaIds = self.getRoomApiField(roomName, easyrtcId, "mediaIds");
	                    if (!mediaIds) {
	                        continue;
	                    }
	                    for (streamName in mediaIds) {
	                        if (mediaIds.hasOwnProperty(streamName) && mediaIds[streamName] === webrtcStreamId) {
	                            return streamName;
	                        }
	                    }
	                    //
	                    // a stream from chrome to firefox will be missing it's id/label.
	                    // there is no correct solution.
	                    //
	                    if (adapter && adapter.browserDetails && adapter.browserDetails.browser === "firefox") {

	                        // if there is a stream called default, return it in preference
	                        if (mediaIds["default"]) {
	                            return "default";
	                        }

	                        //
	                        // otherwise return the first name we find. If there is more than
	                        // one, complain to Mozilla.
	                        //
	                        for (var anyName in mediaIds) {
	                            if (mediaIds.hasOwnProperty(anyName)) {
	                                return anyName;
	                            }
	                        }
	                    }
	                }
	            }

	            return undefined;
	        }

	        this.getNameOfRemoteStream = function (easyrtcId, webrtcStream) {
	            if (typeof webrtcStream === "string") {
	                return getNameOfRemoteStream(easyrtcId, webrtcStream);
	            } else if (webrtcStream.id) {
	                return getNameOfRemoteStream(easyrtcId, webrtcStream.id);
	            }
	        };

	        /** @private */
	        function closeLocalMediaStreamByName(streamName) {
	            if (!streamName) {
	                streamName = "default";
	            }
	            var stream = self.getLocalStream(streamName);
	            if (!stream) {
	                return;
	            }
	            var streamId = stream.id || "default";
	            var id;
	            var roomName;
	            if (namedLocalMediaStreams[streamName]) {

	                for (id in peerConns) {
	                    if (peerConns.hasOwnProperty(id)) {
	                        try {
	                            peerConns[id].pc.removeStream(stream);
	                        } catch (err) {}
	                        self.sendPeerMessage(id, "__closingMediaStream", { streamId: streamId, streamName: streamName });
	                    }
	                }

	                stopStream(namedLocalMediaStreams[streamName]);
	                delete namedLocalMediaStreams[streamName];

	                if (streamName !== "default") {
	                    var mediaIds = buildMediaIds();
	                    for (roomName in self.roomData) {
	                        if (self.roomData.hasOwnProperty(roomName)) {
	                            self.setRoomApiField(roomName, "mediaIds", mediaIds);
	                        }
	                    }
	                }
	            }
	        }

	        /**
	         * Close the local media stream. You usually need to close the existing media stream
	         * of a camera before reacquiring it at a different resolution.
	         * @param {String} streamName - an option stream name.
	         */
	        this.closeLocalMediaStream = function (streamName) {
	            return closeLocalMediaStreamByName(streamName);
	        };

	        /**
	         * Alias for closeLocalMediaStream
	         */
	        this.closeLocalStream = this.closeLocalMediaStream;

	        /**
	         * This function is used to enable and disable the local camera. If you disable the
	         * camera, video objects display it will "freeze" until the camera is re-enabled. *
	         * By default, a camera is enabled.
	         * @param {Boolean} enable - true to enable the camera, false to disable it.
	         * @param {String} streamName - the name of the stream, optional.
	         */
	        this.enableCamera = function (enable, streamName) {
	            var stream = getLocalMediaStreamByName(streamName);
	            if (stream && stream.getVideoTracks) {
	                enableMediaTracks(enable, stream.getVideoTracks());
	            }
	        };

	        /**
	         * This function is used to enable and disable the local microphone. If you disable
	         * the microphone, sounds stops being transmitted to your peers. By default, the microphone
	         * is enabled.
	         * @param {Boolean} enable - true to enable the microphone, false to disable it.
	         * @param {String} streamName - an optional streamName
	         */
	        this.enableMicrophone = function (enable, streamName) {
	            var stream = getLocalMediaStreamByName(streamName);
	            if (stream && stream.getAudioTracks) {
	                enableMediaTracks(enable, stream.getAudioTracks());
	            }
	        };

	        /**
	         * Mute a video object.
	         * @param {String} videoObjectName - A DOMObject or the id of the DOMObject.
	         * @param {Boolean} mute - true to mute the video object, false to unmute it.
	         */
	        this.muteVideoObject = function (videoObjectName, mute) {
	            var videoObject;
	            if (typeof videoObjectName === 'string') {
	                videoObject = document.getElementById(videoObjectName);
	                if (!videoObject) {
	                    throw "Unknown video object " + videoObjectName;
	                }
	            } else if (!videoObjectName) {
	                throw "muteVideoObject passed a null";
	            } else {
	                videoObject = videoObjectName;
	            }
	            videoObject.muted = !!mute;
	        };

	        /**
	         * Returns a URL for your local camera and microphone.
	         *  It can be called only after easyrtc.initMediaSource has succeeded.
	         *  It returns a url that can be used as a source by the Chrome video element or the &lt;canvas&gt; element.
	         *  @param {String} streamName - an option stream name.
	         *  @return {URL}
	         *  @example
	         *      document.getElementById("myVideo").src = easyrtc.getLocalStreamAsUrl();
	         */
	        self.getLocalStreamAsUrl = function (streamName) {
	            var stream = getLocalMediaStreamByName(streamName);
	            if (stream === null) {
	                throw "Developer error: attempt to get a MediaStream without invoking easyrtc.initMediaSource successfully";
	            }
	            return self.createObjectURL(stream);
	        };

	        /**
	         * Returns a media stream for your local camera and microphone.
	         *  It can be called only after easyrtc.initMediaSource has succeeded.
	         *  It returns a stream that can be used as an argument to easyrtc.setVideoObjectSrc.
	         *  Returns null if there is no local media stream acquired yet.
	         * @return {?MediaStream}
	         * @example
	         *    easyrtc.setVideoObjectSrc( document.getElementById("myVideo"), easyrtc.getLocalStream());
	         */
	        this.getLocalStream = function (streamName) {
	            return getLocalMediaStreamByName(streamName) || null;
	        };

	        /** Clears the media stream on a video object.
	         *
	         * @param {Object} element the video object.
	         * @example
	         *    easyrtc.clearMediaStream( document.getElementById('selfVideo'));
	         *
	         */
	        this.clearMediaStream = function (element) {
	            if (typeof element.src !== 'undefined') {
	                //noinspection JSUndefinedPropertyAssignment
	                element.src = "";
	            } else if (typeof element.srcObject !== 'undefined') {
	                element.srcObject = "";
	            } else if (typeof element.mozSrcObject !== 'undefined') {
	                element.mozSrcObject = null;
	            }
	        };

	        /**
	         *  Sets a video or audio object from a media stream.
	         *  Chrome uses the src attribute and expects a URL, while firefox
	         *  uses the mozSrcObject and expects a stream. This procedure hides
	         *  that from you.
	         *  If the media stream is from a local webcam, you may want to add the
	         *  easyrtcMirror class to the video object so it looks like a proper mirror.
	         *  The easyrtcMirror class is defined in this.css.
	         *  Which is could be added using the same path of easyrtc.js file to an HTML file
	         *  @param {Object} element an HTML5 video element
	         *  @param {MediaStream|String} stream a media stream as returned by easyrtc.getLocalStream or your stream acceptor.
	         * @example
	         *    easyrtc.setVideoObjectSrc( document.getElementById("myVideo"), easyrtc.getLocalStream());
	         *
	         */
	        this.setVideoObjectSrc = function (element, stream) {
	            if (stream && stream !== "") {
	                element.autoplay = true;

	                if (typeof element.src !== 'undefined') {
	                    element.src = self.createObjectURL(stream);
	                } else if (typeof element.srcObject !== 'undefined') {
	                    element.srcObject = stream;
	                } else if (typeof element.mozSrcObject !== 'undefined') {
	                    element.mozSrcObject = self.createObjectURL(stream);
	                }
	                element.play();
	            } else {
	                self.clearMediaStream(element);
	            }
	        };

	        /**
	         * This function builds a new named local media stream from a set of existing audio and video tracks from other media streams.
	         * @param {String} streamName is the name of the new media stream.
	         * @param {Array} audioTracks is an array of MediaStreamTracks
	         * @param {Array} videoTracks is an array of MediaStreamTracks
	         * @returns {?MediaStream} the track created.
	         * @example
	         *    easyrtc.buildLocalMediaStream("myComposedStream",
	         *             easyrtc.getLocalStream("camera1").getVideoTracks(),
	         *             easyrtc.getLocalStream("camera2").getAudioTracks());
	         */
	        this.buildLocalMediaStream = function (streamName, audioTracks, videoTracks) {
	            var i;
	            if (typeof streamName !== 'string') {
	                self.showError(self.errCodes.DEVELOPER_ERR, "easyrtc.buildLocalMediaStream not supplied a stream name");
	                return null;
	            }

	            var streamToClone = null;
	            for (var key in namedLocalMediaStreams) {
	                if (namedLocalMediaStreams.hasOwnProperty(key)) {
	                    streamToClone = namedLocalMediaStreams[key];
	                    if (streamToClone) {
	                        break;
	                    }
	                }
	            }
	            if (!streamToClone) {
	                for (key in peerConns) {
	                    if (peerConns.hasOwnProperty(key)) {
	                        var remoteStreams = peerConns[key].pc.getRemoteStreams();
	                        if (remoteStreams && remoteStreams.length > 0) {
	                            streamToClone = remoteStreams[0];
	                        }
	                    }
	                }
	            }
	            if (!streamToClone) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to create a mediastream without one to clone from");
	                return null;
	            }

	            //
	            // clone whatever mediastream we found, and remove any of it's
	            // tracks.
	            //
	            var mediaClone = streamToClone.clone();
	            var oldTracks = mediaClone.getTracks();

	            if (audioTracks) {
	                for (i = 0; i < audioTracks.length; i++) {
	                    mediaClone.addTrack(audioTracks[i].clone());
	                }
	            }

	            if (videoTracks) {
	                for (i = 0; i < videoTracks.length; i++) {
	                    mediaClone.addTrack(videoTracks[i].clone());
	                }
	            }

	            for (i = 0; i < oldTracks.length; i++) {
	                mediaClone.removeTrack(oldTracks[i]);
	            }

	            registerLocalMediaStreamByName(mediaClone, streamName);
	            return mediaClone;
	        };

	        /* @private*/
	        /** Load Easyrtc Stylesheet.
	         *   Easyrtc Stylesheet define easyrtcMirror class and some basic css class for using easyrtc.js.
	         *   That way, developers can override it or use it's own css file minified css or package.
	         * @example
	         *       easyrtc.loadStylesheet();
	         *
	         */
	        this.loadStylesheet = function () {

	            //
	            // check to see if we already have an easyrtc.css file loaded
	            // if we do, we can exit immediately.
	            //
	            var links = document.getElementsByTagName("link");
	            var cssIndex, css;
	            for (cssIndex in links) {
	                if (links.hasOwnProperty(cssIndex)) {
	                    css = links[cssIndex];
	                    if (css.href && css.href.match(/\/easyrtc.css/)) {
	                        return;
	                    }
	                }
	            }
	            //
	            // add the easyrtc.css file since it isn't present
	            //
	            var easySheet = document.createElement("link");
	            easySheet.setAttribute("rel", "stylesheet");
	            easySheet.setAttribute("type", "text/css");
	            easySheet.setAttribute("href", "/easyrtc/easyrtc.css");
	            var headSection = document.getElementsByTagName("head")[0];
	            var firstHead = headSection.childNodes[0];
	            headSection.insertBefore(easySheet, firstHead);
	        };

	        /**
	         * @private
	         * @param {String} x
	         */
	        this.formatError = function (x) {
	            var name, result;
	            if (x === null || typeof x === 'undefined') {
	                return "null";
	            }
	            if (typeof x === 'string') {
	                return x;
	            } else if (x.type && x.description) {
	                return x.type + " : " + x.description;
	            } else if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
	                try {
	                    return JSON.stringify(x);
	                } catch (oops) {
	                    result = "{";
	                    for (name in x) {
	                        if (x.hasOwnProperty(name)) {
	                            if (typeof x[name] === 'string') {
	                                result = result + name + "='" + x[name] + "' ";
	                            }
	                        }
	                    }
	                    result = result + "}";
	                    return result;
	                }
	            } else {
	                return "Strange case";
	            }
	        };

	        /**
	         * Initializes your access to a local camera and microphone.
	         * Failure could be caused a browser that didn't support WebRTC, or by the user not granting permission.
	         * If you are going to call easyrtc.enableAudio or easyrtc.enableVideo, you need to do it before
	         * calling easyrtc.initMediaSource.
	         * @param {function(Object)} successCallback - will be called with localmedia stream on success.
	         * @param {function(String,String)} errorCallback - is called with an error code and error description.
	         * @param {String} streamName - an optional name for the media source so you can use multiple cameras and
	         * screen share simultaneously.
	         * @example
	         *       easyrtc.initMediaSource(
	         *          function(mediastream){
	         *              easyrtc.setVideoObjectSrc( document.getElementById("mirrorVideo"), mediastream);
	         *          },
	         *          function(errorCode, errorText){
	         *               easyrtc.showError(errorCode, errorText);
	         *          });
	         */
	        this.initMediaSource = function (successCallback, errorCallback, streamName) {

	            logDebug("about to request local media");

	            if (!streamName) {
	                streamName = "default";
	            }

	            haveAudioVideo = {
	                audio: self.audioEnabled,
	                video: self.videoEnabled
	            };

	            if (!errorCallback) {
	                errorCallback = function errorCallback(errorCode, errorText) {
	                    var message = "easyrtc.initMediaSource: " + self.formatError(errorText);
	                    logDebug(message);
	                    self.showError(self.errCodes.MEDIA_ERR, message);
	                };
	            }

	            if (!self.supportsGetUserMedia()) {
	                errorCallback(self.errCodes.MEDIA_ERR, self.getConstantString("noWebrtcSupport"));
	                return;
	            }

	            if (!successCallback) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "easyrtc.initMediaSource not supplied a successCallback");
	                return;
	            }

	            var mode = self.getUserMediaConstraints();
	            /** @private
	             * @param {Object} stream - A mediaStream object.
	             *  */
	            var onUserMediaSuccess = function onUserMediaSuccess(stream) {
	                logDebug("getUserMedia success callback entered");
	                logDebug("successfully got local media");

	                stream.streamName = streamName;
	                registerLocalMediaStreamByName(stream, streamName);
	                var videoObj, triesLeft, _tryToGetSize, ele;
	                if (haveAudioVideo.video) {
	                    videoObj = document.createElement('video');
	                    videoObj.muted = true;
	                    triesLeft = 30;
	                    _tryToGetSize = function tryToGetSize() {
	                        if (videoObj.videoWidth > 0 || triesLeft < 0) {
	                            self.nativeVideoWidth = videoObj.videoWidth;
	                            self.nativeVideoHeight = videoObj.videoHeight;
	                            if (self._desiredVideoProperties.height && (self.nativeVideoHeight !== self._desiredVideoProperties.height || self.nativeVideoWidth !== self._desiredVideoProperties.width)) {
	                                self.showError(self.errCodes.MEDIA_WARNING, self.format(self.getConstantString("resolutionWarning"), self._desiredVideoProperties.width, self._desiredVideoProperties.height, self.nativeVideoWidth, self.nativeVideoHeight));
	                            }
	                            self.setVideoObjectSrc(videoObj, null);
	                            if (videoObj.removeNode) {
	                                videoObj.removeNode(true);
	                            } else {
	                                ele = document.createElement('div');
	                                ele.appendChild(videoObj);
	                                ele.removeChild(videoObj);
	                            }

	                            updateConfigurationInfo();
	                            if (successCallback) {
	                                successCallback(stream);
	                            }
	                        } else {
	                            triesLeft -= 1;
	                            setTimeout(_tryToGetSize, 300);
	                        }
	                    };
	                    self.setVideoObjectSrc(videoObj, stream);
	                    _tryToGetSize();
	                } else {
	                    updateConfigurationInfo();
	                    if (successCallback) {
	                        successCallback(stream);
	                    }
	                }
	            };

	            /**
	             * @private
	             * @param {String} error
	             */
	            var onUserMediaError = function onUserMediaError(error) {
	                logDebug("getusermedia failed");
	                logDebug("failed to get local media");
	                var errText;
	                if (typeof error === 'string') {
	                    errText = error;
	                } else if (error.name) {
	                    errText = error.name;
	                } else {
	                    errText = "Unknown";
	                }
	                if (errorCallback) {
	                    logDebug("invoking error callback", errText);
	                    errorCallback(self.errCodes.MEDIA_ERR, self.format(self.getConstantString("gumFailed"), errText));
	                }
	                closeLocalMediaStreamByName(streamName);
	                haveAudioVideo = {
	                    audio: false,
	                    video: false
	                };
	                updateConfigurationInfo();
	            };

	            if (!self.audioEnabled && !self.videoEnabled) {
	                onUserMediaError(self.getConstantString("requireAudioOrVideo"));
	                return;
	            }

	            function getCurrentTime() {
	                return new Date().getTime();
	            }

	            var firstCallTime;
	            function tryAgain(err) {
	                var currentTime = getCurrentTime();
	                if (currentTime < firstCallTime + 1000) {
	                    logDebug("Trying getUserMedia a second time");
	                    try {
	                        navigator.getUserMedia(mode, onUserMediaSuccess, onUserMediaError);
	                    } catch (e) {
	                        onUserMediaError(err);
	                    }
	                } else {
	                    onUserMediaError(err);
	                }
	            }

	            //
	            // getUserMedia sometimes fails the first time I call it. I suspect it's a page loading
	            // issue. So I'm going to try adding a 1 second delay to allow things to settle down first.
	            // In addition, I'm going to try again after 3 seconds.
	            //
	            try {
	                firstCallTime = getCurrentTime();
	                navigator.getUserMedia(mode, onUserMediaSuccess, tryAgain);
	            } catch (err) {
	                tryAgain(err);
	            }
	        };

	        /**
	         * Sets the callback used to decide whether to accept or reject an incoming call.
	         * @param {Function} acceptCheck takes the arguments (callerEasyrtcid, acceptor).
	         * The acceptCheck callback is passed an easyrtcid and an acceptor function. The acceptor function should be called with either
	         * a true value (accept the call) or false value( reject the call) as it's first argument, and optionally,
	         * an array of local media streamNames as a second argument.
	         * @example
	         *      easyrtc.setAcceptChecker( function(easyrtcid, acceptor){
	         *           if( easyrtc.idToName(easyrtcid) === 'Fred' ){
	         *              acceptor(true);
	         *           }
	         *           else if( easyrtc.idToName(easyrtcid) === 'Barney' ){
	         *              setTimeout( function(){
	         acceptor(true, ['myOtherCam']); // myOtherCam presumed to a streamName
	         }, 10000);
	         *           }
	         *           else{
	         *              acceptor(false);
	         *           }
	         *      });
	         */
	        this.setAcceptChecker = function (acceptCheck) {
	            self.acceptCheck = acceptCheck;
	        };

	        /**
	         * easyrtc.setStreamAcceptor sets a callback to receive media streams from other peers, independent
	         * of where the call was initiated (caller or callee).
	         * @param {Function} acceptor takes arguments (caller, mediaStream, mediaStreamName)
	         * @example
	         *  easyrtc.setStreamAcceptor(function(easyrtcid, stream, streamName){
	         *     document.getElementById('callerName').innerHTML = easyrtc.idToName(easyrtcid);
	         *     easyrtc.setVideoObjectSrc( document.getElementById("callerVideo"), stream);
	         *  });
	         */
	        this.setStreamAcceptor = function (acceptor) {
	            self.streamAcceptor = acceptor;
	        };

	        /** Sets the easyrtc.onError field to a user specified function.
	         * @param {Function} errListener takes an object of the form {errorCode: String, errorText: String}
	         * @example
	         *    easyrtc.setOnError( function(errorObject){
	         *        document.getElementById("errMessageDiv").innerHTML += errorObject.errorText;
	         *    });
	         */
	        self.setOnError = function (errListener) {
	            self.onError = errListener;
	        };

	        /**
	         * Sets the callCancelled callback. This will be called when a remote user
	         * initiates a call to you, but does a "hangup" before you have a chance to get his video stream.
	         * @param {Function} callCancelled takes an easyrtcid as an argument and a boolean that indicates whether
	         *  the call was explicitly cancelled remotely (true), or actually accepted by the user attempting a call to
	         *  the same party.
	         * @example
	         *     easyrtc.setCallCancelled( function(easyrtcid, explicitlyCancelled){
	         *        if( explicitlyCancelled ){
	         *            console.log(easyrtc.idToName(easyrtcid) + " stopped trying to reach you");
	         *         }
	         *         else{
	         *            console.log("Implicitly called "  + easyrtc.idToName(easyrtcid));
	         *         }
	         *     });
	         */
	        this.setCallCancelled = function (callCancelled) {
	            self.callCancelled = callCancelled;
	        };

	        /**  Sets a callback to receive notification of a media stream closing. The usual
	         *  use of this is to clear the source of your video object so you aren't left with
	         *  the last frame of the video displayed on it.
	         *  @param {Function} onStreamClosed takes an easyrtcid as it's first parameter, the stream as it's second argument, and name of the video stream as it's third.
	         *  @example
	         *     easyrtc.setOnStreamClosed( function(easyrtcid, stream, streamName){
	         *         easyrtc.setVideoObjectSrc( document.getElementById("callerVideo"), "");
	         *         ( easyrtc.idToName(easyrtcid) + " closed stream " + stream.id + " " + streamName);
	         *     });
	         */
	        this.setOnStreamClosed = function (onStreamClosed) {
	            self.onStreamClosed = onStreamClosed;
	        };

	        /**
	         * Sets a listener for data sent from another client (either peer to peer or via websockets).
	         * If no msgType or source is provided, the listener applies to all events that aren't otherwise handled.
	         * If a msgType but no source is provided, the listener applies to all messages of that msgType that aren't otherwise handled.
	         * If a msgType and a source is provided, the listener applies to only message of the specified type coming from the specified peer.
	         * The most specific case takes priority over the more general.
	         * @param {Function} listener has the signature (easyrtcid, msgType, msgData, targeting).
	         *   msgType is a string. targeting is null if the message was received using WebRTC data channels, otherwise it
	         *   is an object that contains one or more of the following string valued elements {targetEasyrtcid, targetGroup, targetRoom}.
	         * @param {String} msgType - a string, optional.
	         * @param {String} source - the sender's easyrtcid, optional.
	         * @example
	         *     easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting){
	         *         console.log("From " + easyrtc.idToName(easyrtcid) +
	         *             " sent the following data " + JSON.stringify(msgData));
	         *     });
	         *     easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting){
	         *         console.log("From " + easyrtc.idToName(easyrtcid) +
	         *             " sent the following data " + JSON.stringify(msgData));
	         *     }, 'food', 'dkdjdekj44--');
	         *     easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting){
	         *         console.log("From " + easyrtcid +
	         *             " sent the following data " + JSON.stringify(msgData));
	         *     }, 'drink');
	         *
	         *
	         */
	        this.setPeerListener = function (listener, msgType, source) {
	            if (!msgType) {
	                receivePeer.cb = listener;
	            } else {
	                if (!receivePeer.msgTypes[msgType]) {
	                    receivePeer.msgTypes[msgType] = { sources: {} };
	                }
	                if (!source) {
	                    receivePeer.msgTypes[msgType].cb = listener;
	                } else {
	                    receivePeer.msgTypes[msgType].sources[source] = { cb: listener };
	                }
	            }
	        };
	        /* This function serves to distribute peer messages to the various peer listeners */
	        /** @private
	         * @param {String} easyrtcid
	         * @param {Object} msg - needs to contain a msgType and a msgData field.
	         * @param {Object} targeting
	         */
	        this.receivePeerDistribute = function (easyrtcid, msg, targeting) {
	            var msgType = msg.msgType;
	            var msgData = msg.msgData;
	            if (!msgType) {
	                logDebug("received peer message without msgType", msg);
	                return;
	            }

	            if (receivePeer.msgTypes[msgType]) {
	                if (receivePeer.msgTypes[msgType].sources[easyrtcid] && receivePeer.msgTypes[msgType].sources[easyrtcid].cb) {
	                    receivePeer.msgTypes[msgType].sources[easyrtcid].cb(easyrtcid, msgType, msgData, targeting);
	                    return;
	                }
	                if (receivePeer.msgTypes[msgType].cb) {
	                    receivePeer.msgTypes[msgType].cb(easyrtcid, msgType, msgData, targeting);
	                    return;
	                }
	            }
	            if (receivePeer.cb) {
	                receivePeer.cb(easyrtcid, msgType, msgData, targeting);
	            }
	        };

	        /**
	         * Sets a listener for messages from the server.
	         * @param {Function} listener has the signature (msgType, msgData, targeting)
	         * @example
	         *     easyrtc.setServerListener( function(msgType, msgData, targeting){
	         *         ("The Server sent the following message " + JSON.stringify(msgData));
	         *     });
	         */
	        this.setServerListener = function (listener) {
	            receiveServerCB = listener;
	        };

	        /**
	         * Sets the url of the Socket server.
	         * The node.js server is great as a socket server, but it doesn't have
	         * all the hooks you'd like in a general web server, like PHP or Python
	         * plug-ins. By setting the serverPath your application can get it's regular
	         * pages from a regular web server, but the EasyRTC library can still reach the
	         * socket server.
	         * @param {String} socketUrl
	         * @param {Object} options an optional dictionary of options for socket.io's connect method.
	         * The default is {'connect timeout': 10000,'force new connection': true }
	         * @example
	         *     easyrtc.setSocketUrl(":8080", options);
	         */
	        this.setSocketUrl = function (socketUrl, options) {
	            logDebug("WebRTC signaling server URL set to " + socketUrl);
	            serverPath = socketUrl;
	            if (options) {
	                connectionOptions = options;
	            }
	        };

	        /**
	         * Sets the user name associated with the connection.
	         * @param {String} username must obey standard identifier conventions.
	         * @returns {Boolean} true if the call succeeded, false if the username was invalid.
	         * @example
	         *    if( !easyrtc.setUsername("JohnSmith") ){
	         *        console.error("bad user name);
	         *    }
	         *
	         */
	        this.setUsername = function (username) {
	            if (self.myEasyrtcid) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "easyrtc.setUsername called after authentication");
	                return false;
	            } else if (self.isNameValid(username)) {
	                self.username = username;
	                return true;
	            } else {
	                self.showError(self.errCodes.BAD_NAME, self.format(self.getConstantString("badUserName"), username));
	                return false;
	            }
	        };

	        /**
	         * Get an array of easyrtcids that are using a particular username
	         * @param {String} username - the username of interest.
	         * @param {String} room - an optional room name argument limiting results to a particular room.
	         * @returns {Array} an array of {easyrtcid:id, roomName: roomName}.
	         */
	        this.usernameToIds = function (username, room) {
	            var results = [];
	            var id, roomName;
	            for (roomName in lastLoggedInList) {
	                if (!lastLoggedInList.hasOwnProperty(roomName)) {
	                    continue;
	                }
	                if (room && roomName !== room) {
	                    continue;
	                }
	                for (id in lastLoggedInList[roomName]) {
	                    if (!lastLoggedInList[roomName].hasOwnProperty(id)) {
	                        continue;
	                    }
	                    if (lastLoggedInList[roomName][id].username === username) {
	                        results.push({
	                            easyrtcid: id,
	                            roomName: roomName
	                        });
	                    }
	                }
	            }
	            return results;
	        };

	        /**
	         * Returns another peers API field, if it exists.
	         * @param {type} roomName
	         * @param {type} easyrtcid
	         * @param {type} fieldName
	         * @returns {Object}  Undefined if the attribute does not exist, its value otherwise.
	         */
	        this.getRoomApiField = function (roomName, easyrtcid, fieldName) {
	            if (lastLoggedInList[roomName] && lastLoggedInList[roomName][easyrtcid] && lastLoggedInList[roomName][easyrtcid].apiField && lastLoggedInList[roomName][easyrtcid].apiField[fieldName]) {
	                return lastLoggedInList[roomName][easyrtcid].apiField[fieldName].fieldValue;
	            } else {
	                return undefined;
	            }
	        };

	        /**
	         * Set the authentication credential if needed.
	         * @param {Object} credentialParm - a JSONable object.
	         */
	        this.setCredential = function (credentialParm) {
	            try {
	                JSON.stringify(credentialParm);
	                credential = credentialParm;
	                return true;
	            } catch (oops) {
	                self.showError(self.errCodes.BAD_CREDENTIAL, "easyrtc.setCredential passed a non-JSON-able object");
	                throw "easyrtc.setCredential passed a non-JSON-able object";
	            }
	        };

	        /**
	         * Sets the listener for socket disconnection by external (to the API) reasons.
	         * @param {Function} disconnectListener takes no arguments and is not called as a result of calling easyrtc.disconnect.
	         * @example
	         *    easyrtc.setDisconnectListener(function(){
	         *        easyrtc.showError("SYSTEM-ERROR", "Lost our connection to the socket server");
	         *    });
	         */
	        this.setDisconnectListener = function (disconnectListener) {
	            self.disconnectListener = disconnectListener;
	        };

	        /**
	         * Convert an easyrtcid to a user name. This is useful for labeling buttons and messages
	         * regarding peers.
	         * @param {String} easyrtcid
	         * @return {String} the username associated with the easyrtcid, or the easyrtcid if there is
	         * no associated username.
	         * @example
	         *    console.log(easyrtcid + " is actually " + easyrtc.idToName(easyrtcid));
	         */
	        this.idToName = function (easyrtcid) {
	            var roomName;
	            for (roomName in lastLoggedInList) {
	                if (!lastLoggedInList.hasOwnProperty(roomName)) {
	                    continue;
	                }
	                if (lastLoggedInList[roomName][easyrtcid]) {
	                    if (lastLoggedInList[roomName][easyrtcid].username) {
	                        return lastLoggedInList[roomName][easyrtcid].username;
	                    }
	                }
	            }
	            return easyrtcid;
	        };

	        /* used in easyrtc.connect */
	        /** @private */
	        this.webSocket = null;
	        /** @private */
	        var pc_config = {};
	        /** @private */
	        var pc_config_to_use = null;
	        /** @private */
	        var use_fresh_ice_each_peer = false;

	        /**
	         * Determines whether fresh ice server configuration should be requested from the server for each peer connection.
	         * @param {Boolean} value the default is false.
	         */
	        this.setUseFreshIceEachPeerConnection = function (value) {
	            use_fresh_ice_each_peer = value;
	        };

	        /**
	         * Returns the last ice config supplied by the EasyRTC server. This function is not normally used, it is provided
	         * for people who want to try filtering ice server configuration on the client.
	         * @return {Object} which has the form {iceServers:[ice_server_entry, ice_server_entry, ...]}
	         */
	        this.getServerIce = function () {
	            return pc_config;
	        };

	        /**
	         * Sets the ice server configuration that will be used in subsequent calls. You only need this function if you are filtering
	         * the ice server configuration on the client or if you are using TURN certificates that have a very short lifespan.
	         * @param {Object} ice An object with iceServers element containing an array of ice server entries.
	         * @example
	         *     easyrtc.setIceUsedInCalls( {"iceServers": [
	         *      {
	         *         "url": "stun:stun.sipgate.net"
	         *      },
	         *      {
	         *         "url": "stun:217.10.68.152"
	         *      },
	         *      {
	         *         "url": "stun:stun.sipgate.net:10000"
	         *      }
	         *      ]});
	         *      easyrtc.call(...);
	         */
	        this.setIceUsedInCalls = function (ice) {
	            if (!ice.iceServers) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Bad ice configuration passed to easyrtc.setIceUsedInCalls");
	            } else {
	                pc_config_to_use = ice;
	            }
	        };

	        /** @private */
	        function getRemoteStreamByName(peerConn, otherUser, streamName) {

	            var keyToMatch = null;
	            var remoteStreams = peerConn.pc.getRemoteStreams();

	            // No streamName lead to default 
	            if (!streamName) {
	                streamName = "default";
	            }

	            // default lead to first if available
	            if (streamName === "default") {
	                if (remoteStreams.length > 0) {
	                    return remoteStreams[0];
	                } else {
	                    return null;
	                }
	            }

	            // Get mediaIds from user roomData
	            for (var roomName in self.roomData) {
	                if (self.roomData.hasOwnProperty(roomName)) {
	                    var mediaIds = self.getRoomApiField(roomName, otherUser, "mediaIds");
	                    keyToMatch = mediaIds ? mediaIds[streamName] : null;
	                    if (keyToMatch) {
	                        break;
	                    }
	                }
	            }

	            // 
	            if (!keyToMatch) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "remote peer does not have media stream called " + streamName);
	            }

	            // 
	            for (var i = 0; i < remoteStreams.length; i++) {
	                var remoteId;
	                if (remoteStreams[i].id) {
	                    remoteId = remoteStreams[i].id;
	                } else {
	                    remoteId = "default";
	                }

	                if (!keyToMatch || // No match
	                remoteId === keyToMatch || // Full match
	                remoteId.indexOf(keyToMatch) === 0 // Partial match
	                ) {
	                        return remoteStreams[i];
	                    }
	            }

	            return null;
	        }

	        /**
	         * @private
	         * @param {string} easyrtcid
	         * @param {boolean} checkAudio
	         * @param {string} streamName
	         */
	        function _haveTracks(easyrtcid, checkAudio, streamName) {
	            var stream, peerConnObj;
	            if (!easyrtcid) {
	                stream = getLocalMediaStreamByName(streamName);
	            } else {
	                peerConnObj = peerConns[easyrtcid];
	                if (!peerConnObj) {
	                    self.showError(self.errCodes.DEVELOPER_ERR, "haveTracks called about a peer you don't have a connection to");
	                    return false;
	                }
	                stream = getRemoteStreamByName(peerConns[easyrtcid], easyrtcid, streamName);
	            }
	            if (!stream) {
	                return false;
	            }

	            var tracks;
	            try {

	                if (checkAudio) {
	                    tracks = stream.getAudioTracks();
	                } else {
	                    tracks = stream.getVideoTracks();
	                }
	            } catch (oops) {
	                // TODO why do we return true here ?
	                return true;
	            }

	            if (!tracks) {
	                return false;
	            }

	            return tracks.length > 0;
	        }

	        /** Determines if a particular peer2peer connection has an audio track.
	         * @param {String} easyrtcid - the id of the other caller in the connection. If easyrtcid is not supplied, checks the local media.
	         * @param {String} streamName - an optional stream id.
	         * @return {Boolean} true if there is an audio track or the browser can't tell us.
	         */
	        this.haveAudioTrack = function (easyrtcid, streamName) {
	            return _haveTracks(easyrtcid, true, streamName);
	        };

	        /** Determines if a particular peer2peer connection has a video track.
	         * @param {String} easyrtcid - the id of the other caller in the connection. If easyrtcid is not supplied, checks the local media.
	         * @param {String} streamName - an optional stream id.     *
	         * @return {Boolean} true if there is an video track or the browser can't tell us.
	         */
	        this.haveVideoTrack = function (easyrtcid, streamName) {
	            return _haveTracks(easyrtcid, false, streamName);
	        };

	        /**
	         * Gets a data field associated with a room.
	         * @param {String} roomName - the name of the room.
	         * @param {String} fieldName - the name of the field.
	         * @return {Object} dataValue - the value of the field if present, undefined if not present.
	         */
	        this.getRoomField = function (roomName, fieldName) {
	            var fields = self.getRoomFields(roomName);
	            return !fields || !fields[fieldName] ? undefined : fields[fieldName].fieldValue;
	        };

	        /** @private */
	        var fields = null;

	        /** @private */
	        var preallocatedSocketIo = null;

	        /** @private */
	        var closedChannel = null;

	        //
	        // easyrtc.disconnect performs a clean disconnection of the client from the server.
	        //
	        function disconnectBody() {
	            var key;
	            self.loggingOut = true;
	            offersPending = {};
	            acceptancePending = {};
	            self.disconnecting = true;
	            closedChannel = self.webSocket;
	            if (self.webSocketConnected) {
	                if (!preallocatedSocketIo) {
	                    self.webSocket.close();
	                }
	                self.webSocketConnected = false;
	            }
	            self.hangupAll();
	            if (roomOccupantListener) {
	                for (key in lastLoggedInList) {
	                    if (lastLoggedInList.hasOwnProperty(key)) {
	                        roomOccupantListener(key, {}, false);
	                    }
	                }
	            }
	            lastLoggedInList = {};
	            self.emitEvent("roomOccupant", {});
	            self.roomData = {};
	            self.roomJoin = {};
	            self._roomApiFields = {};
	            self.loggingOut = false;
	            self.myEasyrtcid = null;
	            self.disconnecting = false;
	            oldConfig = {};
	        }

	        /**
	         * Disconnect from the EasyRTC server.
	         * @example
	         *    easyrtc.disconnect();
	         */
	        this.disconnect = function () {

	            logDebug("attempt to disconnect from WebRTC signalling server");

	            self.disconnecting = true;
	            self.hangupAll();
	            self.loggingOut = true;
	            //
	            // The hangupAll may try to send configuration information back to the server.
	            // Collecting that information is asynchronous, we don't actually close the
	            // connection until it's had a chance to be sent. We allocate 100ms for collecting
	            // the info, so 250ms should be sufficient for the disconnecting.
	            //
	            setTimeout(function () {
	                if (self.webSocket) {
	                    try {
	                        self.webSocket.disconnect();
	                    } catch (e) {
	                        // we don't really care if this fails.
	                    }

	                    closedChannel = self.webSocket;
	                    self.webSocket = 0;
	                }
	                self.loggingOut = false;
	                self.disconnecting = false;
	                if (roomOccupantListener) {
	                    roomOccupantListener(null, {}, false);
	                }
	                self.emitEvent("roomOccupant", {});
	                oldConfig = {};
	            }, 250);
	        };

	        /** @private */
	        //
	        // This function is used to send WebRTC signaling messages to another client. These messages all the form:
	        //   destUser: some id or null
	        //   msgType: one of ["offer"/"answer"/"candidate","reject","hangup", "getRoomList"]
	        //   msgData: either null or an SDP record
	        //   successCallback: a function with the signature  function(msgType, wholeMsg);
	        //   errorCallback: a function with signature function(errorCode, errorText)
	        //
	        function sendSignalling(destUser, msgType, msgData, successCallback, errorCallback) {
	            if (!self.webSocket) {
	                throw "Attempt to send message without a valid connection to the server.";
	            } else {
	                var dataToShip = {
	                    msgType: msgType
	                };
	                if (destUser) {
	                    dataToShip.targetEasyrtcid = destUser;
	                }
	                if (msgData) {
	                    dataToShip.msgData = msgData;
	                }

	                logDebug("sending socket message " + JSON.stringify(dataToShip));

	                self.webSocket.json.emit("easyrtcCmd", dataToShip, function (ackMsg) {
	                    if (ackMsg.msgType !== "error") {
	                        if (!ackMsg.hasOwnProperty("msgData")) {
	                            ackMsg.msgData = null;
	                        }
	                        if (successCallback) {
	                            successCallback(ackMsg.msgType, ackMsg.msgData);
	                        }
	                    } else {
	                        if (errorCallback) {
	                            errorCallback(ackMsg.msgData.errorCode, ackMsg.msgData.errorText);
	                        } else {
	                            self.showError(ackMsg.msgData.errorCode, ackMsg.msgData.errorText);
	                        }
	                    }
	                });
	            }
	        }

	        /** @private */
	        //
	        // This function is used to send large messages. it sends messages that have a transfer field
	        // so that the receiver knows it's a transfer message. To differentiate the transfers, a
	        // transferId is generated and passed for each message.
	        //
	        var sendByChunkUidCounter = 0;
	        /** @private */
	        function sendByChunkHelper(destUser, msgData) {
	            var transferId = destUser + '-' + sendByChunkUidCounter++;

	            var pos, len, startMessage, message, endMessage;
	            var numberOfChunks = Math.ceil(msgData.length / self.maxP2PMessageLength);
	            startMessage = {
	                transfer: 'start',
	                transferId: transferId,
	                parts: numberOfChunks
	            };

	            endMessage = {
	                transfer: 'end',
	                transferId: transferId
	            };

	            peerConns[destUser].dataChannelS.send(JSON.stringify(startMessage));

	            for (pos = 0, len = msgData.length; pos < len; pos += self.maxP2PMessageLength) {
	                message = {
	                    transferId: transferId,
	                    data: msgData.substr(pos, self.maxP2PMessageLength),
	                    transfer: 'chunk'
	                };
	                peerConns[destUser].dataChannelS.send(JSON.stringify(message));
	            }

	            peerConns[destUser].dataChannelS.send(JSON.stringify(endMessage));
	        }

	        /**
	         *Sends data to another user using previously established data channel. This method will
	         * fail if no data channel has been established yet. Unlike the easyrtc.sendWS method,
	         * you can't send a dictionary, convert dictionaries to strings using JSON.stringify first.
	         * What data types you can send, and how large a data type depends on your browser.
	         * @param {String} destUser (an easyrtcid)
	         * @param {String} msgType - the type of message being sent (application specific).
	         * @param {Object} msgData - a JSONable object.
	         * @example
	         *     easyrtc.sendDataP2P(someEasyrtcid, "roomData", {room:499, bldgNum:'asd'});
	         */
	        this.sendDataP2P = function (destUser, msgType, msgData) {

	            var flattenedData = JSON.stringify({ msgType: msgType, msgData: msgData });
	            logDebug("sending p2p message to " + destUser + " with data=" + JSON.stringify(flattenedData));

	            if (!peerConns[destUser]) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to send data peer to peer without a connection to " + destUser + ' first.');
	            } else if (!peerConns[destUser].dataChannelS) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to send data peer to peer without establishing a data channel to " + destUser + ' first.');
	            } else if (!peerConns[destUser].dataChannelReady) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to use data channel to " + destUser + " before it's ready to send.");
	            } else {
	                try {
	                    if (flattenedData.length > self.maxP2PMessageLength) {
	                        sendByChunkHelper(destUser, flattenedData);
	                    } else {
	                        peerConns[destUser].dataChannelS.send(flattenedData);
	                    }
	                } catch (sendDataErr) {
	                    logDebug("sendDataP2P error: ", sendDataErr);
	                    throw sendDataErr;
	                }
	            }
	        };

	        /** Sends data to another user using websockets. The easyrtc.sendServerMessage or easyrtc.sendPeerMessage methods
	         * are wrappers for this method; application code should use them instead.
	         * @param {String} destination - either a string containing the easyrtcId of the other user, or an object containing some subset of the following fields: targetEasyrtcid, targetGroup, targetRoom.
	         * Specifying multiple fields restricts the scope of the destination (operates as a logical AND, not a logical OR).
	         * @param {String} msgType -the type of message being sent (application specific).
	         * @param {Object} msgData - a JSONable object.
	         * @param {Function} ackhandler - by default, the ackhandler handles acknowledgments from the server that your message was delivered to it's destination.
	         * However, application logic in the server can over-ride this. If you leave this null, a stub ackHandler will be used. The ackHandler
	         * gets passed a message with the same msgType as your outgoing message, or a message type of "error" in which case
	         * msgData will contain a errorCode and errorText fields.
	         * @example
	         *    easyrtc.sendDataWS(someEasyrtcid, "setPostalAddress", {room:499, bldgNum:'asd'},
	         *      function(ackMsg){
	         *          console.log("saw the following acknowledgment " + JSON.stringify(ackMsg));
	         *      }
	         *    );
	         */
	        this.sendDataWS = function (destination, msgType, msgData, ackhandler) {
	            logDebug("sending client message via websockets to " + destination + " with data=" + JSON.stringify(msgData));

	            if (!ackhandler) {
	                ackhandler = function ackhandler(msg) {
	                    if (msg.msgType === "error") {
	                        self.showError(msg.msgData.errorCode, msg.msgData.errorText);
	                    }
	                };
	            }

	            var outgoingMessage = {
	                msgType: msgType,
	                msgData: msgData
	            };

	            if (destination) {
	                if (typeof destination === 'string') {
	                    outgoingMessage.targetEasyrtcid = destination;
	                } else if ((typeof destination === 'undefined' ? 'undefined' : _typeof(destination)) === 'object') {
	                    if (destination.targetEasyrtcid) {
	                        outgoingMessage.targetEasyrtcid = destination.targetEasyrtcid;
	                    }
	                    if (destination.targetRoom) {
	                        outgoingMessage.targetRoom = destination.targetRoom;
	                    }
	                    if (destination.targetGroup) {
	                        outgoingMessage.targetGroup = destination.targetGroup;
	                    }
	                }
	            }

	            if (self.webSocket) {
	                self.webSocket.json.emit("easyrtcMsg", outgoingMessage, ackhandler);
	            } else {
	                logDebug("websocket failed because no connection to server");

	                throw "Attempt to send message without a valid connection to the server.";
	            }
	        };

	        /** Sends data to another user. This method uses data channels if one has been set up, or websockets otherwise.
	         * @param {String} destUser - a string containing the easyrtcId of the other user.
	         * Specifying multiple fields restricts the scope of the destination (operates as a logical AND, not a logical OR).
	         * @param {String} msgType -the type of message being sent (application specific).
	         * @param {Object} msgData - a JSONable object.
	         * @param {Function} ackHandler - a function which receives acknowledgments. May only be invoked in
	         *  the websocket case.
	         * @example
	         *    easyrtc.sendData(someEasyrtcid, "roomData",  {room:499, bldgNum:'asd'},
	         *       function ackHandler(msgType, msgData);
	         *    );
	         */
	        this.sendData = function (destUser, msgType, msgData, ackHandler) {
	            if (peerConns[destUser] && peerConns[destUser].dataChannelReady) {
	                self.sendDataP2P(destUser, msgType, msgData);
	            } else {
	                self.sendDataWS(destUser, msgType, msgData, ackHandler);
	            }
	        };

	        /**
	         * Sends a message to another peer on the easyrtcMsg channel.
	         * @param {String} destination - either a string containing the easyrtcId of the other user, or an object containing some subset of the following fields: targetEasyrtcid, targetGroup, targetRoom.
	         * Specifying multiple fields restricts the scope of the destination (operates as a logical AND, not a logical OR).
	         * @param {String} msgType - the type of message being sent (application specific).
	         * @param {Object} msgData - a JSONable object with the message contents.
	         * @param {function(String, Object)} successCB - a callback function with results from the server.
	         * @param {function(String, String)} failureCB - a callback function to handle errors.
	         * @example
	         *     easyrtc.sendPeerMessage(otherUser, 'offer_candy', {candy_name:'mars'},
	         *             function(msgType, msgBody ){
	         *                console.log("message was sent");
	         *             },
	         *             function(errorCode, errorText){
	         *                console.log("error was " + errorText);
	         *             });
	         */
	        this.sendPeerMessage = function (destination, msgType, msgData, successCB, failureCB) {
	            if (!destination) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "destination was null in sendPeerMessage");
	            }

	            logDebug("sending peer message " + JSON.stringify(msgData));

	            function ackHandler(response) {
	                if (response.msgType === "error") {
	                    if (failureCB) {
	                        failureCB(response.msgData.errorCode, response.msgData.errorText);
	                    }
	                } else {
	                    if (successCB) {
	                        // firefox complains if you pass an undefined as an parameter.
	                        successCB(response.msgType, response.msgData ? response.msgData : null);
	                    }
	                }
	            }

	            self.sendDataWS(destination, msgType, msgData, ackHandler);
	        };

	        /**
	         * Sends a message to the application code in the server (ie, on the easyrtcMsg channel).
	         * @param {String} msgType - the type of message being sent (application specific).
	         * @param {Object} msgData - a JSONable object with the message contents.
	         * @param {function(String, Object)} successCB - a callback function with results from the server.
	         * @param {function(String, String)} failureCB - a callback function to handle errors.
	         * @example
	         *     easyrtc.sendServerMessage('get_candy', {candy_name:'mars'},
	         *             function(msgType, msgData ){
	         *                console.log("got candy count of " + msgData.barCount);
	         *             },
	         *             function(errorCode, errorText){
	         *                console.log("error was " + errorText);
	         *             });
	         */
	        this.sendServerMessage = function (msgType, msgData, successCB, failureCB) {

	            var dataToShip = { msgType: msgType, msgData: msgData };
	            logDebug("sending server message " + JSON.stringify(dataToShip));

	            function ackhandler(response) {
	                if (response.msgType === "error") {
	                    if (failureCB) {
	                        failureCB(response.msgData.errorCode, response.msgData.errorText);
	                    }
	                } else {
	                    if (successCB) {
	                        successCB(response.msgType, response.msgData ? response.msgData : null);
	                    }
	                }
	            }

	            self.sendDataWS(null, msgType, msgData, ackhandler);
	        };

	        /** Sends the server a request for the list of rooms the user can see.
	         * You must have already be connected to use this function.
	         * @param {function(Object)} callback - on success, this function is called with a map of the form  { roomName:{"roomName":String, "numberClients": Number}}.
	         * The roomName appears as both the key to the map, and as the value of the "roomName" field.
	         * @param {function(String, String)} errorCallback   is called on failure. It gets an errorCode and errorText as it's too arguments.
	         * @example
	         *    easyrtc.getRoomList(
	         *        function(roomList){
	         *           for(roomName in roomList){
	         *              console.log("saw room " + roomName);
	         *           }
	         *         },
	         *         function(errorCode, errorText){
	         *            easyrtc.showError(errorCode, errorText);
	         *         }
	         *    );
	         */
	        this.getRoomList = function (callback, errorCallback) {
	            sendSignalling(null, "getRoomList", null, function (msgType, msgData) {
	                callback(msgData.roomList);
	            }, function (errorCode, errorText) {
	                if (errorCallback) {
	                    errorCallback(errorCode, errorText);
	                } else {
	                    self.showError(errorCode, errorText);
	                }
	            });
	        };

	        /** Value returned by easyrtc.getConnectStatus if the other user isn't connected to us. */
	        this.NOT_CONNECTED = "not connected";

	        /** Value returned by easyrtc.getConnectStatus if the other user is in the process of getting connected */
	        this.BECOMING_CONNECTED = "connection in progress to us.";

	        /** Value returned by easyrtc.getConnectStatus if the other user is connected to us. */
	        this.IS_CONNECTED = "is connected";

	        /**
	         * Check if the client has a peer-2-peer connection to another user.
	         * The return values are text strings so you can use them in debugging output.
	         *  @param {String} otherUser - the easyrtcid of the other user.
	         *  @return {String} one of the following values: easyrtc.NOT_CONNECTED, easyrtc.BECOMING_CONNECTED, easyrtc.IS_CONNECTED
	         *  @example
	         *     if( easyrtc.getConnectStatus(otherEasyrtcid) == easyrtc.NOT_CONNECTED ){
	         *         easyrtc.call(otherEasyrtcid,
	         *                  function(){ console.log("success"); },
	         *                  function(){ console.log("failure"); });
	         *     }
	         */
	        this.getConnectStatus = function (otherUser) {
	            if (!peerConns.hasOwnProperty(otherUser)) {
	                return self.NOT_CONNECTED;
	            }
	            var peer = peerConns[otherUser];
	            if ((peer.sharingAudio || peer.sharingVideo) && !peer.startedAV) {
	                return self.BECOMING_CONNECTED;
	            } else if (peer.sharingData && !peer.dataChannelReady) {
	                return self.BECOMING_CONNECTED;
	            } else {
	                return self.IS_CONNECTED;
	            }
	        };

	        /**
	         * @private
	         */
	        function buildPeerConstraints() {
	            var options = [];
	            options.push({ 'DtlsSrtpKeyAgreement': 'true' }); // for interoperability
	            return { optional: options };
	        }

	        /** @private */
	        function sendQueuedCandidates(peer, onSignalSuccess, onSignalFailure) {
	            var i;
	            for (i = 0; i < peerConns[peer].candidatesToSend.length; i++) {
	                sendSignalling(peer, "candidate", peerConns[peer].candidatesToSend[i], onSignalSuccess, onSignalFailure);
	            }
	        }

	        /** @private */
	        //
	        // This function calls the users onStreamClosed handler, passing it the easyrtcid of the peer, the stream itself,
	        // and the name of the stream.
	        //
	        function emitOnStreamClosed(easyrtcid, stream) {
	            if (!peerConns[easyrtcid]) {
	                return;
	            }
	            var streamName;
	            var id;
	            if (stream.id) {
	                id = stream.id;
	            } else {
	                id = "default";
	            }
	            streamName = peerConns[easyrtcid].remoteStreamIdToName[id] || "default";
	            if (peerConns[easyrtcid].liveRemoteStreams[streamName] && self.onStreamClosed) {
	                delete peerConns[easyrtcid].liveRemoteStreams[streamName];
	                self.onStreamClosed(easyrtcid, stream, streamName);
	            }
	            delete peerConns[easyrtcid].remoteStreamIdToName[id];
	        }

	        /** @private */
	        function onRemoveStreamHelper(easyrtcid, stream) {
	            if (peerConns[easyrtcid]) {
	                emitOnStreamClosed(easyrtcid, stream);
	                updateConfigurationInfo();
	                if (peerConns[easyrtcid].pc) {
	                    try {
	                        peerConns[easyrtcid].pc.removeStream(stream);
	                    } catch (err) {}
	                }
	            }
	        }

	        /** @private */
	        function buildDeltaRecord(added, deleted) {
	            function objectNotEmpty(obj) {
	                var i;
	                for (i in obj) {
	                    if (obj.hasOwnProperty(i)) {
	                        return true;
	                    }
	                }
	                return false;
	            }

	            var result = {};
	            if (objectNotEmpty(added)) {
	                result.added = added;
	            }

	            if (objectNotEmpty(deleted)) {
	                result.deleted = deleted;
	            }

	            if (objectNotEmpty(result)) {
	                return result;
	            } else {
	                return null;
	            }
	        }

	        /** @private */
	        function findDeltas(oldVersion, newVersion) {
	            var i;
	            var added = {},
	                deleted = {};
	            var subPart;
	            for (i in newVersion) {
	                if (newVersion.hasOwnProperty(i)) {
	                    if (oldVersion === null || typeof oldVersion[i] === 'undefined') {
	                        added[i] = newVersion[i];
	                    } else if (_typeof(newVersion[i]) === 'object') {
	                        subPart = findDeltas(oldVersion[i], newVersion[i]);
	                        if (subPart !== null) {
	                            added[i] = newVersion[i];
	                        }
	                    } else if (newVersion[i] !== oldVersion[i]) {
	                        added[i] = newVersion[i];
	                    }
	                }
	            }
	            for (i in oldVersion) {
	                if (newVersion.hasOwnProperty(i)) {
	                    if (typeof newVersion[i] === 'undefined') {
	                        deleted[i] = oldVersion[i];
	                    }
	                }
	            }

	            return buildDeltaRecord(added, deleted);
	        }

	        /** @private */
	        //
	        // this function collects configuration info that will be sent to the server.
	        // It returns that information, leaving it the responsibility of the caller to
	        // do the actual sending.
	        //
	        function collectConfigurationInfo() /* forAuthentication */{
	            var p2pList = {};
	            var i;
	            for (i in peerConns) {
	                if (!peerConns.hasOwnProperty(i)) {
	                    continue;
	                }
	                p2pList[i] = {
	                    connectTime: peerConns[i].connectTime,
	                    isInitiator: !!peerConns[i].isInitiator
	                };
	            }

	            var newConfig = {
	                userSettings: {
	                    sharingAudio: !!haveAudioVideo.audio,
	                    sharingVideo: !!haveAudioVideo.video,
	                    sharingData: !!dataEnabled,
	                    nativeVideoWidth: self.nativeVideoWidth,
	                    nativeVideoHeight: self.nativeVideoHeight,
	                    windowWidth: window.innerWidth,
	                    windowHeight: window.innerHeight,
	                    screenWidth: window.screen.width,
	                    screenHeight: window.screen.height,
	                    cookieEnabled: navigator.cookieEnabled,
	                    os: navigator.oscpu,
	                    language: navigator.language
	                }
	            };

	            if (!isEmptyObj(p2pList)) {
	                newConfig.p2pList = p2pList;
	            }

	            return newConfig;
	        }

	        /** @private */
	        function updateConfiguration() {

	            var newConfig = collectConfigurationInfo(false);
	            //
	            // we need to give the getStats calls a chance to fish out the data.
	            // The longest I've seen it take is 5 milliseconds so 100 should be overkill.
	            //
	            var sendDeltas = function sendDeltas() {
	                var alteredData = findDeltas(oldConfig, newConfig);
	                //
	                // send all the configuration information that changes during the session
	                //
	                if (alteredData) {
	                    logDebug("cfg=" + JSON.stringify(alteredData.added));

	                    if (self.webSocket) {
	                        sendSignalling(null, "setUserCfg", { setUserCfg: alteredData.added }, null, null);
	                    }
	                }
	                oldConfig = newConfig;
	            };
	            if (oldConfig === {}) {
	                sendDeltas();
	            } else {
	                setTimeout(sendDeltas, 100);
	            }
	        }

	        // Parse the uint32 PRIORITY field into its constituent parts from RFC 5245,
	        // type preference, local preference, and (256 - component ID).
	        // ex: 126 | 32252 | 255 (126 is host preference, 255 is component ID 1)
	        function formatPriority(priority) {
	            var s = '';
	            s += priority >> 24;
	            s += ' | ';
	            s += priority >> 8 & 0xFFFF;
	            s += ' | ';
	            s += priority & 0xFF;
	            return s;
	        }

	        // Parse a candidate:foo string into an object, for easier use by other methods.
	        /** @private */
	        function parseCandidate(text) {
	            var candidateStr = 'candidate:';
	            var pos = text.indexOf(candidateStr) + candidateStr.length;
	            var fields = text.substr(pos).split(' ');
	            return {
	                'component': fields[1],
	                'type': fields[7],
	                'foundation': fields[0],
	                'protocol': fields[2],
	                'address': fields[4],
	                'port': fields[5],
	                'priority': formatPriority(fields[3])
	            };
	        }

	        /** @private */
	        function processCandicate(candicate) {
	            self._candicates = self._candicates || [];
	            self._candicates.push(parseCandidate(candicate));
	        }

	        function processAddedStream(otherUser, theStream) {
	            if (!peerConns[otherUser] || peerConns[otherUser].cancelled) {
	                return;
	            }

	            var peerConn = peerConns[otherUser];

	            if (!peerConn.startedAV) {
	                peerConn.startedAV = true;
	                peerConn.sharingAudio = haveAudioVideo.audio;
	                peerConn.sharingVideo = haveAudioVideo.video;
	                peerConn.connectTime = new Date().getTime();
	                if (peerConn.callSuccessCB) {
	                    if (peerConn.sharingAudio || peerConn.sharingVideo) {
	                        peerConn.callSuccessCB(otherUser, "audiovideo");
	                    }
	                }
	                if (self.audioEnabled || self.videoEnabled) {
	                    updateConfiguration();
	                }
	            }

	            var remoteName = getNameOfRemoteStream(otherUser, theStream.id || "default");
	            if (!remoteName) {
	                remoteName = "default";
	            }
	            peerConn.remoteStreamIdToName[theStream.id || "default"] = remoteName;
	            peerConn.liveRemoteStreams[remoteName] = true;
	            theStream.streamName = remoteName;
	            if (self.streamAcceptor) {
	                self.streamAcceptor(otherUser, theStream, remoteName);
	                //
	                // Inform the other user that the stream they provided has been received.
	                // This should be moved into signalling at some point
	                //
	                self.sendDataWS(otherUser, "easyrtc_streamReceived", { streamName: remoteName }, function () {});
	            }
	        }

	        function processAddedTrack(otherUser, peerStreams) {

	            if (!peerConns[otherUser] || peerConns[otherUser].cancelled) {
	                return;
	            }

	            var peerConn = peerConns[otherUser];
	            peerConn.trackTimers = peerConn.trackTimers || {};

	            // easyrtc thinks in terms of streams, not tracks.
	            // so we'll add a timeout when the first track event
	            // fires. Firefox produces two events (one of type "video",
	            // and one of type "audio".

	            for (var i = 0, l = peerStreams.length; i < l; i++) {
	                var peerStream = peerStreams[i],
	                    streamId = peerStream.id || "default";
	                clearTimeout(peerConn.trackTimers[streamId]);
	                peerConn.trackTimers[streamId] = setTimeout(function (peerStream) {
	                    processAddedStream(peerConn, otherUser, peerStream);
	                }.bind(peerStream), 100); // Bind peerStream
	            }
	        }

	        /** @private */
	        // TODO split buildPeerConnection it more thant 500 lines
	        function buildPeerConnection(otherUser, isInitiator, failureCB, streamNames) {
	            var pc;
	            var message;
	            var newPeerConn;
	            var iceConfig = pc_config_to_use ? pc_config_to_use : pc_config;

	            logDebug("building peer connection to " + otherUser);

	            //
	            // we don't support data channels on chrome versions < 31
	            //

	            try {

	                pc = self.createRTCPeerConnection(iceConfig, buildPeerConstraints());

	                if (!pc) {
	                    message = "Unable to create PeerConnection object, check your ice configuration(" + JSON.stringify(iceConfig) + ")";
	                    logDebug(message);
	                    throw Error(message);
	                }

	                //
	                // turn off data channel support if the browser doesn't support it.
	                //

	                if (dataEnabled && typeof pc.createDataChannel === 'undefined') {
	                    dataEnabled = false;
	                }

	                pc.onnegotiationneeded = function (event) {
	                    if (peerConns[otherUser] && peerConns[otherUser].enableNegotiateListener) {
	                        pc.createOffer(function (sdp) {
	                            if (sdpLocalFilter) {
	                                sdp.sdp = sdpLocalFilter(sdp.sdp);
	                            }
	                            pc.setLocalDescription(sdp, function () {
	                                self.sendPeerMessage(otherUser, "__addedMediaStream", {
	                                    sdp: sdp
	                                });
	                            }, function () {});
	                        }, function (error) {
	                            logDebug("unexpected error in creating offer");
	                        });
	                    }
	                };

	                pc.onsignalingstatechange = function () {

	                    var eventTarget = event.currentTarget || event.target || pc,
	                        signalingState = eventTarget.signalingState || 'unknown';

	                    if (signalingStateChangeListener) {
	                        signalingStateChangeListener(otherUser, eventTarget, signalingState);
	                    }
	                };

	                pc.oniceconnectionstatechange = function (event) {

	                    var eventTarget = event.currentTarget || event.target || pc,
	                        connState = eventTarget.iceConnectionState || 'unknown';

	                    if (iceConnectionStateChangeListener) {
	                        iceConnectionStateChangeListener(otherUser, eventTarget, connState);
	                    }

	                    switch (connState) {
	                        case "connected":
	                            if (self.onPeerOpen) {
	                                self.onPeerOpen(otherUser);
	                            }
	                            if (peerConns[otherUser] && peerConns[otherUser].callSuccessCB) {
	                                peerConns[otherUser].callSuccessCB(otherUser, "connection");
	                            }
	                            break;
	                        case "failed":
	                            if (failureCB) {
	                                failureCB(self.errCodes.NOVIABLEICE, "No usable STUN/TURN path");
	                            }
	                            delete peerConns[otherUser];
	                            break;
	                        case "disconnected":
	                            if (self.onPeerFailing) {
	                                self.onPeerFailing(otherUser);
	                            }
	                            if (peerConns[otherUser]) {
	                                peerConns[otherUser].failing = Date.now();
	                            }
	                            break;

	                        case "closed":
	                            if (self.onPeerClosed) {
	                                self.onPeerClosed(otherUser);
	                            }
	                            break;
	                        case "completed":
	                            if (peerConns[otherUser]) {
	                                if (peerConns[otherUser].failing && self.onPeerRecovered) {
	                                    self.onPeerRecovered(otherUser, peerConns[otherUser].failing, Date.now());
	                                }
	                                delete peerConns[otherUser].failing;
	                            }
	                            break;
	                    }
	                };

	                pc.onconnection = function () {
	                    logDebug("onconnection called prematurely");
	                };

	                newPeerConn = {
	                    pc: pc,
	                    candidatesToSend: [],
	                    startedAV: false,
	                    connectionAccepted: false,
	                    isInitiator: isInitiator,
	                    remoteStreamIdToName: {},
	                    streamsAddedAcks: {},
	                    liveRemoteStreams: {}
	                };

	                pc.onicecandidate = function (event) {
	                    if (peerConns[otherUser] && peerConns[otherUser].cancelled) {
	                        return;
	                    }
	                    var candidateData;
	                    if (event.candidate && peerConns[otherUser]) {
	                        candidateData = {
	                            type: 'candidate',
	                            label: event.candidate.sdpMLineIndex,
	                            id: event.candidate.sdpMid,
	                            candidate: event.candidate.candidate
	                        };

	                        if (iceCandidateFilter) {
	                            candidateData = iceCandidateFilter(candidateData, false);
	                            if (!candidateData) {
	                                return;
	                            }
	                        }
	                        //
	                        // some candidates include ip addresses of turn servers. we'll want those
	                        // later so we can see if our actual connection uses a turn server.
	                        // The keyword "relay" in the candidate identifies it as referencing a
	                        // turn server. The \d symbol in the regular expression matches a number.
	                        //
	                        processCandicate(event.candidate.candidate);

	                        if (peerConns[otherUser].connectionAccepted) {
	                            sendSignalling(otherUser, "candidate", candidateData, null, function () {
	                                failureCB(self.errCodes.PEER_GONE, "Candidate disappeared");
	                            });
	                        } else {
	                            peerConns[otherUser].candidatesToSend.push(candidateData);
	                        }
	                    }
	                };

	                pc.ontrack = function (event) {
	                    logDebug("empty ontrack method invoked, which is expected");
	                    processAddedTrack(otherUser, event.streams);
	                };

	                pc.onaddstream = function (event) {
	                    logDebug("empty onaddstream method invoked, which is expected");
	                    processAddedStream(otherUser, event.stream);
	                };

	                pc.onremovestream = function (event) {
	                    logDebug("saw remove on remote media stream");
	                    onRemoveStreamHelper(otherUser, event.stream);
	                };

	                // Register PeerConn
	                peerConns[otherUser] = newPeerConn;
	            } catch (error) {
	                logDebug('buildPeerConnection error', error);
	                failureCB(self.errCodes.SYSTEM_ERR, error.message);
	                return null;
	            }

	            var i, stream;
	            if (streamNames) {
	                for (i = 0; i < streamNames.length; i++) {
	                    stream = getLocalMediaStreamByName(streamNames[i]);
	                    if (stream) {
	                        pc.addStream(stream);
	                    } else {
	                        logDebug("Developer error, attempt to access unknown local media stream " + streamNames[i]);
	                    }
	                }
	            } else if (autoInitUserMedia && (self.videoEnabled || self.audioEnabled)) {
	                stream = self.getLocalStream();
	                pc.addStream(stream);
	            }

	            //
	            // This function handles data channel message events.
	            //
	            var pendingTransfer = {};
	            function dataChannelMessageHandler(event) {
	                logDebug("saw dataChannel.onmessage event: ", event.data);

	                if (event.data === "dataChannelPrimed") {
	                    self.sendDataWS(otherUser, "dataChannelPrimed", "");
	                } else {
	                    //
	                    // Chrome and Firefox Interop is passing a event with a strange data="", perhaps
	                    // as it's own form of priming message. Comparing the data against "" doesn't
	                    // work, so I'm going with parsing and trapping the parse error.
	                    //
	                    var msg;

	                    try {
	                        msg = JSON.parse(event.data);
	                    } catch (err) {
	                        logDebug('Developer error, unable to parse event data');
	                    }

	                    if (msg) {
	                        if (msg.transfer && msg.transferId) {
	                            if (msg.transfer === 'start') {
	                                logDebug('start transfer #' + msg.transferId);

	                                var parts = parseInt(msg.parts);
	                                pendingTransfer = {
	                                    chunks: [],
	                                    parts: parts,
	                                    transferId: msg.transferId
	                                };
	                            } else if (msg.transfer === 'chunk') {
	                                logDebug('got chunk for transfer #' + msg.transferId);

	                                // check data is valid
	                                if (!(typeof msg.data === 'string' && msg.data.length <= self.maxP2PMessageLength)) {
	                                    logDebug('Developer error, invalid data');

	                                    // check there's a pending transfer
	                                } else if (!pendingTransfer) {
	                                    logDebug('Developer error, unexpected chunk');

	                                    // check that transferId is valid
	                                } else if (msg.transferId !== pendingTransfer.transferId) {
	                                    logDebug('Developer error, invalid transfer id');

	                                    // check that the max length of transfer is not reached
	                                } else if (pendingTransfer.chunks.length + 1 > pendingTransfer.parts) {
	                                    logDebug('Developer error, received too many chunks');
	                                } else {
	                                    pendingTransfer.chunks.push(msg.data);
	                                }
	                            } else if (msg.transfer === 'end') {
	                                logDebug('end of transfer #' + msg.transferId);

	                                // check there's a pending transfer
	                                if (!pendingTransfer) {
	                                    logDebug('Developer error, unexpected end of transfer');

	                                    // check that transferId is valid
	                                } else if (msg.transferId !== pendingTransfer.transferId) {
	                                    logDebug('Developer error, invalid transfer id');

	                                    // check that all the chunks were received
	                                } else if (pendingTransfer.chunks.length !== pendingTransfer.parts) {
	                                    logDebug('Developer error, received wrong number of chunks');
	                                } else {
	                                    var chunkedMsg;
	                                    try {
	                                        chunkedMsg = JSON.parse(pendingTransfer.chunks.join(''));
	                                    } catch (err) {
	                                        logDebug('Developer error, unable to parse message');
	                                    }

	                                    if (chunkedMsg) {
	                                        self.receivePeerDistribute(otherUser, chunkedMsg, null);
	                                    }
	                                }
	                                pendingTransfer = {};
	                            } else {
	                                logDebug('Developer error, got an unknown transfer message' + msg.transfer);
	                            }
	                        } else {
	                            self.receivePeerDistribute(otherUser, msg, null);
	                        }
	                    }
	                }
	            }

	            function initOutGoingChannel(otherUser) {
	                logDebug("saw initOutgoingChannel call");

	                var dataChannel = pc.createDataChannel(dataChannelName, self.getDatachannelConstraints());
	                peerConns[otherUser].dataChannelS = dataChannel;
	                peerConns[otherUser].dataChannelR = dataChannel;
	                dataChannel.onmessage = dataChannelMessageHandler;
	                dataChannel.onopen = function (event) {
	                    logDebug("saw dataChannel.onopen event");

	                    if (peerConns[otherUser]) {
	                        dataChannel.send("dataChannelPrimed");
	                    }
	                };
	                dataChannel.onclose = function (event) {
	                    logDebug("saw dataChannelS.onclose event");

	                    if (peerConns[otherUser]) {
	                        peerConns[otherUser].dataChannelReady = false;
	                        delete peerConns[otherUser].dataChannelS;
	                    }
	                    if (onDataChannelClose) {
	                        onDataChannelClose(otherUser);
	                    }

	                    updateConfigurationInfo();
	                };
	            }

	            function initIncomingChannel(otherUser) {
	                logDebug("initializing incoming channel handler for " + otherUser);

	                peerConns[otherUser].pc.ondatachannel = function (event) {

	                    logDebug("saw incoming data channel");

	                    var dataChannel = event.channel;
	                    peerConns[otherUser].dataChannelR = dataChannel;
	                    peerConns[otherUser].dataChannelS = dataChannel;
	                    peerConns[otherUser].dataChannelReady = true;
	                    dataChannel.onmessage = dataChannelMessageHandler;
	                    dataChannel.onclose = function (event) {
	                        logDebug("saw dataChannelR.onclose event");

	                        if (peerConns[otherUser]) {
	                            peerConns[otherUser].dataChannelReady = false;
	                            delete peerConns[otherUser].dataChannelR;
	                        }
	                        if (onDataChannelClose) {
	                            onDataChannelClose(otherUser);
	                        }

	                        updateConfigurationInfo();
	                    };
	                    dataChannel.onopen = function (event) {
	                        logDebug("saw dataChannel.onopen event");

	                        if (peerConns[otherUser]) {
	                            dataChannel.send("dataChannelPrimed");
	                        }
	                    };
	                };
	            }

	            //
	            //  added for interoperability
	            //
	            // TODO check if both sides have the same browser and versions
	            if (dataEnabled) {
	                self.setPeerListener(function () {
	                    if (peerConns[otherUser]) {
	                        peerConns[otherUser].dataChannelReady = true;
	                        if (peerConns[otherUser].callSuccessCB) {
	                            peerConns[otherUser].callSuccessCB(otherUser, "datachannel");
	                        }
	                        if (onDataChannelOpen) {
	                            onDataChannelOpen(otherUser, true);
	                        }
	                        updateConfigurationInfo();
	                    } else {
	                        logDebug("failed to setup outgoing channel listener");
	                    }
	                }, "dataChannelPrimed", otherUser);

	                if (isInitiator) {
	                    try {

	                        initOutGoingChannel(otherUser);
	                    } catch (channelErrorEvent) {
	                        logDebug("failed to init outgoing channel");
	                        failureCB(self.errCodes.SYSTEM_ERR, self.formatError(channelErrorEvent));
	                    }
	                }
	                if (!isInitiator) {
	                    initIncomingChannel(otherUser);
	                }
	            }

	            pc.onconnection = function () {
	                logDebug("setup pc.onconnection ");
	            };

	            //
	            // Temporary support for responding to acknowledgements of about streams being added.
	            //
	            self.setPeerListener(function (easyrtcid, msgType, msgData, targeting) {
	                if (newPeerConn.streamsAddedAcks[msgData.streamName]) {
	                    newPeerConn.streamsAddedAcks[msgData.streamName](easyrtcid, msgData.streamName);
	                    delete newPeerConn.streamsAddedAcks[msgData.streamName];
	                }
	            }, "easyrtc_streamReceived", otherUser);
	            return pc;
	        }

	        /** @private */
	        function doAnswerBody(caller, msgData, streamNames) {
	            var pc = buildPeerConnection(caller, false, function (message) {
	                self.showError(self.errCodes.SYSTEM_ERR, message);
	            }, streamNames);
	            var newPeerConn = peerConns[caller];
	            if (!pc) {
	                logDebug("buildPeerConnection failed. Call not answered");
	                return;
	            }
	            var setLocalAndSendMessage1 = function setLocalAndSendMessage1(sessionDescription) {

	                if (newPeerConn.cancelled) {
	                    return;
	                }

	                var sendAnswer = function sendAnswer() {
	                    logDebug("sending answer");

	                    function onSignalSuccess() {
	                        logDebug("sending success");
	                    }

	                    function onSignalFailure(errorCode, errorText) {
	                        logDebug("sending error");
	                        delete peerConns[caller];
	                        self.showError(errorCode, errorText);
	                    }

	                    sendSignalling(caller, "answer", sessionDescription, onSignalSuccess, onSignalFailure);
	                    peerConns[caller].connectionAccepted = true;
	                    sendQueuedCandidates(caller, onSignalSuccess, onSignalFailure);

	                    if (pc.connectDataConnection) {
	                        logDebug("calling connectDataConnection(5002,5001)");
	                        pc.connectDataConnection(5002, 5001);
	                    }
	                };
	                if (sdpLocalFilter) {
	                    sessionDescription.sdp = sdpLocalFilter(sessionDescription.sdp);
	                }
	                pc.setLocalDescription(sessionDescription, sendAnswer, function (message) {
	                    self.showError(self.errCodes.INTERNAL_ERR, "setLocalDescription: " + message);
	                });
	            };
	            var sd = new RTCSessionDescription(msgData);

	            if (!sd) {
	                throw "Could not create the RTCSessionDescription";
	            }

	            logDebug("sdp ||  " + JSON.stringify(sd));

	            var invokeCreateAnswer = function invokeCreateAnswer() {
	                if (newPeerConn.cancelled) {
	                    return;
	                }
	                pc.createAnswer(setLocalAndSendMessage1, function (message) {
	                    self.showError(self.errCodes.INTERNAL_ERR, "create-answer: " + message);
	                }, receivedMediaConstraints);
	            };

	            logDebug("about to call setRemoteDescription in doAnswer");

	            try {

	                if (sdpRemoteFilter) {
	                    sd.sdp = sdpRemoteFilter(sd.sdp);
	                }
	                pc.setRemoteDescription(sd, invokeCreateAnswer, function (message) {
	                    self.showError(self.errCodes.INTERNAL_ERR, "set-remote-description: " + message);
	                });
	            } catch (srdError) {
	                logDebug("set remote description failed");
	                self.showError(self.errCodes.INTERNAL_ERR, "setRemoteDescription failed: " + srdError.message);
	            }
	        }

	        /** @private */
	        function doAnswer(caller, msgData, streamNames) {
	            if (!streamNames && autoInitUserMedia) {
	                var localStream = self.getLocalStream();
	                if (!localStream && (self.videoEnabled || self.audioEnabled)) {
	                    self.initMediaSource(function () {
	                        doAnswer(caller, msgData);
	                    }, function (errorCode, error) {
	                        self.showError(self.errCodes.MEDIA_ERR, self.format(self.getConstantString("localMediaError")));
	                    });
	                    return;
	                }
	            }
	            if (use_fresh_ice_each_peer) {
	                self.getFreshIceConfig(function (succeeded) {
	                    if (succeeded) {
	                        doAnswerBody(caller, msgData, streamNames);
	                    } else {
	                        self.showError(self.errCodes.CALL_ERR, "Failed to get fresh ice config");
	                    }
	                });
	            } else {
	                doAnswerBody(caller, msgData, streamNames);
	            }
	        }

	        /** @private */
	        function callBody(otherUser, callSuccessCB, callFailureCB, wasAcceptedCB, streamNames) {
	            acceptancePending[otherUser] = true;
	            var pc = buildPeerConnection(otherUser, true, callFailureCB, streamNames);
	            var message;
	            if (!pc) {
	                message = "buildPeerConnection failed, call not completed";
	                logDebug(message);
	                throw message;
	            }

	            peerConns[otherUser].callSuccessCB = callSuccessCB;
	            peerConns[otherUser].callFailureCB = callFailureCB;
	            peerConns[otherUser].wasAcceptedCB = wasAcceptedCB;
	            var peerConnObj = peerConns[otherUser];
	            var setLocalAndSendMessage0 = function setLocalAndSendMessage0(sessionDescription) {
	                if (peerConnObj.cancelled) {
	                    return;
	                }
	                var sendOffer = function sendOffer() {

	                    sendSignalling(otherUser, "offer", sessionDescription, null, callFailureCB);
	                };
	                if (sdpLocalFilter) {
	                    sessionDescription.sdp = sdpLocalFilter(sessionDescription.sdp);
	                }
	                pc.setLocalDescription(sessionDescription, sendOffer, function (errorText) {
	                    callFailureCB(self.errCodes.CALL_ERR, errorText);
	                });
	            };
	            setTimeout(function () {
	                //
	                // if the call was cancelled, we don't want to continue getting the offer.
	                // we can tell the call was cancelled because there won't be a peerConn object
	                // for it.
	                //
	                if (!peerConns[otherUser]) {
	                    return;
	                }
	                pc.createOffer(setLocalAndSendMessage0, function (errorObj) {
	                    callFailureCB(self.errCodes.CALL_ERR, JSON.stringify(errorObj));
	                }, receivedMediaConstraints);
	            }, 100);
	        }

	        /**
	         * Initiates a call to another user. If it succeeds, the streamAcceptor callback will be called.
	         * @param {String} otherUser - the easyrtcid of the peer being called.
	         * @param {Function} callSuccessCB (otherCaller, mediaType) - is called when the datachannel is established or the MediaStream is established. mediaType will have a value of "audiovideo" or "datachannel"
	         * @param {Function} callFailureCB (errorCode, errMessage) - is called if there was a system error interfering with the call.
	         * @param {Function} wasAcceptedCB (wasAccepted:boolean,otherUser:string) - is called when a call is accepted or rejected by another party. It can be left null.
	         * @param {Array} streamNames - optional array of streamNames.
	         * @example
	         *    easyrtc.call( otherEasyrtcid,
	         *        function(easyrtcid, mediaType){
	         *           console.log("Got mediaType " + mediaType + " from " + easyrtc.idToName(easyrtcid));
	         *        },
	         *        function(errorCode, errMessage){
	         *           console.log("call to  " + easyrtc.idToName(otherEasyrtcid) + " failed:" + errMessage);
	         *        },
	         *        function(wasAccepted, easyrtcid){
	         *            if( wasAccepted ){
	         *               console.log("call accepted by " + easyrtc.idToName(easyrtcid));
	         *            }
	         *            else{
	         *                console.log("call rejected" + easyrtc.idToName(easyrtcid));
	         *            }
	         *        });
	         */
	        this.call = function (otherUser, callSuccessCB, callFailureCB, wasAcceptedCB, streamNames) {

	            if (streamNames) {
	                if (typeof streamNames === "string") {
	                    // accept a string argument if passed.
	                    streamNames = [streamNames];
	                } else if (typeof streamNames.length === "undefined") {
	                    self.showError(self.errCodes.DEVELOPER_ERR, "easyrtc.call passed bad streamNames");
	                    return;
	                }
	            }

	            logDebug("initiating peer to peer call to " + otherUser + " audio=" + self.audioEnabled + " video=" + self.videoEnabled + " data=" + dataEnabled);

	            if (!self.supportsPeerConnections()) {
	                callFailureCB(self.errCodes.CALL_ERR, self.getConstantString("noWebrtcSupport"));
	                return;
	            }

	            var message;
	            //
	            // If we are sharing audio/video and we haven't allocated the local media stream yet,
	            // we'll do so, recalling our self on success.
	            //
	            if (!streamNames && autoInitUserMedia) {
	                var stream = self.getLocalStream();
	                if (!stream && (self.audioEnabled || self.videoEnabled)) {
	                    self.initMediaSource(function () {
	                        self.call(otherUser, callSuccessCB, callFailureCB, wasAcceptedCB);
	                    }, callFailureCB);
	                    return;
	                }
	            }

	            if (!self.webSocket) {
	                message = "Attempt to make a call prior to connecting to service";
	                logDebug(message);
	                throw message;
	            }

	            //
	            // If B calls A, and then A calls B before accepting, then A should treat the attempt to
	            // call B as a positive offer to B's offer.
	            //
	            if (offersPending[otherUser]) {
	                wasAcceptedCB(true, otherUser);
	                doAnswer(otherUser, offersPending[otherUser], streamNames);
	                delete offersPending[otherUser];
	                self.callCancelled(otherUser, false);
	                return;
	            }

	            // do we already have a pending call?
	            if (typeof acceptancePending[otherUser] !== 'undefined') {
	                message = "Call already pending acceptance";
	                logDebug(message);
	                callFailureCB(self.errCodes.ALREADY_CONNECTED, message);
	                return;
	            }

	            if (use_fresh_ice_each_peer) {
	                self.getFreshIceConfig(function (succeeded) {
	                    if (succeeded) {
	                        callBody(otherUser, callSuccessCB, callFailureCB, wasAcceptedCB, streamNames);
	                    } else {
	                        callFailureCB(self.errCodes.CALL_ERR, "Attempt to get fresh ice configuration failed");
	                    }
	                });
	            } else {
	                callBody(otherUser, callSuccessCB, callFailureCB, wasAcceptedCB, streamNames);
	            }
	        };

	        /** @private */
	        //
	        // this function check the deprecated MediaStream.ended attribute
	        // and new .active. Also fallback .enable on track for Firefox.
	        //
	        function isStreamActive(stream) {

	            var isActive;

	            if (stream.active === true || stream.ended === false) {
	                isActive = true;
	            } else {
	                isActive = stream.getTracks().reduce(function (track) {
	                    return track.enabled;
	                });
	            }

	            return isActive;
	        }

	        /** @private */
	        var queuedMessages = {};

	        /** @private */
	        function clearQueuedMessages(caller) {
	            queuedMessages[caller] = {
	                candidates: []
	            };
	        }

	        /** @private */
	        function closePeer(otherUser) {

	            if (acceptancePending[otherUser]) {
	                delete acceptancePending[otherUser];
	            }
	            if (offersPending[otherUser]) {
	                delete offersPending[otherUser];
	            }

	            if (!peerConns[otherUser].cancelled && peerConns[otherUser].pc) {
	                try {
	                    var remoteStreams = peerConns[otherUser].pc.getRemoteStreams();
	                    for (var i = 0; i < remoteStreams.length; i++) {
	                        if (isStreamActive(remoteStreams[i])) {
	                            emitOnStreamClosed(otherUser, remoteStreams[i]);
	                            stopStream(remoteStreams[i]);
	                        }
	                    }

	                    peerConns[otherUser].pc.close();
	                    peerConns[otherUser].cancelled = true;
	                    logDebug("peer closed");
	                } catch (err) {
	                    logDebug("peer " + otherUser + " close failed:" + err);
	                } finally {
	                    if (self.onPeerClosed) {
	                        self.onPeerClosed(otherUser);
	                    }
	                }
	            }
	        }

	        /** @private */
	        function hangupBody(otherUser) {

	            logDebug("Hanging up on " + otherUser);
	            clearQueuedMessages(otherUser);

	            if (peerConns[otherUser]) {

	                if (peerConns[otherUser].pc) {
	                    closePeer(otherUser);
	                }

	                if (peerConns[otherUser]) {
	                    delete peerConns[otherUser];
	                }

	                updateConfigurationInfo();

	                if (self.webSocket) {
	                    sendSignalling(otherUser, "hangup", null, function () {
	                        logDebug("hangup succeeds");
	                    }, function (errorCode, errorText) {
	                        logDebug("hangup failed:" + errorText);
	                        self.showError(errorCode, errorText);
	                    });
	                }
	            }
	        }

	        /**
	         * Hang up on a particular user or all users.
	         *  @param {String} otherUser - the easyrtcid of the person to hang up on.
	         *  @example
	         *     easyrtc.hangup(someEasyrtcid);
	         */
	        this.hangup = function (otherUser) {
	            hangupBody(otherUser);
	            updateConfigurationInfo();
	        };

	        /**
	         * Hangs up on all current connections.
	         * @example
	         *    easyrtc.hangupAll();
	         */
	        this.hangupAll = function () {

	            var sawAConnection = false;
	            for (var otherUser in peerConns) {
	                if (!peerConns.hasOwnProperty(otherUser)) {
	                    continue;
	                }
	                sawAConnection = true;
	                hangupBody(otherUser);
	            }

	            if (sawAConnection) {
	                updateConfigurationInfo();
	            }
	        };

	        /**
	         * Checks to see if data channels work between two peers.
	         * @param {String} otherUser - the other peer.
	         * @returns {Boolean} true if data channels work and are ready to be used
	         *   between the two peers.
	         */
	        this.doesDataChannelWork = function (otherUser) {
	            if (!peerConns[otherUser]) {
	                return false;
	            }
	            return !!peerConns[otherUser].dataChannelReady;
	        };

	        /**
	         * Return the media stream shared by a particular peer. This is needed when you
	         * add a stream in the middle of a call.
	         * @param {String} easyrtcid the peer.
	         * @param {String} remoteStreamName an optional argument supplying the streamName.
	         * @returns {Object} A mediaStream.
	         */
	        this.getRemoteStream = function (easyrtcid, remoteStreamName) {
	            if (!peerConns[easyrtcid]) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "attempt to get stream of uncalled party");
	                throw "Developer err: no such stream";
	            } else {
	                return getRemoteStreamByName(peerConns[easyrtcid], easyrtcid, remoteStreamName);
	            }
	        };

	        /**
	         * Assign a local streamName to a remote stream so that it can be forwarded to other callers.
	         * @param {String} easyrtcid the peer supplying the remote stream
	         * @param {String} remoteStreamName the streamName supplied by the peer.
	         * @param {String} localStreamName streamName used when passing the stream to other peers.
	         * @example
	         *    easyrtc.makeLocalStreamFromRemoteStream(sourcePeer, "default", "forwardedStream");
	         *    easyrtc.call(nextPeer, callSuccessCB, callFailureCB, wasAcceptedCB, ["forwardedStream"]);
	         */
	        this.makeLocalStreamFromRemoteStream = function (easyrtcid, remoteStreamName, localStreamName) {
	            var remoteStream;
	            if (peerConns[easyrtcid].pc) {
	                remoteStream = getRemoteStreamByName(peerConns[easyrtcid], easyrtcid, remoteStreamName);
	                if (remoteStream) {
	                    registerLocalMediaStreamByName(remoteStream, localStreamName);
	                } else {
	                    throw "Developer err: no such stream";
	                }
	            } else {
	                throw "Developer err: no such peer ";
	            }
	        };

	        /**
	         * Add a named local stream to a call.
	         * @param {String} easyrtcId The id of client receiving the stream.
	         * @param {String} streamName The name of the stream.
	         * @param {Function} receiptHandler is a function that gets called when the other side sends a message
	         *   that the stream has been received. The receiptHandler gets called with an easyrtcid and a stream name. This
	         *   argument is optional.
	         */
	        this.addStreamToCall = function (easyrtcId, streamName, receiptHandler) {
	            if (!streamName) {
	                streamName = "default";
	            }
	            var stream = getLocalMediaStreamByName(streamName);
	            if (!stream) {
	                logDebug("attempt to add nonexistent stream " + streamName);
	            } else if (!peerConns[easyrtcId] || !peerConns[easyrtcId].pc) {
	                logDebug("Can't add stream before a call has started.");
	            } else {
	                var pc = peerConns[easyrtcId].pc;
	                peerConns[easyrtcId].enableNegotiateListener = true;
	                pc.addStream(stream);
	                if (receiptHandler) {
	                    peerConns[easyrtcId].streamsAddedAcks[streamName] = receiptHandler;
	                }
	            }
	        };

	        //
	        // these three listeners support the ability to add/remove additional media streams on the fly.
	        //
	        this.setPeerListener(function (easyrtcid, msgType, msgData) {
	            if (!peerConns[easyrtcid] || !peerConns[easyrtcid].pc) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to add additional stream before establishing the base call.");
	            } else {
	                var sdp = msgData.sdp;
	                var pc = peerConns[easyrtcid].pc;

	                var setLocalAndSendMessage1 = function setLocalAndSendMessage1(sessionDescription) {
	                    var sendAnswer = function sendAnswer() {
	                        logDebug("sending answer");

	                        function onSignalSuccess() {
	                            logDebug("sending answer succeeded");
	                        }

	                        function onSignalFailure(errorCode, errorText) {
	                            logDebug("sending answer failed");

	                            delete peerConns[easyrtcid];
	                            self.showError(errorCode, errorText);
	                        }

	                        sendSignalling(easyrtcid, "answer", sessionDescription, onSignalSuccess, onSignalFailure);
	                        peerConns[easyrtcid].connectionAccepted = true;
	                        sendQueuedCandidates(easyrtcid, onSignalSuccess, onSignalFailure);
	                    };

	                    if (sdpLocalFilter) {
	                        sessionDescription.sdp = sdpLocalFilter(sessionDescription.sdp);
	                    }
	                    pc.setLocalDescription(sessionDescription, sendAnswer, function (message) {
	                        self.showError(self.errCodes.INTERNAL_ERR, "setLocalDescription: " + msgData);
	                    });
	                };

	                var invokeCreateAnswer = function invokeCreateAnswer() {
	                    pc.createAnswer(setLocalAndSendMessage1, function (message) {
	                        self.showError(self.errCodes.INTERNAL_ERR, "create-answer: " + message);
	                    }, receivedMediaConstraints);
	                    self.sendPeerMessage(easyrtcid, "__gotAddedMediaStream", { sdp: sdp });
	                };

	                logDebug("about to call setRemoteDescription in doAnswer");

	                try {

	                    if (sdpRemoteFilter) {
	                        sdp.sdp = sdpRemoteFilter(sdp.sdp);
	                    }
	                    pc.setRemoteDescription(new RTCSessionDescription(sdp), invokeCreateAnswer, function (message) {
	                        self.showError(self.errCodes.INTERNAL_ERR, "set-remote-description: " + message);
	                    });
	                } catch (srdError) {
	                    logDebug("saw exception in setRemoteDescription", srdError);
	                    self.showError(self.errCodes.INTERNAL_ERR, "setRemoteDescription failed: " + srdError.message);
	                }
	            }
	        }, "__addedMediaStream");

	        this.setPeerListener(function (easyrtcid, msgType, msgData) {
	            if (!peerConns[easyrtcid] || !peerConns[easyrtcid].pc) {
	                logDebug("setPeerListener failed: __gotAddedMediaStream Unknow easyrtcid " + easyrtcid);
	            } else {
	                var sdp = msgData.sdp;
	                if (sdpRemoteFilter) {
	                    sdp.sdp = sdpRemoteFilter(sdp.sdp);
	                }
	                var pc = peerConns[easyrtcid].pc;
	                pc.setRemoteDescription(new RTCSessionDescription(sdp), function () {}, function (message) {
	                    self.showError(self.errCodes.INTERNAL_ERR, "set-remote-description: " + message);
	                });
	            }
	        }, "__gotAddedMediaStream");

	        this.setPeerListener(function (easyrtcid, msgType, msgData) {
	            if (!peerConns[easyrtcid] || !peerConns[easyrtcid].pc) {
	                logDebug("setPeerListener failed: __closingMediaStream Unknow easyrtcid " + easyrtcid);
	            } else {
	                var stream = getRemoteStreamByName(peerConns[easyrtcid], easyrtcid, msgData.streamName);
	                if (stream) {
	                    onRemoveStreamHelper(easyrtcid, stream);
	                    stopStream(stream);
	                }
	            }
	        }, "__closingMediaStream");

	        /** @private */
	        this.dumpPeerConnectionInfo = function () {
	            var i;
	            for (var peer in peerConns) {
	                if (peerConns.hasOwnProperty(peer)) {
	                    var pc = peerConns[peer].pc;
	                    var remotes = pc.getRemoteStreams();
	                    var remoteIds = [];
	                    for (i = 0; i < remotes.length; i++) {
	                        remoteIds.push(remotes[i].id);
	                    }
	                    var locals = pc.getLocalStreams();
	                    var localIds = [];
	                    for (i = 0; i < locals.length; i++) {
	                        localIds.push(locals[i].id);
	                    }

	                    logDebug("For peer " + peer);
	                    logDebug("    " + JSON.stringify({ local: localIds, remote: remoteIds }));
	                }
	            }
	        };

	        /** @private */
	        function onRemoteHangup(otherUser) {

	            logDebug("Saw onRemote hangup event");
	            clearQueuedMessages(otherUser);

	            if (peerConns[otherUser]) {

	                if (peerConns[otherUser].pc) {
	                    closePeer(otherUser);
	                } else {
	                    if (self.callCancelled) {
	                        self.callCancelled(otherUser, true);
	                    }
	                }

	                if (peerConns[otherUser]) {
	                    delete peerConns[otherUser];
	                }
	            } else {
	                if (self.callCancelled) {
	                    self.callCancelled(otherUser, true);
	                }
	            }
	        }

	        /** @private */
	        //
	        // checks to see if a particular peer is in any room at all.
	        //
	        function isPeerInAnyRoom(id) {
	            var roomName;
	            for (roomName in lastLoggedInList) {
	                if (!lastLoggedInList.hasOwnProperty(roomName)) {
	                    continue;
	                }
	                if (lastLoggedInList[roomName][id]) {
	                    return true;
	                }
	            }
	            return false;
	        }

	        /**
	         * Checks to see if a particular peer is present in any room.
	         * If it isn't, we assume it's logged out.
	         * @param {string} easyrtcid the easyrtcId of the peer.
	         */
	        this.isPeerInAnyRoom = function (easyrtcid) {
	            return isPeerInAnyRoom(easyrtcid);
	        };

	        /** @private */
	        function processLostPeers(peersInRoom) {
	            var id;
	            //
	            // check to see the person is still in at least one room. If not, we'll hangup
	            // on them. This isn't the correct behavior, but it's the best we can do without
	            // changes to the server.
	            //
	            for (id in peerConns) {
	                if (peerConns.hasOwnProperty(id) && typeof peersInRoom[id] === 'undefined') {
	                    if (!isPeerInAnyRoom(id)) {
	                        if (peerConns[id].pc || peerConns[id].isInitiator) {
	                            onRemoteHangup(id);
	                        }
	                        delete offersPending[id];
	                        delete acceptancePending[id];
	                        clearQueuedMessages(id);
	                    }
	                }
	            }

	            for (id in offersPending) {
	                if (offersPending.hasOwnProperty(id) && !isPeerInAnyRoom(id)) {
	                    onRemoteHangup(id);
	                    clearQueuedMessages(id);
	                    delete offersPending[id];
	                    delete acceptancePending[id];
	                }
	            }

	            for (id in acceptancePending) {
	                if (acceptancePending.hasOwnProperty(id) && !isPeerInAnyRoom(id)) {
	                    onRemoteHangup(id);
	                    clearQueuedMessages(id);
	                    delete acceptancePending[id];
	                }
	            }
	        }

	        /**
	         * The idea of aggregating timers is that there are events that convey state and these can fire more frequently
	         * than desired. Aggregating timers allow a bunch of events to be collapsed into one by only firing the last
	         * event.
	         * @private
	         */
	        var aggregatingTimers = {};

	        /**
	         * This function sets a timeout for a function to be called with the feature that if another
	         * invocation comes along within a particular interval (with the same key), the second invocation
	         * replaces the first. To prevent a continuous stream of events from preventing a callback from ever
	         * firing, we'll collapse no more than 20 events.
	         * @param {String} key A key used to identify callbacks that should be aggregated.
	         * @param {Function} callback The callback to invoke.
	         * @param {Number} period The aggregating period in milliseconds.
	         * @private
	         */
	        function addAggregatingTimer(key, callback, period) {
	            if (!period) {
	                period = 100; // 0.1 second
	            }
	            var counter = 0;
	            if (aggregatingTimers[key]) {
	                clearTimeout(aggregatingTimers[key].timer);
	                counter = aggregatingTimers[key].counter;
	            }
	            if (counter > 20) {
	                delete aggregatingTimers[key];
	                callback();
	            } else {
	                aggregatingTimers[key] = { counter: counter + 1 };
	                aggregatingTimers[key].timer = setTimeout(function () {
	                    delete aggregatingTimers[key];
	                    callback();
	                }, period);
	            }
	        }

	        /** @private */
	        //
	        // this function gets called for each room when there is a room update.
	        //
	        function processOccupantList(roomName, occupantList) {
	            var myInfo = null;
	            var reducedList = {};

	            var id;
	            for (id in occupantList) {
	                if (occupantList.hasOwnProperty(id)) {
	                    if (id === self.myEasyrtcid) {
	                        myInfo = occupantList[id];
	                    } else {
	                        reducedList[id] = occupantList[id];
	                    }
	                }
	            }
	            //
	            // processLostPeers detects peers that have gone away and performs
	            // house keeping accordingly.
	            //
	            processLostPeers(reducedList);
	            //
	            //
	            //
	            addAggregatingTimer("roomOccupants&" + roomName, function () {
	                if (roomOccupantListener) {
	                    roomOccupantListener(roomName, reducedList, myInfo);
	                }
	                self.emitEvent("roomOccupants", { roomName: roomName, occupants: lastLoggedInList });
	            }, 100);
	        }

	        /** @private */
	        function onChannelMsg(msg, ackAcceptorFunc) {

	            var targeting = {};
	            if (ackAcceptorFunc) {
	                ackAcceptorFunc(self.ackMessage);
	            }
	            if (msg.targetEasyrtcid) {
	                targeting.targetEasyrtcid = msg.targetEasyrtcid;
	            }
	            if (msg.targetRoom) {
	                targeting.targetRoom = msg.targetRoom;
	            }
	            if (msg.targetGroup) {
	                targeting.targetGroup = msg.targetGroup;
	            }
	            if (msg.senderEasyrtcid) {
	                self.receivePeerDistribute(msg.senderEasyrtcid, msg, targeting);
	            } else {
	                if (receiveServerCB) {
	                    receiveServerCB(msg.msgType, msg.msgData, targeting);
	                } else {
	                    logDebug("Unhandled server message " + JSON.stringify(msg));
	                }
	            }
	        }

	        /** @private */
	        function processUrl(url) {
	            var ipAddress;
	            if (url.indexOf('turn:') === 0 || url.indexOf('turns:') === 0) {
	                ipAddress = url.split(/[@:&]/g)[1];
	                self._turnServers[ipAddress] = true;
	            } else if (url.indexOf('stun:') === 0 || url.indexOf('stuns:') === 0) {
	                ipAddress = url.split(/[@:&]/g)[1];
	                self._stunServers[ipAddress] = true;
	            }
	        }

	        /** @private */
	        function processIceConfig(iceConfig) {

	            var i, j, item;

	            pc_config = {
	                iceServers: []
	            };

	            self._turnServers = {};
	            self._stunServers = {};

	            if (!iceConfig || !iceConfig.iceServers || typeof iceConfig.iceServers.length === "undefined") {
	                self.showError(self.errCodes.DEVELOPER_ERR, "iceConfig received from server didn't have an array called iceServers, ignoring it");
	            } else {
	                pc_config = {
	                    iceServers: iceConfig.iceServers
	                };
	            }

	            for (i = 0; i < iceConfig.iceServers.length; i++) {
	                item = iceConfig.iceServers[i];
	                if (item.urls && item.urls.length) {
	                    for (j = 0; j < item.urls.length; j++) {
	                        processUrl(item.urls[j]);
	                    }
	                } else if (item.url) {
	                    processUrl(item.url);
	                }
	            }
	        }

	        /** @private */
	        function processSessionData(sessionData) {
	            if (sessionData) {
	                if (sessionData.easyrtcsid) {
	                    self.easyrtcsid = sessionData.easyrtcsid;
	                }
	                if (sessionData.field) {
	                    sessionFields = sessionData.field;
	                }
	            }
	        }

	        /** @private */
	        function processRoomData(roomData) {
	            self.roomData = roomData;

	            var k, roomName, stuffToRemove, stuffToAdd, id, removeId;

	            for (roomName in self.roomData) {
	                if (!self.roomData.hasOwnProperty(roomName)) {
	                    continue;
	                }
	                if (roomData[roomName].roomStatus === "join") {
	                    if (!self.roomJoin[roomName]) {
	                        self.roomJoin[roomName] = roomData[roomName];
	                    }
	                    var mediaIds = buildMediaIds();
	                    if (mediaIds !== {}) {
	                        self.setRoomApiField(roomName, "mediaIds", mediaIds);
	                    }
	                } else if (roomData[roomName].roomStatus === "leave") {
	                    if (self.roomEntryListener) {
	                        self.roomEntryListener(false, roomName);
	                    }
	                    delete self.roomJoin[roomName];
	                    delete lastLoggedInList[roomName];
	                    continue;
	                }

	                if (roomData[roomName].clientList) {
	                    lastLoggedInList[roomName] = roomData[roomName].clientList;
	                } else if (roomData[roomName].clientListDelta) {
	                    stuffToAdd = roomData[roomName].clientListDelta.updateClient;
	                    if (stuffToAdd) {
	                        for (id in stuffToAdd) {
	                            if (!stuffToAdd.hasOwnProperty(id)) {
	                                continue;
	                            }
	                            if (!lastLoggedInList[roomName]) {
	                                lastLoggedInList[roomName] = [];
	                            }
	                            if (!lastLoggedInList[roomName][id]) {
	                                lastLoggedInList[roomName][id] = stuffToAdd[id];
	                            }
	                            for (k in stuffToAdd[id]) {
	                                if (k === "apiField" || k === "presence") {
	                                    lastLoggedInList[roomName][id][k] = stuffToAdd[id][k];
	                                }
	                            }
	                        }
	                    }
	                    stuffToRemove = roomData[roomName].clientListDelta.removeClient;
	                    if (stuffToRemove && lastLoggedInList[roomName]) {
	                        for (removeId in stuffToRemove) {
	                            if (stuffToRemove.hasOwnProperty(removeId)) {
	                                delete lastLoggedInList[roomName][removeId];
	                            }
	                        }
	                    }
	                }
	                if (self.roomJoin[roomName] && roomData[roomName].field) {
	                    fields.rooms[roomName] = roomData[roomName].field;
	                }
	                if (roomData[roomName].roomStatus === "join") {
	                    if (self.roomEntryListener) {
	                        self.roomEntryListener(true, roomName);
	                    }
	                }
	                processOccupantList(roomName, lastLoggedInList[roomName]);
	            }
	            self.emitEvent("roomOccupant", lastLoggedInList);
	        }

	        /** @private */
	        function onChannelCmd(msg, ackAcceptorFn) {

	            var caller = msg.senderEasyrtcid;
	            var msgType = msg.msgType;
	            var msgData = msg.msgData;
	            var pc;

	            logDebug('received message of type ' + msgType);

	            if (typeof queuedMessages[caller] === "undefined") {
	                clearQueuedMessages(caller);
	            }

	            var processCandidateBody = function processCandidateBody(caller, msgData) {
	                var candidate = null;

	                if (iceCandidateFilter) {
	                    msgData = iceCandidateFilter(msgData, true);
	                    if (!msgData) {
	                        return;
	                    }
	                }

	                candidate = new RTCIceCandidate({
	                    sdpMLineIndex: msgData.label,
	                    candidate: msgData.candidate
	                });
	                pc = peerConns[caller].pc;

	                function iceAddSuccess() {
	                    logDebug("iceAddSuccess: " + JSON.stringify(candidate));
	                    processCandicate(msgData.candidate);
	                }

	                function iceAddFailure(domError) {
	                    self.showError(self.errCodes.ICECANDIDATE_ERR, "bad ice candidate (" + domError.name + "): " + JSON.stringify(candidate));
	                }

	                pc.addIceCandidate(candidate, iceAddSuccess, iceAddFailure);
	            };

	            var flushCachedCandidates = function flushCachedCandidates(caller) {
	                var i;
	                if (queuedMessages[caller]) {
	                    for (i = 0; i < queuedMessages[caller].candidates.length; i++) {
	                        processCandidateBody(caller, queuedMessages[caller].candidates[i]);
	                    }
	                    delete queuedMessages[caller];
	                }
	            };

	            var processOffer = function processOffer(caller, msgData) {

	                var helper = function helper(wasAccepted, streamNames) {

	                    if (streamNames) {
	                        if (typeof streamNames === "string") {
	                            streamNames = [streamNames];
	                        } else if (streamNames.length === undefined) {
	                            self.showError(self.errCodes.DEVELOPER_ERR, "accept callback passed invalid streamNames");
	                            return;
	                        }
	                    }

	                    logDebug("offer accept=" + wasAccepted);

	                    delete offersPending[caller];

	                    if (wasAccepted) {
	                        if (!self.supportsPeerConnections()) {
	                            self.showError(self.errCodes.CALL_ERR, self.getConstantString("noWebrtcSupport"));
	                            return;
	                        }
	                        doAnswer(caller, msgData, streamNames);
	                        flushCachedCandidates(caller);
	                    } else {
	                        sendSignalling(caller, "reject", null, null, null);
	                        clearQueuedMessages(caller);
	                    }
	                };
	                //
	                // There is a very rare case of two callers sending each other offers
	                // before receiving the others offer. In such a case, the caller with the
	                // greater valued easyrtcid will delete its pending call information and do a
	                // simple answer to the other caller's offer.
	                //
	                if (acceptancePending[caller] && caller < self.myEasyrtcid) {
	                    delete acceptancePending[caller];
	                    if (queuedMessages[caller]) {
	                        delete queuedMessages[caller];
	                    }
	                    if (peerConns[caller]) {
	                        if (peerConns[caller].wasAcceptedCB) {
	                            peerConns[caller].wasAcceptedCB(true, caller);
	                        }
	                        delete peerConns[caller];
	                    }
	                    helper(true);
	                    return;
	                }

	                offersPending[caller] = msgData;
	                if (!self.acceptCheck) {
	                    helper(true);
	                } else {
	                    self.acceptCheck(caller, helper);
	                }
	            };

	            function processReject(caller) {
	                delete acceptancePending[caller];
	                if (queuedMessages[caller]) {
	                    delete queuedMessages[caller];
	                }
	                if (peerConns[caller]) {
	                    if (peerConns[caller].wasAcceptedCB) {
	                        peerConns[caller].wasAcceptedCB(false, caller);
	                    }
	                    delete peerConns[caller];
	                }
	            }

	            function processAnswer(caller, msgData) {

	                delete acceptancePending[caller];

	                //
	                // if we've discarded the peer connection, ignore the answer.
	                //
	                if (!peerConns[caller]) {
	                    return;
	                }
	                peerConns[caller].connectionAccepted = true;

	                if (peerConns[caller].wasAcceptedCB) {
	                    peerConns[caller].wasAcceptedCB(true, caller);
	                }

	                var onSignalSuccess = function onSignalSuccess() {};
	                var onSignalFailure = function onSignalFailure(errorCode, errorText) {
	                    if (peerConns[caller]) {
	                        delete peerConns[caller];
	                    }
	                    self.showError(errorCode, errorText);
	                };
	                // peerConns[caller].startedAV = true;
	                sendQueuedCandidates(caller, onSignalSuccess, onSignalFailure);
	                pc = peerConns[caller].pc;
	                var sd = new RTCSessionDescription(msgData);
	                if (!sd) {
	                    throw "Could not create the RTCSessionDescription";
	                }

	                logDebug("about to call initiating setRemoteDescription");

	                try {
	                    if (sdpRemoteFilter) {
	                        sd.sdp = sdpRemoteFilter(sd.sdp);
	                    }
	                    pc.setRemoteDescription(sd, function () {
	                        if (pc.connectDataConnection) {
	                            logDebug("calling connectDataConnection(5001,5002)");

	                            pc.connectDataConnection(5001, 5002); // these are like ids for data channels
	                        }
	                    }, function (message) {
	                        logDebug("setRemoteDescription failed ", message);
	                    });
	                } catch (smdException) {
	                    logDebug("setRemoteDescription failed ", smdException);
	                }
	                flushCachedCandidates(caller);
	            }

	            function processCandidateQueue(caller, msgData) {

	                if (peerConns[caller] && peerConns[caller].pc) {
	                    processCandidateBody(caller, msgData);
	                } else {
	                    if (!peerConns[caller]) {
	                        queuedMessages[caller] = {
	                            candidates: []
	                        };
	                    }
	                    queuedMessages[caller].candidates.push(msgData);
	                }
	            }

	            switch (msgType) {
	                case "sessionData":
	                    processSessionData(msgData.sessionData);
	                    break;
	                case "roomData":
	                    processRoomData(msgData.roomData);
	                    break;
	                case "iceConfig":
	                    processIceConfig(msgData.iceConfig);
	                    break;
	                case "forwardToUrl":
	                    if (msgData.newWindow) {
	                        window.open(msgData.forwardToUrl.url);
	                    } else {
	                        window.location.href = msgData.forwardToUrl.url;
	                    }
	                    break;
	                case "offer":
	                    processOffer(caller, msgData);
	                    break;
	                case "reject":
	                    processReject(caller);
	                    break;
	                case "answer":
	                    processAnswer(caller, msgData);
	                    break;
	                case "candidate":
	                    processCandidateQueue(caller, msgData);
	                    break;
	                case "hangup":
	                    onRemoteHangup(caller);
	                    clearQueuedMessages(caller);
	                    break;
	                case "error":
	                    self.showError(msgData.errorCode, msgData.errorText);
	                    break;
	                default:
	                    self.showError(self.errCodes.DEVELOPER_ERR, "received unknown message type from server, msgType is " + msgType);
	                    return;
	            }

	            if (ackAcceptorFn) {
	                ackAcceptorFn(self.ackMessage);
	            }
	        }

	        /**
	         * Sets the presence state on the server.
	         * @param {String} state - one of 'away','chat','dnd','xa'
	         * @param {String} statusText - User configurable status string. May be length limited.
	         * @example   easyrtc.updatePresence('dnd', 'sleeping');
	         */
	        this.updatePresence = function (state, statusText) {

	            self.presenceShow = state;
	            self.presenceStatus = statusText;

	            if (self.webSocketConnected) {
	                sendSignalling(null, 'setPresence', {
	                    setPresence: {
	                        'show': self.presenceShow,
	                        'status': self.presenceStatus
	                    }
	                }, null);
	            }
	        };

	        /**
	         * Fetch the collection of session fields as a map. The map has the structure:
	         *  {key1: {"fieldName": key1, "fieldValue": value1}, ...,
	         *   key2: {"fieldName": key2, "fieldValue": value2}
	         *  }
	         * @returns {Object}
	         */
	        this.getSessionFields = function () {
	            return sessionFields;
	        };

	        /**
	         * Fetch the value of a session field by name.
	         * @param {String} name - name of the session field to be fetched.
	         * @returns the field value (which can be anything). Returns undefined if the field does not exist.
	         */
	        this.getSessionField = function (name) {
	            if (sessionFields[name]) {
	                return sessionFields[name].fieldValue;
	            } else {
	                return undefined;
	            }
	        };

	        /**
	         * Returns an array of easyrtcid's of peers in a particular room.
	         * @param roomName
	         * @returns {Array} of easyrtcids or null if the client is not in the room.
	         * @example
	         *     var occupants = easyrtc.getRoomOccupants("default");
	         *     var i;
	         *     for( i = 0; i < occupants.length; i++ ) {
	         *         console.log( occupants[i] + " is in the room");
	         *     }
	         */
	        this.getRoomOccupantsAsArray = function (roomName) {
	            if (!lastLoggedInList[roomName]) {
	                return null;
	            } else {
	                return Object.keys(lastLoggedInList[roomName]);
	            }
	        };

	        /**
	         * Returns a map of easyrtcid's of peers in a particular room. You should only test elements in the map to see if they are
	         * null; their actual values are not guaranteed to be the same in different releases.
	         * @param roomName
	         * @returns {Object} of easyrtcids or null if the client is not in the room.
	         * @example
	         *      if( easyrtc.getRoomOccupantsAsMap("default")[some_easyrtcid]) {
	         *          console.log("yep, " + some_easyrtcid + " is in the room");
	         *      }
	         */
	        this.getRoomOccupantsAsMap = function (roomName) {
	            return lastLoggedInList[roomName];
	        };

	        /**
	         * Returns true if the ipAddress parameter was the address of a turn server. This is done by checking against information
	         * collected during peer to peer calls. Don't expect it to work before the first call, or to identify turn servers that aren't
	         * in the ice config.
	         * @param ipAddress
	         * @returns {boolean} true if ip address is known to be that of a turn server, false otherwise.
	         */
	        this.isTurnServer = function (ipAddress) {
	            return !!self._turnServers[ipAddress];
	        };

	        /**
	         * Returns true if the ipAddress parameter was the address of a stun server. This is done by checking against information
	         * collected during peer to peer calls. Don't expect it to work before the first call, or to identify turn servers that aren't
	         * in the ice config.
	         * @param {string} ipAddress
	         * @returns {boolean} true if ip address is known to be that of a stun server, false otherwise.
	         */
	        this.isStunServer = function (ipAddress) {
	            return !!self._stunServers[ipAddress];
	        };

	        /**
	         * Request fresh ice config information from the server.
	         * This should be done periodically by long running applications.
	         * @param {Function} callback is called with a value of true on success, false on failure.
	         */
	        this.getFreshIceConfig = function (callback) {
	            var dataToShip = {
	                msgType: "getIceConfig",
	                msgData: {}
	            };
	            if (!callback) {
	                callback = function callback() {};
	            }
	            self.webSocket.json.emit("easyrtcCmd", dataToShip, function (ackMsg) {
	                if (ackMsg.msgType === "iceConfig") {
	                    processIceConfig(ackMsg.msgData.iceConfig);
	                    callback(true);
	                } else {
	                    self.showError(ackMsg.msgData.errorCode, ackMsg.msgData.errorText);
	                    callback(false);
	                }
	            });
	        };

	        /**
	         * This method allows you to join a single room. It may be called multiple times to be in
	         * multiple rooms simultaneously. It may be called before or after connecting to the server.
	         * Note: the successCB and failureDB will only be called if you are already connected to the server.
	         * @param {String} roomName the room to be joined.
	         * @param {Object} roomParameters application specific parameters, can be null.
	         * @param {Function} successCB called once, with a roomName as it's argument, once the room is joined.
	         * @param {Function} failureCB called if the room can not be joined. The arguments of failureCB are errorCode, errorText, roomName.
	         */
	        this.joinRoom = function (roomName, roomParameters, successCB, failureCB) {
	            if (self.roomJoin[roomName]) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to join room " + roomName + " which you are already in.");
	                return;
	            }

	            var newRoomData = { roomName: roomName };
	            if (roomParameters) {
	                try {
	                    JSON.stringify(roomParameters);
	                } catch (error) {
	                    self.showError(self.errCodes.DEVELOPER_ERR, "non-jsonable parameter to easyrtc.joinRoom");
	                    throw "Developer error, see application error messages";
	                }
	                var parameters = {};
	                for (var key in roomParameters) {
	                    if (roomParameters.hasOwnProperty(key)) {
	                        parameters[key] = roomParameters[key];
	                    }
	                }
	                newRoomData.roomParameter = parameters;
	            }
	            var msgData = {
	                roomJoin: {}
	            };
	            var roomData;
	            var signallingSuccess, signallingFailure;
	            if (self.webSocket) {

	                msgData.roomJoin[roomName] = newRoomData;
	                signallingSuccess = function signallingSuccess(msgType, msgData) {

	                    roomData = msgData.roomData;
	                    self.roomJoin[roomName] = newRoomData;
	                    if (successCB) {
	                        successCB(roomName);
	                    }

	                    processRoomData(roomData);
	                };
	                signallingFailure = function signallingFailure(errorCode, errorText) {
	                    if (failureCB) {
	                        failureCB(errorCode, errorText, roomName);
	                    } else {
	                        self.showError(errorCode, self.format(self.getConstantString("unableToEnterRoom"), roomName, errorText));
	                    }
	                };
	                sendSignalling(null, "roomJoin", msgData, signallingSuccess, signallingFailure);
	            } else {
	                self.roomJoin[roomName] = newRoomData;
	            }
	        };

	        /**
	         * This function allows you to leave a single room. Note: the successCB and failureDB
	         *  arguments are optional and will only be called if you are already connected to the server.
	         * @param {String} roomName
	         * @param {Function} successCallback - A function which expects a roomName.
	         * @param {Function} failureCallback - A function which expects the following arguments: errorCode, errorText, roomName.
	         * @example
	         *    easyrtc.leaveRoom("freds_room");
	         *    easyrtc.leaveRoom("freds_room", function(roomName){ console.log("left the room")},
	         *                       function(errorCode, errorText, roomName){ console.log("left the room")});
	         */
	        this.leaveRoom = function (roomName, successCallback, failureCallback) {
	            var roomItem;
	            if (self.roomJoin[roomName]) {
	                if (!self.webSocket) {
	                    delete self.roomJoin[roomName];
	                } else {
	                    roomItem = {};
	                    roomItem[roomName] = { roomName: roomName };
	                    sendSignalling(null, "roomLeave", { roomLeave: roomItem }, function (msgType, msgData) {
	                        var roomData = msgData.roomData;
	                        processRoomData(roomData);
	                        if (successCallback) {
	                            successCallback(roomName);
	                        }
	                    }, function (errorCode, errorText) {
	                        if (failureCallback) {
	                            failureCallback(errorCode, errorText, roomName);
	                        }
	                    });
	                }
	            }
	        };

	        /** Get a list of the rooms you are in. You must be connected to call this function.
	         * @returns {Object} A map whose keys are the room names
	         */
	        this.getRoomsJoined = function () {
	            var roomsIn = {};
	            var key;
	            for (key in self.roomJoin) {
	                if (self.roomJoin.hasOwnProperty(key)) {
	                    roomsIn[key] = true;
	                }
	            }
	            return roomsIn;
	        };

	        /** Get server defined fields associated with a particular room. Only valid
	         * after a connection has been made.
	         * @param {String} roomName - the name of the room you want the fields for.
	         * @returns {Object} A dictionary containing entries of the form {key:{'fieldName':key, 'fieldValue':value1}} or undefined
	         * if you are not connected to the room.
	         */
	        this.getRoomFields = function (roomName) {
	            return !fields || !fields.rooms || !fields.rooms[roomName] ? undefined : fields.rooms[roomName];
	        };

	        /** Get server defined fields associated with the current application. Only valid
	         * after a connection has been made.
	         * @returns {Object} A dictionary containing entries of the form {key:{'fieldName':key, 'fieldValue':value1}}
	         */
	        this.getApplicationFields = function () {
	            return fields.application;
	        };

	        /** Get server defined fields associated with the connection. Only valid
	         * after a connection has been made.
	         * @returns {Object} A dictionary containing entries of the form {key:{'fieldName':key, 'fieldValue':value1}}
	         */
	        this.getConnectionFields = function () {
	            return fields.connection;
	        };

	        /**
	         * Supply a socket.io connection that will be used instead of allocating a new socket.
	         * The expected usage is that you allocate a websocket, assign options to it, call
	         * easyrtc.useThisSocketConnection, followed by easyrtc.connect or easyrtc.easyApp. Easyrtc will not attempt to
	         * close sockets that were supplied with easyrtc.useThisSocketConnection.
	         * @param {Object} alreadyAllocatedSocketIo A value allocated with the connect method of socket.io.
	         */
	        this.useThisSocketConnection = function (alreadyAllocatedSocketIo) {
	            preallocatedSocketIo = alreadyAllocatedSocketIo;
	        };

	        /** @private */
	        function processToken(msg) {
	            var msgData = msg.msgData;
	            logDebug("entered process token");

	            if (msgData.easyrtcid) {
	                self.myEasyrtcid = msgData.easyrtcid;
	            }
	            if (msgData.field) {
	                fields.connection = msgData.field;
	            }
	            if (msgData.iceConfig) {
	                processIceConfig(msgData.iceConfig);
	            }

	            if (msgData.sessionData) {
	                processSessionData(msgData.sessionData);
	            }
	            if (msgData.roomData) {
	                processRoomData(msgData.roomData);
	            }
	            if (msgData.application.field) {
	                fields.application = msgData.application.field;
	            }
	        }

	        /** @private */
	        function sendAuthenticate(successCallback, errorCallback) {
	            //
	            // find our easyrtcsid
	            //
	            var cookies, target, i;
	            var easyrtcsid = null;

	            if (self.cookieId && document.cookie) {
	                cookies = document.cookie.split(/[; ]/g);
	                target = self.cookieId + "=";
	                for (i = 0; i < cookies.length; i++) {
	                    if (cookies[i].indexOf(target) === 0) {
	                        easyrtcsid = cookies[i].substring(target.length);
	                    }
	                }
	            }

	            var msgData = {
	                apiVersion: self.apiVersion,
	                applicationName: self.applicationName,
	                setUserCfg: collectConfigurationInfo(true)
	            };

	            if (!self.roomJoin) {
	                self.roomJoin = {};
	            }
	            if (self.presenceShow) {
	                msgData.setPresence = {
	                    show: self.presenceShow,
	                    status: self.presenceStatus
	                };
	            }
	            if (self.username) {
	                msgData.username = self.username;
	            }
	            if (self.roomJoin && !isEmptyObj(self.roomJoin)) {
	                msgData.roomJoin = self.roomJoin;
	            }
	            if (easyrtcsid) {
	                msgData.easyrtcsid = easyrtcsid;
	            }
	            if (credential) {
	                msgData.credential = credential;
	            }

	            self.webSocket.json.emit("easyrtcAuth", {
	                msgType: "authenticate",
	                msgData: msgData
	            }, function (msg) {
	                var room;
	                if (msg.msgType === "error") {
	                    errorCallback(msg.msgData.errorCode, msg.msgData.errorText);
	                    self.roomJoin = {};
	                } else {
	                    processToken(msg);
	                    if (self._roomApiFields) {
	                        for (room in self._roomApiFields) {
	                            if (self._roomApiFields.hasOwnProperty(room)) {
	                                enqueueSendRoomApi(room);
	                            }
	                        }
	                    }

	                    if (successCallback) {
	                        successCallback(self.myEasyrtcid);
	                    }
	                }
	            });
	        }

	        /** @private */
	        function connectToWSServer(successCallback, errorCallback) {
	            var i;
	            if (preallocatedSocketIo) {
	                self.webSocket = preallocatedSocketIo;
	            } else if (!self.webSocket) {
	                try {
	                    self.webSocket = io.connect(serverPath, connectionOptions);

	                    if (!self.webSocket) {
	                        throw "io.connect failed";
	                    }
	                } catch (socketErr) {
	                    self.webSocket = 0;
	                    errorCallback(self.errCodes.SYSTEM_ERROR, socketErr.toString());

	                    return;
	                }
	            } else {
	                for (i in self.websocketListeners) {
	                    if (!self.websocketListeners.hasOwnProperty(i)) {
	                        continue;
	                    }
	                    self.webSocket.removeEventListener(self.websocketListeners[i].event, self.websocketListeners[i].handler);
	                }
	            }

	            self.websocketListeners = [];

	            function addSocketListener(event, handler) {
	                self.webSocket.on(event, handler);
	                self.websocketListeners.push({ event: event, handler: handler });
	            }

	            addSocketListener("close", function (event) {
	                logDebug("the web socket closed");
	            });

	            addSocketListener('error', function (event) {
	                function handleErrorEvent() {
	                    if (self.myEasyrtcid) {
	                        //
	                        // socket.io version 1 got rid of the socket member, moving everything up one level.
	                        //
	                        if (isSocketConnected(self.webSocket)) {
	                            self.showError(self.errCodes.SIGNAL_ERR, self.getConstantString("miscSignalError"));
	                        } else {
	                            /* socket server went down. this will generate a 'disconnect' event as well, so skip this event */
	                            errorCallback(self.errCodes.CONNECT_ERR, self.getConstantString("noServer"));
	                        }
	                    } else {
	                        errorCallback(self.errCodes.CONNECT_ERR, self.getConstantString("noServer"));
	                    }
	                }
	                handleErrorEvent();
	            });

	            function connectHandler(event) {
	                self.webSocketConnected = true;
	                if (!self.webSocket) {
	                    self.showError(self.errCodes.CONNECT_ERR, self.getConstantString("badsocket"));
	                }

	                logDebug("saw socket-server onconnect event");

	                if (self.webSocketConnected) {
	                    sendAuthenticate(successCallback, errorCallback);
	                } else {
	                    errorCallback(self.errCodes.SIGNAL_ERR, self.getConstantString("icf"));
	                }
	            }

	            if (isSocketConnected(preallocatedSocketIo)) {
	                connectHandler(null);
	            } else {
	                addSocketListener("connect", connectHandler);
	            }

	            addSocketListener("easyrtcMsg", onChannelMsg);
	            addSocketListener("easyrtcCmd", onChannelCmd);
	            addSocketListener("disconnect", function () /* code, reason, wasClean */{

	                self.webSocketConnected = false;
	                updateConfigurationInfo = function updateConfigurationInfo() {}; // dummy update function
	                oldConfig = {};
	                disconnectBody();

	                if (self.disconnectListener) {
	                    self.disconnectListener();
	                }
	            });
	        }

	        /**
	         * Connects to the EasyRTC signaling server. You must connect before trying to
	         * call other users.
	         * @param {String} applicationName is a string that identifies the application so that different applications can have different
	         *        lists of users. Note that the server configuration specifies a regular expression that is used to check application names
	         *        for validity. The default pattern is that of an identifier, spaces are not allowed.
	         * @param {Function} successCallback (easyrtcId, roomOwner) - is called on successful connect. easyrtcId is the
	         *   unique name that the client is known to the server by. A client usually only needs it's own easyrtcId for debugging purposes.
	         *       roomOwner is true if the user is the owner of a room. It's value is random if the user is in multiple rooms.
	         * @param {Function} errorCallback (errorCode, errorText) - is called on unsuccessful connect. if null, an alert is called instead.
	         *  The errorCode takes it's value from easyrtc.errCodes.
	         * @example
	         *   easyrtc.connect("my_chat_app",
	         *                   function(easyrtcid, roomOwner){
	         *                       if( roomOwner){ console.log("I'm the room owner"); }
	         *                       console.log("my id is " + easyrtcid);
	         *                   },
	         *                   function(errorText){
	         *                       console.log("failed to connect ", erFrText);
	         *                   });
	         */
	        this.connect = function (applicationName, successCallback, errorCallback) {

	            // Detect invalid or missing socket.io
	            if (!io) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Your HTML has not included the socket.io.js library");
	            }

	            if (!preallocatedSocketIo && self.webSocket) {
	                self.showError(self.errCodes.DEVELOPER_ERR, "Attempt to connect when already connected to socket server");
	                return;
	            }
	            pc_config = {};
	            closedChannel = null;
	            oldConfig = {}; // used internally by updateConfiguration
	            queuedMessages = {};
	            self.applicationName = applicationName;
	            fields = {
	                rooms: {},
	                application: {},
	                connection: {}
	            };

	            logDebug("attempt to connect to WebRTC signalling server with application name=" + applicationName);

	            if (errorCallback === null) {
	                errorCallback = function errorCallback(errorCode, errorText) {
	                    self.showError(errorCode, errorText);
	                };
	            }

	            connectToWSServer(successCallback, errorCallback);
	        };
	    };

	    return new Easyrtc();
	});

	/* global define, module, require, console */
	/*!
	  Script: easyrtc_app.js

	    Provides support file and data transfer support to easyrtc.

	  About: License

	    Copyright (c) 2016, Priologic Software Inc.
	    All rights reserved.

	    Redistribution and use in source and binary forms, with or without
	    modification, are permitted provided that the following conditions are met:

	        * Redistributions of source code must retain the above copyright notice,
	          this list of conditions and the following disclaimer.
	        * Redistributions in binary form must reproduce the above copyright
	          notice, this list of conditions and the following disclaimer in the
	          documentation and/or other materials provided with the distribution.

	    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	    ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	    CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	    INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	    CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	    POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (root, factory) {
	    if (true) {
	        //RequireJS (AMD) build system
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__WEBPACK_LOCAL_MODULE_2__], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	        //CommonJS build system
	        module.exports = factory(require('easyrtc'));
	    } else {
	        //Vanilla JS, ensure dependencies are loaded correctly
	        if (_typeof(window.easyrtc) !== 'object' || !window.easyrtc) {
	            throw new Error("easyrtc_app requires easyrtc");
	        }
	        root.easyrtc = factory(window.easyrtc);
	    }
	})(undefined, function (easyrtc, undefined) {

	    "use strict";

	    /**
	     * This file adds additional methods to Easyrtc for simplifying the 
	     * management of video-mediastream assignment.
	     * @class Easyrtc_App
	     */

	    /** @private */

	    var autoAddCloseButtons = true;

	    /** By default, the easyApp routine sticks a "close" button on top of each caller
	     * video object that it manages. Call this function(before calling easyApp) to disable that particular feature.
	     * @function
	     * @memberOf Easyrtc_App
	     * @example
	     *    easyrtc.dontAddCloseButtons();
	     */
	    easyrtc.dontAddCloseButtons = function () {
	        autoAddCloseButtons = false;
	    };

	    /**
	     * This is a helper function for the easyApp method. It manages the assignment of video streams
	     * to video objects. It assumes
	     * @param {String} monitorVideoId is the id of the mirror video tag.
	     * @param {Array} videoIds is an array of ids of the caller video tags.
	     * @private
	     */
	    function easyAppBody(monitorVideoId, videoIds) {

	        var videoIdsP = videoIds || [],
	            numPEOPLE = videoIds.length,
	            videoIdToCallerMap = {},
	            onCall = null,
	            onHangup = null;

	        /**
	         * Validates that the video ids correspond to dom objects.
	         * @param {String} monitorVideoId
	         * @param {Array} videoIds
	         * @returns {Boolean}
	         * @private
	         */
	        function validateVideoIds(monitorVideoId, videoIds) {
	            var i;
	            // verify that video ids were not typos.
	            if (monitorVideoId && !document.getElementById(monitorVideoId)) {
	                easyrtc.showError(easyrtc.errCodes.DEVELOPER_ERR, "The monitor video id passed to easyApp was bad, saw " + monitorVideoId);
	                return false;
	            }

	            for (i in videoIds) {
	                if (!videoIds.hasOwnProperty(i)) {
	                    continue;
	                }
	                var name = videoIds[i];
	                if (!document.getElementById(name)) {
	                    easyrtc.showError(easyrtc.errCodes.DEVELOPER_ERR, "The caller video id '" + name + "' passed to easyApp was bad.");
	                    return false;
	                }
	            }
	            return true;
	        }

	        function getCallerOfVideo(videoObject) {
	            return videoIdToCallerMap[videoObject.id];
	        }

	        function setCallerOfVideo(videoObject, callerEasyrtcId) {
	            videoIdToCallerMap[videoObject.id] = callerEasyrtcId;
	        }

	        function videoIsFree(obj) {
	            var caller = getCallerOfVideo(obj);
	            return caller === "" || caller === null || caller === undefined;
	        }

	        function getIthVideo(i) {
	            if (videoIdsP[i]) {
	                return document.getElementById(videoIdsP[i]);
	            } else {
	                return null;
	            }
	        }

	        function showVideo(video, stream) {
	            easyrtc.setVideoObjectSrc(video, stream);
	            if (video.style.visibility) {
	                video.style.visibility = 'visible';
	            }
	        }

	        function hideVideo(video) {
	            easyrtc.setVideoObjectSrc(video, "");
	            video.style.visibility = "hidden";
	        }

	        if (!validateVideoIds(monitorVideoId, videoIdsP)) {
	            throw "bad video element id";
	        }

	        if (monitorVideoId) {
	            document.getElementById(monitorVideoId).muted = "muted";
	        }

	        easyrtc.addEventListener("roomOccupants", function (eventName, eventData) {
	            var i;
	            for (i = 0; i < numPEOPLE; i++) {
	                var video = getIthVideo(i);
	                if (!videoIsFree(video)) {
	                    if (!easyrtc.isPeerInAnyRoom(getCallerOfVideo(video))) {
	                        if (onHangup) {
	                            onHangup(getCallerOfVideo(video), i);
	                        }
	                        setCallerOfVideo(video, null);
	                    }
	                }
	            }
	        });

	        /** Sets an event handler that gets called when an incoming MediaStream is assigned 
	         * to a video object. The name is poorly chosen and reflects a simpler era when you could
	         * only have one media stream per peer connection.
	         * @function
	         * @memberOf Easyrtc_App
	         * @param {Function} cb has the signature function(easyrtcid, slot){}
	         * @example
	         *   easyrtc.setOnCall( function(easyrtcid, slot){
	         *      console.log("call with " + easyrtcid + "established");
	         *   });
	         */
	        easyrtc.setOnCall = function (cb) {
	            onCall = cb;
	        };

	        /** Sets an event handler that gets called when a call is ended.
	         * it's only purpose (so far) is to support transitions on video elements.
	         x     * this function is only defined after easyrtc.easyApp is called.
	         * The slot is parameter is the index into the array of video ids.
	         * Note: if you call easyrtc.getConnectionCount() from inside your callback
	         * it's count will reflect the number of connections before the hangup started.
	         * @function
	         * @memberOf Easyrtc_App
	         * @param {Function} cb has the signature function(easyrtcid, slot){}
	         * @example
	         *   easyrtc.setOnHangup( function(easyrtcid, slot){
	         *      console.log("call with " + easyrtcid + "ended");
	         *   });
	         */
	        easyrtc.setOnHangup = function (cb) {
	            onHangup = cb;
	        };

	        /** 
	          * Get the easyrtcid of the ith caller, starting at 0.
	          * @function
	          * @memberOf Easyrtc_App
	          * @param {number} i
	          * @returns {String}
	          */
	        easyrtc.getIthCaller = function (i) {
	            if (i < 0 || i >= videoIdsP.length) {
	                return null;
	            }
	            var vid = getIthVideo(i);
	            return getCallerOfVideo(vid);
	        };

	        /** 
	          * This is the complement of getIthCaller. Given an easyrtcid,
	          * it determines which slot the easyrtc is in.
	          * @function
	          * @memberOf Easyrtc_App
	          * @param {string} easyrtcid 
	          * @returns {number} or -1 if the easyrtcid is not a caller.
	          */
	        easyrtc.getSlotOfCaller = function (easyrtcid) {
	            var i;
	            for (i = 0; i < numPEOPLE; i++) {
	                if (easyrtc.getIthCaller(i) === easyrtcid) {
	                    return i;
	                }
	            }
	            return -1; // caller not connected
	        };

	        easyrtc.setOnStreamClosed(function (caller) {
	            var i;
	            for (i = 0; i < numPEOPLE; i++) {
	                var video = getIthVideo(i);
	                if (getCallerOfVideo(video) === caller) {
	                    hideVideo(video);
	                    setCallerOfVideo(video, "");
	                    if (onHangup) {
	                        onHangup(caller, i);
	                    }
	                }
	            }
	        });

	        //
	        // Only accept incoming calls if we have a free video object to display
	        // them in.
	        //
	        easyrtc.setAcceptChecker(function (caller, helper) {
	            var i;
	            for (i = 0; i < numPEOPLE; i++) {
	                var video = getIthVideo(i);
	                if (videoIsFree(video)) {
	                    helper(true);
	                    return;
	                }
	            }
	            helper(false);
	        });

	        easyrtc.setStreamAcceptor(function (caller, stream) {
	            var i;
	            if (easyrtc.debugPrinter) {
	                easyrtc.debugPrinter("stream acceptor called");
	            }

	            var video;

	            for (i = 0; i < numPEOPLE; i++) {
	                video = getIthVideo(i);
	                if (getCallerOfVideo(video) === caller) {
	                    showVideo(video, stream);
	                    if (onCall) {
	                        onCall(caller, i);
	                    }
	                    return;
	                }
	            }

	            for (i = 0; i < numPEOPLE; i++) {
	                video = getIthVideo(i);
	                if (videoIsFree(video)) {
	                    setCallerOfVideo(video, caller);
	                    if (onCall) {
	                        onCall(caller, i);
	                    }
	                    showVideo(video, stream);
	                    return;
	                }
	            }
	            //
	            // no empty slots, so drop whatever caller we have in the first slot and use that one.
	            //
	            video = getIthVideo(0);
	            if (video) {
	                easyrtc.hangup(getCallerOfVideo(video));
	                showVideo(video, stream);
	                if (onCall) {
	                    onCall(caller, 0);
	                }
	            }

	            setCallerOfVideo(video, caller);
	        });

	        var addControls, parentDiv, closeButton, i;
	        if (autoAddCloseButtons) {

	            addControls = function addControls(video) {
	                parentDiv = video.parentNode;
	                setCallerOfVideo(video, "");
	                closeButton = document.createElement("div");
	                closeButton.className = "easyrtc_closeButton";
	                closeButton.onclick = function () {
	                    if (getCallerOfVideo(video)) {
	                        easyrtc.hangup(getCallerOfVideo(video));
	                        hideVideo(video);
	                        setCallerOfVideo(video, "");
	                    }
	                };
	                parentDiv.appendChild(closeButton);
	            };

	            for (i = 0; i < numPEOPLE; i++) {
	                addControls(getIthVideo(i));
	            }
	        }

	        var monitorVideo = null;
	        if (easyrtc.videoEnabled && monitorVideoId !== null) {
	            monitorVideo = document.getElementById(monitorVideoId);
	            if (!monitorVideo) {
	                console.error("Programmer error: no object called " + monitorVideoId);
	                return;
	            }
	            monitorVideo.muted = "muted";
	            monitorVideo.defaultMuted = true;
	        }
	    }

	    /**
	     * Provides a layer on top of the easyrtc.initMediaSource and easyrtc.connect, assign the local media stream to
	     * the video object identified by monitorVideoId, assign remote video streams to
	     * the video objects identified by videoIds, and then call onReady. One of it's
	     * side effects is to add hangup buttons to the remote video objects, buttons
	     * that only appear when you hover over them with the mouse cursor. This method will also add the
	     * easyrtcMirror class to the monitor video object so that it behaves like a mirror.
	     * @function
	     * @memberOf Easyrtc_App
	     *  @param {String} applicationName - name of the application.
	     *  @param {String} monitorVideoId - the id of the video object used for monitoring the local stream.
	     *  @param {Array} videoIds - an array of video object ids (strings)
	     *  @param {Function} onReady - a callback function used on success. It is called with the easyrtcId this peer is known to the server as.
	     *  @param {Function} onFailure - a callback function used on failure (failed to get local media or a connection of the signaling server).
	     *  @example
	     *     easyrtc.easyApp('multiChat', 'selfVideo', ['remote1', 'remote2', 'remote3'],
	     *              function(easyrtcId){
	     *                  console.log("successfully connected, I am " + easyrtcId);
	     *              },
	     *              function(errorCode, errorText){
	     *                  console.log(errorText);
	     *              });
	     */
	    easyrtc.easyApp = function (applicationName, monitorVideoId, videoIds, onReady, onFailure) {

	        var gotMediaCallback = null,
	            gotConnectionCallback = null;

	        easyAppBody(monitorVideoId, videoIds);

	        easyrtc.setGotMedia = function (gotMediaCB) {
	            gotMediaCallback = gotMediaCB;
	        };

	        //
	        // try to restablish broken connections that weren't caused by a hangup
	        //
	        easyrtc.setPeerClosedListener(function (easyrtcid) {
	            setTimeout(function () {
	                if (easyrtc.getSlotOfCaller(easyrtcid) >= 0 && easyrtc.isPeerInAnyRoom(easyrtcid)) {
	                    easyrtc.call(easyrtcid, function () {}, function () {}, function () {});
	                }
	            }, 1000);
	        });

	        /** Sets an event handler that gets called when a connection to the signaling
	         * server has or has not been made. Can only be called after calling easyrtc.easyApp.
	         * @function
	         * @memberOf Easyrtc_App
	         * @param {Function} gotConnectionCB has the signature (gotConnection, errorText)
	         * @example
	         *    easyrtc.setGotConnection( function(gotConnection, errorText){
	         *        if( gotConnection ){
	         *            console.log("Successfully connected to signaling server");
	         *        }
	         *        else{
	         *            console.log("Failed to connect to signaling server because: " + errorText);
	         *        }
	         *    });
	         */
	        easyrtc.setGotConnection = function (gotConnectionCB) {
	            gotConnectionCallback = gotConnectionCB;
	        };

	        function nextInitializationStep() /* token */{
	            if (gotConnectionCallback) {
	                gotConnectionCallback(true, "");
	            }
	            onReady(easyrtc.myEasyrtcid);
	        }

	        function postGetUserMedia() {
	            if (gotMediaCallback) {
	                gotMediaCallback(true, null);
	            }
	            if (monitorVideoId !== null) {
	                easyrtc.setVideoObjectSrc(document.getElementById(monitorVideoId), easyrtc.getLocalStream());
	            }
	            function connectError(errorCode, errorText) {
	                if (gotConnectionCallback) {
	                    gotConnectionCallback(false, errorText);
	                } else if (onFailure) {
	                    onFailure(easyrtc.errCodes.CONNECT_ERR, errorText);
	                } else {
	                    easyrtc.showError(easyrtc.errCodes.CONNECT_ERR, errorText);
	                }
	            }

	            easyrtc.connect(applicationName, nextInitializationStep, connectError);
	        }

	        var stream = easyrtc.getLocalStream(null);
	        if (stream) {
	            postGetUserMedia();
	        } else {
	            easyrtc.initMediaSource(postGetUserMedia, function (errorCode, errorText) {
	                if (gotMediaCallback) {
	                    gotMediaCallback(false, errorText);
	                } else if (onFailure) {
	                    onFailure(easyrtc.errCodes.MEDIA_ERR, errorText);
	                } else {
	                    easyrtc.showError(easyrtc.errCodes.MEDIA_ERR, errorText);
	                }
	            }, null // default stream
	            );
	        }
	    };

	    return easyrtc;
	}); // end of module wrapper
	;

/***/ },
/* 210 */
/***/ function(module, exports) {

	'use strict';

	var suitMap = { 'Club': '草花', 'Diamond': '方块', 'Heart': '红心', 'Spade': '黑桃' };
	module.exports = function parseToImg(card) {
	    if (!card) return null;
	    var ret = fairygui.UIPackage.getItemURL('Package1', suitMap[card.suit] + (card.sort == 14 ? 1 : card.sort));
	    if (!ret) console.log(suitMap[card.suit] + (card.sort == 14 ? 1 : card.sort), 'not found');
	    return ret;
	};

/***/ },
/* 211 */
/***/ function(module, exports) {

	/**
	 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
	 *
	 * @name feature
	 * @param {Geometry} geometry input geometry
	 * @param {Object} properties properties
	 * @returns {FeatureCollection} a FeatureCollection of input features
	 * @example
	 * var geometry = {
	 *      "type": "Point",
	 *      "coordinates": [
	 *        67.5,
	 *        32.84267363195431
	 *      ]
	 *    }
	 *
	 * var feature = turf.feature(geometry);
	 *
	 * //=feature
	 */
	function feature(geometry, properties) {
	    return {
	        type: 'Feature',
	        properties: properties || {},
	        geometry: geometry
	    };
	}

	module.exports.feature = feature;

	/**
	 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
	 *
	 * @name point
	 * @param {number[]} coordinates longitude, latitude position (each in decimal degrees)
	 * @param {Object=} properties an Object that is used as the {@link Feature}'s
	 * properties
	 * @returns {Feature<Point>} a Point feature
	 * @example
	 * var pt1 = turf.point([-75.343, 39.984]);
	 *
	 * //=pt1
	 */
	module.exports.point = function (coordinates, properties) {
	    if (!Array.isArray(coordinates)) throw new Error('Coordinates must be an array');
	    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
	    return feature({
	        type: 'Point',
	        coordinates: coordinates.slice()
	    }, properties);
	};

	/**
	 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
	 *
	 * @name polygon
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object=} properties a properties object
	 * @returns {Feature<Polygon>} a Polygon feature
	 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
	 * or if a LinearRing of the Polygon does not have matching Positions at the
	 * beginning & end.
	 * @example
	 * var polygon = turf.polygon([[
	 *  [-2.275543, 53.464547],
	 *  [-2.275543, 53.489271],
	 *  [-2.215118, 53.489271],
	 *  [-2.215118, 53.464547],
	 *  [-2.275543, 53.464547]
	 * ]], { name: 'poly1', population: 400});
	 *
	 * //=polygon
	 */
	module.exports.polygon = function (coordinates, properties) {

	    if (!coordinates) throw new Error('No coordinates passed');

	    for (var i = 0; i < coordinates.length; i++) {
	        var ring = coordinates[i];
	        if (ring.length < 4) {
	            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
	        }
	        for (var j = 0; j < ring[ring.length - 1].length; j++) {
	            if (ring[ring.length - 1][j] !== ring[0][j]) {
	                throw new Error('First and last Position are not equivalent.');
	            }
	        }
	    }

	    return feature({
	        type: 'Polygon',
	        coordinates: coordinates
	    }, properties);
	};

	/**
	 * Creates a {@link LineString} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name lineString
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object=} properties an Object of key-value pairs to add as properties
	 * @returns {Feature<LineString>} a LineString feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var linestring1 = turf.lineString([
	 *	[-21.964416, 64.148203],
	 *	[-21.956176, 64.141316],
	 *	[-21.93901, 64.135924],
	 *	[-21.927337, 64.136673]
	 * ]);
	 * var linestring2 = turf.lineString([
	 *	[-21.929054, 64.127985],
	 *	[-21.912918, 64.134726],
	 *	[-21.916007, 64.141016],
	 * 	[-21.930084, 64.14446]
	 * ], {name: 'line 1', distance: 145});
	 *
	 * //=linestring1
	 *
	 * //=linestring2
	 */
	module.exports.lineString = function (coordinates, properties) {
	    if (!coordinates) {
	        throw new Error('No coordinates passed');
	    }
	    return feature({
	        type: 'LineString',
	        coordinates: coordinates
	    }, properties);
	};

	/**
	 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
	 *
	 * @name featureCollection
	 * @param {Feature[]} features input features
	 * @returns {FeatureCollection} a FeatureCollection of input features
	 * @example
	 * var features = [
	 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
	 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
	 *  turf.point([-75.534, 39.123], {name: 'Location C'})
	 * ];
	 *
	 * var fc = turf.featureCollection(features);
	 *
	 * //=fc
	 */
	module.exports.featureCollection = function (features) {
	    return {
	        type: 'FeatureCollection',
	        features: features
	    };
	};

	/**
	 * Creates a {@link Feature<MultiLineString>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiLineString
	 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
	 * @param {Object=} properties an Object of key-value pairs to add as properties
	 * @returns {Feature<MultiLineString>} a MultiLineString feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
	 *
	 * //=multiLine
	 *
	 */
	module.exports.multiLineString = function (coordinates, properties) {
	    if (!coordinates) {
	        throw new Error('No coordinates passed');
	    }
	    return feature({
	        type: 'MultiLineString',
	        coordinates: coordinates
	    }, properties);
	};

	/**
	 * Creates a {@link Feature<MultiPoint>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPoint
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object=} properties an Object of key-value pairs to add as properties
	 * @returns {Feature<MultiPoint>} a MultiPoint feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
	 *
	 * //=multiPt
	 *
	 */
	module.exports.multiPoint = function (coordinates, properties) {
	    if (!coordinates) {
	        throw new Error('No coordinates passed');
	    }
	    return feature({
	        type: 'MultiPoint',
	        coordinates: coordinates
	    }, properties);
	};


	/**
	 * Creates a {@link Feature<MultiPolygon>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPolygon
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
	 * @param {Object=} properties an Object of key-value pairs to add as properties
	 * @returns {Feature<MultiPolygon>} a multipolygon feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]);
	 *
	 * //=multiPoly
	 *
	 */
	module.exports.multiPolygon = function (coordinates, properties) {
	    if (!coordinates) {
	        throw new Error('No coordinates passed');
	    }
	    return feature({
	        type: 'MultiPolygon',
	        coordinates: coordinates
	    }, properties);
	};

	/**
	 * Creates a {@link Feature<GeometryCollection>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name geometryCollection
	 * @param {Array<{Geometry}>} geometries an array of GeoJSON Geometries
	 * @param {Object=} properties an Object of key-value pairs to add as properties
	 * @returns {Feature<GeometryCollection>} a geometrycollection feature
	 * @example
	 * var pt = {
	 *     "type": "Point",
	 *       "coordinates": [100, 0]
	 *     };
	 * var line = {
	 *     "type": "LineString",
	 *     "coordinates": [ [101, 0], [102, 1] ]
	 *   };
	 * var collection = turf.geometrycollection([[0,0],[10,10]]);
	 *
	 * //=collection
	 */
	module.exports.geometryCollection = function (geometries, properties) {
	    return feature({
	        type: 'GeometryCollection',
	        geometries: geometries
	    }, properties);
	};

	var factors = {
	    miles: 3960,
	    nauticalmiles: 3441.145,
	    degrees: 57.2957795,
	    radians: 1,
	    inches: 250905600,
	    yards: 6969600,
	    meters: 6373000,
	    metres: 6373000,
	    kilometers: 6373,
	    kilometres: 6373
	};

	/*
	 * Convert a distance measurement from radians to a more friendly unit.
	 *
	 * @name radiansToDistance
	 * @param {number} distance in radians across the sphere
	 * @param {string=kilometers} units: one of miles, nauticalmiles, degrees, radians,
	 * inches, yards, metres, meters, kilometres, kilometers.
	 * @returns {number} distance
	 */
	module.exports.radiansToDistance = function (radians, units) {
	    var factor = factors[units || 'kilometers'];
	    if (factor === undefined) {
	        throw new Error('Invalid unit');
	    }
	    return radians * factor;
	};

	/*
	 * Convert a distance measurement from a real-world unit into radians
	 *
	 * @name distanceToRadians
	 * @param {number} distance in real units
	 * @param {string=kilometers} units: one of miles, nauticalmiles, degrees, radians,
	 * inches, yards, metres, meters, kilometres, kilometers.
	 * @returns {number} radians
	 */
	module.exports.distanceToRadians = function (distance, units) {
	    var factor = factors[units || 'kilometers'];
	    if (factor === undefined) {
	        throw new Error('Invalid unit');
	    }
	    return distance / factor;
	};

	/*
	 * Convert a distance measurement from a real-world unit into degrees
	 *
	 * @name distanceToRadians
	 * @param {number} distance in real units
	 * @param {string=kilometers} units: one of miles, nauticalmiles, degrees, radians,
	 * inches, yards, metres, meters, kilometres, kilometers.
	 * @returns {number} degrees
	 */
	module.exports.distanceToDegrees = function (distance, units) {
	    var factor = factors[units || 'kilometers'];
	    if (factor === undefined) {
	        throw new Error('Invalid unit');
	    }
	    return (distance / factor) * 57.2958;
	};


/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var extent = __webpack_require__(213);
	var featurecollection = __webpack_require__(215);
	var inside = __webpack_require__(216);
	var random = __webpack_require__(217);

	/**
	 * Takes a number and a feature and {@link Polygon} or {@link MultiPolygon} and returns {@link Points} that reside inside the polygon. The polygon can
	 * be convex or concave. The function accounts for holes.
	 *
	 * * Given a {Number}, the number of points to be randomly generated.
	 * * Given a {@link Polygon} or {@link MultiPolygon}, the boundary of the random points
	 *
	 *
	 * @module turf-random-points-on-polygon
	 * @category measurement
	 * @param {Number} number of points to be generated
	 * @param {Feature<(Polygon|MultiPolygon)>} polygon input polygon or multipolygon
	 * @param {Object} [properties={}] properties to be appended to the point features
	 * @param {Boolean} [fc=false] if true returns points as a {@link FeatureCollection}
	 * @return {Array} || {FeatureCollection<Points>} an array or feature collection of the random points inside the polygon
	**/

	function randomPointsOnPolygon(number, polygon, properties, fc) {
	  if (typeof properties === 'boolean') {
	    fc = properties;
	    properties = {};
	  }

	  if (number < 1) {
	    return new Error('Number must be >= 1');
	  }

	  if(polygon.type !== 'Feature') {
	    return new Error('Polygon parameter must be a Feature<(Polygon|MultiPolygon)>');

	    if (polygon.geomtry.type !== 'Polygon' || polygon.geomtry.type !== 'MutliPolygon') {
	      return new Error('Polygon parameter must be a Feature<(Polygon|MultiPolygon)>')
	    }
	  }

	  if (this instanceof randomPointsOnPolygon) {
	    return new randomPointsOnPolygon(number, polygon, properties);
	  }

	  properties = properties || {};
	  fc = fc || false;
	  var points = [];
	  var bbox = extent(polygon);
	  var count = Math.round(parseFloat(number));

	  for (var i = 0; i <= count; i++) {
	    if (i === count) {
	      if (fc) {
	        return featurecollection(points);
	      }

	      return points;
	    }

	    var point = random('point', 1, { bbox: bbox });

	    if (inside(point.features[0], polygon) === false) {
	      i = --i;
	    }

	    if (inside(point.features[0], polygon) === true) {
	      point.features[0].properties = properties;
	      points.push(point.features[0]);
	    }
	  }

	}

	module.exports = randomPointsOnPolygon;


/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	var each = __webpack_require__(214).coordEach;

	/**
	 * Takes any {@link GeoJSON} object, calculates the extent of all input features, and returns a bounding box.
	 *
	 * @module turf/extent
	 * @category measurement
	 * @param {GeoJSON} input any valid GeoJSON Object
	 * @return {Array<number>} the bounding box of `input` given
	 * as an array in WSEN order (west, south, east, north)
	 * @example
	 * var input = {
	 *   "type": "FeatureCollection",
	 *   "features": [
	 *     {
	 *       "type": "Feature",
	 *       "properties": {},
	 *       "geometry": {
	 *         "type": "Point",
	 *         "coordinates": [114.175329, 22.2524]
	 *       }
	 *     }, {
	 *       "type": "Feature",
	 *       "properties": {},
	 *       "geometry": {
	 *         "type": "Point",
	 *         "coordinates": [114.170007, 22.267969]
	 *       }
	 *     }, {
	 *       "type": "Feature",
	 *       "properties": {},
	 *       "geometry": {
	 *         "type": "Point",
	 *         "coordinates": [114.200649, 22.274641]
	 *       }
	 *     }, {
	 *       "type": "Feature",
	 *       "properties": {},
	 *       "geometry": {
	 *         "type": "Point",
	 *         "coordinates": [114.186744, 22.265745]
	 *       }
	 *     }
	 *   ]
	 * };
	 *
	 * var bbox = turf.extent(input);
	 *
	 * var bboxPolygon = turf.bboxPolygon(bbox);
	 *
	 * var resultFeatures = input.features.concat(bboxPolygon);
	 * var result = {
	 *   "type": "FeatureCollection",
	 *   "features": resultFeatures
	 * };
	 *
	 * //=result
	 */
	module.exports = function(layer) {
	    var extent = [Infinity, Infinity, -Infinity, -Infinity];
	    each(layer, function(coord) {
	      if (extent[0] > coord[0]) extent[0] = coord[0];
	      if (extent[1] > coord[1]) extent[1] = coord[1];
	      if (extent[2] < coord[0]) extent[2] = coord[0];
	      if (extent[3] < coord[1]) extent[3] = coord[1];
	    });
	    return extent;
	};


/***/ },
/* 214 */
/***/ function(module, exports) {

	/**
	 * Lazily iterate over coordinates in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @param {Object} layer any GeoJSON object
	 * @param {Function} callback a method that takes (value)
	 * @param {boolean=} excludeWrapCoord whether or not to include
	 * the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @example
	 * var point = { type: 'Point', coordinates: [0, 0] };
	 * coordEach(point, function(coords) {
	 *   // coords is equal to [0, 0]
	 * });
	 */
	function coordEach(layer, callback, excludeWrapCoord) {
	  var i, j, k, g, geometry, stopG, coords,
	    geometryMaybeCollection,
	    wrapShrink = 0,
	    isGeometryCollection,
	    isFeatureCollection = layer.type === 'FeatureCollection',
	    isFeature = layer.type === 'Feature',
	    stop = isFeatureCollection ? layer.features.length : 1;

	  // This logic may look a little weird. The reason why it is that way
	  // is because it's trying to be fast. GeoJSON supports multiple kinds
	  // of objects at its root: FeatureCollection, Features, Geometries.
	  // This function has the responsibility of handling all of them, and that
	  // means that some of the `for` loops you see below actually just don't apply
	  // to certain inputs. For instance, if you give this just a
	  // Point geometry, then both loops are short-circuited and all we do
	  // is gradually rename the input until it's called 'geometry'.
	  //
	  // This also aims to allocate as few resources as possible: just a
	  // few numbers and booleans, rather than any temporary arrays as would
	  // be required with the normalization approach.
	  for (i = 0; i < stop; i++) {

	    geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
	        (isFeature ? layer.geometry : layer));
	    isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
	    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	    for (g = 0; g < stopG; g++) {

	      geometry = isGeometryCollection ?
	          geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
	      coords = geometry.coordinates;

	      wrapShrink = (excludeWrapCoord &&
	        (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
	        1 : 0;

	      if (geometry.type === 'Point') {
	        callback(coords);
	      } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
	        for (j = 0; j < coords.length; j++) callback(coords[j]);
	      } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
	        for (j = 0; j < coords.length; j++)
	          for (k = 0; k < coords[j].length - wrapShrink; k++)
	            callback(coords[j][k]);
	      } else if (geometry.type === 'MultiPolygon') {
	        for (j = 0; j < coords.length; j++)
	          for (k = 0; k < coords[j].length; k++)
	            for (l = 0; l < coords[j][k].length - wrapShrink; l++)
	              callback(coords[j][k][l]);
	      } else {
	        throw new Error('Unknown Geometry Type');
	      }
	    }
	  }
	}
	module.exports.coordEach = coordEach;

	/**
	 * Lazily reduce coordinates in any GeoJSON object into a single value,
	 * similar to how Array.reduce works. However, in this case we lazily run
	 * the reduction, so an array of all coordinates is unnecessary.
	 *
	 * @param {Object} layer any GeoJSON object
	 * @param {Function} callback a method that takes (memo, value) and returns
	 * a new memo
	 * @param {boolean=} excludeWrapCoord whether or not to include
	 * the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @param {*} memo the starting value of memo: can be any type.
	 */
	function coordReduce(layer, callback, memo, excludeWrapCoord) {
	  coordEach(layer, function(coord) {
	    memo = callback(memo, coord);
	  }, excludeWrapCoord);
	  return memo;
	}
	module.exports.coordReduce = coordReduce;

	/**
	 * Lazily iterate over property objects in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @param {Object} layer any GeoJSON object
	 * @param {Function} callback a method that takes (value)
	 * @example
	 * var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
	 * propEach(point, function(props) {
	 *   // props is equal to { foo: 1}
	 * });
	 */
	function propEach(layer, callback) {
	  var i;
	  switch (layer.type) {
	      case 'FeatureCollection':
	        features = layer.features;
	        for (i = 0; i < layer.features.length; i++) {
	            callback(layer.features[i].properties);
	        }
	        break;
	      case 'Feature':
	        callback(layer.properties);
	        break;
	  }
	}
	module.exports.propEach = propEach;

	/**
	 * Lazily reduce properties in any GeoJSON object into a single value,
	 * similar to how Array.reduce works. However, in this case we lazily run
	 * the reduction, so an array of all properties is unnecessary.
	 *
	 * @param {Object} layer any GeoJSON object
	 * @param {Function} callback a method that takes (memo, coord) and returns
	 * a new memo
	 * @param {*} memo the starting value of memo: can be any type.
	 */
	function propReduce(layer, callback, memo) {
	  propEach(layer, function(prop) {
	    memo = callback(memo, prop);
	  });
	  return memo;
	}
	module.exports.propReduce = propReduce;


/***/ },
/* 215 */
/***/ function(module, exports) {

	/**
	 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}
	 *
	 * @module turf/featurecollection
	 * @category helper
	 * @param {Feature} features input Features
	 * @returns {FeatureCollection} a FeatureCollection of input features
	 * @example
	 * var features = [
	 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
	 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
	 *  turf.point([-75.534, 39.123], {name: 'Location C'})
	 * ];
	 *
	 * var fc = turf.featurecollection(features);
	 *
	 * //=fc
	 */
	module.exports = function(features){
	  return {
	    type: "FeatureCollection",
	    features: features
	  };
	};


/***/ },
/* 216 */
/***/ function(module, exports) {

	// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
	// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
	// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	/**
	 * Takes a {@link Point} feature and a {@link Polygon} feature and determines if the Point resides inside the Polygon. The Polygon can
	 * be convex or concave. The function accepts any valid Polygon or {@link MultiPolygon}
	 * and accounts for holes.
	 *
	 * @module turf/inside
	 * @category joins
	 * @param {Point} point a Point feature
	 * @param {Polygon} polygon a Polygon feature
	 * @return {Boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
	 * @example
	 * var pt1 = {
	 *   "type": "Feature",
	 *   "properties": {
	 *     "marker-color": "#f00"
	 *   },
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [-111.467285, 40.75766]
	 *   }
	 * };
	 * var pt2 = {
	 *   "type": "Feature",
	 *   "properties": {
	 *     "marker-color": "#0f0"
	 *   },
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [-111.873779, 40.647303]
	 *   }
	 * };
	 * var poly = {
	 *   "type": "Feature",
	 *   "properties": {},
	 *   "geometry": {
	 *     "type": "Polygon",
	 *     "coordinates": [[
	 *       [-112.074279, 40.52215],
	 *       [-112.074279, 40.853293],
	 *       [-111.610107, 40.853293],
	 *       [-111.610107, 40.52215],
	 *       [-112.074279, 40.52215]
	 *     ]]
	 *   }
	 * };
	 *
	 * var features = {
	 *   "type": "FeatureCollection",
	 *   "features": [pt1, pt2, poly]
	 * };
	 *
	 * //=features
	 *
	 * var isInside1 = turf.inside(pt1, poly);
	 * //=isInside1
	 *
	 * var isInside2 = turf.inside(pt2, poly);
	 * //=isInside2
	 */
	module.exports = function(point, polygon) {
	  var polys = polygon.geometry.coordinates;
	  var pt = [point.geometry.coordinates[0], point.geometry.coordinates[1]];
	  // normalize to multipolygon
	  if(polygon.geometry.type === 'Polygon') polys = [polys];

	  var insidePoly = false;
	  var i = 0;
	  while (i < polys.length && !insidePoly) {
	    // check if it is in the outer ring first
	    if(inRing(pt, polys[i][0])) {
	      var inHole = false;
	      var k = 1;
	      // check for the point in any of the holes
	      while(k < polys[i].length && !inHole) {
	        if(inRing(pt, polys[i][k])) {
	          inHole = true;
	        }
	        k++;
	      }
	      if(!inHole) insidePoly = true;
	    }
	    i++;
	  }
	  return insidePoly;
	}

	// pt is [x,y] and ring is [[x,y], [x,y],..]
	function inRing (pt, ring) {
	  var isInside = false;
	  for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
	    var xi = ring[i][0], yi = ring[i][1];
	    var xj = ring[j][0], yj = ring[j][1];
	    
	    var intersect = ((yi > pt[1]) != (yj > pt[1]))
	        && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
	    if (intersect) isInside = !isInside;
	  }
	  return isInside;
	}



/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	var random = __webpack_require__(218);

	/**
	 * Generates random {@link GeoJSON} data, including {@link Point|Points} and {@link Polygon|Polygons}, for testing
	 * and experimentation.
	 *
	 * @module turf/random
	 * @category data
	 * @param {String} [type='point'] type of features desired: 'points' or 'polygons'
	 * @param {Number} [count=1] how many geometries should be generated.
	 * @param {Object} options options relevant to the feature desired. Can include:
	 * @param {Array<number>} options.bbox a bounding box inside of which geometries
	 * are placed. In the case of {@link Point} features, they are guaranteed to be within this bounds,
	 * while {@link Polygon} features have their centroid within the bounds.
	 * @param {Number} [options.num_vertices=10] options.vertices the number of vertices added
	 * to polygon features.
	 * @param {Number} [options.max_radial_length=10] the total number of decimal
	 * degrees longitude or latitude that a polygon can extent outwards to
	 * from its center.
	 * @return {FeatureCollection} generated random features
	 * @example
	 * var points = turf.random('points', 100, {
	 *   bbox: [-70, 40, -60, 60]
	 * });
	 *
	 * //=points
	 *
	 * var polygons = turf.random('polygons', 4, {
	 *   bbox: [-70, 40, -60, 60]
	 * });
	 *
	 * //=polygons
	 */
	module.exports = function(type, count, options) {
	    options = options || {};
	    count = count || 1;
	    switch (type) {
	        case 'point':
	        case 'points':
	        case undefined:
	            return random.point(count, options.bbox);
	        case 'polygon':
	        case 'polygons':
	            return random.polygon(
	                count,
	                options.num_vertices,
	                options.max_radial_length,
	                options.bbox);
	        default:
	            throw new Error('Unknown type given: valid options are points and polygons');
	    }
	};


/***/ },
/* 218 */
/***/ function(module, exports) {

	module.exports = function() {
	    throw new Error('call .point() or .polygon() instead');
	};

	function position(bbox) {
	    if (bbox) return coordInBBBOX(bbox);
	    else return [lon(), lat()];
	}

	module.exports.position = position;

	module.exports.point = function(count, bbox) {
	    var features = [];
	    for (i = 0; i < count; i++) {
	        features.push(feature(bbox ? point(position(bbox)) : point()));
	    }
	    return collection(features);
	};

	module.exports.polygon = function(count, num_vertices, max_radial_length, bbox) {
	    if (typeof num_vertices !== 'number') num_vertices = 10;
	    if (typeof max_radial_length !== 'number') max_radial_length = 10;
	    var features = [];
	    for (i = 0; i < count; i++) {
	        var vertices = [],
	            circle_offsets = Array.apply(null,
	                new Array(num_vertices + 1)).map(Math.random);

	        circle_offsets.forEach(sumOffsets);
	        circle_offsets.forEach(scaleOffsets);
	        vertices[vertices.length - 1] = vertices[0]; // close the ring

	        // center the polygon around something
	        vertices = vertices.map(vertexToCoordinate(position(bbox)));
	        features.push(feature(polygon([vertices])));
	    }

	    function sumOffsets(cur, index, arr) {
	        arr[index] = (index > 0) ? cur + arr[index - 1] : cur;
	    }

	    function scaleOffsets(cur, index) {
	        cur = cur * 2 * Math.PI / circle_offsets[circle_offsets.length - 1];
	        var radial_scaler = Math.random();
	        vertices.push([
	            radial_scaler * max_radial_length * Math.sin(cur),
	            radial_scaler * max_radial_length * Math.cos(cur)
	        ]);
	    }

	    return collection(features);
	};


	function vertexToCoordinate(hub) {
	    return function(cur, index) { return [cur[0] + hub[0], cur[1] + hub[1]]; };
	}

	function rnd() { return Math.random() - 0.5; }
	function lon() { return rnd() * 360; }
	function lat() { return rnd() * 180; }

	function point(coordinates) {
	    return {
	        type: 'Point',
	        coordinates: coordinates || [lon(), lat()]
	    };
	}

	function coordInBBBOX(bbox) {
	    return [
	        (Math.random() * (bbox[2] - bbox[0])) + bbox[0],
	        (Math.random() * (bbox[3] - bbox[1])) + bbox[1]];
	}

	function pointInBBBOX() {
	    return {
	        type: 'Point',
	        coordinates: [lon(), lat()]
	    };
	}

	function polygon(coordinates) {
	    return {
	        type: 'Polygon',
	        coordinates: coordinates
	    };
	}

	function feature(geom) {
	    return {
	        type: 'Feature',
	        geometry: geom,
	        properties: {}
	    };
	}

	function collection(f) {
	    return {
	        type: 'FeatureCollection',
	        features: f
	    };
	}


/***/ }
]));