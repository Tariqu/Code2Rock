import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  private fileSocketURL = 'ws://localhost:3000/api/files';
  private fileSocket;
  files = [];
  constructor() { }

  ngOnInit() {
    this.files = [];
    this.fileSocket = new WebSocket(this.fileSocketURL);
    this.fileSocket.bufferType = "arraybuffer";
    this.fileSocket.onopen = ()=>{
      console.log("file system connected to file...");
    };
    this.fileSocket.onmessage = (event)=>{
      console.log(event.data);
      this.files.push(event.data);
    }
  }

}
