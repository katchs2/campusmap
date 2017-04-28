/* 
This code will mainly be used to add maarkers to the map, but it also
initializes the map which is centered at the Rensselaer Union.
*/

/*
Create an array for all the new markers made form locations.json.
Creates a new map centered at the Rensselaer Union 
*/
var map;
var markers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 42.729948799999995, lng: -73.6766655},
    zoom: 19,
    styles: [{"stylers":[{"hue": "#dd0d0d"}]},{"featureType": "road","elementType": "labels","stylers":[{"visibility":"off"}]},
    {"featureType":"road","elementType":"geometry","stylers":[{"lightness": 100},{"visibility":"simplified"}]}],
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  var largeInfowindow = new google.maps.InfoWindow();

  // Get all notable location information from the JSON file
  $(document).ready(function(){
    $.getJSON("json/locations.json", function(json) {
      $.each(json.locations, function(index, location) {
         // Create marker objects and stroe them
        var position = new google.maps.LatLng(location.latitude,location.longitude);
        var title = location.title;
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation. DROP
        });
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        // It will display the title of the location
        marker.addListener("click", function() {
          populateInfoWindow(this, largeInfowindow);
        });
      });
    });
  });

  // Buttons to show and hide map markers
  document.getElementById("show-listings").addEventListener("click", showListings);
  document.getElementById("hide-listings").addEventListener("click", hideListings);
}

/*
This function populates the infowindow when the marker is clicked. We'll only allow
one infowindow which will open at the marker that is clicked, and populate based
on that markers position. It also displays all the classrooms for a location.
*/
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    document.getElementById("view-classrooms").style.display="block";  
    infowindow.marker = marker;
    infowindow.setContent("<div>" + marker.title + "</div>");
    infowindow.open(map, marker);
    getClassrooms(marker);
    /*
    Make sure the marker property is cleared and the "View Classrooms" button is hissen 
    if the infowindow is closed.
    */
    infowindow.addListener('closeclick', function() {
      document.getElementById('view-classrooms').style.display="none";
      infowindow.marker = null;
    });
  }
}

/*
This function will display markers on the map. It will also extend the boundaries of the map 
to accomadate each marker.
*/
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function hides all map markers.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function displays the classrooms for a marker in a scrollable sidebar.
function getClassrooms(marker) {
  var classrooms;
  $(document).ready(function(){
    $.getJSON("json/locations.json", function(json) {
      $.each(json.locations, function(index, location) {
        if (location.title === marker.title) {
          if ("rooms" in location) {
            alert(location.title,"has rooms!");
            $.each(location.rooms, function(floor,room) {
              alert();
            })
          }
        }
        });
      });
    });
  }