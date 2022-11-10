import { Injectable, EventEmitter } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { environment } from "../../environments/environment.prod";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Diagram } from '../models/datos.model';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  private url = environment.baseURL;

  diagramEvent = new EventEmitter<Array<any>>();

  constructor(
    private wsService: WebSocketService,
    private http: HttpClient
  ) { }

  sendData(data: any){
    this.wsService.emit('emite-datos', data);
  }

  getData(){
    return this.wsService.listen('obtiene-datos');
  }

  saveDiagram(coord: string){
    const diagram: Diagram = {
      diagram: coord
    }
    return this.http.post(`${this.url}/api/saveDiagram`, diagram);
  }

  getDiagrams(){
    return this.http.get(`${this.url}/api/diagram`);
  }
}
