// This code will mainly be used to add markers to the map

var map;
// Create a new blank array for all the listing markers.
var markers = [];
function initMap() {

  // creates a new map centered at the Rensselaer Union 
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.729948799999995, lng: -73.6766655},
    zoom: 19,
    styles: [{"stylers":[{"hue": "#dd0d0d"}]},{"featureType": "road","elementType": "labels","stylers":[{"visibility":"off"}]},
    {"featureType":"road","elementType":"geometry","stylers":[{"lightness": 100},{"visibility":"simplified"}]}],
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  
 
  var largeInfowindow = new google.maps.InfoWindow();

  // Get all notable locations from a JSON file
  $(document).ready(function(){
    $.getJSON("json/locations.json", function(json) {
      $.each(json.location, function(index, location) {
        console.log(location.title);
         // Get the position from the location object
        var position = new google.maps.LatLng(location.latitude,location.longitude);
        var title = location.title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
      });
    });
  });

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
    // getClassrooms(marker);
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

// // This function displays the classrooms for a marker when called. It also displays the Display Classrooms option for a marker.
function getClassrooms(marker) {
  show the view clssrooms button
  document.getElementById('view-classrooms').style.display="block";  
  var classrooms;
  $(document).ready(function(){
    $.getJSON("json/locations.json", function(json) {
      $.each(json.location, function(index, location) {
        if (location.title == marker.title) {
          console.log(title)
          classrooms = location.rooms;
          return;
        }
        });
      });
    });
  infowindow.addListener('closeclick', function() {
    document.getElementById('show-classrooms').style.display="none";
  });
  });