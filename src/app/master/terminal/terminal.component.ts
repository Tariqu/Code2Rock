import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Terminal } from 'xterm'
import { SharedService } from 'src/app/shared/services/shared.service';

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
  @ViewChild('myTerminal', { static: false }) terminalContainer: ElementRef;

  constructor(private sharedService: SharedService) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.term.open(this.terminalContainer.nativeElement);
    this.runFakeTerminal();
    this.sharedService.socket.on("connect", () => {
      console.log("Connected...");
    })
    this.sharedService.socket.on("message", (data) => {
      this.term.write(data);
    })
  }
  runFakeTerminal(): void {
    this.term.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.ctrlKey && ev.keyCode === 90) {
        console.log("ctrl + z is pressed...");
      } else if (ev.keyCode === 13) {
        this.sharedService.socket.emit("clientEnter", "\r");
      } else if (ev.keyCode === 8) {
        this.sharedService.socket.emit("clientEnter", "\b \b");
      } else if (printable) {
        this.sharedService.socket.emit("clientEnter", e.key);
      }
    });
  }
}