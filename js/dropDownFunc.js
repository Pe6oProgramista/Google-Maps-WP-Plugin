// function showDropdown(id) {
//     document.getElementById(id).classList.toggle("show");
// }

function makeChanges(id) {
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

jQuery(document).ready(function () {
    jQuery('.filterInput').focus(function () {
        jQuery('.filterList').show();
    });
    jQuery('.filterInput').blur(function () {
        jQuery('.filterList').hide();
    });
});

var datalists = jQuery('.filterList');
var dl_options = datalists.map( (k, v) => {
	return jQuery(`#${jQuery(v).attr('id')} option`);
})
var dl_optionsarray = dl_options.map( (options) => {
    return options.map( (option) => {
        return option.value;
    });
});
var inputs = jQuery('.filterInput');
var lastInputsVals = inputs.map( ( k, v ) => { return v.val() }); 

var inputscommas = inputs.map( ( k, v ) => { return (v.val().match(/,/g) || []).length });
var separator = ',';

function filldatalist(prefix) {
    if (options.length > 0) {
        datalist.empty();
        for (i = 0; i < optionsarray.length; i++) {
            if (prefix.indexOf(optionsarray[i]) < 0) {
                datalist.append('<option value="' + prefix + optionsarray[i] + '">');
            }
        }
    }
}
input.bind("change keyup", function () {
    var inputtrim = input.val().replace(/^\s+|\s+$/g, "");
    var currentcommas = (input.val().match(/,/g) || []).length;

    if (lastInputVal != input.val()) {
        if (inputcommas != currentcommas || input.val() == "") {
            var lsIndex = inputtrim.lastIndexOf(separator);
            var str = (lsIndex != -1) ? inputtrim.substr(0, lsIndex) + "," : "";

            filldatalist(str);

            inputcommas = currentcommas;
        }
        input.val(inputtrim);
        lastInputVal = inputtrim;
    }
});