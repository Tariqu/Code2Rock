import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editorOptions;
  code: string;
  languageExtension = [{
    langExt: ".js",
    langName: "javascript"
  },
  {
    langExt: ".json",
    langName: "json"
  },
  {
    langExt: ".ts",
    langName: "typescript"
  }]

  private codeEditorModelChanged: Subject<string> = new Subject<string>();
  private codeEditorSubscription: Subscription;
  @Input() file;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    let language = this.languageExtension.find(obj => obj.langExt == this.file.file.fileType);
    this.editorOptions = { theme: 'vs-light', language: language ? language.langName : 'text' };
    this.codeEditorSubscription = this.codeEditorModelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(newCode => {
        this.saveFileApi(newCode);
      });
  }

  saveFileApi(newCode: string) {
    let bodyData = {
      filePath: this.file.file.path,
      content: newCode
    }
    this.sharedService.saveFile(bodyData).subscribe(result => {
      console.log(result)
    })
  }

  ngOnDestroy() {
    this.codeEditorSubscription.unsubscribe();
  }
}
