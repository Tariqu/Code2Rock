import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public socket = io('http://localhost:3000');
  private editorData = new Subject<any>();

  constructor(private http: HttpClient) { }

  getDir(bodyData: any): Observable<any> {
    return this.http.post<any>("http://localhost:3000/api/files/", bodyData);
  }

  saveFile(bodyData: any): Observable<any> {
    return this.http.post<any>("http://localhost:3000/api/files/save", bodyData);
  }

  setEditorData(data: any) {
    this.editorData.next(data);
  }

  getEditorData(): Observable<any> {
    return this.editorData.asObservable();
  }
}
