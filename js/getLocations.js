// search: "get list of cities api"  >>>>>>>  http://geodb-cities-api.wirefreethought.com/


const fetch = require('node-fetch');
const mysql = require('mysql');

const con = mysql.createConnection({
	host: "localhost",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

function query(sql) {
	return new Promise((resolve, reject) => {
		con.query(sql, (err, data, fields) => {
			if(!err){
				resolve(data, fields);	
			} else {
				reject(err);
			}
		});
	})

}

con.connect(async function(err) {
	if (err) throw err;
	console.log("Connected!");

	const colsStr = "city,country,countryCode,distance,geodbId,latitude,longitude,name,region,regionCode,type,wikiDataId"
	const cols = colsStr.replace('geodbId', 'id').split(',');

	for(let i = 0; i < 10000; i += 10) {
		await fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${i}`)
		.then(r => r.json())
		.then(r => {
			let sql = 'INSERT INTO wp_markers (' + colsStr + ') VALUES ';
			let values = [];
			let sqlValues = [];
			for (let j = 0; j < r.data.length; j++) {
				
				let qm = [];
				for ( let c of cols ) {
					values.push(r.data[j][c]);
					qm.push('?');
				}
				sqlValues.push("(" + qm.join(',') + ")");
			}
			sql += sqlValues.join(',');

			con.query(sql, values, function (err, result) {
				if (err) throw err;
				console.log("10 records inserted");
			});
		})
		.catch(error => console.log(error.message));
	}
	console.log("Finish");
	con.end();
});
