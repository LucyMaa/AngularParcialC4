import { Component, OnInit } from '@angular/core';
import { DiagramService } from '../../services/diagram.service';
import DiagramComponent from '../diagram/diagram.component';

@Component({
  selector: 'app-load-diagram',
  templateUrl: './load-diagram.component.html',
  styleUrls: ['./load-diagram.component.css']
})
export class LoadDiagramComponent implements OnInit {

  coordenadas: any[] = [];

  constructor(
    private diagramServices: DiagramService,
    private diagram: DiagramComponent
  ) { }

  ngOnInit(): void {
    this.getDiagrams();
  }
  getDiagrams(){
    this.diagramServices.getDiagrams().subscribe((res: any) => {
      this.coordenadas = res;
      console.log(res);
    });
  }

  loadDiagram(i: number){
    const coor = this.coordenadas[i].diagram;
    const pintar = JSON.parse(coor);
    this.diagram.load(pintar);
  }



}
