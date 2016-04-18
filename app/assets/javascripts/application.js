// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

var map;
var infoWindow;
var service;
var markers = [];
var results = [];
var names = [];
var pos;
var marker;
var placeLoc

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow({map: map});
  service = new google.maps.places.PlacesService(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You..');
      map.setCenter(pos);
      service.nearbySearch({
        location: pos,
        radius: 5000,
        type: ['establishment']
      }, callback);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }

  google.maps.event.addListener(map, 'rightclick', function(event) {
    map.setCenter(event.latLng);
    clearResults(markers);

    service.nearbySearch({
      location: event.latLng,
      radius: 5000,
      types: ['establishment']
    }, callback);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
       infoWindow.setPosition(pos);
       infoWindow.setContent(browserHasGeolocation ?
                             'Error: The Geolocation service failed.' :
                             'Error: Your browser doesn\'t support geolocation.');
     }

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      markers.push(createMarker(results[i]));
      names.push(results[i].name);
    }
  }
}

function createMarker(place) {
  placeLoc = place.geometry.location;
  marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name + " " + place.vicinity);
    infoWindow.open(map, this);
  });
  return marker;
}

function clearResults(markers) {
  for (var m in markers) {
    markers[m].setMap(null)
  }
  markers = []
}
