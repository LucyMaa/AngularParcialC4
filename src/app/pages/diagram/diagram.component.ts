import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DiagramService } from "../../services/diagram.service";
import * as go from "gojs";
import { Subscription } from 'rxjs';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export default class DiagramComponent implements OnInit {

  public diagram: go.Diagram = new go.Diagram();
  public palette: go.Palette = new go.Palette();

  @Input()
  public model: go.Model;

  dataSubscription: Subscription;

  @HostListener('document:click', ['$event'])
  onClick(e: any){
    this.sendData();
  }

  constructor(
    public diagramServices: DiagramService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.iniciar();
    this.getData();
    //this.getDiagrams();
  }

  ngAfterViewInit(): void {
  }

  iniciar(){
    this.diagram = $(go.Diagram, "diagramDiv",
    {
      grid: $(go.Panel, "Grid",
          $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
          $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
      ),
      "draggingTool.dragsLink": true,
      "draggingTool.isGridSnapEnabled": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,
      "relinkingTool.fromHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
      "relinkingTool.toHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
      "linkReshapingTool.handleArchetype":
        $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
      "rotatingTool.handleAngle": 270,
      "rotatingTool.handleDistance": 30,
      "rotatingTool.snapAngleMultiple": 15,
      "rotatingTool.snapAngleEpsilon": 15,
      "undoManager.isEnabled": true
    });

    var nodeSelectionAdornmentTemplate =
    $(go.Adornment, "Auto",
      $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
      $(go.Placeholder)
    );

    var nodeResizeAdornmentTemplate =
      $(go.Adornment, "Spot",
        { locationSpot: go.Spot.Right },
        $(go.Placeholder),
        $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
      );

    var nodeRotateAdornmentTemplate =
      $(go.Adornment,
        { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
        $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
        $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
      );

    this.diagram.nodeTemplate = $(go.Node, "Spot",
      { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
          new go.Binding("angle").makeTwoWay(),
          // the main object is a Panel that surrounds a TextBlock with a Shape
          $(go.Panel, "Auto",
            { name: "PANEL" },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            $(go.Shape, "Rectangle",  // default figure
              {
                portId: "", // the default port: if no spot on link data, use closest side
                fromLinkable: true, toLinkable: true, cursor: "pointer",
                fill: "white",  // default color
                strokeWidth: 2
              },
              new go.Binding("figure"),
              new go.Binding("fill")),
            $(go.TextBlock,
              {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          { // handle mouse enter/leave events to show/hide the ports
            mouseEnter: function(e, node) { showSmallPorts(node, true); },
            mouseLeave: function(e, node) { showSmallPorts(node, false); }
          });

          function showSmallPorts(node: any, show: any) {
            node.ports.each(function(port: any) {
              if (port.portId !== "") {  // don't change the default port, which is the big shape
                port.fill = show ? "rgba(0,0,0,.3)" : null;
              }
            });
          }

          var linkSelectionAdornmentTemplate =
          $(go.Adornment, "Link",
            $(go.Shape,
              // isPanelMain declares that this Shape shares the Link.geometry
              { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
          );

    this.diagram.linkTemplate =
          $(go.Link,  // the whole link panel
            { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
            { relinkableFrom: true, relinkableTo: true, reshapable: true },
            {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5,
              toShortLength: 4
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the link path shape
              { isPanelMain: true, strokeWidth: 2 }),
            $(go.Shape,  // the arrowhead
              { toArrow: "Standard", stroke: null }),
            $(go.Panel, "Auto",
              new go.Binding("visible", "isSelected").ofObject(),
              $(go.Shape, "RoundedRectangle",  // the link shape
                { fill: "#F8F8F8", stroke: null }),
              $(go.TextBlock,
                {
                  textAlign: "center",
                  font: "10pt helvetica, arial, sans-serif",
                  stroke: "#919191",
                  margin: 2,
                  minSize: new go.Size(10, NaN),
                  editable: true
                },
                new go.Binding("text").makeTwoWay())
            )
          );

    this.palette = $(go.Palette, "paletteDiv",
    {
      maxSelectionCount: 1,
      nodeTemplateMap: this.diagram.nodeTemplateMap,  // share the templates used by myDiagram
      linkTemplate: // simplify the link template, just in this Palette
        $(go.Link,
          { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
            // to line up the Link in the same manner we have to pretend the Link has the same location spot
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate:
              $(go.Adornment, "Link",
                { locationSpot: go.Spot.Center },
                $(go.Shape,
                  { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                $(go.Shape,  // the arrowhead
                  { toArrow: "Standard", stroke: null })
              )
          },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding("points"),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null })
        ),
      model: new go.GraphLinksModel([  // specify the contents of the Palette
        { text: "User", figure: "Ellipse", "size":"80 70", fill: "#00AD5F" },
        { text: "API", figure: "Actor", fill: "#00AD5F" },
        { text: "Container", figure: "Border", fill: " #4b6be1 " },
        { text: "DataBase", figure: "Database", "size":"90 80", fill: "#ff9517 " },
        { text: "Comentario", figure: "RoundedRectangle","size":"115 50", fill: "lightyellow" },
        { text: "Modelo", figure: "Border","size":"115 50", fill: "lightyellow" }

      ], [
          // the Palette also has a disconnected Link, which the user can drag-and-drop
          //{ points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
        ])
    });
  }

  save(){
    this.saveDiagramProperties();
    console.log(this.diagram.model.toJson());
    this.diagram.isModified = false;

  }

  load(diagramData: any){
    //console.log('recargar diagrama');
    //console.log(this.diagram.model.toJson());
    this.diagram.model = go.Model.fromJson(diagramData);
    this.diagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
    this.loadDiagramProperties();

  }

  saveDiagramProperties(){
    this.diagram.model.modelData.position = go.Point.stringify(this.diagram.position);
  }

  loadDiagramProperties(){
    var pos = this.diagram.model.modelData.position;
    if(pos){
      this.diagram.initialPosition = go.Point.parse(pos);
    }
  }

  //hacemos uso de los sockets para enviar y recibir datos
  sendData(){
    this.diagramServices.sendData(this.diagram.model.toJson());
    //console.log(this.save())
  }

  getData(){
    this.dataSubscription = this.diagramServices.getData().subscribe(data => {
      this.load(data);
    });
  }

  guardarDiagram(){
    const coorDiagram = JSON.stringify(this.diagram.model.toJson());
    this.diagramServices.saveDiagram(coorDiagram).subscribe((res: any) => {
      this.toast.success('Guardado con exito!');
    });
    //localStorage.setItem('datos', JSON.stringify(this.diagram.model.toJson()));
  }


}
