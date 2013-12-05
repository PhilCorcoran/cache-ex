'use strict';
var fs = require('fs'),
http = require('http'),
express = require('express'),
cacheEx=require('./index.js'),
mock_db=require('./test/mock_db_driver');

var settings = require('./test/settings.json');
cacheEx.init(settings.secret,settings.timeToLive);
mock_db.connect(settings.database,start_app);

function start_app(){
	var app = express();
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.logger("default"));
	app.use(express.bodyParser());
	app.use('/cache',cacheEx.admin);
	app.use(cacheEx.get);

	app.get('/price', function(req, res) {
		if(res.locals.data!=undefined){
			res.send(res.locals.data);
		}else{
			var params=req.query;
			mock_db.execute("mock_procedure",params,res,function (data){
				cacheEx.put(data,req);
				res.send(data);
			});

		}
	});

	app.listen(settings.port);
	console.log("settings:"+JSON.stringify(settings));
};

