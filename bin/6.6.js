webpackJsonp([6],{

/***/ 153:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var async = __webpack_require__(18),
	    me = __webpack_require__(22),
	    printf = __webpack_require__(34),
	    etc = __webpack_require__(59),
	    EventEmitter = __webpack_require__(23),
	    clone = __webpack_require__(10);
	var wins = __webpack_require__(33);
	var ROAD = __webpack_require__(154),
	    BeadPlate = ROAD.BeadPlate,
	    BigRoad = ROAD.BigRoad,
	    BigEye = ROAD.BigEye;

	var Loader = laya.net.Loader;
	var Handler = laya.utils.Handler;

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var HallUI = function () {
		function HallUI(opt) {
			_classCallCheck(this, HallUI);

			this.opt = opt;
		}

		_createClass(HallUI, [{
			key: 'assignAllBtns',
			value: function assignAllBtns() {
				'use strict';

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
				var self = this;
				if (this._view.getController('isAdmin').selectedIndex == 0) this.enterGame();
			}
		}, {
			key: 'enterGame',
			value: function enterGame() {
				fairygui.GRoot.inst.showModalWait();
				_socket.sendp({ c: 'alltables' });
				netmsg.once('alltables', this, function (pack) {
					fairygui.GRoot.inst.closeModalWait();
					console.log(pack);
					this.tables = [];
					for (var id in pack.tables) {
						pack.tables[id].roomid = id;
						this.tables.push(pack.tables[id]);
					}
					var num = this.tables.length;
					if (num > 1) console.log('桌子数量不唯一，请检查服务器以及数据库');
					_socket.sendp({ c: 'join', code: this.tables[0].roomid });
				});
			}
		}], [{
			key: 'create',
			value: function create(opt, cb) {
				if (typeof opt === 'function') {
					cb = opt;opt = {};
				}
				Laya.loader.load([{ url: __webpack_require__(115), type: Loader.IMAGE }, { url: __webpack_require__(116), type: Loader.IMAGE }, { url: __webpack_require__(117), type: Loader.BUFFER }], Handler.create(null, function () {
					if (!!window.magiclink) {
						magiclink.reg(function (room) {
							console.log('magiclink ret', room);
							_socket.sendp({ c: 'join', code: room });
						});
					}
					var hall = new HallUI(opt);
					fairygui.UIPackage.addPackage("baijiale");
					fairygui.UIConfig.buttonSound = null;
					fairygui.UIConfig.buttonSoundVolumeScale = 0;
					var _view = hall._view = fairygui.UIPackage.createObject("Package1", "hall").asCom;

					_view.getController('isAdmin').selectedIndex = me.isAdmin ? 1 : 0;

					// 用户管理
					var l = _view.getChild('n33');
					l.removeChildren();
					_view.getChild('n34').onClick(null, function () {
						var uid = _view.getChild('n12').text,
						    nickname = _view.getChild('n7').text;
						if (uid || nickname) {
							_socket.sendp({ c: 'userInfo', id: uid, nickname: nickname });
						} else {
							_view.getChild('n12').displayObject.prompt = 'id或者昵称必须填写一个';
							_view.getChild('n12').text = '';
							_view.getChild('n7').text = '';
							return;
						}
						fairygui.GRoot.inst.showModalWait();
						netmsg.once('userInfo', null, function (pack) {
							fairygui.GRoot.inst.closeModalWait();
							l.removeChildren();
							var item = fairygui.UIPackage.createObject('Package1', 'Component6');
							l.addChild(item);
							item.getChild('userInfo').getChild('n45').url = pack.face;
							item.getChild('n4').text = pack.nickname;
							item.getChild('n7').text = pack.showId;
							item.getChild('n9').text = pack.coins;

							var btnBlk = item.getChild('n10'),
							    btnNcht = item.getChild('n11');
							if (pack.block && new Date(pack.block) > new Date()) btnBlk.selected = true;
							if (pack.nochat && new Date(pack.nochat) > new Date()) btnNcht.selected = true;
							//add coins
							item.getChild('n2').onClick(null, function () {
								var c = item.getChild('n3').text;
								c = Number(c);
								if (isNaN(c) || !c) return;
								if (c < 0 && !confirm('确定要减钱？？！')) return;
								_socket.sendp({ c: 'admin.addcoins', userid: pack.id, coins: c });
								item.getChild('n3').text = '';
								item.getChild('n9').text = Number(item.getChild('n9').text) + c;
							});
							// block account
							btnBlk.onClick(null, function () {
								_socket.sendp({ c: 'admin.block', userid: pack.id, t: btnBlk.selected ? 315532748958 : 0 });
							});
							// forbid chat
							btnNcht.onClick(null, function () {
								_socket.sendp({ c: 'admin.nochat', userid: pack.id, t: btnNcht.selected ? 315532748958 : 0 });
							});
						});
					});

					// 加豆纪录
					var log = _view.getChild('n49');
					log.setVirtual();
					_view.getChild('n47').onClick(null, function () {
						var start = _view.getChild('n44').text,
						    end = _view.getChild('n40').text;
						if (!start) {
							var date = new Date();
							start = new Date('' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-1');
						} else {
							start = new Date(start);
							if (start == 'Invalid Date') {
								_view.getChild('n44').text = '';
								_view.getChild('n44').displayObject.prompt = '类似2017-6-7 00:00:00';
								return;
							}
						}
						if (!end) {
							end = new Date();
						} else {
							end = new Date(end);
							if (end == 'Invalid Date') {
								_view.getChild('n44').text = '';
								_view.getChild('n44').displayObject.prompt = '类似2017-6-7 12:00:00';
								return;
							}
						}

						fairygui.GRoot.inst.showModalWait();
						_socket.sendp({ c: 'admin.addCoinsLog', start: start, end: end });
						netmsg.once('admin.addCoinsLog', null, function (pack) {
							fairygui.GRoot.inst.closeModalWait();
							log.itemRenderer = Handler.create(null, function (idx, obj) {
								var item = pack.logs[idx];
								obj.getChild('n1').text = etc.toDateString(item.time);
								obj.getChild('n3').text = item.targetName;
								obj.getChild('n2').text = '金豆' + item.coins;
								obj.getChild('n4').text = item.operatorName;
							}, null, false);
							log.numItems = pack.logs.length;

							var total = 0;
							for (var i = 0; i < pack.logs.length; i++) {
								if (pack.logs[i].coins > 0) total += pack.logs[i].coins;
							}
							_view.getChild('n51').text = '总计 ' + total;
						});
					});

					// admin管理
					// _view.getController('c1').on

					// 进入游戏
					_view.getChild('n3').onClick(hall, hall.enterGame);
					cb(null, hall);
				}));
			}
		}]);

		return HallUI;
	}();

	module.exports = HallUI.create;

/***/ },

/***/ 154:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _ = __webpack_require__(60);

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

/***/ }

});