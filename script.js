let cnvContext = null;      // Canvas context
let canvas = null;          // Canvas
let itemScalePx = 32;       // a size for object (32x32px default)
let playerX  = getRandomInt(4);
let score = 0;        // current score
let pause = true;     // game in pause

function loadImages(sources, callback)
{
    let images = {};
    let loadedImages = 0;
    let numImages = 0;
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
    rail:     'https://anchovys.github.io/diamond-rails/tex/rail.png',
    rock0:    'https://anchovys.github.io/diamond-rails/tex/rock0.png',
    rock1:    'https://anchovys.github.io/diamond-rails/tex/rock1.png',
    player:   'https://anchovys.github.io/diamond-rails/tex/player.png',
    diamond:  'https://anchovys.github.io/diamond-rails/tex/diamond.png'
  };

  function getRandomInt(max)
  {
    return Math.floor(Math.random() * Math.floor(max));
  }

document.addEventListener('keydown', function(event)
{
    switch (event.code )
    {
        case 'KeyA':        //  нажатие влево
        case 'ArrowLeft':
            if(playerX > 0 && !pause)
                playerX--;      // перемещение по x
            break;

        case 'KeyD':        //  нажатие вправо
        case 'ArrowRight':
            if(playerX < 3  && !pause)
                playerX++;     // перемещение по x
            break;

        case 'KeyP':        // установка/снятие паузы только на кнопку P
             pause = !pause;
            break;

        default:            // снятие с паузы на любую другую кнопку
              pause = false;
            break;
    }
});


function ClickAt(x, y, width)
{
    if (pause)
      pause = false;

    if (x < width / 2 && playerX > 0)
    {
        playerX--;
    }
    else if (x > width / 2 && playerX < 3)
    {
        playerX++;
    }
}

document.addEventListener("DOMContentLoaded", function ()
{
    canvas = document.getElementById('myCanvas');
    cnvContext = canvas.getContext("2d");

    //при клике мышью
    canvas.onclick = function(e)
    {
        let rect = canvas.getBoundingClientRect();
        ClickAt(e.clientX - rect.left, e.clientY - rect.top, rect.width);
    };

    cnvContext.canvas.width = itemScalePx * 4;
    cnvContext.canvas.height = (itemScalePx-1) * 4;
    cnvContext.font = "20px Arial";
    cnvContext.fillStyle = "#84ffff";
    cnvContext.textAlign = "center";

    let dy = 2;
    let rockY = -itemScalePx;
    let diamondY = itemScalePx;
    let rockX = getRandomInt(4);
    let diamondX = getRandomInt(4);

    let rockId = getRandomInt(2);

    setInterval(function()
    {
        loadImages(sources, function(images)
        {
            cnvContext.clearRect(0, 0, canvas.width, canvas.height);

            for(let x = 0; x < 4; x++)
            {   for(let y = 0; y < 4; y++)
                {
                    cnvContext.drawImage(images.rail, x * itemScalePx, y * itemScalePx + dy - 2, itemScalePx, itemScalePx);
                }
            }

            cnvContext.drawImage(images.player, playerX * itemScalePx, 2 * itemScalePx, itemScalePx, itemScalePx);
            cnvContext.drawImage((rockId === 0) ? images.rock0 : images.rock1, rockX * itemScalePx, rockY, itemScalePx, itemScalePx);
            cnvContext.drawImage(images.diamond, diamondX * itemScalePx, diamondY, itemScalePx, itemScalePx);

            cnvContext.fillText(score, (playerX * itemScalePx) + itemScalePx/2, (3 * itemScalePx) - itemScalePx / 4);

        });

        if (pause) return;

        rockY    += 3;
        diamondY += 2;


        if(rockY > canvas.height)
        {
            rockX = getRandomInt(4);
            rockY = -itemScalePx;
            rockId = getRandomInt(2);
        }
        if(diamondY > canvas.height || (rockY + itemScalePx/2 > diamondY && rockY < diamondY + itemScalePx/2 && rockX === diamondX))
        {
            diamondX = getRandomInt(4);
            diamondY = -itemScalePx;
        }

        dy = -dy;

        if(rockY + itemScalePx > 2 * itemScalePx && rockY < 3 * itemScalePx && rockX === playerX)
        {
            //alert("You lose. Score: " + score);
            rockX       = getRandomInt(4);
            rockY       = -itemScalePx;
            diamondX    = getRandomInt(4);
            diamondY    = -itemScalePx;
            rockId      = getRandomInt(2);
            playerX     = getRandomInt(4);
            score       = 0;
            dy          = 2;
            pause       = true;
        }
        if(diamondY + itemScalePx > 2 * itemScalePx && diamondY < 3 * itemScalePx && diamondX === playerX)
        {
            score++;
            diamondX = getRandomInt(4);
            diamondY = -itemScalePx;
        }


    }, 50);
});