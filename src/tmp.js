
var SunCalc = require('./app/lib/suncalc');
var data = require('./public/data/results.json');

var date = new Date();

function pubtime(angle) {
    var angle = angle - 90;
    var upper = angle + 10;
    var lower = angle - 10;
    console.log(upper, lower);
    SunCalc.addTime(upper, 'upper', 'upper2');
    SunCalc.addTime(lower, 'lower', 'lower2');
    var times = SunCalc.getTimes(date, 51.526, -0.82);
    console.log(times.upper.getHours(), times.upper2.getHours());
    console.log(times.lower.getHours(), times.lower2.getHours());
}

var times = SunCalc.getTimes(date, 51.526, -0.82);
var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();

// get position of the sun (azimuth and altitude) at today's sunrise
var sunrisePos = SunCalc.getPosition(times.sunrise, 51.5, -0.1);

// get sunrise azimuth in degrees
var sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;



data.items.forEach(function(item) {
    console.log(item.name);
    pubtime(item.outdoor_angle);
})
