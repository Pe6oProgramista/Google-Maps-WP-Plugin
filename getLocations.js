// search: "get list of cities api"  >>>>>>>  http://geodb-cities-api.wirefreethought.com/


var fetch = require('node-fetch');
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

con.connect(async function(err) {
	if (err) throw err;
	console.log("Connected!");

	for(let i = 0; i < 10000; i += 10) {
		await fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=10&offset=${i}`)
		.then(r => r.json())
		.then(r => {
			var sql = "INSERT INTO wp_markers (lat, lng) VALUES ";
			for (let j = 0; j < r.data.length; j++) {
				sql += ((j > 0)?", ":"") + `(${r.data[j].latitude}, ${r.data[j].longitude})`;
			}
			sql += ";";
  			
			con.query(sql, function (err, result) {
				if (err) throw err;
				console.log("10 records inserted");
			});
		});
	}
});
