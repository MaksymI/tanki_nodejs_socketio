// короткая функция для регистрации сообщений от сервера (io.sockets.emit('message', 'hi!')),
// чтобы убедиться в том, что мы их получаем
var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

// стандартный код, который позволяет отслеживать нажатие клавиш W, A, S, D
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

// добавляем сообщение, что в игре появился новый участник,
socket.emit('new player');
// и цикл, который сообщает серверу о нажатии клавиш 60 раз в секунду
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

// обработчик, который будет отображать данные от сервера в Canvas
// код обращается к id Canvas (#canvas) и рисует там.
// Каждый раз, когда от сервера будет поступать сообщение о состоянии,
// данные в Canvas будут обнуляться, и на нём в виде зеленых кружков будут заново отображаться все игроки
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
});