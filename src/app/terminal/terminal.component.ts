import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  private term = new Terminal({
    cols: 100,
    rows: 10,
    cursorBlink: true
  });
  private socketURL = 'ws://localhost:3000/terminals/';
  private socket;
  private fitAddon: FitAddon;
  @ViewChild('myTerminal', { static: false }) terminalContainer: ElementRef;

  constructor() { }
  ngOnInit() {
    this.fitAddon = new FitAddon();
    setTimeout(() => {
      this.updateTerminalSize();
      console.log(this.term.cols)
      fetch('http://127.0.0.1:3000/terminals?cols=' + 100 + '&rows=' + 10, { method: 'POST' }).then((res) => {
        res.text().then((processId) => {
          this.socketURL += processId;
          this.socket = new WebSocket(this.socketURL);
          this.socket.onopen = this.runRealTerminal();
          this.socket.onmessage = (event) => {
            console.log(event.data);
          };
        });
      });
    }, 0);
  }
  ngAfterViewInit() {
    this.term.open(this.terminalContainer.nativeElement);
  }
  updateTerminalSize(): void {
    console.log("Update terminal...");
    const cols = 100;
    const rows = 10;
    const width = cols.toString() + 'px';
    const height = rows.toString() + 'px';
    this.terminalContainer.nativeElement.style.width = width;
    this.terminalContainer.nativeElement.style.height = height;
    this.fitAddon.fit();
  }
  runRealTerminal(): void {
    this.term.loadAddon(new AttachAddon(this.socket));
  }
}
