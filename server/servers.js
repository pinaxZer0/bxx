var getDB=require('./db.js');

var srv_stat=null;
module.exports=function(cb) {
    if (srv_stat) return cb(null, srv_stat);
    getDB(function(err, db, easym) {
        if (err) return;

        easym.createDbJson(db, {col:db.servers, key:{_id:'statement'}, default:{total_profit:0, canenter:true, canchat:false}, alwayscreate:true}, function(err, srv) {
            if (!err) srv_stat=srv;
            cb(err, srv);
        });
    });
}
