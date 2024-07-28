
let canvas=document.getElementById("gameBoard");
let ctx=canvas.getContext("2d");
let height=canvas.height;
let width=canvas.width;

let gameInterface=document.getElementById("gameInterface");
let lostScreen=document.getElementById("lostScreen");
let menu=document.getElementById("menu");
let startBtn=document.getElementById("startBtn");
let menuBtn=document.getElementById("menuBtn");
let scoreText=document.getElementById("scoreText");
let moveInterval;
let direction="";
let paused=false;
let speed=200;
let snake;
let food={x:0,y:0};
let score=0;
let unit=30;
let snakeColor="Green";
let foodColor;
let btns=document.querySelectorAll("button");
let key="";
let gameOver = false;
let colors=
[
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Indigo",
    "Violet"
];




//sounds
let collectApple=new Audio("sounds/good-6081.mp3");
let collideWithSelf=new Audio("sounds/collidewithself.wav");
let collideWithWall=new Audio("sounds/collidewithwall.ogg");
let click=new Audio("sounds/click.mp3");



// add event listener to the menu button
menuBtn.addEventListener("click",enterMenu);


/*when the start button is clicked,the startGame func is fired*/
startBtn.addEventListener("click", startGame);




/*when any button in the layout is clicked, we play the click sound*/
for(i of btns)
{
    i.onclick=()=>{

        click.play();
    }
}





/*initializes a new game*/
function startGame()
{
    // hide the menu screen 
    menu.classList.add("notDisplayed");

    /* when the player clicks on the canvas we want 
to fire the handleCanvasClick function 
that either pauses or resumes the game*/
canvas.addEventListener("click",handleCanvasClick);

    
    direction="";

    // show the board and the score
    gameInterface.classList.remove("notDisplayed");

    //set the score's value to zero
    score=0;
    scoreText.innerText=scoreLogic(score);

    /* we want to clear the board to make sure 
    there are no remains from previous games*/
    ctx.clearRect(0,0,width,height);
    ctx.globalAlpha=1;
snake=
[
    {x:unit*4, y:0},
    {x:unit*3,y:0},
    {x:unit*2, y:0},
    {x:unit, y:0},
    {x:0,y:0}
];

createSnake();
createFood();

// when a key is clicked, the move function is fired
document.addEventListener("keydown",move);
    }




    














// creates the snake
function createSnake()
{
    
    snake.forEach(organ=>
    {
        createOrgan(organ);
        
    })
    
}


// crate an organ of the snake
function createOrgan(organ)
{
    ctx.beginPath();
    ctx.fillStyle=snakeColor;
    ctx.rect(organ.x, organ.y,unit,unit);
        ctx.fill();
        
        ctx.closePath();
}


/* creates food, appears in a random position 
that take in account the snake's presence*/
function createFood()
{
    ctx.beginPath();
    

    let x=unit*Math.floor(Math.random()*(canvas.width/unit));
    
    let y=unit*Math.floor(Math.random()*(canvas.height/unit));


    while(!isFreePlace(x,y))
    {
        x=unit*Math.floor(Math.random()*(canvas.width/unit));
        y=unit*Math.floor(Math.random()*(canvas.height/unit));

    }

    food.x=x;
    food.y=y;
    

    let rnd=colors[Math.floor(Math.random()*colors.length)];
    while(rnd==snakeColor)
    {
        rnd=colors[Math.floor(Math.random()*colors.length)];
    }

    foodColor=rnd;
    
    

    
    
    ctx.fillStyle=foodColor;
    ctx.rect(x,y,unit,unit);
    ctx.fill();
    
    ctx.closePath();


    

}





/*the function is fired when any key is clicked
 and then checks whether the right/left/down/up key was clicked, and handles that*/
 

function move(event)
{
    
    if(event.key!=direction)
    {
    
    switch(event.key)
    {
        case 'ArrowRight':
            if(direction!="ArrowLeft")
            {
                clearInterval(moveInterval);
                direction=event.key;
            moveInterval=setInterval(moveRight,speed);
            moveRight();
           
            }
            break;


            case 'ArrowLeft':
                if(direction!="ArrowRight" &&direction!="")
                {
                    
                    clearInterval(moveInterval);
                    direction=event.key;
                moveInterval=setInterval(moveLeft,speed);
                moveLeft();
                }
                break;


                case 'ArrowUp':
                   if(direction!="ArrowDown")
                   {
                    
                    clearInterval(moveInterval);
                    direction=event.key;
                    moveInterval=setInterval(moveUp,speed);
                    moveUp();
                    }
                    break;


                    case 'ArrowDown':
                        if(direction!="ArrowUp")
                        {
                            clearInterval(moveInterval);
                            direction=event.key;
                        moveInterval=setInterval(moveDown,speed);
                        moveDown();
                        }

            default:
                break;

    }

    
}


}



/* the move functions: 1.create a new "head" and remove the "tail",considering the direction
2.check if apple is collected
3. check if snake collides with the wall,if so, fire the lostfunc
4.check if snake collides with itself, if so,fire the lostfunc*/



// the snake moves right by 30 px (unit)
function moveRight()
{
    let head={x:snake[0].x+unit,y:snake[0].y};
    snake.unshift(head);
    createOrgan(head);
    let removed=snake.pop();
    ctx.clearRect(removed.x,removed.y,unit,unit);
    checkAppleCollected();
    if(head.x==width)
    {
        
        collideWithWall.play();
        lostFunction();
    }



    else{
    for(let i=1; i<snake.length; i++)
    {
        if(head.y==snake[i].y && head.x+30==snake[i].x)
        {
            collideWithSelf.play();
            lostFunction();
            break;
        }
    }
    }


       

}


//the snake moves left by 30 px (unit)
function moveLeft()
{
    let head={x:snake[0].x-unit,y:snake[0].y};
snake.unshift(head);
createOrgan(head);
let removed=snake.pop();
ctx.clearRect(removed.x,removed.y,unit,unit);
checkAppleCollected();
if(head.x==-unit)
{
    
    collideWithWall.play();
    lostFunction();


}

else{
for(let i=1; i<snake.length; i++)
{
    if(head.y==snake[i].y && head.x-30==snake[i].x)
    {
        console.log("ughh");
        collideWithSelf.play();
        lostFunction();
        break;
    }
}
}
       
}

//the snake moves up by 30 px
function moveUp()
{
    
    let head={x:snake[0].x,y:snake[0].y-unit};
    snake.unshift(head);
    createOrgan(head);
    let removed=snake.pop();
    ctx.clearRect(removed.x,removed.y,unit,unit);
    checkAppleCollected();

    if(head.y==-unit)
    {
        collideWithWall.play();
        lostFunction();
    }


    else{
   for(let i=1; i<snake.length; i++)
    {
        if(head.x==snake[i].x && head.y-30==snake[i].y)
        {
            
            collideWithSelf.play();
            lostFunction();
            break;
        }
    }
    }


       



       


}

// the snake moves down by 30px
function moveDown()
{
    let head={x:snake[0].x,y:snake[0].y+unit};
    snake.unshift(head);
    createOrgan(head);
    let removed=snake.pop();
    ctx.clearRect(removed.x,removed.y,unit,unit);
    
    checkAppleCollected();

    if(head.y==height)
    {
        collideWithWall.play();
        lostFunction();

    }


else{
    for(let i=1; i<snake.length; i++)
    {
        if(head.x==snake[i].x&& head.y+30==snake[i].y)
        {
        console.log("ughh");
            collideWithSelf.play();
            lostFunction();
            break;
        }
    }

    }

    
       
       

}




/* check if the coordinates are free*/
function isFreePlace(x,y)
{
    for(let i=0; i<snake.length; i++)
    {
        if(snake[i].x==x&& snake[i].y==y) return false;
    }
    return true;
}


/* check if the snake collides with the apple, if so, fire the apple collected function*/
function checkAppleCollected()
{
    
    if(snake[0].x==food.x&& snake[0].y==food.y)
    {
        collectApple.play();
        appleCollected();
        

    }
}


// creates new tail,and adds to the score
function appleCollected()
{
    let newX;
    let newY;
    let last=snake[snake.length-1];
    let beforeLast=snake[snake.length-2];


    if(last.x>beforeLast.x)
    {
        newX=last.x+unit;
        newY=last.y;

    }

    if(last.x<beforeLast.x)
    {
        newX=last.x-unit;
        newY=last.y;
    }


    if(last.y>beforeLast.y)
    {
        newY=last.y+unit;
        newX=last.x;
    }

    if(last.y<beforeLast.y)
    {
        newY=last.y-unit;
        newX=last.x;
    }
        
   clearCanvas();

    

    snakeColor=foodColor;

    snake.push({x:newX, y:newY});

    createSnake();
    createFood();
    score++;
    scoreText.innerText=scoreLogic(score);

}





 function lostFunction()
{
    
   clearInterval(moveInterval);
   canvas.removeEventListener('click',handleCanvasClick);
    document.removeEventListener("keydown",move);

    //making the effect of trasperrency
    clearCanvas();
    

    ctx.globalAlpha=0.5;

    createSnake();
    drawFood();
    lostScreen.classList.remove("notDisplayed");
    
}






function enterMenu()
{
    lostScreen.classList.add("notDisplayed");
    gameInterface.classList.add("notDisplayed");
    menu.classList.remove("notDisplayed");
}


function clearCanvas()
{
    snake.forEach(organ=>
        {
            ctx.clearRect(organ.x,organ.y,unit,unit);
    
        })
    
        ctx.clearRect(food.x,food.y,unit,unit);

}

function scoreLogic(score)
{

    return score<10? "0"+score:score;

}

function drawFood()
{
    ctx.beginPath();
    ctx.fillStyle=foodColor;
    ctx.rect(food.x,food.y,unit,unit);
    ctx.fill();
    ctx.closePath();

}

function getMoveFunc(key)
{
    switch(key)
    {
        case "ArrowRight":
        moveInterval=setInterval(moveRight,speed)
        break;

        case "ArrowLeft":
            moveInterval=setInterval(moveLeft,speed)
            break;

            case "ArrowUp":
                moveInterval=setInterval(moveUp,speed);
                break;

                case "ArrowDown":
                    moveInterval=setInterval(moveDown,speed);
                    break;
    }

}



function handleCanvasClick()
{
  if(!paused)
  {
    clearInterval(moveInterval);
    document.removeEventListener("keydown",move);
    clearCanvas();
    ctx.globalAlpha=0.5;
    createSnake();
    drawFood();
    paused=true;


  }

  else
  {
    ctx.globalAlpha=1;
    clearCanvas();
    createSnake();
    drawFood();
    getMoveFunc(direction);
    document.addEventListener("keydown",move);
    paused=false;
    
  }


}










        





