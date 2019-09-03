var express = require('express');
var pty = require('node-pty');
const cors = require("cors");
const fs = require('fs');
var path1 = require('path');
const chokidar = require("chokidar");
/**
 * Whether to use UTF8 binary transport.
 * (Must also be switched in client.ts)
 */
const USE_BINARY_UTF8 = false;
function startServer() {
  var app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  const watcher = chokidar.watch(process.env.PWD + "/candidates", {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  io.on('connection', (client) => {
    const env = Object.assign({}, process.env);
    client.on("clientId",(data)=>{
      console.log(data);
      fs.mkdirSync('data')
    })
    env['COLORTERM'] = 'truecolor';
    var cols = 100,
      rows = 10,
      term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: 'xterm-256color',
        cols: cols || 100,
        rows: rows || 10,
        cwd: env.PWD+"/candidates",
        env: env,
        encoding: USE_BINARY_UTF8 ? null : 'utf8'
      });
    console.log('Created terminal with PID: ' + term.pid);
    term.on('data', function (data) {
      try {
        client.emit("message", data);
      } catch (ex) {
        // The WebSocket is not open, ignore
      }
    });
    term.write('cls\r');
    client.on("clientEnter", (msg) => {
      term.write(msg);
    })
    watcher.on('add', () => {
      client.emit('fileUpdate', true);
    }).on('addDir', () => {
      client.emit('fileUpdate', true);
    }).on('unlink', () => {
      client.emit('fileUpdate', true);
    }).on('unlinkDir', () => {
      client.emit('fileUpdate', true);
    }).on('change', () => {
      client.emit('fileUpdate', true);
    })
  });
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.post("/api/files", (req, res) => {
    let sendArray = []
    let path = ""
    const reqPath = req.body.filePath;
    if(reqPath === ""){
      path = __dirname + "/candidates";
    }else{
      path = reqPath;
    }
    let stat1 = fs.lstatSync(path);
    if (stat1.isFile()) {
      const value = fs.readFileSync(path, 'utf8');
      const filename = path.split('/').reverse();
      res.json({
        success: 1,
        data: [
          { filename: filename[0], path: path, isDir: false, content: value, fileType: path1.extname(filename[0]) }
        ]
      })
      return;
    }
    let oldFiles = fs.readdirSync(path);
    oldFiles.forEach(file => {
      const pathWithFileName = path + "/"+file
      try {
        let stat = fs.lstatSync(pathWithFileName);
        sendArray.push({ filename: file, path: pathWithFileName, isDir: stat.isDirectory() });
      } catch (e) { }


    })
    res.json({
      success: 1,
      data: sendArray
    })
  })
  app.post('/api/files/save', (req, res) => {
    let path = ""
    const reqPath = req.body.filePath;
    if(reqPath === ""){
      path = __dirname + "/candidates";
    }else{
      path = reqPath;
    }
    const content = req.body.content;
    const err = fs.writeFileSync(path, content);
    if (!err) {
      res.json({
        success: 1,
        message: "File saved!"
      })
    }
  })
  var port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log('App listening to http://127.0.0.1:' + port);
  });
}
startServer();

