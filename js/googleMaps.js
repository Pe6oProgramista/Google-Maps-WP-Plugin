let db_markers = argsArray.db_markers;
let ajaxUrl = argsArray.ajaxUrl;
delete argsArray;

let map;
let markers = [];

let fakeEl = jQuery('<span>').hide().appendTo(document.body);
let pageNum = 0;

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

function updateAutocompleteData(inputField) {
	let filterType = inputField.closest(".filterDiv").find(".filterInput:first").attr('name');
	jQuery.ajax({
		type: "POST",
		url: ajaxUrl,
		data: {
			action: 'autocomplete_request',
			filterType: filterType,
			inputVal: inputField.val(),
			pageNum: pageNum
		},
		error: function (response) { console.log(response.responseJSON.data.messagesg) },
		success: function (result) {
			let nextPageData = result.body;

			let datalist = inputField.closest(".filterDiv").find(".filterList:first");
			let options = datalist.find("option");

			if (options.length > nextPageData.length) {
				for (let i = nextPageData.length; i < options.length; i++) {
					options[i].remove();
				}
			}

			if (options.length < nextPageData.length) {
				for (let i = 0; i < nextPageData.length - options.length; i++) {
					datalist.append('<option value="">');
				}
			}
			options = datalist.find("option");

			for (let i = 0; i < nextPageData.length; i++) {
				jQuery(options[i]).val(nextPageData[i][filterType]);
			}
		}
	});
}

function sendForm(form) {
	let form_filters = form.serializeArray().map((v) => v.value);

	jQuery.ajax({
		type: "POST",
		url: ajaxUrl,
		data: {
			action: 'filters_request',
			filters: form_filters
		},
		error: function (response) { console.log(response.responseJSON.data.message) },
		success: function (result) {
			db_markers = result.body;
			deleteMarkers(markers);
			initMarkers(db_markers);
		}
	});
}

jQuery(document).ready(function () {
	jQuery('.filtersEditorInput').on('input', function () {
		// change input field width according to text width
		fakeEl.text(jQuery(this).val() || jQuery(this).attr('placeholder')).css('font', jQuery(this).css('font'));
		jQuery(this).css('width', fakeEl.css('width'));


		// autocomplete
		updateAutocompleteData(jQuery(this))
	});

	jQuery('.filtersEditorInput').on('blur', function () {
		pageNum = 0;
		// jQuery(this).closest(".filterList").css("display", "none");
	});

	// jQuery('.filtersEditorInput').on('focus', function () {
	// 	pageNum = 0;
	// 	jQuery(this).closest(".filterList").css("display", "block");
	// });

	jQuery(".filtersEditorInput").on("keyup", function (e) {
		let filter = jQuery(this).val();

		// TODO: Trim filter variable

		if (e.which == 13 && jQuery(this).val()) {
			jQuery(this).val("");
			jQuery(this).css('width', '20px');

			jQuery(this).closest(".filtersEditor").find("span:first").append(`
            <span class="filterSpan">
                ${filter}
                <a class="deleteFilter" title="Remove filter" onclick="jQuery(this).closest('.filterSpan').remove();">
                    <svg style="pointer-events:none;" class="svg-icon iconClearSm" width="12" height="12" viewBox="0 0 14 14">
                        <path style="fill: #774548" d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z">
                        </path>
                    </svg>
                </a>
            </span>`);

			jQuery(this).closest(".filterDiv").find(".filterInput:first").val(function () {
				return this.value + ((this.value != "") ? "&" : "") + filter;
			});

			sendForm(jQuery(this).closest("#filtersForm"));
		}
		if (e.which == 8 && filter == "") {
			jQuery(this).closest(".filterDiv").find(".filterInput:first").val(function () {
				let newValue = this.value.split("&");
				newValue.pop();
				return newValue.join("&");
			});

			let filterSpans = jQuery(this).closest(".filtersEditor").find("span > .filterSpan");
			jQuery(filterSpans[filterSpans.length - 1]).remove();
			
			sendForm(jQuery(this).closest("#filtersForm"));
		}
	});

	// focus on input field when click on div
	jQuery(".filterDiv").click(function () {
		jQuery(this).find(".filtersEditorInput:first").focus();
	});

	// on click next page button to update the autocomplete list
	jQuery(".nextPageBut").click(function () {
		pageNum++;
	});

	jQuery("#filtersForm").submit(function (event) {
		event.preventDefault();
	});
});
