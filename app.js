var mysql  = require('mysql');  

//接口
var express=require('express');
var app =express();
//app.use(bodyParser.urlencoded({ extended: false }));  
//设置跨域访问
app.all('*', function(req, res, next) {
	//req.body=666666;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Cache-Control", "no-chache");
    var time=new Date().toString().slice(0,25);
   	res.header("Last-Modified", time);
   	res.header("if-modified-since", time);
   	next();
});


//var connection = mysql.createConnection({     
//host     : 'localhost',       
//user     : 'root',              
//password : '123456',       
//port: '3306',                   
//database: 'tpshop', 
//}); 
 


function handleError (err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      console.error(err.stack || err);
    }
  }
}
var config={
   host     : 'localhost',       
   user     : 'root',              
   password : 'zsf2011211',       
   port: '3306',                   
   database: 'shufa', 
};
// 连接数据库
function connect () {
  connection = mysql.createConnection(config);
  connection.connect(handleError);
  connection.on('error', handleError);
}

var connection;
connect();
 
// connection.connect();


app.get('/product',function(req,res){
	var type=req.query.type;
	console.log(type);
	var  sql = 'SELECT * FROM product where type='+type;
 	connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       //console.log(result);
		res.status(200);
		res.json(result);
		res.end();
       console.log('------------------------------------------------------------\n\n');  
	});
});

//登陆
app.get('/login',function(req,res){
	var phone=req.query.phone;
	var password=req.query.password;
	var sql="select * from user where account = '"+phone+"' and password = '"+password+"'"
 	connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       var questions=result;
       //写个接口123
		res.status(200),
		res.json(questions)
		res.end();
       console.log('------------------------------------------------------------\n\n');  
	});
});




//增

app.post('/add',function(req,res){
	var str='';
	req.on("data",function(dt){
		//console.log(typeof dt);
         str+=dt
     })
	req.on("end",function(){
         //console.log(typeof JSON.parse(str));
         var param=JSON.parse(str);
         //插入数据
         var  name=param.name;
		//console.log(name);
		var  phone=param.phone;
		var  email=param.email;
		var  addSql = 'INSERT INTO user(name,phone,email) VALUES(?,?,?)';
		var  addSqlParams = [name, phone,email];
		connection.query(addSql,addSqlParams,function (err, result) {
	        if(err){
	         console.log('[INSERT ERROR] - ',err.message);
	         return;
	        }        
	 
	       console.log('--------------------------INSERT----------------------------');
	       //console.log('INSERT ID:',result.insertId);        
	       console.log('INSERT ID:',result); 
	       res.status(200);
	        res.end();
			//res.json(questions)       
	       console.log('-----------------------------------------------------------------\n\n');  
		});
     })
});



//配置服务端口
var server = app.listen(3000, function () {
var host = server.address().address;
 var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})


// connection.end();