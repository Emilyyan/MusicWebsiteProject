var ctx = document.createElement('canvas').getContext('2d');
var linGrad = ctx.createLinearGradient(0, 64, 0, 200);
linGrad.addColorStop(0.5, 'rgba(105,105,105, 1)');
linGrad.addColorStop(0.5, 'rgba(105,105,105, 0.3)');

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: linGrad,
    progressColor: 'hsla(200, 100%, 30%, 0.5)',
    cursorColor: '#fff',
    barWidth: 3,
    height: 100,
    maxCanvasWidth: 800
});

wavesurfer.on('loading', function (percents) {
    document.getElementById('progress').value = percents;
});

wavesurfer.on('ready', function (percents) {
    document.getElementById('progress').style.display = 'none';
    //clear comments for previous wave before loading comments for the current one
    
    //example use:
    /*printComment(19.6,"test comment");
    printComment(2,"beginning test");
    printComment(29.6,"another comment");*/

    //initialize tooltips on comments whenever a different wave is loaded
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});

// Display comments along timeline when playing the audio
wavesurfer.on('audioprocess', function(){
    Array.prototype.forEach.call($('.comment-indicator'), item => {
        //comment position (start from 0)
        var comment = item.style.cssText.substr(6).slice(0,-3);
        //cursor position (start form 1)
        var cursor = $('#waveform>wave>wave').css('width').slice(0,-2);
        if(comment == cursor-1){         
            $(item).tooltip('show');
            setTimeout(function(){$('.comment-indicator').tooltip('hide'); }, 1000);
        }
      });
});
/*
$('body').on('mousemove','#waveform',
function(){
    //get container width
    var width = $('#waveform').css('width').replace(/[^-\d\.]/g, '');
    //calculate the time point of mouse position on the wave
    var mouseTime = (event.layerX / width) * wavesurfer.getDuration();
    console.log(mouseTime);
});
*/

$( "body" ).on( "click", ".music-to-choose", switchMusic);
function switchMusic(){
     var trackId = $(this).attr('id');
     var thumbnail = $( this ).data("thumb-nail");
     var previewURL = $(this).children('.previewUrl').children('a').attr('href');
     wavesurfer.load(previewURL);
     var music_title = $(this).children('.info-name').html();
     var music_artist = $(this).children('.info-artist').children('a').text();
     $(".music-title").html(music_title);
     $(".music-title").attr("id", trackId);
     $(".music-artist").html(music_artist);
     
}

$( "#volume" ).change(function() {
    var volume = $(this).val();
    console.log(volume);
    wavesurfer.setVolume(volume);
});