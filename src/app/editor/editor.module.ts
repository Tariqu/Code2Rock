import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// material Design
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { TerminalComponent } from './terminal/terminal.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';


@NgModule({
  declarations: [EditorComponent, TerminalComponent, FileExplorerComponent, AceEditorComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    MatListModule,
    MatIconModule
  ]
})
export class EditorModule { }
