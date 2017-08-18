'use strict';
var TableBase=require('./tablebase.js');
var async=require('async'), merge=require('gy-merge'), clone=require('clone');
var Game=require('./gamerule');
var debugout=require('debugout')(require('yargs').argv.debugout);
var _=require('lodash');
var getDB=require('../db.js'), g_db=null;
getDB(function(err, db) {
	if (!err) g_db=db;
});
var initSrvStat=require('../servers.js'),srv_state={};
initSrvStat(function(err, s) {
	if (!err) srv_state=s;
})

function shortenCoinStr(n) {
	if (n>100000000) return g(printf('%.2f', n/100000000))+'亿';
	if (n>10000) return g(printf('%.2f', n/10000))+'万';
	return n;
}

const GAME_STATUS={
	KAIJU:1,
	FAPAI:2,
	QIEPAI:0,
};
const playerMaxDeal=50000000;
const enrollBaseCoins=2000000;
const playerBankerSetLimits=12;

var tips=[
	'开牌出和时，庄，闲的下注将原分返还',
	'断线时，已下注的金币将跟据下注实际情况进行结算'
];

class Baijiale extends TableBase {
	constructor(roomid, type, opt) {
		super(roomid, type, opt);
		this.roomid=roomid;
		this.profits=[];
		this.profits.sum=0;
		this.roomtype='baccarat';
		this.gamedata.opt=merge({minZhu:10, maxZhu:7500, minDui:1, maxDui:750, maxHe:950}, opt);
		this.opt=this.gamedata.opt;
		this.gamedata.roomid=roomid;
		this.gamedata.his=[];
		this.gamedata.seats={};
		this.gamedata.enroll=[];
		var game=this.gamedata.game=new Game();
		var self=this;
		game.on('burn', function(detail) {
			self.broadcast({c:'table.baccarat.burn', detail, seq:1});
		})
		.on('result', function(detail) {
			debugout('set', self.gamedata.setnum, detail, '@', new Date());
			detail.playerCard=game.player.cards;
			detail.bankerCard=game.banker.cards;
			self.gamedata.his.push(detail);
		});

		this.msgDispatcher.on('userquit', this.countOnline.bind(this));
		this.run();
		setInterval(function() {
			self.broadcast({c:'table.chat', nickname:'小贴士', str:tips[Math.floor(Math.random()*tips.length)]});
		}, 10*60*1000);
	}
	countOnline() {
		this.gamedata.online=Object.keys(this.gamedata.seats).length;
	}
	get onlineCount() {
		return this.gamedata.online;
	}
	tryAutoDismiss() {}
	canEnter(user) {
		return true;
	}
	leave(user) {
		// this.broadcast({c:'table.userout', id:user.id});
		this.msgDispatcher.emit('userleave', user);
		this.quit(user);
	}
	enter(user) {
		if (this.quitTimer) clearTimeout(this.quitTimer);
		var seat=null, gd=this.gamedata;

		if (!gd.seats[user.id]) {
			gd.seats[user.id]={user:user}; 
			this.countOnline();
		}
		var o=this.mk_transfer_gamedata(this.gamedata);
		var gamedata=o.gamedata||o.scene;
		gamedata.$={init:true};
		o.seq=1;
		user.send(o);
		user.send({c:'table.chat', nickname:'提示', str:'挂帅条件：200,0000<br>区域限制： 1,0000,0000<br>玩家限制：5000,0000<br>庄赔率： 1.98<br>闲赔率:  2.02<br>庄对，闲对赔率: 12.00', seq:1});
		this.broadcast({c:'table.userin', id:user.id, nickname:user.nickname, level:user.level, face:user.dbuser.face, seat:seat});
		user.offline=false;
		this.msgDispatcher.emit('userin', user);
	}
	mk_transfer_gamedata(obj, idx) {
		// 简化user对象，只传输id nickname face level score
		//console.log(JSON.stringify(obj));
		var self = this;
		if (obj.enroll) {
			var a=0;
		}
		if (!obj.deal && !obj.seats && !obj.playerBanker && !obj.enroll) return {scene:obj};
		obj=clone(obj);
		if (obj.deal) {
			if (!obj.seats) obj.seats={};
			for (var i in obj.deal) {
				// var u=this.scene.seats[i].user;
				obj.seats[i]={};
				delete obj.deal[i].user;
			}
		}
		if (obj.seats) {
			for (var i in obj.seats) {
				var seat =this.scene.seats[i];
				if (!seat) continue;
				var u=seat.user;
				if (u) {
					obj.seats[i].user={id:u.id, nickname:u.nickname, face:u.dbuser.face, coins:u.coins, level:u.level, offline:seat.offline, showId:u.showId, profit:u.profit, bankerSets:u.bankerSets, setprofit:u.setprofit, memo:u.memo, total_set:u.dbuser.total_set};
				}
			}
		}
		if (obj.playerBanker) {
			debugout('upd playerBanker');
			var u=this.scene.playerBanker;
			if (!u) delete obj.playerBanker;
			else obj.playerBanker={id:u.id, nickname:u.nickname, coins:u.coins, bankerSets:u.bankerSets, profit:u.profit};
		}
		if (obj.enroll) {
			for (var i in obj.enroll) {
				var u=obj.enroll[i];
				obj.enroll[i]={id:u.id, nickname:u.nickname, coins:u.coins};
			}
		}
		return {scene:obj};
	}
	newgame() {
		debugout(this.gamedata.roomid, 'new game');
		this.gamedata.setnum=0;
		this.gamedata.his=[];
		this.q.push(this.qiepai.bind(this));
		this.newround();
	}
	newround() {
		debugout(this.gamedata.roomid, 'new round');
		this.q.push([
			this.chooseBanker.bind(this),
			this.adjustXianhong.bind(this),
			this.waitXiazhu.bind(this),
			this.fapai.bind(this),
			this.jiesuan.bind(this)
		]);
	}
	run() {
		var self = this;
		// loop
		this.q = async.queue(function(task, cb) {
			if (typeof task=='function') return task(cb);
			cb();
		});

		this.q.push([
			this.waitUserEnter.bind(this),
		],function(err) {

		});
		this.newgame();
	}
	waitUserEnter(cb) {
		this.msgDispatcher.once('userin', function() {
			cb();
		});
	}
	chooseBanker(cb) {
		if (this.playerBankerWantQuit) {
			this.gamedata.playerBanker=null;
			this.playerBankerWantQuit=null;
		}
		var limitSets=playerBankerSetLimits;
		if (this.gamedata.enroll.length==0) {
			limitSets=14;
		}
		var playerBanker=this.gamedata.playerBanker;
		if (playerBanker) {
			playerBanker.bankerSets++;
			if (playerBanker.coins>=enrollBaseCoins && playerBanker.bankerSets<=limitSets) {
				return cb();
			}
		}
		if (this.gamedata.enroll.length==0) {
			this.gamedata.playerBanker=null;
			return cb();
		}
		var self=this, anticipate=null;
		for (var i=0; i<this.gamedata.enroll.length; i++) {
			anticipate=this.gamedata.enroll[i];
			if (!anticipate.offline && anticipate.coins>=enrollBaseCoins) break;
		}
		if (i>=this.gamedata.enroll.length) {
			this.gamedata.playerBanker=null;
			this.gamedata.enroll=[];
			return cb();
		}
		this.gamedata.playerBanker=anticipate;
		this.gamedata.playerBanker.bankerSets=1;
		this.gamedata.playerBanker.profit=0;
		this.gamedata.enroll.splice(0, i+1);
		return cb();
	}
	adjustXianhong(cb) {
		var pb=this.gamedata.playerBanker;
		if (!pb) {
			this.gamedata.opt.minZhu=100;
			this.gamedata.opt.maxZhu=200000;
			this.gamedata.opt.minDui=100;
			this.gamedata.opt.maxDui=20000;
			this.gamedata.opt.maxHe=25000;
		} else {
			var u=pb;
			var reasonableZhu=Math.floor(u.coins/1000000)*1000000;
			this.gamedata.opt.minZhu=100;
			this.gamedata.opt.maxZhu=reasonableZhu;
			this.gamedata.opt.minDui=100;
			this.gamedata.opt.maxDui=Math.floor(u.coins/33/10000)*10000;// u.c*1/3/11
			this.gamedata.opt.maxHe=Math.floor(this.gamedata.opt.maxDui*19/15/10000)*10000;  // u.c/8
		}
		cb();
	}
	qiepai(cb) {
		debugout(this.roomid, 'qiepai');
		// 找到所有在线的玩家，随机选一个人来切牌
		var self=this;
		this.gamedata.status=GAME_STATUS.QIEPAI;
		var vus=this.allusers(true);
		var choose=Math.floor(Math.random()*vus.length);
		debugout(vus, choose);
		var u=vus[choose];
		if (!u) {
			self.gamedata.game.begin();
			return cb();
		}
		u.createInteract({c:'table.waitQiepai', seq:1}, {times:1, timeout:5})
		.on('ans', function(pack) {
			self.broadcast(pack, vus[choose]);
		})
		.on('final', function() {
			self.gamedata.game.begin();
			cb();
		});
	}
	waitXiazhu(callback) {
		debugout(this.roomid, 'waitXiazhu');
		var self=this, gd=this.gamedata;
		this.gamedata.status=GAME_STATUS.KAIJU;
		gd.deal={};
		var total={xian:0, xianDui:0, zhuang:0, zhuangDui:0, he:0};
		function handleXiazhu(pack, user) {
			if (user==gd.playerBanker) return;
			var deal=gd.deal[user.id];
			if (!deal) {
				gd.deal[user.id]={xianDui:0, zhuangDui:0, he:0, xian:0, zhuang:0, user:user};
				deal=gd.deal[user.id];
			}
			if (deal.sealed) return;
			var userTotal=deal.xian+deal.zhuang+deal.xianDui+deal.zhuangDui+deal.he;
			if (user.coins+userTotal>=playerMaxDeal) return user.send({err:{message:'超过5000万，不能下注'}});
			debugout(pack, total);
			if (pack.xian) {
				if (pack.xian<gd.opt.minZhu) return user.send({err:'最少下注'+gd.opt.minZhu});
				if (pack.xian>gd.opt.maxZhu) return user.send({err:'最多下注'+gd.opt.maxZhu});
				if (user.coins<pack.xian) return user.send({err:{message:'金豆不足，请充值', /*win:'RechargeWin'*/}});
				if ((total.xian+pack.xian)>(total.zhuang+gd.opt.maxZhu/3)) return user.send({err:'不能继续压闲'});
				if (pack.xian>=1000000) self.broadcast({c:'table.chat', nickname:'富豪', str:user.nickname+'在闲区下注了'+shortenCoinStr(pack.xian)});
				deal.xian+=pack.xian;
				total.xian+=pack.xian;
				// user.coins-=pack.xian;
			}
			else if (pack.zhuang) {
				if (pack.zhuang<gd.opt.minZhu) return user.send({err:'最少下注'+gd.opt.minZhu});
				if (pack.zhuang>gd.opt.maxZhu) return user.send({err:'最多下注'+gd.opt.maxZhu});
				if (user.coins<pack.zhuang) return user.send({err:{message:'金豆不足，请充值', /*win:'RechargeWin'*/}});
				if ((total.zhuang+pack.zhuang)>(total.xian+gd.opt.maxZhu/3)) return user.send({err:'不能继续压庄'});
				if (pack.zhuang>=1000000) self.broadcast({c:'table.chat', nickname:'富豪', str:user.nickname+'在庄区下注了'+shortenCoinStr(pack.zhuang)});
				deal.zhuang+=pack.zhuang;
				total.zhuang+=pack.zhuang;
				user.coins-=pack.zhuang;
			}
			else if (pack.he) {
				if (pack.he<gd.opt.minDui) return user.send({err:'最少下注'+gd.opt.minDui});
				if (user.coins<pack.he) return user.send({err:{message:'金豆不足，请充值', /*win:'RechargeWin'*/}});
				if ((total.he+pack.he)>gd.opt.maxHe) return user.send({err:'不能继续压和'});
				if (pack.he>=1000000) self.broadcast({c:'table.chat', nickname:'富豪', str:user.nickname+'在和区下注了'+shortenCoinStr(pack.he)});
				deal.he+=pack.he;
				total.he+=pack.he;
				// user.coins-=pack.he;
			}
			else if (pack.xianDui) {
				if (pack.xianDui<gd.opt.minDui) return user.send({err:'最少下注'+gd.opt.minDui});
				if (user.coins<pack.xianDui) return user.send({err:{message:'金豆不足，请充值', /*win:'RechargeWin'*/}});
				if ((total.xianDui+pack.xianDui)>gd.opt.maxDui) return user.send({err:'不能继续压闲对'});
				if (pack.xianDui>=1000000) self.broadcast({c:'table.chat', nickname:'富豪', str:user.nickname+'在闲对下注了'+shortenCoinStr(pack.xianDui)});
				deal.xianDui+=pack.xianDui;
				total.xianDui+=pack.xianDui;
				// user.coins-=pack.xianDui;
			}
			else if (pack.zhuangDui) {
				if (pack.zhuangDui<gd.opt.minDui) return user.send({err:'最少下注'+gd.opt.minDui});
				if (user.coins<pack.zhuangDui) return user.send({err:{message:'金豆不足，请充值', /*win:'RechargeWin'*/}});
				if ((total.zhuangDui+pack.zhuangDui)>gd.opt.maxDui) return user.send({err:'不能继续压庄对'});
				if (pack.zhuangDui>=1000000) self.broadcast({c:'table.chat', nickname:'富豪', str:user.nickname+'在庄对下注了'+shortenCoinStr(pack.zhuangDui)});
				deal.zhuangDui+=pack.zhuangDui;
				total.zhuangDui+=pack.zhuangDui;
				// user.coins-=pack.zhuangDui;
			}			
		}
		function handleCancelXiazhu(pack, user) {
			if (user==gd.playerBanker) return;
			var deal=gd.deal[user.id];
			if (!deal) return;
			if (deal.sealed) return;
			total.xianDui-=deal.xianDui;
			total.zhuangDui-=deal.zhuangDui;
			total.he-=deal.he;
			total.xian-=deal.xian;
			total.zhuang-=deal.zhuang;
			var reback=(deal.xian||0)+(deal.xianDui||0)+(deal.zhuangDui||0)+(deal.he||0)+(deal.zhuang||0);
			// deal.user.coins+=reback;
			deal.xian=deal.xianDui=deal.zhuangDui=deal.he=deal.zhuang=0;
		}
		function handleConfirmXiazhu(pack, user) {
			if (user==gd.playerBanker) return;
			var deal=gd.deal[user.id];
			if (!deal) return;
			deal.sealed=true;
		}
		gd.countdown=24;
		var timer=setInterval(function() {
			gd.countdown--;
			if (gd.countdown==-1) {
				clearInterval(timer);
				self.msgDispatcher.removeListener('table.xiazhu',handleXiazhu)
				.removeListener('table.cancelXiazhu',handleCancelXiazhu)
				.removeListener('table.confirmXiazhu',handleConfirmXiazhu);
				callback();
			}
		}, 1000);
		this.msgDispatcher.on('table.xiazhu', handleXiazhu)
		.on('table.cancelXiazhu', handleCancelXiazhu)
		.on('table.confirmXiazhu', handleConfirmXiazhu)
	}
	fapai(cb) {
		this.gamedata.status=GAME_STATUS.FAPAI;
		this.gamedata.game.once('result', function() {
			setTimeout(function() {cb()}, 100);
		});
		this.gamedata.game.playHand();
	}
	jiesuan(cb) {
		debugout(this.roomid, 'jiesuan');
		this.gamedata.status=0;
		const factor={xian:1.02, zhuang:0.98, xianDui:11, zhuangDui:11, he:8};
		const waterRatio=0.99;
		var self=this, gd=this.gamedata;
		var r=gd.his[gd.his.length-1];
		var winArr=[], loseArr, tieArr=[];
		if (r.win=='tie') {
			winArr.push('he');
			tieArr=['zhuang', 'xian'];
		} else {
			if (r.win=='banker') {
				winArr.push('zhuang');
			}
			if (r.win=='player') {
				winArr.push('xian');
			}
			if (r.playerPair) {
				winArr.push('xianDui');
			}
			if (r.bankerPair) {
				winArr.push('zhuangDui');
			}
		}
		var params=winArr.concat(tieArr);
		params.unshift(['zhuang', 'xian', 'he', 'xianDui', 'zhuangDui']);
		loseArr=_.without.apply(_, params);

		var now=new Date();
		var profit=0, water=0;
		var updObj={seats:{}};
		for (var k in gd.deal) {
			var deal=gd.deal[k];
			updObj.seats[k]={user:deal.user};
			var orgCoins=deal.user.coins;
			var userprofit=0;
			for (var i=0;i<winArr.length; i++) {
				var usercoins=deal[winArr[i]]
				if (!usercoins) continue;
				// 玩家赢钱
				var delta=usercoins*factor[winArr[i]], d=Math.floor(delta*waterRatio);
				water+=(delta-d);
				userprofit+=d;
				// deal.user.coins+=(d+usercoins);
				deal.user.coins+=d;
				profit-=delta;
				debugout('player win(id, qu, wins, minus water)', deal.user.id, winArr[i], delta, d);
			}
			for (var i=0; i<loseArr.length; i++) {
				var usercoins=deal[loseArr[i]];
				if (!usercoins) continue;
				deal.user.coins-=usercoins;
				userprofit-=usercoins;
				profit+=usercoins;
			}
			// for (var i=0; i<tieArr.length; i++) {
			// 	deal.user.coins+=deal[tieArr[i]];
			// }
			// deal.user.setprofit=userprofit;
			deal.user.send({c:'setprofit', p:userprofit});
			var newCoins=deal.user.coins;
			delete deal.user;
			g_db.games.insert({user:k, deal:deal, r:r, oldCoins:orgCoins, newCoins:newCoins, t:now});
		}
		// profit里是庄家的盈利，庄盈利
		if (this.isPlayerBanker()) {
			updObj.seats[gd.playerBanker.id]={user:gd.playerBanker};
			if (profit>0) {
				var p=Math.floor(profit*waterRatio);
				water+=(profit-p);
				// 如果是人的庄,抽水后给他
				gd.playerBanker.coins+=p;
				gd.playerBanker.profit+=p;
				debugout('banker win(profit, minus water)', profit, p);
				this.broadcast({c:'bankerprofit', p:p});
			} else {
				gd.playerBanker.coins+=profit;
				gd.playerBanker.profit+=profit;
				this.broadcast({c:'bankerprofit', p:profit});
			}
			// 如果是人的庄，只记录water，否则记录profit+water
			profit=0;
		} else {
			this.broadcast({c:'bankerprofit', p:profit});
		}
		// this.profits.push({water:water, profit:profit, t:now, set:gd.setnum /*, playerSet:isPlayerBanker()*/});
		debugout('sys win(profit, water)', profit, water);
		this.profits.sum+=profit+water;
		srv_state.total_profit+=profit+water;

		gd.setnum++;
		for (var i in updObj.seats) {
			var seat=gd.seats[i];
			if (seat) {
				if (seat.user) {
					if (!seat.user.dbuser.total_set) seat.user.dbuser.total_set=1;
					else seat.user.dbuser.total_set++;
				}
				var o=self.mk_transfer_gamedata(updObj, i);
				o.seq=1;
				seat.user.send(o);
			}
		}	
		(function(next) {
			if (self.allusers().length==0) {
				debugout(self.roomid, 'no enough user');
				// wait user enter to continue
				self.msgDispatcher.once('userin', function() {
					next();
				});
			}
			else next();
		})(function() {
			if (gd.game.leftCards<14) {
			// if (gd.setnum>=3) {
				self.newgame();
			}else self.newround();
			var delay=1800;
			if (gd.game.player.cards.length==2) delay+=1200;
			else delay+=1800;
			if (gd.game.banker.cards.length==2) delay+=1200;
			else delay+=1800;
			delay+=1500;
			if (r.playerPair) delay+=1300; //pairs
			if (r.bankerPair) delay+=1300;
			delay+=500; //take coin
			delay+=500; //give coins;
			delay+=500; //to player
			delay+=4000;
			setTimeout(cb, delay);
		});
	}
	isPlayerBanker() {
		return (this.gamedata.playerBanker!=null);
	}
	msg(pack, comesfrom) {
		var self=this;
		switch (pack.c) {
			case 'table.enroll':
			var idx=this.gamedata.enroll.findIndex(function(ele) {
				return ele.id==comesfrom.id;
			});
			if (pack.in) {
				if (this.gamedata.playerBanker && this.gamedata.playerBanker.id==comesfrom.id) return comesfrom.senderr('正在做帅');
				if (this.allusers(true).length==1) return comesfrom.senderr('只有一个人，不能做帅');
				if (idx>=0) return comesfrom.senderr('已经在排队了');
				if (comesfrom.coins>=enrollBaseCoins) this.gamedata.enroll.push(comesfrom);
				else comesfrom.senderr('金豆不足200万，不能做帅');
			} else {
				if (this.gamedata.playerBanker && this.gamedata.playerBanker.id==comesfrom.id) {
					this.playerBankerWantQuit=comesfrom.id;
					return;
				}
				if (idx>=0) this.gamedata.enroll.splice(idx,1);
			}
			break;
			case 'table.chat':
				pack.nickname=comesfrom.nickname||comesfrom.id;
				if (comesfrom.dbuser.nochat>new Date()) return comesfrom.send(pack);
				this.broadcast(pack);
			break;
		}
		return super.msg(pack, comesfrom);
	}
}

module.exports=Baijiale;