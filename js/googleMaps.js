let db_markers = argsArray.db_markers;
let ajaxUrl = argsArray.ajaxUrl;
delete argsArray;

let map;
let markers = [];

let datalists = jQuery('.filterList').map((k, v) => jQuery(v));
let dl_options = datalists.toArray().map((v) => {
    return jQuery(`#${v.attr('id')} option`).toArray().map(v => v.value);
})

let inputs = jQuery('.filterInput');
let lastInputsVals = inputs.map((k, v) => jQuery(v).val());
let inputscommas = inputs.map((k, v) => (jQuery(v).val().match(/,/g) || []).length);

let separator = ',';

function initMap() {
    let pos = { lat: 0, lng: 0 };
    let mapBlock = document.getElementById('map');

    if (typeof (mapBlock) != 'undefined' && mapBlock != null) {
        map = new google.maps.Map(mapBlock, {
            zoom: 2,
            center: pos
        });
    }
    initMarkers(db_markers);
}

function initMarkers(markers_values) {
    for (let marker_val of markers_values) {
        let contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + marker_val.city + '</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Latidue</b>: ' + marker_val.latitude + '  Longitude: ' + marker_val.longitude + '</p>' +
            '<p><b>Type</b> - ' + marker_val.type + '</p>' +
            '<p><b>Country</b> - ' + marker_val.country +
            '<p><b>Country code</b> - ' + marker_val.countryCode + '</p>' +
            '<p><b>Region</b> - ' + marker_val.region + '</p>' +
            '<p><b>Region code</b> - ' + marker_val.regionCode + '</p>' +
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=' + marker_val.city + '">' +
            'https://en.wikipedia.org/w/index.php?title=' + marker_val.city + '</a> ' +
            '</p>' +
            '</div>' +
            '</div>';

        let marker = new google.maps.Marker({
            position: { lat: parseFloat(marker_val.latitude), lng: parseFloat(marker_val.longitude) },
            map: map,
            title: marker_val.city
        });
        markers.push({ marker, contentString });
    }

    for (let markerContent of markers) {
        markerContent.marker.addListener('click', function () {
            new google.maps.InfoWindow({
                content: markerContent.contentString
            }).open(map, markerContent.marker);
        });
    }
}

function deleteMarkers(markers) {
    for (let m of markers) {
        m.marker.setMap(null);
    }
    markers = [];
}

function filldatalist(prefix, indx) {
    if (dl_options[indx].length > 0) {
        datalists[indx].empty();
        for (let option of dl_options[indx]) {
            window.counter++;
            if (prefix.indexOf(option) < 0) {
                datalists[indx].append(`<option value="${prefix}${option}">`);
            }
        }
    }
}


// window.counter = 0;
// function filldatalist(prefix, indx) {
//   if (dl_options[indx].length > 0) {
//     //datalists[indx].empty();
//     // for (let option of dl_options[indx]) {
//     const ch = datalists[indx].children();
//     for (let i = 0; i < ch.length; i++) {
//       window.counter++;
//       if (prefix.indexOf(dl_options[indx][i]) < 0) {
        
//         if (i < dl_options[indx].length) {
//           ch.get(i).setAttribute('value', `${prefix}${dl_options[indx][i]}`);
//         } else {
//           ch.eq(i).remove();
//         }
//       }
//     }
//   }
// }

jQuery(document).ready(function () {
    jQuery("#filtersForm").submit(function (event) {
        event.preventDefault();
        let form = jQuery(this).serializeArray();

        let form_filters = form.map((v) => v.value)

        jQuery.ajax({
            type: "POST",
            url: ajaxUrl,
            data: {
                action: 'filters_request',
                filters: form_filters
            },
            error: function (msg) { console.log(msg) }
        }).done(function (result) {
            db_markers = result.body;
            deleteMarkers(markers);
            initMarkers(db_markers);
        });
    });
});

inputs.bind("change keyup", function () {
    let indx = inputs.index(this);

    let inputtrim = jQuery(this).val().split(',').map((v, i, arr) => (i == arr.length - 1) ? v.replace(/^\s+/g, "") : v.trim()).join(',');
    let currentcommas = (jQuery(this).val().match(/,/g) || []).length;

    if (lastInputsVals[indx] != jQuery(this).val()) {
        if (inputscommas[indx] != currentcommas || jQuery(this).val() == "") {
            let lsIndex = inputtrim.lastIndexOf(separator);
            let str = (lsIndex != -1) ? inputtrim.substr(0, lsIndex) + "," : "";
            filldatalist(str, indx);

            inputscommas[indx] = currentcommas;
        }
        jQuery(this).val(inputtrim);
        lastInputsVals[indx] = inputtrim;
    }
});