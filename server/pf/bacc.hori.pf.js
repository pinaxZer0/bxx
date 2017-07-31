var express = require('express');
var crypto = require('crypto'),argv=require('yargs').argv, debugout=require('debugout')(argv.debugout);;
var router = express.Router();
var qs=require('querystring').stringify, url=require('url');
var httpf=require('httpf');
var getDB=require('../db.js'), ObjectID = require('mongodb').ObjectID;
var User=require('../User.js');

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
});

module.exports=router;
