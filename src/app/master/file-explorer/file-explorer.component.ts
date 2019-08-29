import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FoodNode, ExampleFlatNode } from 'src/app/shared/models/file_tree';
import { SharedService } from 'src/app/shared/services/shared.service';


const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops' },
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussel sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
        ]
      },
    ]
  },
];



@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  private fileSocketURL = 'ws://localhost:3000/api/files';
  private fileSocket;
  files = [];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private httpService: SharedService) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    this.getdir({ filePath: "" });
    // this.files = ["asas", "asasa", "asas", "asasa", "asas", "asasa"];
    // this.fileSocket = new WebSocket(this.fileSocketURL);
    // this.fileSocket.bufferType = "arraybuffer";
    // this.fileSocket.onopen = () => {
    //   console.log("file system connected to file...");
    // };
    // this.fileSocket.onmessage = (event) => {
    //   console.log(event.data);
    //   this.files.push(event.data);
    // }
  }

  getdir(data: any) {
    this.httpService.getDir(data).subscribe(result => {
      console.log(result)
      this.files = [...result.data]
    })
  }

  getFileData(file: string) {
    this.httpService.getDir({ filePath: file['path'] + '/' + file['filename'] }).subscribe(result => {
      console.log(result)
      if (result.data[0].content)
        this.httpService.setEditorData(result.data[0].content);
    })
  }
}
