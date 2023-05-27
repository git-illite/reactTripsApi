/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Abdalla Aden Student ID: 021-720-057 Date: May 31st 2022
*
********************************************************************************/ 
let tripData = [];
let currentTrip = {};
let page = 1;
const perPage = 10;
let map = null;

let tripDur = (td) => (td /60).toFixed(2);

let tableRows = _.template(
  `<% _.forEach(trips, function(trip){ %>
          <tr data-id=<%- trip._id %> class=<%- trip.usertype%>>
          <td><%= trip.bikeid %></td>
          <td><%= trip['start station name'] %></td>
          <td><%- trip['end station name'] %></td>
          <td><%= tripDur(trip.tripduration) %></td>
          </tr>
          <% }); %>`
  );

function loadtripData() {
    return fetch(
      `https://cryptic-bayou-71026.herokuapp.com/api/trips?page=${page}&perPage=${perPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        tripData=data;
        var rowsReturned = tableRows({ 'trips': data });
        $("#trips-table tbody").html(rowsReturned);
        $("#current-page").html(page);
      })
      .catch((err) => console.log("Error" + err));

};
  
  $(function () {
    loadtripData();

    $("#trips-table tbody").on("click", "tr", function (e) {
       
        currentTrip = tripData.find(
          (trip) => trip._id == $(this).attr("data-id")
        );
        //console.log(currentTrip)
       
    $(".modal-title").html('Trip Details (Bike: ' + currentTrip.bikeid +')');
    $("#map-details").html(
        'Start Location: '+ currentTrip['start station name'] + '</br>'+
        "End Location: "+ currentTrip['end station name'] +'</br>'+
        "Trip Duration: " + tripDur(currentTrip.tripduration)
    );    
    $("#trip-modal").modal("show");
  });

  $("#previous-page").on("click", () => {
    if (page > 1) {
      page--;
      loadtripData();
    }
  });
  $("#next-page").on("click", () => {
      page++;
      loadtripData();
  });

  $('#trip-modal').on('shown.bs.modal', function () {
    map = new L.Map('leaflet', {
        layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ]
    });
    
    let start = L.marker([currentTrip['start station location'].coordinates[1],currentTrip['start station location'].coordinates[0]])
    .bindTooltip(currentTrip['start station name'],
        {
            permanent: true,
            direction: 'right'
        }).addTo(map);
    
    let end = L.marker([currentTrip['end station location'].coordinates[1],currentTrip['end station location'].coordinates[0]])
    .bindTooltip(currentTrip['end station name'],
        {
            permanent: true,
            direction: 'right'
        }).addTo(map);
    
    var group = new L.featureGroup([start, end]);
    
    map.fitBounds(group.getBounds(), { padding: [60, 60] });
    });

    $("#trip-modal").on("hidden.bs.modal", function () {
        map.remove();
    });

});