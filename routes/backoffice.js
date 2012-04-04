module.exports = function(app, r){

    app.get('/backoffice', function(i, o){
        o.send('backoffice here');
    });

    app.get('/backoffice/keys', function(i, o){
        r.keys('*', function(out){
            o.send(out);
        });
    });

    app.get('/backoffice/set/:k/:v', function(i, o){
        r.set(i.params.k, i.params.v, r.print); 
    });

    app.get('/backoffice/get/:k', function(i, o){
        r.get(i.params.k, function(err, reply){
            if (err) console.log(err);
            o.send(reply);
        });
    });
}

