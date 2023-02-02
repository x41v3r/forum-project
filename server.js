const { param } = require('express/lib/application');

var express = require('express'),
	session = require('express-session'),
	ejs = require('ejs'),
	app = express(),
	fs = require('fs'),
	mysql = require('./js/DBConn'),
	multiparty = require('multiparty'); // FormData解析工具;

mysql.connect();
	
// 引入静态文件代码
app.use(express.static(__dirname));
app.engine('html', ejs.__express);
app.set('view engine', 'html'); //此时我们就可以使用ejs模板了
app.use(session({
	secret: 'somesecrettoken', //服务器端生成session的签名
	name: "myTestSession",
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 60 * 60 * 1000
	} // 1小时
}));



app.get('/login', (req, res) => {
	res.sendFile(__dirname + "/" + "login.html");
})
app.post("/login", (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields) {
		if (err) {
			throw err
		}
		// fields显示非文件类型的所有key、value值
		Object.keys(fields).forEach(function(email) {
			console.log('got field named ' + email);
		});
		var email = fields.email[0];
		var pwd = fields.password[0];
		var sql = "select * from t_user where email = ?";
		var params = [];
		params.push(email);
		
		mysql.executeSql(sql, params, users => {
			if (users) {
				var user = users[0];
				if (user != null && user.password == pwd) {
					res.status(200).json({
						msg: "登录成功！",
						nick_name: user.nick_name,
						id:user.id
					})
				} else {
					res.status(500).json({
						msg: "登录失败！"
					})
				}
			}
		})//执行sql
	})
})//用于登录的函数



app.get('/register', (req, res) => {
	res.sendFile(__dirname + "/" + "register.html");
})
app.post("/register", (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields) {
		if (err) {
			throw err
		}
		// fields显示非文件类型的所有key、value值
		Object.keys(fields).forEach(function(email) {
			console.log('got field named ' + email);
		});
		var nick_name = fields.nick_name[0];
		var email = fields.email[0];
		var password = fields.password[0];
		var sql = "insert into t_user(email,password,nick_name) values(?,?,?)";
		var params = [];
		params.push(email);
		params.push(password);
		params.push(nick_name);
		
		mysql.executeSql(sql, params, users => {
			if (users) {
				res.status(200).json({
					msg: "注册成功！"
				})
			}else{
				res.status(500).json({
					msg: "注册失败！"
				})				
			}
		})//执行sql
	})
})//用于注册的函数



app.get("/index", (req, res) => {
	res.sendFile(__dirname + "/" + "index.html");
})
app.post("/init_page", (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields) {
		if (err) {
			throw err
		}

		var sql = "select * from t_post";
		var params = [];
		params.push(1);

		mysql.executeSql(sql, params, posts => {
			if (posts) {
				if (posts != null) {
					res.status(200).json({
						msg: "获取成功！",
						transposts: posts
					})
				} else {
					res.status(500).json({
						msg: "获取失败！"
					})
				}
			}
		})//执行sql
	})
})//初始化主界面



app.post("/send_post", (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields) {
		if (err) {
			throw err
		}
		// fields显示非文件类型的所有key、value值
		Object.keys(fields).forEach(function(email) {
			console.log('got field named ' + email);
		});
		
		var uid = fields.uid[0];
		var nick_name = fields.nick_name[0];
		var iswho = fields.iswho[0];
		var content = fields.content[0];
		
		var sql = "insert into t_post(uid,content,ispost,iswho,nick_name) values(?,?,?,?,?)";
		var params = [];
		params.push(uid);
		params.push(content);
		params.push(1);
		params.push(iswho);
		params.push(nick_name);
		
		mysql.executeSql(sql, params, posts => {
			if (posts) {
				if(posts){
					res.status(200).json({
						msg: "登录成功！"
					})
				}else{
					res.status(500).json({
						msg: "登录失败！"
					})
				}
			}
		})//执行sql
	})
})//用于登录的函数



app.post("/send_comment", (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields) {
		if (err) {
			throw err
		}
		// fields显示非文件类型的所有key、value值
		Object.keys(fields).forEach(function(email) {
			console.log('got field named ' + email);
		});
		
		var uid = fields.uid[0];
		var nick_name = fields.nick_name[0];
		var iswho = fields.iswho[0];
		var content = fields.content[0];
		
		var sql = "insert into t_post(uid,content,ispost,iswho,nick_name) values(?,?,?,?,?)";
		var params = [];
		params.push(uid);
		params.push(content);
		params.push(2);
		params.push(iswho);
		params.push(nick_name);
		
		mysql.executeSql(sql, params, posts => {
			if (posts) {
				if(posts){
					res.status(200).json({
						msg: "登录成功！"
					})
				}else{
					res.status(500).json({
						msg: "登录失败！"
					})
				}
			}
		})//执行sql
	})
})//用于登录的函数



app.listen(8088);

console.log('Listening on port 8088');