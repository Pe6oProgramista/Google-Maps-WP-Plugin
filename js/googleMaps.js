function initMap() {
	let pos = {lat: 42.662369, lng:  23.373397};
	let mapBlock = document.getElementById('map');
	let map;
	
	if (typeof(mapBlock) != 'undefined' && mapBlock != null) {
		map = new google.maps.Map(mapBlock, {
			zoom: 4,
			center: pos
		});
	}
//city,country,countryCode,distance,geodbId,latitude,longitude,name,region,regionCode,type,wikiDataId
	let markers = []
	for (let db_marker of db_markers) {
    let contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">' + db_marker.city + '</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Latidue</b>: ' + db_marker.latitude + '  Longitude: ' + db_marker.longitude + '</p>'+
        '<p><b>Type</b> - ' + db_marker.type + '</p>'+
        '<p><b>Country</b> - ' + db_marker.country +
        '<p><b>Country code</b> - ' + db_marker.countryCode + '</p>'+
        '<p><b>Region</b> - ' + db_marker.region + '</p>'+
        '<p><b>Region code</b> - ' + db_marker.regionCode + '</p>'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=' + db_marker.city + '">'+
        'https://en.wikipedia.org/w/index.php?title=' + db_marker.city + '</a> '+
        '</p>'+
        '</div>'+
        '</div>';       

    let marker = new google.maps.Marker({
      position: {lat: parseFloat(db_marker.latitude), lng: parseFloat(db_marker.longitude)},
      map: map,
      title: db_marker.city
    });
		markers.push({ marker, contentString });
  }

  for (let markerContent of markers) {
    markerContent.marker.addListener('click', function() {
      new google.maps.InfoWindow({
        content: markerContent.contentString
      }).open(map, markerContent.marker);
    });
  }
}
