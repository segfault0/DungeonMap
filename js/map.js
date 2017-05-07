var clicked = false, clickY;
// function setupDragScroll() {
//     $("#mapCanvas").on({
//         'mousemove': function(e) {
//             console.log('mousemove');
//             clicked && updateScrollPos(e);
//         },
//         'mousedown': function(e) {
//             console.log('mousedown');
//             clicked = true;
//             clickY = e.pageY;
//         },
//         'mouseup': function() {
//             console.log('mouseup');
//             clicked = false;
//             $('html').css('cursor', 'auto');
//         }
//     });
// }

var updateScrollPos = function(e) {
    $('html').css('cursor', 'row-resize');
    $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
}


function setupMap() {

    var mapObject = {
        playerRadius: 10,
        color: '#000000',
        lineWidth: 2,
        padding: 50,
        spacing: 25,
        sizeX: 32,
        sizeY: 32,
        playerX: 10,
        playerY: 10,
        playerVision: 100
    };

    var cnv = document.getElementById("mapCanvas");

    cnv.width = mapObject.spacing * mapObject.sizeX + mapObject.padding * 2;
    cnv.height = mapObject.spacing * mapObject.sizeY + mapObject.padding * 2;

    var xGrid = yGrid = 0;

    document.getElementById("canvasDiv").addEventListener('keydown', function(evt) {
            if(evt.keyCode >= 37 && evt.keyCode <= 40) {
                evt.preventDefault();
            }
            switch(evt.keyCode) {
                case 38: // Up arrow
                    mapObject.playerY = Math.max(mapObject.playerY - 1, 0);
                    break;

                case 40: // Down arrow
                    mapObject.playerY = Math.min(mapObject.playerY + 1, mapObject.sizeY - 1);
                    break;

                case 37: // Left arrow
                    mapObject.playerX = Math.max(mapObject.playerX - 1, 0);
                    break;

                case 39: // Right arrow
                    mapObject.playerX = Math.min(mapObject.playerX + 1, mapObject.sizeX - 1);
                    break;
            }
            drawMap(cnv, mapObject);
        }, true
    );
    drawMap(cnv, mapObject); 
    return;
}


function drawMap(cnv, mapObject) {
    cnv.getContext('2d').clearRect(0, 0, cnv.width, cnv.height);
    drawFogLayer(cnv, mapObject);
    drawPlayerLayer(cnv, mapObject);
    drawGridLayer(cnv, mapObject);
}

function drawFogLayer(cnv, mapObject) {
    var ctx = cnv.getContext('2d');
    ctx.beginPath();
    ctx.rect(mapObject.padding, mapObject.padding, cnv.width - mapObject.padding, cnv.height - mapObject.padding);
    ctx.fillStyle = "rgba(0,0,0,.9)";
    ctx.fill();
    ctx.closePath();

    // TODO: Can this be one path?

    ctx.beginPath();
    ctx.arc(mapObject.padding + mapObject.spacing / 2 * (mapObject.playerX * 2 + 1), mapObject.padding + mapObject.spacing / 2 * (mapObject.playerY * 2 + 1), mapObject.playerVision, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();
    ctx.closePath();
    
}

function drawPlayerLayer(cnv, mapObject) {
    // First will need to clear previous cell
    // Then draw in new cell
    var ctx = cnv.getContext('2d');
    ctx.strokeStyle = mapObject.color;
    ctx.lineWidth = mapObject.lineWidth;

    ctx.beginPath();
    ctx.arc(mapObject.padding + mapObject.spacing / 2 * (mapObject.playerX * 2 + 1), mapObject.padding + mapObject.spacing / 2 * (mapObject.playerY * 2 + 1), mapObject.playerRadius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
}


function drawGridLayer(cnv, mapObject) {
    var iWidth = cnv.width;
    var iHeight = cnv.height;

    var ctx = cnv.getContext('2d');

    ctx.strokeStyle = mapObject.color;
    ctx.lineWidth = mapObject.lineWidth;
    
    var iCount = null;
    var i = null;
    var x = mapObject.padding;
    var y = mapObject.padding;

    ctx.beginPath();

    // Vertical lines
    iCount = Math.floor((iWidth - 2 * mapObject.padding) / mapObject.spacing);
    for (i = 0; i <= iCount; i++) {
        // ctx.beginPath();
        ctx.moveTo(x, mapObject.padding - 1);
        ctx.lineTo(x, iHeight - mapObject.padding + 1);
        // ctx.stroke();
        x += mapObject.spacing;
    }

    // Horizontal lines
    iCount = Math.floor((iHeight - 2 * mapObject.padding) / mapObject.spacing);
    for (i = 0; i <= iCount; i++) {
        // ctx.beginPath();
        ctx.moveTo(mapObject.padding, y);
        ctx.lineTo(iWidth - mapObject.padding, y);
        // ctx.stroke();
        y += mapObject.spacing;
    }


    ctx.stroke();

    ctx.closePath();

    return;
}