var socket;
var sensorGyro = {
  vx: null,
  vy: null,
  vz: null,
  x: null,
  y: null,
  z: null
};

var sensorGesture = {
  proximity: null
};

sensors = new function() {
  this.connect = function() {
    socket = io.connect("localhost:13370");
    console.log("Connecting to Sensors");
    
    socket.on('gyro-accelerometer:0:gyro-data', function(msg){
      sensorGyro.vx = msg["x"];
      sensorGyro.vy = msg["y"];
      sensorGyro.vz = msg["z"];
    });
    socket.on('gyro-accelerometer:0:accelerometer-data', function(msg){
      sensorGyro.x = msg["x"];
      sensorGyro.y = msg["y"];
      sensorGyro.z = msg["z"];
    });
    socket.on('motion-sensor:0:proximity-data', function(msg){
      sensorGesture.proximity = msg["proximity"];
    });
    
    // Event received {"type":"event","name":"gesture","detail":{"type":"right"}}
    // Forwarding gesture-sensor:0:gesture to websocket {"type":"right"}
    // socket.on('gesture-sensor:0:gesture', function(msg){
      // switch (msg["type"]) {
      // case "up":
      //   console.log("UP");
      //   gestureUp();
      // break;
      // case "down":
      //   console.log("DOWN");
      //   gestureDown();
      // break;
      // case "left":
      //   console.log("LEFT");
      //   gestureLeft();
      // break;
      // case "right":
      //   console.log("RIGHT");
      //   gestureRight();
      // break;
      // default:
      //
      // };
    // });
    
    
  };
    
  this.update = function() {
  };
  
};