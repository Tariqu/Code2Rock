import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Terminal } from 'xterm'
import io from 'socket.io-client';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  private socket = io('http://localhost:3000');
  private term = new Terminal({
    cols: 100,
    rows: 10,
    cursorBlink: true
  });
  @ViewChild('myTerminal', { static: false }) terminalContainer: ElementRef;

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.term.open(this.terminalContainer.nativeElement);
    this.runFakeTerminal();
    this.socket.on("connect", () => {
      console.log("Connected...");
    })
    this.socket.on("message", (data) => {
      this.term.write(data);
    })
  }
  runFakeTerminal(): void {
    this.term.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.keyCode === 13) {
        this.socket.emit("clientEnter", "\r");
      } else if (ev.keyCode === 8) {
        this.socket.emit("clientEnter", "\b \b");
      } else if (printable) {
        this.socket.emit("clientEnter", e.key);
      }
    });
  }
}