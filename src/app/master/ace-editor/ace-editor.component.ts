import { Component, OnInit } from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';

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
  file;
  subscriptions: Subscription = new Subscription();

  constructor(private sharedService: SharedService) {
    this.sharedService.getEditorData().subscribe(result => {
      console.log(result)
      this.code = result.content;
      this.file = result.file;
    })
  }

  ngOnInit() {

  }

  saveFile() {
    this.subscriptions.unsubscribe();
    setTimeout(() => {
      this.saveFileApi();
    }, 2000);
  }

  saveFileApi() {
    let bodyData = {
      filePath: this.file.path + '/' + this.file.filename,
      content: this.code
    }
    console.log(bodyData)
    this.subscriptions.add(
      this.sharedService.saveFile(bodyData).subscribe(result => {
        console.log(result)
      })
    )
  }
}
