'use strict';
var express = require('express'),
cacheEx=require('cache-ex')({secret:'dont tell a soul'});

var app = express();
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.logger("default"));
app.use(express.bodyParser());
app.use('/cache',cacheEx.admin());
app.use(cacheEx.serve());

app.get('/any',function(req,res){
	cacheEx.put({object:'Cached Object',req:req.query},req);
	res.send({status:'Not from cache',req:req.query});
});

app.listen(8080);


