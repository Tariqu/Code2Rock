import { Component, OnInit } from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements OnInit {
  editorOptions = { theme: 'vs-light', language: 'javascript' };
  code: string;
  options = {
    theme: 'vs-light'
  };

  constructor(private sharedService: SharedService) {
    this.sharedService.getEditorData().subscribe(result => {
      this.code = result;
    })
  }

  ngOnInit() {
  }

}
