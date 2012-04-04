var fs = require('fs');

module.exports = function(app, r){
    function getTimeStamp(){
        var x     = new Date();
        var a     = x.getFullYear();
        var b     = x.getMonth() + 1;
        var c     = x.getDay();
        var d     = x.getHours();
        var e     = x.getMinutes();
        var f     = x.getSeconds();
        var stamp = [a,b,c,d,e,f].join(":");
        return stamp;
    }

    function pathToHash(path){
        var hash = {};
        var toks = path.split('/');
        for(var i=0; i<toks.length; i+=2){
            hash[toks[i]] = toks[i+1];
        }
        return hash;
    }

    function pathToList(path){
        return path.split('/');
    }

    function prettyPrintRange(list){
        var newList = [];
        while(list.length > 0){
            var n = [list.shift(), list.shift()];
            newList.push(n);
        }
        newList.sort(function(a, b){
            return a[0] > b[0];
        });
        return newList;
    }
    // root
    app.get('/', function(req, res){
        var info = r.info();
        res.send(info);
    });
    
    app.get('/author', function(req, res){
        res.send("Author: Lloyd Moore");
    });

    // REDIS COMMANDS

    app.get('/set/:k/:v', function(req, res){
        k = req.params.k; v = req.params.v;
        r.set(k, v, function(out){
            res.send(k + ' has been set to ' + v);
        });
    });

    app.get('/add/:evt', function(req, res){
        evt   = req.params.evt;
        stamp = getTimeStamp();
        r.zincrby('evt:'+evt, 1, stamp, function(err, out){
            res.send(out);
        });
    });

    app.get('/zincrby/:key/:amount/:member', function(req, res){
        key = req.params.key; 
        mem = req.params.member;
        amt = req.params.amount;
        r.zincrby(key, amt, mem, function(err, out){
            res.send(out);
        });
    });

    app.get('/get/:key', function(req, res){
        r.get(req.params.key, function(err, out){
            (err) ? console.log(err) : res.send(out); 
        });
    });

    // hset
    app.get('/hset/:k/:m/:v', function(req, res){
        r.hset(req.params.k, req.params.m, req.params.v,
            function(out){ res.send('ok'); }
        );
    });

    // hget
    app.get('/hget/:key/:member', function(req, res){
        r.hget(req.params.key, req.params.member, function(err, out){
            res.send(out);
        });
    });

    app.get('/hmset/:k/:data(*)', function(req, res){
        k = req.params.k;
        data = pathToHash(req.params.data);
        r.hmset(k, data, function(err, out){
            res.send(data);
        })
    });

    app.get('/hgetall/:key', function(req, res){
        var key = req.params.key;
        r.hgetall(key, function(err, out){
            res.send(out)
        });
    });

    app.get('/get-range-of-:key/:start/:end', function(req, res){
        var start = req.params.start;
        var end   = req.params.end;
        var key   = 'evt:' + req.params.key;
        r.zrange(key, start, end, 'withscores', function(err, out){
            var out = prettyPrintRange(out);
            res.send(out)
        });
    });
}
