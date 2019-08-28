var express = require('express');
var expressWs = require('express-ws');
var pty = require('node-pty');
const cors = require("cors");
const fs = require('fs');
const chokidar = require('chokidar');
/**
 * Whether to use UTF8 binary transport.
 * (Must also be switched in client.ts)
 */
const USE_BINARY_UTF8 = false;

const watcher = chokidar.watch('.', {
  ignored: /(^|[\/\\])\../,
  persistent: true
})
// Add event listeners.
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
function startServer() {
  var app = express();
  expressWs(app);

  var terminals = {},
      logs = {};
  app.use(cors());
  app.use(express.json());
  app.post('/terminals', function (req, res) {
    const env = Object.assign({}, process.env);
    env['COLORTERM'] = 'truecolor';
    var cols = parseInt(req.query.cols),
        rows = parseInt(req.query.rows),
        term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
          name: 'xterm-256color',
          cols: cols || 80,
          rows: rows || 24,
          cwd: env.PWD,
          env: env,
          encoding: USE_BINARY_UTF8 ? null : 'utf8'
        });

    console.log('Created terminal with PID: ' + term.pid);
    terminals[term.pid] = term;
    logs[term.pid] = '';
    term.on('data', function(data) {
      logs[term.pid] += data;
    });
    res.send(term.pid.toString());
    res.end();
  });

  app.post('/terminals/:pid/size', function (req, res) {
    var pid = parseInt(req.params.pid),
        cols = parseInt(req.query.cols),
        rows = parseInt(req.query.rows),
        term = terminals[pid];

    term.resize(cols, rows);
    console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
    res.end();
  });

  app.ws('/terminals/:pid', function (ws, req) {
    var term = terminals[parseInt(req.params.pid)];
    console.log('Connected to terminal ' + term.pid);
    ws.send(logs[term.pid]);
    // string message buffering
    function buffer(socket, timeout) {
      let s = '';
      let sender = null;
      return (data) => {
        s += data;
        if (!sender) {
          sender = setTimeout(() => {
            socket.send(s);
            s = '';
            sender = null;
          }, timeout);
        }
      };
    }
    // binary message buffering
    function bufferUtf8(socket, timeout) {
      let buffer = [];
      let sender = null;
      let length = 0;
      return (data) => {
        buffer.push(data);
        length += data.length;
        if (!sender) {
          sender = setTimeout(() => {
            socket.send(Buffer.concat(buffer, length));
            buffer = [];
            sender = null;
            length = 0;
          }, timeout);
        }
      };
    }
    const send = USE_BINARY_UTF8 ? bufferUtf8(ws, 5) : buffer(ws, 5);

    term.on('data', function(data) {
      try {
        send(data);
      } catch (ex) {
        // The WebSocket is not open, ignore
      }
    });
    ws.on('message', function(msg) {
      term.write(msg);
    });
    ws.on('close', function () {
      term.kill();
      console.log('Closed terminal ' + term.pid);
      // Clean things up
      delete terminals[term.pid];
      delete logs[term.pid];
    });
  });
  app.post("/api/files",(req,res)=>{
    let sendArray = []
    const path =  "\\"+req.body.folderName;
    console.log(__dirname.toString()+path);
    const completePath = __dirname.toString()+path+"\\";
    let oldFiles = fs.readdirSync(completePath);
    oldFiles.forEach(file=>{
      try{
        let stat = fs.lstatSync(completePath+file);
        sendArray.push({filename:file,path:path,isDir:stat.isDirectory()});
      }catch(e){}
    
      
    })
    res.json({
      success:1,
      data:sendArray
    })
  })
  app.ws("/api/files",(ws, req)=>{
    
  watcher
  .on('add', path => ws.send("add:"+path))
  .on('change', path => ws.send("change:"+path))
  .on('unlink', path => ws.send("unlink:"+path))
  .on('addDir', path => ws.send("addDir:"+path))
  .on('unlinkDir', path => ws.send("unlinkDir:"+path));
    // setInterval(()=>{
    //    let newFiles = fs.readdirSync(__dirname);
    //    if(!oldFiles.equals(newFiles)){
    //     newFiles.forEach(file=>{
    //       ws.send(file);
    //     })
    //     oldFiles = newFiles;
    //    }
    // },1000);
  })
  var port = process.env.PORT || 3000;

  app.listen(port,()=>{
    console.log('App listening to http://127.0.0.1:' + port);
  });
}
startServer();
