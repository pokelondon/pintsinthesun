define([
        'jquery',
        'underscore',
        'backbone',
        'config',
        'rays',
        'data',
        'slider',
        'moment',
        'mediator'
        ],
        function($, _, Backbone, config, rays, data,  Slider, moment, Mediator) {

            // DRAWING
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var centre = {lat: 51.5127414, lng: -0.0668529};

            // LINE SEGMENTS
            var segments = [
                // Border
                {a: {x: 0, y: 0}, b: {x: canvas.width, y: 0}},
                {a: {x: canvas.width, y:0}, b: {x: canvas.width, y: canvas.height}},
                {a: {x: canvas.width, y: canvas.height}, b: {x: 0, y: canvas.height}},
                {a: {x: 0, y: canvas.height}, b: {x: 0, y: 0}},
            ];

            data.getOutlines(centre, function(coords, floors, isPub) {

                var xys = _(coords).map(function(p) { return {x: p[0], y: p[1]}; });
                var i = 0;
                while(i < xys.length) {
                    // Make points into set of lines, the last one ends back at the start
                    segments.push({a: xys[i], b: xys[i+1] || xys[0]})
                    i ++;
                }
                draw();
            });

            function draw(){

                // Clear canvas
                ctx.clearRect(0,0,canvas.width,canvas.height);

                // Draw segments
                ctx.fillStyle = "#009900";
                ctx.strokeStyle = "#999";
                for(var i=0;i<segments.length;i++){
                    var seg = segments[i];
                    ctx.beginPath();
                    ctx.moveTo(seg.a.x,seg.a.y);
                    ctx.lineTo(seg.b.x,seg.b.y);
                    ctx.stroke();
                }
                ctx.fill();

                // Get all unique points
                var points = (function(segments){
                    var a = [];
                    segments.forEach(function(seg){
                        a.push(seg.a,seg.b);
                    });
                    return a;
                })(segments);
                var uniquePoints = (function(points){
                    var set = {};
                    return points.filter(function(p){
                        var key = p.x+","+p.y;
                        if(key in set){
                            return false;
                        }else{
                            set[key]=true;
                            return true;
                        }
                    });
                })(points);

                // Get all angles
                var uniqueAngles = [];
                for(var j=0;j<uniquePoints.length;j++){
                    var uniquePoint = uniquePoints[j];
                    var angle = Math.atan2(uniquePoint.y-Mouse.y,uniquePoint.x-Mouse.x);
                    uniquePoint.angle = angle;
                    uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
                }

                // RAYS IN ALL DIRECTIONS
                var intersects = [];
                for(var j=0;j<uniqueAngles.length;j++){
                    var angle = uniqueAngles[j];

                    // Calculate dx & dy from angle
                    var dx = Math.cos(angle);
                    var dy = Math.sin(angle);

                    // Ray from center of screen to mouse
                    var ray = {
                        a:{x:Mouse.x,y:Mouse.y},
                        b:{x:Mouse.x+dx,y:Mouse.y+dy}
                    };

                    // Find CLOSEST intersection
                    var closestIntersect = null;
                    for(var i=0;i<segments.length;i++){
                        var intersect = rays.getIntersection(ray,segments[i]);
                        if(!intersect) continue;
                        if(!closestIntersect || intersect.param<closestIntersect.param){
                            closestIntersect=intersect;
                        }
                    }

                    // Intersect angle
                    if(!closestIntersect) continue;
                    closestIntersect.angle = angle;

                    // Add to list of intersects
                    intersects.push(closestIntersect);

                }

                // Sort intersects by angle
                intersects = intersects.sort(function(a,b){
                    return a.angle-b.angle;
                });

                // DRAW AS A GIANT POLYGON
                ctx.fillStyle = "#F6BB42";
                ctx.beginPath();
                ctx.moveTo(intersects[0].x,intersects[0].y);
                for(var i=1;i<intersects.length;i++){
                    var intersect = intersects[i];
                    ctx.lineTo(intersect.x,intersect.y);
                }
                ctx.fill();

                return;
                // DRAW DEBUG LINES
                ctx.strokeStyle = "#FFCE54";
                for(var i=0;i<intersects.length;i++){
                    var intersect = intersects[i];
                    ctx.beginPath();
                    ctx.moveTo(Mouse.x,Mouse.y);
                    ctx.lineTo(intersect.x,intersect.y);
                    ctx.stroke();
                }

            }

            // DRAW LOOP
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
            var updateCanvas = true;
            function drawLoop(){
                requestAnimationFrame(drawLoop);
                if(updateCanvas){
                    draw();
                    updateCanvas = false;
                }
            }
            window.onload = function(){
                drawLoop();
                // TMP
                //draw();
            };

            // MOUSE
            var Mouse = {
                x: canvas.width/2,
                y: canvas.height/2
            };
            canvas.onmousemove = function(event){
                Mouse.x = event.clientX;
                Mouse.y = event.clientY;
                updateCanvas = true;
            };

        });
