var printf=require('printf'), clone=require('clone'), async=require('async'), assert=require('assert'), path=require('path');
var ss=require('./ss.js');
var args=require('yargs')
	.boolean('debugout')
	.argv;
var debugout=require('debugout')(args.debugout);
var onlineUsers=require('./online.js'), alltables=require('./tables.js');
var User=require('./User.js');
var rndstring=require('randomstring').generate;
require('colors');

function send(data) {
	try {
		var payload=JSON.stringify(data);
	} catch(e) {
		debugout('following data has problem', data.seats);
		return;
	}
	function _h(err) {
		//err && debugout(err, '@ sending', data);
	}
	if (payload.length>100) return (this.send(payload, {compress:true}, _h) || true);
	this.send(payload, _h);
	return true;
}

var crypto=require('crypto');
function md5(str, length) {
	var buf = new Buffer(str.length * 2 + 1);
	var len = buf.write(str, 0);
	str = buf.toString('binary', 0, len);
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	if (length == 16) {
		str = str.substr(8, 16);
	}
	return str;
}
function broadcast(data, excludeUser) {
	var all=onlineUsers.all;
	if (typeof excludeUser=='object') {
		for (var i=0; i<all.length; i++) {
			if (excludeUser.id==all[i]) continue;
			onlineUsers.get(all[i]).send(data);
		}
	}else {
		for (var i=0; i<all.length; i++) {
			onlineUsers.get(all[i]).send(data);
		}		
	}
}
var default_user=User.default_user;

function chkpwd(userid, pwd, cb) {
	g_db.p.users.find({_id:userid}, {pwd:true, salt:true}).toArray(function(err, r) {
		if (err) return cb(err);
		if (r.length==0) return cb('no such user');
		// if (r[0].salt) {
		// 	var recv=md5(''+(r[0].salt||'')+pwd);
		// 	if (recv==r[0].pwd) return cb(null);
		// 	debugout('want', r[0].pwd, 'recv', recv);
		// 	/*if (r.length==0) */return cb('用户名密码不匹配，点击屏幕重试');	
		// } else {
			if (r[0].pwd==pwd) return cb(null);
			debugout(r[0].pwd, pwd);
			return cb('用户名密码不匹配');
		// }
		// cb(null);
	});
}

function afterUserIn(err, pack, ws, dbuser) {
	afterUserInStep2(err, pack, ws, dbuser);
}
function afterUserInStep2(err, pack, ws, dbuser) {
	if (err) return ws.sendp({err:err});
	dbuser.lastIP=ws.remoteAddress;
	if (!dbuser.regIP) {
		dbuser.regIP=ws.remoteAddress;
		dbuser.regTime=new Date();
	}
	if (!args.debugout && (!pack.version || pack.version!='1.1.0')) return ws.sendp({err:'软件已升级，点击屏幕重新加载以便完成更新', act:'reload'});
	if (dbuser) {
		if (dbuser.block>new Date()) return ws.sendp({c:'lgerr',msg:'账号被封停', view:'login'});
		if (!dbuser.__created) {
			// if (dbuser.pwd && md5(''+(dbuser.salt||'')+pack.pwd)!=dbuser.pwd) return ws.sendp({c:'lgerr', msg:'账号密码错', view:'login'});
			if (dbuser.pwd && pack.pwd!=dbuser.pwd) return ws.sendp({c:'lgerr', msg:'账号密码错', view:'login'});
			ws.sendp({user:{id:dbuser._id, showId:dbuser.showId, isAdmin:dbuser.isAdmin, bank:dbuser.bank, savedMoney:dbuser.savedMoney, hasSecpwd:(!!dbuser.secpwd), memo:dbuser.memo}});
		}
		else {
			var salt=dbuser.salt=rndstring(16);
			dbuser.pwd=pack.pwd;//md5(''+salt+pack.pwd);
			g_db.p.users.find({_id:'showId'}).limit(1).toArray(function(err, result) {
				if (err) return;
				if (result.length==0) dbuser.showId=10000;
				else dbuser.showId=(result[0].v||0)+1;
				g_db.p.users.update({_id:'showId'}, {$set:{v:dbuser.showId}}, {upsert:true});
				dbuser.province=pack.province;
				dbuser.city=pack.city;
				dbuser.coins=dbuser.coins;
				var reservedAttr=['id', 'pwd', 'nickname', 'face', 'coins', 'coin', 'diamond', 'level', 'exp', 'tickets', 'table', 'mailCount', 'firstCash', 'savedMoney', 'bank', 'memo'];
				for (key in pack) {
					if (reservedAttr.indexOf(key)>=0) continue;
					dbuser[key]=pack[key];
				}
				ws.sendp({user:{id:dbuser._id, showId:dbuser.showId, isAdmin:dbuser.isAdmin, bank:dbuser.bank, savedMoney:dbuser.savedMoney, hasSecpwd:(!!dbuser.secpwd), memo:dbuser.memo}});
				delete dbuser.__created;
			});
		}
	}
	if (ws.readyState !== ws.OPEN) return;

	var oldUser=onlineUsers.get(dbuser._id);
	if (!oldUser) {
		ws.user=new User(ws, dbuser);
		onlineUsers.add(ws.user);
		if (pack.nickname) dbuser.nickname=pack.nickname;
		else if (dbuser.nickname==null) dbuser.nickname=pack.id;
		pack.face && (dbuser.face=pack.face);
	}
	else {
		ws.user=oldUser;
		oldUser.send({c:'kicked', reason:'账号在其他地方登录了'});
		oldUser.ws.close();
		oldUser.ws=ws;
		oldUser.offline=false;
	}
	ws.sendp({c:'showview', v:'hall', user:dbuser, seq:1});	
	broadcast({c:'userin', userid:pack.id, nick:ws.user.nickname}, ws.user);
	g_db.p.mails.count({to:dbuser._id, used:false}).then(function(c) {
		ws.user.mailCount=c;
		if (pack.inApp && !dbuser.downAppGift) {
			dbuser.downAppGift=new Date();
			ws.user.storeMail('下载客户端奖励', {tickets:2});
		}
	});
	var tbl;
	if (pack.room) {
		tbl=alltables.find(pack.room);
	}
	if (!tbl && ws.user.table) tbl=ws.user.table;
	if (tbl) {
		ws.user.table=tbl;
		if (false==tbl.canEnter(ws.user)) {
			ws.user.table=null;
		} else {
			ws.sendp({c:'showview', v:'game'+tbl.roomtype, id:tbl.roomtype, roomid:tbl.roomid, opt:tbl.opt, seq:1});
			tbl.enter(ws.user);
			if (oldUser) oldUser.backOnline();
		}
		return;
		//ws.user.join(pack.room);
	}
	if (pack.room) return ws.sendp({err:'没有这个桌子号',seq:1});
}
module.exports=function msgHandler(db, createDbJson, wss) {
	g_db={p:db, createDbJson:createDbJson};

	wss.on('connection', function connection(ws, req) {
		ws.sendp=ws.sendjson=send;
		ws.__ob=true;
		ws.remoteAddress=req.headers['x-forwarded-for']||req.headers['X-Real-IP']||req.headers['x-real-ip']||req.connection.remoteAddress;
		debugout('someone in');

		ws.on('message', function(data) {
			try {
				var pack=JSON.parse(data);
			} catch(e) {
				return ws.sendp({err:e});
			}
			debugout('recv', pack);
			if (ws.user) return ws.user.msg(pack);
			switch (pack.c) {
				case 'salt':
					db.users.find({_id:pack.id}, {_id:true, salt:true}).limit(1).toArray(function(err, r){
						if (err) return ws.sendp({err:err});
						debugout(r);
						if (r.length==0) return ws.sendp({err:'no such user '+pack.id});
						ws.sendp({c:'salt', s:r[0].salt});
					});
				break;
				case 'login':
					chkpwd(pack.id, pack.pwd, function(err) {
						if (err) return ws.sendp({c:'lgerr', msg:err, view:'login', cancelRelogin:true});
						if (onlineUsers.get(pack.id)) {
							debugout('already online, kick old');
							afterUserIn(null, pack, ws, onlineUsers.get(pack.id).dbuser);
						} 
						else createDbJson(db, {col:db.users, key:pack.id, alwayscreate:true, default:default_user}, function(err, dbuser) {
							debugout('new one');
							afterUserIn(err, pack, ws, dbuser);
						});
					})
				break;
				case 'reg':
					db.users.find({nickname:(pack.nickname||pack.id)}).limit(1).toArray(function(err, arr) {
						if (err) return ws.sendp({c:'regerr', msg:err.message, view:'login'});
						if (arr.length>0) return ws.sendp({c:'regerr', msg:'昵称重复', view:'login', arr:arr});
						createDbJson(db, {col:db.users, key:pack.id, alwayscreate:true, default:default_user}, function(err, dbuser) {
							if (err) return ws.sendp({err:err});
							if (!dbuser.__created) return ws.sendp({err:{message:'用户已存在', view:'login'}});
							afterUserIn(err, pack, ws, dbuser);
							// var salt=dbuser.salt=rndstring(16);
							// dbuser.pwd=md5(''+salt+pack.pwd);
							// ws.user=new User(ws, dbuser);
							// dbuser.nickname=pack.nickname||pack.id;
							// pack.face && (dbuser.face=pack.face);
							// ws.sendp({c:'showview', v:'hall', user:dbuser, seq:1});
							// onlineUsers.add(ws.user);
							// //ws.sendp({user:{id:ws.user.id, nickname:ws.user.nickname, exp:ws.user.exp, }})
							// if (pack.room) ws.user.join(pack.room);
							// broadcast({c:'userin', userid:pack.id, nick:ws.user.nickname}, ws.user);
						});
					});
				break;
				case 'rol':
					if (onlineUsers.get(pack.id)) {
						debugout('already online, kick old');
						afterUserIn(null, pack, ws, onlineUsers.get(pack.id).dbuser);
					} 
					else 
						createDbJson(db, {col:db.users, key:pack.id, alwayscreate:true, default:default_user}, function(err, dbuser) {
							debugout('new one');
							if (dbuser.__created) db.users.find({nickname:(pack.nickname||pack.id)}).limit(1).toArray(function(err, arr) {
								if (err) return ws.sendp({c:'regerr', msg:err.message, view:'login'});
								if (arr.length>0) return ws.sendp({c:'regerr', msg:'昵称重复', view:'login', arr:arr});
								afterUserIn(err, pack, ws, dbuser);
							});
							else afterUserIn(err, pack, ws, dbuser);
						});
				break;
				case 'alluser':
					ws.sendp({c:'alluser', u:onlineUsers.all});
				break;
				default:
					ws.sendp({err:'unknown cmd', pack:pack});
			}
		})
		.on('error', console.log)
		.on('close', function() {
			if (ws.user) {
				debugout('userout'.red, ws.user.id);
				onlineUsers.remove(ws.user);
				ss('userout', {userid:ws.user.id});
				broadcast({c:'userout', userid:ws.user.id, nick:ws.user.nickname});
			}
		})
	});
};

// ss
setInterval(function() {
	ss('onlineCount', {count:onlineUsers.length});
}, 60*1000);

process.on('SIGINT', function() {
	console.log('recv quit signal, wait all tables quit@', new Date());
	var ss=alltables.alltbls();
	async.each(ss, function(s, cb) {
		s.safeStop(cb);
	},
	function() {
		console.log('safe quit@', new Date());
		process.exit(0);
	})
});