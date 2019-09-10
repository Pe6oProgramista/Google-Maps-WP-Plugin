function myFunction(id) {
    document.getElementById(id).classList.toggle("show");
}

function makeChanges(id) {
    let form = jQuery('#' + id).serializeArray();

    let pos = {lat: 42, lng: 23};
	let mapBlock = document.getElementById('map');
	let map;
	
	if (typeof(mapBlock) != 'undefined' && mapBlock != null) {
		map = new google.maps.Map(mapBlock, {
			zoom: 4,
			center: pos
		});
    }

    let filtered_markers = db_markers.filter( (m) => {
        for ( let col of form ) {
            if (m[col.name] == col.value) {
                return true;
            }
        }
        if(form.length > 0) {
            return false;
        } else {
            return true;
        }
    } );

    let markers = []
	for (let db_marker of filtered_markers) {
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
            new google.maps.InfoWindow( { content: markerContent.contentString } )
                .open(map, markerContent.marker);
        });
    }

    return false;
}