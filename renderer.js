// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

console.log('hello renderer');

function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
  });
}

var connection = new WebSocket('ws://localhost:4000')
connection.onopen = function () {
  console.log("connect webSocket");
  //connection.send("Hello ABCDEF");
};
connection.onerror = function (error) {
  console.error('WebSocket Error ' + error);
};
connection.onmessage = function (e) {
  console.log("message from server: ", e.data);
};

var run = async () =>{

  await fetch('http://localhost:3000/')
  .then(response => response.json())
  .then(data => console.log(data));

  await fetch('http://localhost:3000/sc')
  .then(response => response.json())
  .then(data => console.log(data));

  await fetch('http://localhost:3000/sc-test')
  .then(response => response.json())
  .then(data => console.log(data));

}

try {
  run()
} catch (e) {
  console.log('error ',e);
}

