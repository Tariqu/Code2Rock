import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MasterComponent } from './master/master.component';
import { MatListModule, MatIconModule, MatToolbarModule, MatTreeModule, MatButtonModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { FileExplorerComponent } from './master/file-explorer/file-explorer.component';
import { AceEditorComponent } from './master/ace-editor/ace-editor.component';
import { TerminalComponent } from './master/terminal/terminal.component';
import { HttpClientModule } from '@angular/common/http';

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
    MonacoEditorModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
