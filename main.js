import './style.css'
import kaboom from 'kaboom';

kaboom({
  background: [127, 200, 255]
});
loadSprite('frog', 'https://i.imgur.com/5D3Do8L.png', {
  sliceX: 1.15,
  sliceY: 0,
  anims: {
    idle: {
      from: 0,
      to: 0,
  }
}
});
let score = 0;

scene("game", () => {

  let pause = false;


  //spawn game stuff
  const player = add([
    sprite("frog", {
      anim: 'idle',
    }),
    pos(100, 100),
    area(),
    body(),
    health(10),
    
    "player",
    "friendly",
    {
      dir: LEFT,
      dead: false,
      speed: 100,
    },
  ]);
  const platform = add([
    rect(width(), 80),
    pos(0, height() - 80),
    outline(4),
    area(),
    solid(),
    color(87, 224, 24),
  ]);
  const scoreText = add([
    text(score),
    pos(width()/2, 32),
    origin('center')
  ]);


  // jump
  onKeyPress("space", () => {
    if(player.isGrounded()) {
      player.jump();
    }
  });
  
  //pause game
  onKeyPress("p", () => {
    pause = !pause;
    debug.log(`Paused: ${pause}`);
  });
  

  //update game
  onUpdate(() => {
    score++;
    scoreText.text = score;
  })
  
  //collision detection
  player.onCollide("obstacle", () => {
    addKaboom(player.pos);
    shake(10);
    go('lose');
  });
  
  //spawn the platform
  const spawnObstacle = () => {
    if(!pause) {
      add([
        rect(48, rand(24, 64)),
        area(),
        outline(4),
        pos(width(), height() - 80),
        origin("botleft"),
        color(255, 180, 255),
        move(LEFT, 240),
        "obstacle",
      ]);
    }
    wait(rand(1.0, 1.5), () => {
      spawnObstacle();
    });
  };
  spawnObstacle();
});

scene('lose', () => {
  if(localStorage.getItem('highScore') < score) {
    localStorage.setItem('highScore', score);
  };

  add([
    text("L bozo lost"),
    pos(width()/2, height()/2 -100),
    origin('center'),
  ]);
  add([
    text(`Score: ${score}`),
    pos(width()/2, height()/2),
    origin('center'),
  ]);
  add([
    text(`High Score: ${localStorage.getItem('highScore')}`),
    pos(width()/2, height()/2 + 100),
    origin('center'),
  ]);
  add([
    text('Play Again?'),
    pos(width()/2, height()/2 + 200),
    origin('center'),
    area(),
    'playAgain',
  ]);
  onClick('playAgain', () => {
    score = 0;
    go('game');
  });
});

go('game');
  
  