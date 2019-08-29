import { Component, OnInit } from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements OnInit {
  editorOptions = { theme: 'vs-light', language: 'javascript' };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  options = {
    theme: 'vs-light'
  };

  constructor() { }

  ngOnInit() {
  }

}
