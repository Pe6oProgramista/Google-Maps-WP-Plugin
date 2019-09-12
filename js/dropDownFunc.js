jQuery(document).ready(function () {
    /*jQuery('.filterInput').focus(function () {
        jQuery('.filterList').show();
    });
    jQuery('.filterInput').blur(function () {
        jQuery('.filterList').hide();
    });*/
	jQuery("#filtersForm").submit(function(event) {
        event.preventDefault();
		let form = jQuery(this).serializeArray();

		console.log(form);

		let request_filters = form.map( (v) => ({ [v.name]: v.value }) )
		console.log(request_filters);
        jQuery.ajax({
            type: "POST",
            url: ajaxUrl,
			data: {
				action: 'filter_request',
				filters: 'filtri'//jQuery(this).
			},
			error: function(msg){console.log(msg)}
        }).done(function(result) {
			console.log(result);
		});
    });
});

let datalists = jQuery('.filterList').map( (k, v) => jQuery(v) );
let dl_options = datalists.toArray().map( (v) => {
	return jQuery(`#${v.attr('id')} option`).toArray().map( v => v.value );
})

let inputs = jQuery('.filterInput');
let lastInputsVals = inputs.map( (k, v) => jQuery(v).val() ); 
let inputscommas = inputs.map( (k, v) => (jQuery(v).val().match(/,/g) || []).length );

let separator = ',';

function filldatalist(prefix, indx) {
	if (dl_options[indx].length > 0) {
	    datalists[indx].empty();
		for (let option of dl_options[indx]) {
		    if (prefix.indexOf(option) < 0) {
		        datalists[indx].append(`<option value="${prefix}${option}">`);
		    }
		}
    }
}
inputs.bind("change keyup", function () {
	let indx = inputs.index( this );

    let inputtrim = jQuery(this).val().replace(/^\s+|\s+$/g, " ");
    let currentcommas = (jQuery(this).val().match(/,/g) || []).length;

    if (lastInputsVals[indx] != jQuery(this).val()) {
        if (inputscommas[indx] != currentcommas || jQuery(this).val() == "") {
            let lsIndex = inputtrim.lastIndexOf(separator);
            let str = (lsIndex != -1) ? inputtrim.substr(0, lsIndex) + ", " : "";

            filldatalist(str, indx);

            inputscommas[indx] = currentcommas;
        }
        jQuery(this).val(inputtrim);
        lastInputsVals[indx] = inputtrim;
    }
});

function makeChanges() {
    let form = jQuery('#' + id).serializeArray();

    let pos = { lat: 42, lng: 23 };
    let mapBlock = document.getElementById('map');
    let map;

    if (typeof (mapBlock) != 'undefined' && mapBlock != null) {
        map = new google.maps.Map(mapBlock, {
            zoom: 4,
            center: pos
        });
    }

    let filtered_markers = db_markers.filter((m) => {
        for (let col of form) {
            if (m[col.name] == col.value) {
                return true;
            }
        }
        if (form.length > 0) {
            return false;
        } else {
            return true;
        }
    });

    let markers = []
    for (let db_marker of filtered_markers) {
        let contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + db_marker.city + '</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Latidue</b>: ' + db_marker.latitude + '  Longitude: ' + db_marker.longitude + '</p>' +
            '<p><b>Type</b> - ' + db_marker.type + '</p>' +
            '<p><b>Country</b> - ' + db_marker.country +
            '<p><b>Country code</b> - ' + db_marker.countryCode + '</p>' +
            '<p><b>Region</b> - ' + db_marker.region + '</p>' +
            '<p><b>Region code</b> - ' + db_marker.regionCode + '</p>' +
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=' + db_marker.city + '">' +
            'https://en.wikipedia.org/w/index.php?title=' + db_marker.city + '</a> ' +
            '</p>' +
            '</div>' +
            '</div>';

        let marker = new google.maps.Marker({
            position: { lat: parseFloat(db_marker.latitude), lng: parseFloat(db_marker.longitude) },
            map: map,
            title: db_marker.city
        });
        markers.push({ marker, contentString });
    }

    for (let markerContent of markers) {
        markerContent.marker.addListener('click', function () {
            new google.maps.InfoWindow({ content: markerContent.contentString })
                .open(map, markerContent.marker);
        });
    }

    return false;
}
