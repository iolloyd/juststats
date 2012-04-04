var Ajax = {
    ajaxob: function(){
        return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); 
    },

    call: function(get_or_post, url, params, f){ 
        var ob     = Ajax.ajaxob();
        var params = params || null;
        var f      = f || function(x){return x;};

        ob.onreadystatechange = function(){
            if ((ob.readyState == 4) && (ob.status == 200)){
                console.log(ob.responseText);
                return f(ob.responseText);
            }
        };

        ob.open(get_or_post, url, true);
        if (get_or_post == 'post') { 
            ob.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        ob.send(params);
    }
};

function Stats(){
    var url = 'http://justat.it:3000/stats';
    var x = new Date();
    var a = x.getFullYear();
    var b = x.getMonth() + 1;
    var c = x.getDay();
    var d = x.getHours();
    var e = x.getMinutes();
    var f = x.getSeconds();
    var g = x.getMilliseconds();
    var stamp = ""+a+b+c+d+e+f+g; 
    return {
        track: function(evt, params) {
            var params_string = 'time='+stamp+'&evt='+evt;
            Ajax.call('post', url, params_string);
        }
    }
}

var stats = new Stats();

// Usage:
//   1 (simple case) Stats.track('Visit');
//   2 (multi case)  Stats.track('Buy', {'item': 'socks', 'price': '2.34'};



