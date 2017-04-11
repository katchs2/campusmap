var map;
// Create a new blank array for all the listing markers.
var markers = [];
function initMap() {

  // creates a new map centered at the Rensselaer Union 
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.729948799999995, lng: -73.6766655},
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });

  // Get all notable locations from a JSON file
  $(document).ready(function(){
    $.getJSON("locations.json", function(json) {
      console.log(json); // this will show the info it in firebug console
    });
  });
  
  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var locations = [
    {title: 'Troy', location: {lat: 42.729948799999995, lng: -73.6766655}},
    {title: '133_Sunset_Terrace', location: {lat: 42.72897, lng: -73.66867}},
    {title: '15th_Street_Parking', location: {lat: 42.72856, lng: -73.6779}}
  ];

  var largeInfowindow = new google.maps.InfoWindow();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
     var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }
  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}