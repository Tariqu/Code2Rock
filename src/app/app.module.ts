import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MasterComponent } from './master/master.component';
import { MatListModule, MatIconModule, MatToolbarModule, MatTreeModule, MatButtonModule, MatTabsModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { FileExplorerComponent } from './master/file-explorer/file-explorer.component';
import { TerminalComponent } from './master/terminal/terminal.component';
import { HttpClientModule } from '@angular/common/http';
import { TreeNodeComponent } from './master/file-explorer/tree-node/tree-node.component';
import { EditorPannelComponent } from './master/editor-pannel/editor-pannel.component';
import { EditorComponent } from './master/editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    MasterComponent,
    FileExplorerComponent,
    TerminalComponent,
    HeaderComponent,
    TreeNodeComponent,
    EditorPannelComponent,
    EditorComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatButtonModule,
    MatTabsModule,
    MonacoEditorModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
