import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-editor-pannel',
  templateUrl: './editor-pannel.component.html',
  styleUrls: ['./editor-pannel.component.scss']
})
export class EditorPannelComponent implements OnInit {
  tabsArray = [];
  selectedTab: number = 0;

  constructor(private sharedService: SharedService) {
    this.sharedService.getEditorData().subscribe(result => {
      if (!this.tabsArray.some(e => e.file.filename === result.file.filename)) {
        this.tabsArray.push(result);
        this.selectedTab = this.tabsArray.length - 1;
      } else {
        this.selectedTab = this.tabsArray.findIndex(obj => obj.file.filename === result.file.filename)
      }
    })
  }

  ngOnInit() {
  }

  closeTab(tabIndex: number) {
    this.tabsArray.splice(tabIndex, 1);
  }
}
