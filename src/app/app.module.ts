import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MasterComponent } from './master/master.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { TerminalComponent } from './terminal/terminal.component';
import { MatListModule, MatIconModule, MatToolbarModule, MatTreeModule, MatButtonModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    MasterComponent,
    FileExplorerComponent,
    AceEditorComponent,
    TerminalComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatButtonModule,
    MonacoEditorModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
