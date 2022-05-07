import './style.css'
import kaboom from 'kaboom';

kaboom();

loadRoot('')
loadSprite('frog', 'sprites/frog1.png');
const player = add([
  sprite("frog"),
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




document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
