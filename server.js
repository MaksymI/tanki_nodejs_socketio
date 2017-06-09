// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
 
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
 
// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
 
// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});


// Обработчик веб-сокетов
io.on('connection', function(socket) {
});

// для теста
// setInterval(function() {
//     io.sockets.emit('message', 'hi!');
// }, 1000);


// храним информацию о всех подключенных пользователях в виде объектов JSON
var players = {};
// Так как у каждого подключённого к серверу сокета есть уникальный id,
// клавиша будет представлять собой id сокета подключённого игрока.
// Значение же будет другим объектом JSON, содержащим координаты x и y.
// Когда сервер получит сообщение о том, что присоединился новый игрок,
// он добавит новый вход в объект игроков при помощи id сокета, который будет в этом сообщении.
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });

  // Когда сервер получит сообщение о движении,
  // то обновит информацию об игроке, который связан с этим сокетом, если он существует.
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

// запрос, который будет отправлять сообщение и данные ВСЕМ подключённым сокетам
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);