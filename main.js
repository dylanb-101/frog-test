import './style.css'
import kaboom from 'kaboom';
import { uid } from 'uid';
kaboom({
  background: [127, 200, 255]
});


//firebase setup
import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore, query, orderBy, limit, getDocs } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDiGaptgU0WLLB89pjq-PT_zM0SDko1DUw",
  authDomain: "website-3f031.firebaseapp.com",
  databaseURL: "https://website-3f031-default-rtdb.firebaseio.com",
  projectId: "website-3f031",
  storageBucket: "website-3f031.appspot.com",
  messagingSenderId: "402021919961",
  appId: "1:402021919961:web:cac8f7f71a229d987822c8",
  measurementId: "G-D5EMMY63BE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



//firebase functions

const write = async (score) => {
  await addDoc(collection(db, "scores"), {
    score: score
  });
};


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
loadSprite('board', 'https://i.imgur.com/htrZI7y.png')
let score = 0;

scene("leaderBoard", async() => {

  let scores = []; 
  const scoresRef = collection(db, "scores");
  const q = query(scoresRef, orderBy("score", "desc"), limit(10));
  const docs = await getDocs(q);
  console.log(docs);
  docs.forEach((doc) => {
    console.log(doc.id, "=>", doc.data().score);
    scores.push(doc.data().score);
  });
  
  console.log(scores);

  add([
    text("LeaderBoard"),
    pos(width()/2, 35),
    origin('center')
  ]);
  add([
    text('Back'),
    pos(width()/2, 120),
    origin('center'),
    area(),
    "back"
  ]);
  add([
    sprite('board'),
    pos(width()/2, height()/2 + 50),
    origin('center')
  ]);
  const score1 = add([
    text(`#1 ${scores[0]}`, {
      size: 50,
    }),
    pos(width()/2, height()/2 - 75),
    origin('center')
  ]);
  const score2 = add([
    text(`#2 ${scores[1]}`, {
      size: 50,
    }),
    pos(width()/2, height()/2 - 5),
    origin('center')
  ]);
  const score3 = add([
    text(`#3 ${scores[2]}`, {
      size: 50,
    }),
    pos(width()/2, height()/2 + 60),
    origin('center')
  ]);
  const score4 = add([
    text(`#4 ${scores[3]}`, {
      size: 50,
    }),
    pos(width()/2, height()/2 + 120),
    origin('center')
  ]);
  const score5 = add([
    text(`#5 ${scores[4]}`, {
      size: 50,
    }),
    pos(width()/2, height()/2 + 190),
    origin('center')
  ]);
  onClick("back", () => go("start"));
})

scene("start", () => {
  add([
    text("Frog Game"),
    pos(width()/2, height()/2 - 100),
    origin('center'),
  ]);
  add([
    text("LeaderBoard"),
    pos(center()),
    origin('center'),
    area(),
    "leaderBoard"
  ]);
  add([
    text("Play"),
    pos(width()/2, height()/2 + 100),
    origin('center'),
    area(),
    "play"
  ]);
  onClick("play", () => go("game"));
  onClick("leaderBoard", () => go("leaderBoard"));
  onKeyPress('r', () => localStorage.setItem('highScore', 0));
});

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
    write(Number(localStorage.getItem('highScore')));
  };

  add([
    text("L bozo lost"),
    pos(width()/2, height()/2 -200),
    origin('center'),
  ]);
  add([
    text(`Score: ${score}`),
    pos(width()/2, height()/2-100),
    origin('center'),
  ]);
  add([
    text(`High Score: ${localStorage.getItem('highScore')}`),
    pos(width()/2, height()/2),
    origin('center'),
  ]);
  add([
    text('Play Again?'),
    pos(width()/2, height()/2 + 100),
    origin('center'),
    area(),
    'playAgain',
  ]);
  add([
    text('Home'),
    pos(width()/2, height()/2 + 200),
    origin('center'),
    area(),
    'home',
  ]);
  onClick('playAgain', () => {
    score = 0;
    go('game');
  });
  onClick('home', () => {
    score = 0;
    go('start');
  });
});

go('start');
  
  