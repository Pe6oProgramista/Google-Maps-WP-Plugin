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
			var sql = "INSERT INTO wp_markers (city,country,countryCode,distance,geodbId,latitude,longitude,name,region,regionCode,type,wikiDataId) VALUES ";
			for (let j = 0; j < r.data.length; j++) {
				sql += ((j > 0)?", ":"") +
					`(${r.data[j].hasOwnProperty('city')?'"' + r.data[j].city + '"':"NULL"},
					${r.data[j].hasOwnProperty('country')?'"' + r.data[j].country + '"':"NULL"},
					${r.data[j].hasOwnProperty('countryCode')?'"' + r.data[j].countryCode + '"':"NULL"},
					${r.data[j].hasOwnProperty('distance')?r.data[j].distance:"NULL"},
					${r.data[j].hasOwnProperty('id')?r.data[j].id:"NULL"},
					${r.data[j].hasOwnProperty('latitude')?r.data[j].latitude:"NULL"},
					${r.data[j].hasOwnProperty('longitude')?r.data[j].longitude:"NULL"},
					${r.data[j].hasOwnProperty('name')?'"' + r.data[j].name + '"':"NULL"},
					${r.data[j].hasOwnProperty('region')?'"' + r.data[j].region + '"':"NULL"},
					${r.data[j].hasOwnProperty('regionCode')?'"' + r.data[j].regionCode + '"':"NULL"},
					${r.data[j].hasOwnProperty('type')?'"' + r.data[j].type + '"':"NULL"},
					${r.data[j].hasOwnProperty('wikiDataId')?'"' + r.data[j].wikiDataId + '"':"NULL"})`;
			}
			sql += ";";

			con.query(sql, function (err, result) {
				if (err) throw err;
				console.log("10 records inserted");
			});
		})
		.catch(error => console.log(error.message));
	}
});
