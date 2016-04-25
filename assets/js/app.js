var map, featureList, openBeerMapSearch = [], event15Search = [], participantSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(participants.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggleClass('slip');
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggleClass('slip');
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').addClass('slip');
  map.invalidateSize();
});


$('#metadataModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var url = button.data('url'); // Extract info from data-* attributes
  var modal = $(this);
  modal.find('.modal-body iframe').attr("src", url);
});


/* FONCTIONS */
function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through events15 layer and add only features which are in the map bounds */
  events15.eachLayer(function (layer) {
    if (map.hasLayer(event15Layer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-calendar"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  /* Loop through participants layer and add only features which are in the map bounds */
  participants.eachLayer(function (layer) {
    if (map.hasLayer(participantLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img src="' + imgFromType[layer.feature.properties.TYPE] + '" /></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var mapquestOSM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});

var mapquestOAM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});

var mapquestHYB = L.layerGroup([L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"]
}), L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

var popArt = L.tileLayer("https://a.tiles.mapbox.com/v4/katiekowalsky.m5d5cg5h/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2F0aWVrb3dhbHNreSIsImEiOiJHR2hfdlBNIn0.GUMLsSnT-SYx4ew7b77kqw", {
  minzoom: 0,
  maxZoom: 22,
  attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>'
});

var stamenTonerLite = L.tileLayer("http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["a","b","c","d"],
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});

var stamenWaterColor = L.tileLayer("http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", {
  minZoom: 0,
  maxZoom: 18,
  subdomains: ["a","b","c","d"],
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

// marqueues personnalisés avec une image
var breweryIcon = L.icon({
  iconUrl: 'assets/img/icon_brewery.png',
  shadowUrl: 'assets/img/icon_shadow.png',
  iconAnchor:   [30, 30],
  shadowAnchor: [17, 0]
});
var barIcon = L.icon({
  iconUrl: 'assets/img/icon_bar.png',
  shadowUrl: 'assets/img/icon_shadow.png',
  iconAnchor:   [30, 30],
  shadowAnchor: [17, 0]
});
var shopIcon = L.icon({
  iconUrl: 'assets/img/icon_shop.png',
  shadowUrl: 'assets/img/icon_shadow.png',
  iconAnchor:   [30, 30],
  shadowAnchor: [17, 0]
});
var assoIcon = L.icon({
  iconUrl: 'assets/img/icon_asso.png',
  shadowUrl: 'assets/img/icon_shadow.png',
  iconAnchor:   [30, 30],
  shadowAnchor: [17, 0]
});
var distIcon = L.icon({
  iconUrl: 'assets/img/icon_dist.png',
  shadowUrl: 'assets/img/icon_shadow.png',
  iconAnchor:   [30, 30],
  shadowAnchor: [17, 0]
});
// marqueurs personnalisés via Font Awesome
var participantMarker = L.AwesomeMarkers.icon({
  icon: 'users',
  markerColor: 'blue',
  prefix: 'fa'
});

var eventMarker = L.AwesomeMarkers.icon({
  icon: 'calendar',
  markerColor: 'orange',
  prefix: 'fa'
});

var beerMarker = L.AwesomeMarkers.icon({
  icon: 'beer',
  markerColor: 'green',
  prefix: 'fa'
});


/*Load data*/
var openBeerMapLayer = L.geoJson(null);
var openBeerMaps = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: beerMarker,
      title: feature.properties.NAME,
      riseOnHover: false
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>"
      + "<tr><th>Nom</th><td>" + feature.properties.NAME + "</td></tr>"
      + "<tr><th>Type</th><td>" + feature.properties.TYPE + " - Brasse sur place : " + feature.properties.BREWER + "</td></tr>"
      + "<tr><th>Bières à la pression</th><td>" + feature.properties.BEERS + "</td></tr>"
      + "<tr><th>OpenBeerMap</th><td><a class='url-break' href='http://www.openstreetmap.org/node/" + feature.properties.OSM_ID + "' target='_blank'>Am&eacute;liorer les informations</a></td></tr>"
      + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/event15.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      openBeerMapSearch.push({
        name: layer.feature.properties.NAME,
        name: layer.feature.properties.BEERS,
        source: "Où boire de la bière ?",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/OpenBeerMap_IDF.geojson", function (data) {
  openBeerMaps.addData(data);
});



/* Empty layer placeholder to add to layer control for listening when to add/remove events15 to markerClusters layer */
var event15Layer = L.geoJson(null);
var events15 = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: eventMarker,
      title: feature.properties.NAME + "&nbsp;(" + feature.properties.PLACE_NAME + ")",
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>"
      + "<tr><th>Nom</th><td>" + feature.properties.NAME + "</td></tr>"
      + "<tr><th>Description</th><td>" + feature.properties.DESCR_FR + "</td></tr>"
      + "<tr><th>Date et horaire</th><td><i class='fa fa-calendar fa-2x'></i> le " + feature.properties.EVT_DDAY + ", <i class='fa fa-clock-o fa-2x'></i> de " + feature.properties.EVT_S_TIME + " à " + feature.properties.EVT_E_TIME + "</td></tr>"
      + "<tr><th>Où</th><td>"+ feature.properties.ADDRESS + "</td></tr>"
      + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME + "&nbsp;-&nbsp;" + feature.properties.PLACE_NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/event15.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      event15Search.push({
        name: layer.feature.properties.NAME,
        place_name: layer.feature.properties.PLACE_NAME,
        source: "Evenements",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/ParisBeerWeek_evenements.geojson", function (data) {
  events15.addData(data);
  /*map.addLayer(event15Layer);*/
});

var fsId = 'WAN1BD2P0XKNTBOU4VG3MD1EIM5RH1G3QNC05TIQRERULKSC';
var fsSecret = 'VXGPDL3J1RWEEJI50PUQJLGPK5SVDN4PJAN3TF3IGAMRZG54';
var utpId = '110BDCBFDDEE4BCBFC8A190A2CE246A08CF63D62';
var utpSecret = 'F71C5E961F3592F503689ACE795CD786ED1ACCA5 ';

var addFoursquareInfos = function(feature) {
  $.get('https://api.foursquare.com/v2/venues/' + feature.properties.FS_ID + '?client_id=' + fsId + '&client_secret=' + fsSecret + '&v=20140806%20&m=foursquare')
  .done(function(data) {
    var venue = data.response.venue;
    if (!venue) {
      return;
    }
    var photos = venue.photos;
    if (photos.count) {
      var items = photos.groups[0].items;
      var container = $('#venue-images .grid');
      _.each(items, function(photo) {
        var div = $('<div>').addClass('grid-item');
        var img = $('<img>');
        img.attr('src', photo.prefix + 'width250' + photo.suffix);
        div.append(img);
        container.append(div);
      });
      setTimeout(function() {
        container.masonry({
          columnWidth: '.grid-sizer',
          itemSelector: '.grid-item',
          percentPosition: true,
          gutter: 5
        });
      }, 1000);
    }
    var label = $('<span>')
    .addClass('label label-primary')
    .html(venue.stats.checkinsCount);
    $('#venue-checkins').append(label);
  });
};

var addUntappdInfos = function(feature) {
  $.get('https://api.untappd.com/v4/venue/checkins/' + feature.properties.UTP_ID + '?client_id=' + utpId + '&client_secret=' + utpSecret)
  .done(function(data) {
    var response = data.response;
    var checkins = response.checkins.items;
    var eventCheckins = _.filter(checkins, function(checkin) {
      return new Date(checkin.created_at) >= new Date(2016, 03, 29);
    });
    var label = $('<span>')
    .addClass('label label-primary')
    .html(eventCheckins.length);
    $('#untappd-checkins').append(label);
  });
};

var iconFromType = {
  BAR: barIcon,
  CAVE: shopIcon,
  BRASSERIE: breweryIcon,
  DISTRIBUTEUR: distIcon,
  ASSOCIATION: assoIcon
};

var imgFromType = {
  BAR: 'assets/img/icon_bar.png',
  CAVE: 'assets/img/icon_shop.png',
  BRASSERIE: 'assets/img/icon_brewery.png',
  DISTRIBUTEUR: 'assets/img/icon_dist.png',
  ASSOCIATION: 'assets/img/icon_asso.png'
};

/* Empty layer placeholder to add to layer control for listening when to add/remove participants to markerClusters layer */
var participantLayer = L.geoJson(null);
var participants = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    var icon = iconFromType[feature.properties.TYPE];
    return L.marker(latlng, {
      icon: icon,
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>"
      + "<tr><th>Nom</th><td>" + feature.properties.NAME + "</td></tr>"
      + "<tr><th>Type</th><td>" + feature.properties.TYPE + "</td></tr>"
      + "<tr><th>Description</th><td>" + feature.properties.DESCR_FR + "</td></tr>"
      + "<tr><th>Coordonn&eacute;es</th><td><a target='_blank' href='" + feature.properties.WEBSITE + "'><i class='fa fa-globe fa-3x'></i></a>\
       &nbsp;&nbsp;<a target='_blank' href='" + feature.properties.PBW_2015_FR + "'><i class='fa fa-pinterest-p fa-3x'></i></a>\
       &nbsp;&nbsp;<a target='_blank' href='" + feature.properties.FACEBOOK + "'><i class='fa fa-facebook-official fa-3x'></i></a>\
       &nbsp;&nbsp;<a target='_blank' href=" + feature.properties.OSM + "><i class='fa fa-map-marker fa-3x'></i></a>\
       &nbsp;&nbsp;<a target='_blank' href=" + feature.properties.CITYMAPPER + "><i class='fa fa-map-signs fa-3x'></i></a>\
       </td></tr>"
      + "<tr><td colspan='2'> <img id ='popupimg' src='" + feature.properties.THUMBNAIL + "'></td></tr>";

      if (feature.properties.UTP_ID) {
        content += "<tr><td>Untappd <i class='fa fa-beers'></i></td><td id='untappd-checkins'></td></tr>";
      }
      if (feature.properties.FS_ID) {
        content += "<tr><td>Checkins <i class='fa fa-foursquare'></i></td><td id='venue-checkins'></td></tr>" +
                   "<tr><td colspan='2' id='venue-images'><div class='grid'><div class='grid-sizer'></div></div></td></tr>";
      }
      content += "<table>";

      layer.on({
        click: function (e) {
          var title = $("#feature-title").empty();
          $('<img>').attr('src', imgFromType[feature.properties.TYPE]).appendTo(title);
          $('<span>').html(feature.properties.NAME).appendTo(title);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

          if (feature.properties.FS_ID) {
            addFoursquareInfos(feature);
          }
          if (feature.properties.UTP_ID) {
            addUntappdInfos(feature);
          }

          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="' + imgFromType[feature.properties.TYPE] + '"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      participantSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADDRESS,
        source: "Participants",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/ParisBeerWeek_participants.geojson", function (data) {
  participants.addData(data);
  map.addLayer(participantLayer);
});

/* couches chargées au démarrage */
map = L.map("map", {
  zoom: 12,
  center: [48.8589, 2.3469],
  layers: [mapquestOSM, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === event15Layer) {
    markerClusters.addLayer(events15);
    syncSidebar();
  }
  if (e.layer === participantLayer) {
    markerClusters.addLayer(participants);
    syncSidebar();
  }
  if (e.layer === openBeerMapLayer ) {
    markerClusters.addLayer(openBeerMaps);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === event15Layer) {
    markerClusters.removeLayer(events15);
    syncSidebar();
  }
  if (e.layer === participantLayer) {
    markerClusters.removeLayer(participants);
    syncSidebar();
  }
  if (e.layer === openBeerMapLayer) {
    markerClusters.removeLayer(openBeerMaps);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Modèle d&eacute;velopp&eacute; par <a target='_blank' href='http://bryanmcbride.com'>bryanmcbride.com</a> | Mis en forme par <a target='_blank' href='https://twitter.com/geojulien'>GeoJulien</a> pour <a target='_blank' href='http://www.isogeo.com'>Isogeo</a> et <a target='_blank' href='http://laparisbeerweek.com/'>Paris Beer Week</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

/* zoom control */
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);


/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: false,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: true,
  strings: {
    title: "Ma position",
    popup: "Vous êtes dans un rayon de {distance} {unit} de ce point",
    outsideMapBoundsMsg: "Vous semblez être en dehors des limites de cette carte"
  },
  locateOptions: {
    maxZoom: 15,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Plan": mapquestOSM,
  "Pop art": popArt,
  "Noir et blanc": stamenTonerLite,
  "Aquarelle": stamenWaterColor,
/*  "Imagerie a&eacute;rienne": mapquestOAM,
  "Imagerie et plan": mapquestHYB*/

};

var groupedOverlays = {
  "Paris Beer Week #2": {
    "<span class='half-big'>&#x2b21;</span></i>&nbsp;Participants&nbsp;<a title='Site internet' target='_blank' href='http://laparisbeerweek.com/2015/participants/'><i class='fa fa-globe'></i></a>&nbsp;-&nbsp;<a href='#' data-toggle='modal' data-target='#metadataModal' data-url='http://open.isogeo.com/s/344d51c3edfb435daf9d98d948fa207e/Sbd1w7PgqE8n7LDq3azRqNhiMHZf0/m/92115642a6234bf2a3379b9be9bedd83?lock' id='metadata-part' title='M&eacute;tadonn&eacute;es'><i class='fa fa-info-circle'></i></a>": participantLayer,
    "<i class='fa fa-calendar orange'>&nbsp;Ev&eacute;nements&nbsp;<a title='Site internet' target='_blank' href='http://laparisbeerweek.com/2015/programme/'><i class='fa fa-globe'></i></a>&nbsp;-&nbsp;<a href='#' data-toggle='modal' data-target='#metadataModal' data-url='http://open.isogeo.com/s/344d51c3edfb435daf9d98d948fa207e/Sbd1w7PgqE8n7LDq3azRqNhiMHZf0/m/cc9d1de9f1164159bea1465ef9826eb0?lock' id='metadata-event' title='M&eacute;tadonn&eacute;es'><i class='fa fa-info-circle'></i></a>": event15Layer
    
  },
  "OpenBeerMap": {
    "<i class='fa fa-beer green'>&nbsp;Bars&nbsp;&&nbsp;pubs parisiens&nbsp;<a title='Site internet' target='_blank' href='http://nlehuby.drupalgardens.com/node/81'><i class='fa fa-globe'></i></a>&nbsp;-&nbsp;<a href='#' data-toggle='modal' data-target='#metadataModal' data-url='http://open.isogeo.com/s/344d51c3edfb435daf9d98d948fa207e/Sbd1w7PgqE8n7LDq3azRqNhiMHZf0/m/eeeb7a31c27145e2a3c0f08415f38aed?lock' id='metadata-obm' title='M&eacute;tadonn&eacute;es'><i class='fa fa-info-circle'></i></a>": openBeerMapLayer
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {collapsed: isCollapsed}).addTo(map);

/* slider temps */
/*var sliderControl = L.control.sliderControl({
  position: "bottomleft",
  layer: event15Layer,
  timeAttribute: 'EVT_S_EPC',
  isEpoch: true,
  timeStrLength: 16,
}).addTo(map);

map.addControl(sliderControl);

sliderControl.startSlider();*/

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to participants bounds */
  map.fitBounds(participants.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var openBeerMapBH = new Bloodhound({
    name: "Bars",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: openBeerMapSearch,
    limit: 10
  });

  var event15BH = new Bloodhound({
    name: "Evenements",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: event15Search,
    limit: 10
  });

  var participantsBH = new Bloodhound({
    name: "Participants",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: participantSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=FR&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  openBeerMapBH.initialize();
  event15BH.initialize();
  participantsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Bars",
    displayKey: "name",
    source: openBeerMapBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-beer'>Bars</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Evenements",
    displayKey: "name",
    source: event15BH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-calendar'>&nbsp;Ev&eacute;nements 2015</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{place_name}}</small>"].join(""))
    }
  }, {
    name: "Participants",
    displayKey: "name",
    source: participantsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-users'>&nbsp;Participants</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-globe'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Evenements") {
      if (!map.hasLayer(event15Layer)) {
        map.addLayer(event15Layer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Participants") {
      if (!map.hasLayer(participantLayer)) {
        map.addLayer(participantLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Bars") {
      if (!map.hasLayer(openBeerMapLayer)) {
        map.addLayer(openBeerMapLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
