/* 
This code will mainly be used to add maarkers to the map, but it also
initializes the map which is centered at the Rensselaer Union.
*/

/*
Create an array for all the new markers made form locations.json.
Creates a new map centered at the Rensselaer Union 
*/
var map;
var markerid;
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
         // Create marker objects and store them
        var position = new google.maps.LatLng(location.latitude,location.longitude);
        var title = location.title;
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation. DROP
        });
        markers.push(marker);

        /*
        Create an mouseover/onclick event to open an infowindow at each marker.
        The click event will display the title of the building and make room
        for the classroom list
        */
        marker.addListener("mouseover", function() {
          populateInfoWindow(this, largeInfowindow);
        });
        marker.addListener("click", function() {
          var classroom_list = document.getElementById('classroom-list');
          classroom_list.innerHTML = '';
          populateInfoWindow(this, largeInfowindow);
          getClassrooms(this);
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
    infowindow.marker = marker;
    infowindow.setContent("<div>" + marker.title + "</div>");
    infowindow.open(map, marker);
    /*
    Make sure the marker property is cleared and the "View Classrooms" button is hidden 
    if the infowindow is closed. Remove the classroom list too.
    */
    infowindow.addListener('closeclick', function() {
      var classroom_list = document.getElementById('classroom-list');
      classroom_list.innerHTML = '';
      var display_title = document.getElementById('display-title');
      display_title.innerHTML ="Find a Building or Classroom"; 
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

/* 
This function displays the classrooms for a marker in a scrollable sidebar. It searches the json file for the building and
checks to see if it has classrooms. If so, it displays the classrooms. Else it alerts the user that there are no classrooms
in the building and exits the function.
*/
function getClassrooms(marker) {
  var floors = []; // Holds all the floor objects
  $(document).ready(function(){
    $.getJSON("json/locations.json", function(json) {
        for (var building in json["locations"]) {
          // Find the building             
          if (marker.title === json["locations"][building].title) {
            // Check if it has rooms
            if (json["locations"][building].rooms) {
              // Change the display title to the building name
              var all_floors = json["locations"][building].rooms; 
              var display_title = document.getElementById('display-title');
              display_title.innerHTML = marker.title; 
              // Save each floor and the rooms on it as an object
              for (var floor_num in all_floors) {
                for (var room in all_floors[floor_num]) {
                  var floor = {
                    num: room,
                    classrooms: all_floors[floor_num][room].sort()
                  };
                  floors.push(floor);
                }
              }
              for (var i=0;i < floors.length;i++) {
                var li = document.createElement("li");
                var span = document.createElement("span");  
                span.setAttribute("class","badge badge-info badge-pill");
                span.appendChild(document.createTextNode(floors[i].classrooms.length));
                li.appendChild(document.createTextNode(floors[i].num));
                li.appendChild(span);
                li.setAttribute("id", floors[i].num);
                li.setAttribute("class", "list-group-item");
                document.getElementById("classroom-list").appendChild(li);
              }
            }
            else {
              alert("There are no classrooms in "+marker.title);
              // Reset the display title
              var display_title = document.getElementById('display-title');
              display_title.innerHTML ="Find a Building or Classroom"; 
              return;
            }
          }
        }
        var classroom_list = document.getElementById('classroom-list').getElementsByTagName('span');
        for (var item of document.querySelectorAll("span")) {
          item.addEventListener("click", function (e) {
          var floor_num = e.target.parentNode.id;
          var result = $.grep(floors, function(floor_object,index){ 
            return floor_object.num == floor_num;
          })[0];  
          console.log(result); 
          for(var i = 0; i < result.classrooms.length; i++) {
            // console.log(result.classrooms[i]);
          }         
          }, false);
        }
      });
    });
  }