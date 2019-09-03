import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  files = [];
  selectedFileIndex: number = 0;

  constructor(private httpService: SharedService) {
  }

  ngOnInit() {
    this.httpService.socket.on("connect", () => {
      this.getdir({ filePath: "" });
    });
    this.httpService.socket.on("fileUpdate", (data) => {
      if (data) {
        this.getdir({ filePath: "" });
      }
    })
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

  getFileData(file: string, fileIndex: number) {
    this.selectedFileIndex = fileIndex;
    this.httpService.getDir({ filePath: file['path'] + '/' + file['filename'] }).subscribe(result => {
      if (result.data.length && result.data[0].hasOwnProperty("content")) {
        file["content"] = result.data[0].content;
        let editorData = {
          file: result.data[0],
          content: result.data[0].content
        }
        this.httpService.setEditorData(editorData);
      } else {
        file["children"] = [...this.mapData(result.data)];
      }
    })
  }
}
