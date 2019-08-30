import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  private fileSocketURL = 'ws://localhost:3000/api/files';
  private fileSocket;
  files = [];

  constructor(private httpService: SharedService) {
  }

  ngOnInit() {
    this.getdir({ filePath: "" });
  }

  getdir(data: any) {
    this.httpService.getDir(data).subscribe(result => {
      this.files = [...this.mapData(result.data)]
    })
  }

  mapData(files: any) {
    files.forEach(obj => {
      obj.showchild = false;
    });
    return files;
  }

  getFileData(file: string) {
    this.httpService.getDir({ filePath: file['path'] + '/' + file['filename'] }).subscribe(result => {
      if (result.data.length && result.data[0].content) {
        file["content"] = result.data[0].content;
        let editorData = {
          file: file,
          content: result.data[0].content
        }
        this.httpService.setEditorData(editorData);
      } else {
        file["children"] = [...this.mapData(result.data)];
      }
    })
  }
}
