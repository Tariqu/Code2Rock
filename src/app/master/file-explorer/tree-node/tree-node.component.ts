import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
  @Input() files = [];

  constructor(private httpService: SharedService) {
  }

  ngOnInit() {
  }

  mapData(files: any) {
    files.forEach(obj => {
      obj.showchild = false;
    });
    return files;
  }

  getFileData(file: string) {
    this.httpService.getDir({ filePath: file['path'] + '/' + file['filename'] }).subscribe(result => {
      if (result.data.length && result.data[0].hasOwnProperty("content")) {
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
