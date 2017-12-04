var table;
$(document).ready(function(){

    table = $('#myTable').DataTable({
            //"lengthMenu": [6],
            "bLengthChange": false,
            "iDisplayLength": 5,
            "searching": false,
            //"bPaginate": false,
            "bFilter": true,
            "bInfo": false,
            "columnDefs": [
                { "width": "10%", "targets": 3 }
            ]
            });
    var ID;
    var length = 0;

    var db = firebase.database();
    db.ref("/ZumbaMusic").on("value", function(snapshot){

                snapshot.forEach(function(childSnapshot) {
                    //console.log(childSnapshot.val().ID);
                    ID = childSnapshot.val().ID;
                    var query = "select * from json where url='https://itunes.apple.com/us/lookup?id="+ID+"'";
                    var params = {
	                    q: query,
	                    format: "json"
	                }
	                var url = 'http://query.yahooapis.com/v1/public/yql';
	                $.getJSON(url, params, showResults);

                });


                var size = snapshot.numChildren();
                //console.log(size);

    });



   //tour part
   db.ref("/Tour").on("value", function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    console.log(childSnapshot.val());
                    date = childSnapshot.val().time;
                    artist =  childSnapshot.val().artist;
                    place = childSnapshot.val().location;
                    city = childSnapshot.val().city;
                    tickets = childSnapshot.val().ticketsURL;

                    var tourItem = `<div class="row">
                                        <div class="col-md-2">${date}</div>
                                        <div class='col-md-2'>${artist}</div>
                                        <div class='col-md-2'>${place}</div>
                                        <div class='col-md-2'>${city}</div>
                                        <div class='col-md-2'><a target="_blank" href="${tickets}">tickets</a></div>`;
                    $( "#tourList").append(tourItem);
                });
   });

   //video part
   db.ref("/ZumbaVideo").on("value", function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            videoID = childSnapshot.val().ID;
            videoName = childSnapshot.val().name;
            var url = "https://www.youtube.com/embed/"+videoID;

            var img_src = `https://img.youtube.com/vi/${videoID}/default.jpg`;
            var listItem = `<li class="media">
                                <div class="media-left">
                                <a class='video' id='${url}'>
                                    <img class="media-object" src="${img_src}">
                                </a>
                                </div>
                                <div class="media-body">
                                <h4 class="media-heading">${videoName}</h4>
                                </div>
                            </li>`;
            $(".media-list").append(listItem);
        });
    });
});

function changeVideo(){
    var url = $(this).attr("id");
    var iframe=document.getElementById("utube");
    iframe.src=url;
}

$( "body" ).on( "click", ".video", changeVideo);


var row_data = document.getElementById("data");
var count = 1;

function showResults(response){
    var info = response.query.results.json.results;
    console.log(info);
    var thumbnail = info.artworkUrl100;
    var song = info.trackCensoredName;
    var artist = info.artistName;
    var artistURL = info.artistViewUrl;
    var previewURL = info.previewUrl;
    var trackviewURL = info.trackViewUrl;
    var album = info.collectionCensoredName;
    var trackLinkCode = "<a target='_blank' href='" + trackviewURL + "'>" + album + "</span></a>";
    var artistLinkCode =  "<a target='_blank' href='" + artistURL + "'>" + artist + "</span></a>";
    //var URLicon = "<a target='_blank' href='" + trackviewURL + "'><span class='glyphicon glyphicon-music btn-lg'></span></a>"
    var previewURLicon = "<a href='" + previewURL + "'><span class='glyphicon glyphicon-download btn-lg'></span></a>"

    /*row_data.innerHTML += "<tr class='music-to-choose' data-thumb-nail='" + thumbnail + "'><th scope='row'>" + count + "</th><td class='info-name'>" + song +
                        "</td><td class='info-artist'>" + artist + "</td><td class='info-album'>" + album + "</td><td class='trackUrl'>"
                        + URLicon + "</td><td class='previewUrl'>" + previewURLicon + "</td></tr>";*/
    var rowNode = table.row.add([song, artistLinkCode, trackLinkCode, previewURLicon ]).draw().node();
    $(rowNode).addClass("music-to-choose");
    //$(rowNode).add("data-thumb-nail='" + thumbnail + "'");
    $(rowNode).attr("data-thumb-nail", thumbnail);
    $( rowNode ).find('td').eq(0).addClass('info-name');
    $( rowNode ).find('td').eq(1).addClass('info-artist');
    $( rowNode ).find('td').eq(2).addClass('info-album');
    $( rowNode ).find('td').eq(3).addClass('previewUrl');

    count++;

    //var pic = response.query.results.json.results.artworkUrl100;
    //console.log(pic);
}

//used to update info of player
function getInfo() {
    var thumbnail = $( this ).data("thumb-nail");
  $( "#thumbnail").html ("<img class='thumbnail' src='"+thumbnail+"'>" );
  $( "#song" ).html("<p class='navbar-text'>" + $(this).children('.info-name').html() +"</p>");
  $( "#artist" ).html("<p class='navbar-text'>" + $(this).children('.info-artist').children('a').text() +"</p>");
  $( "#album" ).html("<p class='navbar-text'>" + $(this).children('.info-album').children('a').text() + "</p>");
  var previewURL = $(this).children('.previewUrl').children('a').attr('href');
  $( "#previewURL" ).html("<audio controls controlsList='nodownload' class='audio'><source src='" + previewURL + "' audio='m4a'></audio>" );

}

$( "body" ).on( "click", ".music-to-choose", getInfo);//needs to use .on and bind it to body since the element is dynamically added


//tour list section
function getTours(){




}



//the scroll javascript code is from https://codepen.io/mattsince87/pen/exByn
function scrollNav() {
  $('.nav a').click(function(){
    //Toggle Class
    $(".active").removeClass("active");
    $(this).closest('li').addClass("active");
    var theClass = $(this).attr("class");
    $('.'+theClass).parent('li').addClass('active');
    //Animate
    $('html, body').stop().animate({
        scrollTop: $( $(this).attr('href') ).offset().top-60
    }, 400);
    return false;
  });
  $('.scrollTop a').scrollTop();
}
scrollNav();
