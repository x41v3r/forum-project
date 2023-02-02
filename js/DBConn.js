var mysql = require('mysql');
var $ = require('underscore');
var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '123456',
	port: '3306',
	database: 'forum-db'
});

function connect() {
	connection.connect();
	console.log("mysql connected");
}

function end() {
	connection.end();
}

function selectData(tableName) {
	var list = [];
	connection.query("select * from " + tableName, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		list = result;
		console.log('The solution is: ', result);
	});
	return list;
}

function executeSql(sql, params, callback) {
	var res;
	console.log(sql);
	connection.query(sql, params, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		res = result;
		callback(res);
		console.log('The solution is: ', result);
	});
	return res;
}

module.exports = {
	connect,
	selectData,
	end,
	executeSql
}