function initMap() {
	var pos = {lat: 42.662369, lng:  23.373397};
	var mapBlock = document.getElementById('map');
	var map;
	
	if (typeof(mapBlock) != 'undefined' && mapBlock != null) {
		map = new google.maps.Map(mapBlock, {
			zoom: 4,
			center: pos
		});
	}

	markers = []
	for (let marker of db_markers) {
		markers.push(new google.maps.Marker({
			position: {lat: parseFloat(marker.lat), lng: parseFloat(marker.lng)},
			map: map
		}));
	}
}
