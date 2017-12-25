var express = require('express');
var crypto = require('crypto'),argv=require('yargs').argv, debugout=require('debugout')(argv.debugout);;
var router = express.Router();
var qs=require('querystring').stringify, url=require('url');
var httpf=require('httpf');
var getDB=require('../db.js'), ObjectID = require('mongodb').ObjectID;
var User=require('../User.js');
var exportXls=require('../exportxls.js');

function toDateString(date, noTimeString) {
    if (typeof date=='string') date=new Date(date);
    if (!date instanceof Date) return null;
    var ret=''+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    if (!noTimeString) noTimeString='min sec';
    else if (typeof noTimeString!='string') noTimeString='';
    if (noTimeString.indexOf('min')>=0) ret+=' '+date.getHours()+':'+date.getMinutes();
    if (noTimeString.indexOf('sec')>=0) ret+=':'+date.getSeconds();
    return ret;
}


getDB(function(err, db) {
	if (err) return router.use(function(req,res) {
		res.send({err:err});
	});
	router.all('/user.secpwd.set', httpf({userid:'string', pwd:'string', callback:true}, function(userid, pwd, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            if (!!user.dbuser.secpwd) return callback('不能设置保险箱密码');
            user.dbuser.secpwd=pwd;
            user.send({user:{hasSecpwd:true}});
            callback();
        });
    }));
    router.all('/user.secpwd.verify', httpf({userid:'string', pwd:'string', callback:true}, function(userid, pwd, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            if (!pwd) return callback('参数有误');
            if (pwd==user.dbuser.secpwd) return callback();
            else return callback('密码不符');
        });
    }));
    router.all('/user.pwdpro.set', httpf({userid:'string', q:'array', qid:'?number', ans:'?string', callback:true}, function(userid, q, qid, ans, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            if (user.dbuser.pwdpro) {
                // sec verfy
                var innerq=user.dbuser.pwdpro[qid];
                if (!innerq) return callback('无法验证的问题');
                if (innerq.ans!=ans) return callback('答案不符');
            }
            user.dbuser.pwdpro=q;
            callback();
        });
    }));
    router.all('/user.pwdpro.status', httpf({userid:'string', callback:true}, function(userid, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            return callback(null, {pwdpro:user.dbuser.pwdpro!=null});
        });
    }));
    router.all('/user.pwdpro.queryquestion', httpf({userid:'string', callback:true}, function(userid, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            if (!user.dbuser.pwdpro) return callback({message:'没有设置密保问题', win:'SetSecPwdWin'});
            var qid=Math.floor(Math.random()*user.dbuser.pwdpro.length);
            callback(null, {qid:qid, q:user.dbuser.pwdpro[qid].q});
        });
    }));
    router.all('/user.pwdpro.verify', httpf({userid:'string', qid:'number', ans:'string', callback:true}, function(userid, qid, ans, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            var q=user.dbuser.pwdpro[qid];
            if (!q) return callback('无法验证的问题');
            if (q.ans==ans) return callback();
            callback('答案不符');
        });
    }));
    router.all('/user.pwdpro.setpwd', httpf({userid:'string', pwd:'string', qid:'number', ans:'string', callback:true}, function(userid, pwd, qid, ans, callback) {
        User.fromID(userid, function(err, user) {
            if (err) return callback(err);
            var q=user.dbuser.pwdpro[qid];
            if (!q) return callback('无法验证的问题');
            if (q.ans!=ans) return callback('答案不符');
            user.dbuser.pwd=pwd;
            callback();
        });
    }));
    router.all('/downxlsx', httpf({userid:'string', token:'string',no_return:true}, function(userid, token){
        var req=this.req, res=this.res;
        User.fromID(userid, function(err, user) {
            if (err) return res.status(502).send({err:err});
            if (!user.storedAdminCoinsLogs) return res.status(404).send({err:'xlsx not found'});
            if (user.storedAdminCoinsLogs.token!=token) return res.status(403).send({err:'token wrong, access denied'});
            var start=user.storedAdminCoinsLogs.start, end=user.storedAdminCoinsLogs.end;
            db.adminlog.find({time:{$gt:start, $lte:end}}).toArray(function(err, r) {
                if (err) return res.status(502).send({err:err});
                exportXls(req, res, r, toDateString(start, true)+'-'+toDateString(end, true), {
                    from:'ID',
                    _t:'时间',
                    nickname:'用户名',
                    coins:'账户余额',
                    user:'姓名',
                    card:'卡号',
                    name:'银行',
                    province:'省',
                    city:'市',
                    distribution:'支行',
                    mobi:'手机',
                });
            });
        });
    }));
});

module.exports=router;
