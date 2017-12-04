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
});

wavesurfer.load('https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview30/v4/4f/42/0c/4f420c68-cbf1-47de-be68-927ccfdcef01/mzaf_5308035793306250766.plus.aac.p.m4a');
