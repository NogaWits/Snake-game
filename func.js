


let canvas=document.getElementById("gameBoard");
let ctx=canvas.getContext("2d");
let height=canvas.height;
let width=canvas.width;

let nameInput=document.getElementById("nameInput");
let userName;
let scoreTable=document.getElementById("scoreTable");
let nameScreen=document.getElementById("nameScreen");
let leaderBoard=document.getElementById("leaderBoard");
let gameInterface=document.getElementById("gameInterface");
let lostScreen=document.getElementById("lostScreen");
let menu=document.getElementById("menu");
let startBtn=document.getElementById("startBtn");
let menuBtn=document.getElementById("menuBtn");
let leaderBoardBtn=document.getElementById("leaderBoardBtn");
let scoreText=document.getElementById("scoreText");
let moveInterval;
let direction="";
let paused=false;
let speed=200;
let snake;
let food={x:0,y:0};
let score=0;
let unit=30;
let snakeColor="SpringGreen";
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
]


/*create the players name+score 2dArray
if exists in local storage just fetch it and convert into an array, if doesnt exist create empty arr*/

let namesArr;
if(localStorage.length==0)
{

    namesArr=[];

}

else
{
    namesArr=JSON.parse(localStorage.getItem("arr"));

    for(let i=0; i<namesArr.length; i++)
    {
        namesArr[i]=JSON.parse(namesArr[i]);
    }

    
    
}



//sounds
let collectApple=new Audio("good-6081.mp3");
let collideWithSelf=new Audio("collidewithself.wav");
let collideWithWall=new Audio("collidewithwall.ogg");
let click=new Audio("click.mp3");



// add event listeners to the leader board button and the menu button
leaderBoardBtn.addEventListener("click",enterLeaderBoard);
menuBtn.addEventListener("click",enterMenu);


/*when the start button is clicked,the startGame func is fired*/
startBtn.addEventListener("click", startGame);


/* when the player clicks on the canvas we want 
to essentialy fire the handleCanvasClick funtion 
that either pauses or resumes the game*/
canvas.addEventListener("click",handleCanvasClick);


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
    /* the user is required to enter his name
    if not entered the app will alert and won't proceed*/
    if(nameInput.value!="")
    {
        // first we want to store the user's name
    userName=nameInput.value;

    // hide the menu screen and the name input
    menu.classList.add("notDisplayed");
    nameScreen.classList.add("notDisplayed");

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



    // in case the user input is empty
    else 
    {
        alert("you must enter your name!!");
    }



    
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


// creates food, appears in a random position that aligns with the snake
function createFood()
{
    ctx.beginPath();
    

    let x=unit*Math.floor(Math.random()*(canvas.width/unit));
    
    let y=unit*Math.floor(Math.random()*(canvas.height/unit));


    while(!isFreePlace(x,y))
    {
        console.log("oops, this place is taken.. trying again");
        x=unit*Math.floor(Math.random()*(canvas.width/unit));
        y=unit*Math.floor(Math.random()*(canvas.height/unit));

    }

    food.x=x;
    food.y=y;
    

    foodColor=colors[Math.floor(Math.random()*colors.length)];
    
    

    
    
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
                if(direction!="ArrowRight")
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

           console.log("ughh");
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
        
    snake.forEach(organ=>
    {
        ctx.clearRect(organ.x,organ.y,unit,unit);
        
    })

    

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
    document.removeEventListener("keydown",move);
    
    ctx.globalAlpha=0.5;

    //making the effect of trasperrency
    snake.forEach(organ=>
    {
        ctx.clearRect(organ.x,organ.y,unit,unit);

    })

    ctx.clearRect(food.x,food.y,unit,unit);

    ctx.globalAlpha=0.5;

    createSnake();

    ctx.beginPath();
    ctx.fillStyle=foodColor;
    ctx.rect(food.x,food.y,unit,unit);
    ctx.fill();
    ctx.closePath();
    lostScreen.classList.remove("notDisplayed");
    

    //add player to local storgae
    // store the score and the name in an array
    
        
    
    if(score>0)
    {
    localStorage.clear();
    let dup=false;
    

    if(namesArr.length>0)
    {
        
        namesArr.forEach(item=>{
            if(item[0]==userName)
            {
                if(Number(item[1])<score)
                {
                    item[1]=score;
                    dup=true;
                }
            }
        })

    
    }

    if(!dup)
    {
       namesArr.push([userName,score.toString()]);
    }


let tempArr=[];
namesArr.forEach(item=>{
    tempArr.push(JSON.stringify(item));
})


    localStorage.setItem("arr",JSON.stringify(tempArr));
    
    }




        

    
}


function enterLeaderBoard()
{
    
    let max=-1;
    let absMax=-1;
    let rank=1;
    

    while(rank<=namesArr.length)
    {
        max=-1;
        for(let j=0; j<namesArr.length; j++)
        {
            let value=Number(namesArr[j][1]);


            if(value>max)
            {
                if(absMax>-1)
                {
                    if(value<absMax)
                    {
                        max=value;
                    }

                }

                else
                {
                    max=value;
                }

            }
        }


            absMax=max;

            for(let k=0; k<namesArr.length; k++)
            {
                if(Number(namesArr[k][1])==absMax)
                {
                    let row=scoreTable.insertRow(scoreTable.rows.length);
                    let cell1=row.insertCell(0);
                    let cell2=row.insertCell(1);
                    let cell3=row.insertCell(2);

                    cell1.innerText="#"+rank;
                    cell2.innerText=namesArr[k][0];
                    cell3.innerText=namesArr[k][1];
                    rank++;

                }
            }


        }

        leaderBoard.classList.remove("notDisplayed");
        lostScreen.classList.add("notDisplayed");
        gameInterface.classList.add("notDisplayed");
    
    


    }

    
    
    

function enterMenu()
{
    lostScreen.classList.add("notDisplayed");
    gameInterface.classList.add("notDisplayed");
    menu.classList.remove("notDisplayed");
}



function scoreLogic(score)
{

    return score<10? "0"+score:score;

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
    ctx.globalAlpha=0.5;
    paused=true;


  }

  else
  {
    ctx.globalAlpha=1;
    getMoveFunc(direction);
    document.addEventListener("keydown",move);
    paused=false;
    
  }


}










        





