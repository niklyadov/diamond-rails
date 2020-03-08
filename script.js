
var context = null;
var canvas = null;
var scaleItem = 32;
var playerX  = getRandomInt(4);;
var score = 0;
var pause = false;

function loadImages(sources, callback)
{
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources)
    {
      numImages++;
    }
    for(var src in sources)
    {
      images[src] = new Image();
      images[src].onload = function()
      {
        if(++loadedImages >= numImages)
        {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }

  var sources =
  {
    rail:     './tex/rail.png',
    rock0:    './tex/rock0.png',
    rock1:    './tex/rock1.png',
    player:   './tex/player.png',
    diamond:  './tex/diamond.png'
  };

  function getRandomInt(max)
  {
    return Math.floor(Math.random() * Math.floor(max));
  }

document.addEventListener('keydown', function(event)
{
    switch (event.code )
    {
      case 'ArrowLeft':
        if(playerX > 0)
            playerX--;
      break;
      case 'ArrowRight':
        if(playerX < 3)
            playerX++;
      break;
      case 'KeyP':
              pause = !pause;
      break;
    }
  });
document.addEventListener("DOMContentLoaded", function ()
{
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");

    context.canvas.width = scaleItem * 4;
    context.canvas.height = (scaleItem-1) * 4;
    context.font = "20px Arial";
    context.fillStyle = "#84ffff";
    context.textAlign = "center";

    var dy = 2;
    var rockY = -scaleItem;
    var diamondY = scaleItem;
    var rockX = getRandomInt(4);
    var diamondX = getRandomInt(4);

    var rockId = getRandomInt(2);

    setInterval(function()
    {
        if(pause)
        {
            return;
        }

        rockY    += 3;
        diamondY += 2;

        loadImages(sources, function(images)
        {
            context.clearRect(0, 0, canvas.width, canvas.height);

            for(var x = 0; x < 4; x++)
            {   for(var y = 0; y < 4; y++)
                {
                    context.drawImage(images.rail, x * scaleItem, y * scaleItem + dy - 2, scaleItem, scaleItem);
                }
            }

            context.drawImage(images.player, playerX * scaleItem, 2 * scaleItem, scaleItem, scaleItem);
            context.drawImage((rockId == 0) ? images.rock0 : images.rock1, rockX * scaleItem, rockY, scaleItem, scaleItem);
            context.drawImage(images.diamond, diamondX * scaleItem, diamondY, scaleItem, scaleItem);

            context.fillText(score, (playerX * scaleItem) + scaleItem/2, (3 * scaleItem) - scaleItem / 4);

            if(rockY > canvas.height)
            {
                rockX = getRandomInt(4);
                rockY = -scaleItem;
                rockId = getRandomInt(2);
            }
            if(diamondY > canvas.height || (rockY + scaleItem/2 > diamondY && rockY < diamondY + scaleItem/2 && rockX == diamondX))
            {
                diamondX = getRandomInt(4);
                diamondY = -scaleItem;
            }

            dy = -dy;

            if(rockY + scaleItem > 2 * scaleItem && rockY < 3 * scaleItem && rockX == playerX)
            {
                alert("You lose. Score: " + score);
                pause = true;
                document.location.reload(true);
            }
            if(diamondY + scaleItem > 2 * scaleItem && diamondY < 3 * scaleItem && diamondX == playerX)
            {
                score++;
                diamondX = getRandomInt(4);
                diamondY = -scaleItem;
            }
        });
    }, 50);
});