const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3001;

let room = ["room0", "room1", "room2"];
let a = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("유저가 들어왔다.");

  // 요거 추가
  socket.on("joinRoom", (num, name) => {
    console.log(num, name);
    socket.join(room[num], () => {
      io.to(room[num]).emit("joinRoom", num, name);
    });
  });

  // 요거 추가
  socket.on("leaveRoom", (num, name) => {
    console.log("현재 접속방 LEAVE ROOM ==>" + room[num]);
    socket.leave(room[num], () => {
      io.to(room[num]).emit("leaveRoom", num, name);
    });
  });

  socket.on("disconnect", () => {
    console.log("유저가 나갔다.");
  });

  socket.on("chat-msg", (num, name, msg) => {
    a = num;
    console.log("현재 접속방 MSG SEND ==>" + room[a]);
    io.to(room[a]).emit("chat-msg", name, msg); // to(room[a])를 통해 그룹에게만 메세지를 날린다.
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
