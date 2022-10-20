import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import "leaflet";
import leafletImage from "leaflet-image";
import { GeoColService } from "./geocol.service";
import { Tile, tiles } from "./tiles.data";
import "leaflet-draw";
import "@geoman-io/leaflet-geoman-free";
import { animate, style, transition, trigger } from "@angular/animations";
import * as parse_georaster from "georaster";
import "georaster-layer-for-leaflet";
import "proj4leaflet";
// import {MediaObserver} from '@angular/flex-layout';

import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
  HttpResponseBase,
} from "@angular/common/http";
import { MapService } from "./map.services";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { saveAs } from "file-saver";
import { DomElementSchemaRegistry } from "@angular/compiler";
import "../../../../node_modules/leaflet.browser.print/dist/leaflet.browser.print.min.js";

import { canvas } from "leaflet";
import { StringMapWithRename } from "@angular/compiler/src/compiler_facade_interface";
import { center } from "@turf/turf";
import {
  ActivatedRoute,
  ChildActivationEnd,
  NavigationEnd,
  NavigationStart,
  Router,
  UrlSegment,
} from "@angular/router";
import { ElementScrollController } from "@fullcalendar/core";
import { filter, take, tap } from "rxjs/operators";
import * as XLSX from "xlsx";
import { AuthenticationService } from "src/app/main/auth.service";
import { AccountService } from "src/app/account/auth/account.service";
import { resolve } from "path";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var browserPrint: any;
declare const L;
declare const pm;
declare const Proj;
const iconRetinaUrl = "assets/marker-icon-2x.png";
const iconUrl = "assets/marker-icon.png";
const shadowUrl = "assets/marker-shadow.png";
declare const GeoRasterLayer;
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: "app-geoportail",
  templateUrl: "./geoportail.component.html",
  styleUrls: ["./geoportail.component.scss"],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0)  translateX(-50%)" }),
        animate(
          "500ms",
          style({ transform: "scale(1) translateX(-50%)", opacity: 1 })
        ),
      ]),
      transition(":leave", [
        style({ transform: "scale(1) translateX(-50%)", opacity: 1 }),
        animate(
          "500ms",
          style({ transform: "scale(0) translateX(-50%)", opacity: 0 })
        ),
      ]),
    ]),
    trigger("appear", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(90%)" }),
        animate("300ms", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate("300ms", style({ opacity: 0, transform: "translateX(90%)" })),
      ]),
    ]),
  ],
})
export class GeoportailComponent implements OnInit {
  map: any;
  tilesArray: Tile[] = tiles;
  choosenTile: Tile;
  tileLayer: any;
  urbaDocument: { nom: string; reference: string; localite: string } = null;
  typeTiff: string = "Ortho Photo";
  urbanismeForm: FormGroup;
  logosForm: FormGroup;
  isClient:boolean=false;
  loading: boolean = false;
  geoJSON: any;
  area: string = "";
  distance: number = 0;
  showLayers = false;
  showTiles = false;
  currentlyAdmin = false;
  drawnLayer: any;
  layerArray: any[] = [];
  allLayers = [];
  crs: any;
  isGeoIns: boolean = false;
  private drawnItems = new L.FeatureGroup();
  screenshotter: any;
  showed_hidden_layers: any = [];
  private drawControl;
  intersections: any[];
  scale: any;
  minimizedIntersections: any[] = [];
  @ViewChild("map") mapElementf: ElementRef;
  geotiff_form: FormGroup;
  @Output() doneDrawing: EventEmitter<any> = new EventEmitter<any>();
  @Output() notAthenticated:EventEmitter<boolean>=new EventEmitter<boolean>();
  coordsForm: FormGroup;
  projects=[];
  showProjects=false;
  permited:boolean=false;
  screenSize:string;
  allowResponsible:boolean=false;
  urbaDocuments=[];
  initializationPhase:boolean=false;
  constructor(
    private modalService: NgbModal,
    private geoColService: GeoColService,
    private mapService: MapService,
    private elByClassName: ElementRef,
    private http: HttpClient,
    private route: Router,
    private active: ActivatedRoute,
    private fb: FormBuilder,
    private lambdaAuthService:AuthenticationService,
    private accountService:AccountService,
    // private mediaObserver: MediaObserver
  ) {}
  ngOnInit(): void {

    // this.mediaObserver.asObservable().subscribe((data:any)=>{
    //   console.log("This is the size of screen : ",data.mqAlias);
    // })
    this.accountService.connectedRole.subscribe(role=>{

      if(role==='Admin'){
        this.permited=true;
      }
      else{
        this.permited=false;
        if(role==='Responsable') this.allowResponsible=true;

      }
    });

    this.choosenTile = this.tilesArray[4];
    this.initForms();
    this.route.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        console.log(event.url);
      }
    });
    if (this.route.url == "/admin/map") {
      this.currentlyAdmin = true;
    }
    else if(this.route.url=="/main/landingPage"){
      this.isClient=true;
    }

    // this.generatePdf();
  }
  generatePdf(imageSrc, logosArray, lambertCoordinates) {
    const legend = [];
    const elements: any = { zones: [], equipements: [], voirie: [] };
    const lambCoords = [
      [
        {
          text: "X",
          fillColor: "#556ee6",
          color: "white",
          alignment: "center",
        },
        {
          text: "Y",
          fillColor: "#556ee6",
          color: "white",
          alignment: "center",
        },
      ],
    ];
    for (let el of lambertCoordinates) {
      let temp: any = [
        {
          text: el[0],
          margin: [0, 10, 0, 0],
          alignment: "center",
          fontSize: 12,
          color: "#556ee6",
        },
        {
          text: el[1],
          margin: [0, 10, 0, 0],
          alignment: "center",
          fontSize: 12,
          color: "#556ee6",
        },
      ];
      lambCoords.push(temp);
    }
    let me = this;
    this.minimizedIntersections.forEach((element) => {
      if (element.className.includes("ZONE")) {
        if (elements.zones.length === 0) {
          elements.zones.push([
            {
              text: "Désignation",
              fillColor: "#556ee6",
              color: "white",
              alignment: "center",
            },
            {
              text: "Surface",
              fillColor: "#556ee6",
              color: "white",
              alignment: "center",
            },
          ]);
        }
        elements.zones.push([
          {
            text: element.className,
            margin: [0, 10, 0, 0],
            alignment: "center",
            fontSize: 12,
            color: "#556ee6",
          },
          {
            text: `${element.area} m²`,
            margin: [0, 10, 0, 0],
            alignment: "center",
            fontSize: 12,
            color: "#556ee6",
          },
        ]);
      } else if (element.className.includes("VOIE")) {
        if (elements.voirie.length === 0) {
          elements.voirie.push([
            {
              text: "Désignation",
              fillColor: "#556ee6",
              color: "white",
              alignment: "center",
            },
            {
              text: "Surface",
              fillColor: "#556ee6",
              color: "white",
              alignment: "center",
            },
          ]);
        }
        elements.voirie.push([
          {
            text: element.className,
            margin: [0, 10, 0, 0],
            alignment: "center",
            fontSize: 12,
            color: "#556ee6",
          },
          {
            text: `${element.area} m²`,
            margin: [0, 10, 0, 0],
            alignment: "center",
            fontSize: 12,
            color: "#556ee6",
          },
        ]);
      } else {
        if (elements.equipements.length === 0) {
          elements.equipements.push([
            {
              text: "Désignation",
              fillColor: "#556ee6",
              color: "white",
              alignment: "center",
            },
            {
              text: "Surface",
              fillColor: "#556ee6",
              color: "white",
              alignment: "center",
            },
          ]);
        }
        elements.equipements.push([
          {
            text: element.className,
            margin: [0, 10, 0, 0],
            alignment: "center",
            fontSize: 12,
            color: "#556ee6",
          },
          {
            text: `${element.area} m²`,
            margin: [0, 10, 0, 0],
            alignment: "center",
            fontSize: 12,
            color: "#556ee6",
          },
        ]);
      }
    });
    if (this.minimizedIntersections.length <= 16) {
      this.minimizedIntersections.forEach((elem) => {
        legend.push({
          columns: [
            {
              text: "    ",
              width: 30,
              height: 7,
              background: elem.color,
              fontSize: 12,
              margin: [10, 14, 0, 0],
            },
            {
              text: elem.className,
              fontSize: 7,
              margin: [0, 16, 0, 0],
            },
          ],
          columnGap: 2,
        });
      });
    } else {
    }

    const currentScaale = this.getRoundedNumber(this.getCurrentScale());
    let logo = document.createElement("img");
    logo.src = logosArray[0];
    console.log("this si the image link : ",imageSrc);
    const documentDefinition = {
      content: [
        {
          columns: [
            {
              image: "logo1",
              width: 30,
            },
            {
              stack: [
                {
                  text: "Royaume du Maroc",
                  alignment: "center",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: "Ministère de l'Aménagement du Territoire Nationale de l'Urbanisme et l'Habitat et de la Politique de la Ville",
                  alignment: "center",
                  fontSize: 9,
                  bold: true,
                  margin: [0, 10, 0, 0],
                },
                {
                  text: "Agence Urbaine d'Al Hoceima",
                  alignment: "center",
                  fontSize: 9,
                  bold: true,
                  margin: [0, 10, 0, 0],
                },
              ],
            },
            {
              image: "logo2",
              width: 37,
              margin: [0, 5, 0, 0],
            },
          ],
          columnGap: 100,
        },
        {
          text: "NOTE DE RENSEIGNEMENT INDICATIVE",
          fontSize: 16,
          alignment: "center",
          margin: [0, 20, 0, 10],
        },
        {
          columns: [
            {
              stack: [
                {
                  image: imageSrc,
                  width: 350,
                  height: 230,
                  margin: [0, 20, 0, 0],
                },
                {
                  text: `Situation administrative : ${me.urbaDocument.localite}`,
                  fontSize: 14,
                  margin: [0, 20, 0, 0],
                },
                {
                  text: `Référence réglementaire : ${me.urbaDocument.reference}`,
                  fontSize: 14,
                  margin: [0, 5, 0, 0],
                },
                {
                  text: `Surface de la parcelle : ${me.getArea(
                    me.drawnLayer
                  )} m²`,
                  fontSize: 14,
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  image: "nord",
                  width: 30,
                  margin: [55, 30, 0, 0],
                },
                {
                  text: `Echelle : 1:${currentScaale} `,
                  fontSize: 13,
                  alignment: "center",
                  width: "*",
                  bold: true,
                  margin: [-215, 20, 0, 0],
                },
                {
                  stack: legend,
                },
              ],
            },
          ],
          columnGap: 30,
        },

        {
          text: "Cordoonées lamberts de la parcelle",
          fontSize: 16,
          margin: [0, 15, 0, 0],
          color: "#556ee6",
          bold: true,
        },
        {
          layout: "noBorders", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["*", "*"],

            body: lambCoords,
          },
          margin: [0, 15, 0, 0],
        },
        {
          text: `${
            elements.equipements.length == 0
              ? ""
              : "Situation par rapport aux équipements"
          }`,
          fontSize: 16,
          margin: [0, 20, 0, 10],
          color: "#556ee6",
          bold: true,
        },
        {
          ...this.checkLength(elements.equipements),
        },
        {
          text: `${
            elements.voirie.length == 0 ? "" : "Situation par rapport aux voies"
          }`,
          fontSize: 16,
          margin: [0, 20, 0, 10],
          color: "#556ee6",
          bold: true,
        },
        {
          ...this.checkLength(elements.voirie),
        },
        {
          text: `${
            elements.zones.length == 0 ? "" : "Situation par rapport aux zones"
          }`,
          fontSize: 16,
          margin: [0, 20, 0, 10],
          color: "#556ee6",
          bold: true,
        },
        {
          ...this.checkLength(elements.zones),
        },
      ],
      images: {
        logo1: {
          url: logosArray[0],
        },
        logo2: {
          url: logosArray[1],
        },
        nord: {
          url: "https://bnimenlyoumbucket.s3.eu-west-3.amazonaws.com/nord-arrow.png",
        },
      },
    };
    this.loading = false;
    pdfMake.createPdf(documentDefinition).open()
  }
  getRoundedNumber(n: number) {
    let quotient;
    if (n >= 10 && n < 100) {
      quotient = Math.floor(n / 10);
      return quotient * 10;
    } else if (n >= 100 && n < 1000) {
      quotient = Math.floor(n / 100);
      return quotient * 100;
    } else {
      quotient = Math.floor(n / 1000);
      return quotient * 1000;
    }
  }
  getRawLatLng(latlngArray) {
    const result = [];
    for (let el of latlngArray) {
      result.push([el.lng, el.lat]);
    }
    return result;
  }
  checkLength(table) {
    if (table.length === 0) {
      return { text: "" };
    } else {
      return {
        layout: "noBorders", // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ["*", "*"],

          body: table,
        },
        margin: [0, 15, 0, 0],
      };
    }
  }
  toggleSubElements(index: number) {
    this.layerArray[index].showSub = !this.layerArray[index].showSub;
  }
  getArrowMargin(elem) {
    if (elem.showSub) {
      return "0";
    } else {
      return "-30rem";
    }
  }
  initForms() {
    this.urbanismeForm = new FormGroup({
      nom: new FormControl(""),
      referenceHomologation: new FormControl(""),
      type: new FormControl("PA"),
      localite: new FormControl(""),
      surface: new FormControl(""),
      file: new FormControl(),
    });
    this.logosForm = new FormGroup({
      ministreLogo: new FormControl(),
      communeLogo: new FormControl(),
      communeName: new FormControl(),
    });
    this.geotiff_form = new FormGroup({
      nom: new FormControl(),
      reference: new FormControl(),
      echelle: new FormControl(),
      date_de_prise_de_vue: new FormControl(),
      file: new FormControl(),
    });
    this.coordsForm = this.fb.group({
      lambertCoords: this.fb.array([
        this.newLambertCoords(),
        this.newLambertCoords(),
        this.newLambertCoords(),
      ]),
    });
  }
  lambertCoords(): FormArray {
    return this.coordsForm.get("lambertCoords") as FormArray;
  }
  newLambertCoords(): FormGroup {
    return this.fb.group({
      X: null,
      Y: null,
    });
  }
  addLambertCoords() {
    this.lambertCoords().push(this.newLambertCoords());
    console.log(this.lambertCoords);
  }
  removeLambertCoords(index: number) {
    this.lambertCoords().removeAt(index);
  }
  onSubmitLambertCoords() {
    let isAuthenticated;
    if(this.route.url==='/main/landingPage'){
      this.lambdaAuthService.user.pipe(take(1)).subscribe(user=>{
        if(user===null){
          this.notAthenticated.emit(false);
          isAuthenticated=false;
          return;
        }
        else{
          isAuthenticated=true;
        }
      }
      )
      if(!isAuthenticated){
        return;
      }
    }
    console.log(this.coordsForm.value);
    let formValues = this.coordsForm.value.lambertCoords;
    let coordsArray = [];
    for (let pair of formValues) {
      coordsArray.push([pair.X, pair.Y]);
    }

    this.geoColService.convertToWGS84(coordsArray).subscribe((data) => {
      this.modalService.dismissAll();
      let poly = L.polygon(data, { color: "blue" });
      this.processBeforeGPDF(poly, coordsArray);
      this.map.fitBounds(poly.getBounds());
    });
  }
  initTile() {
    if (!this.choosenTile.subdomains) {
      this.tileLayer = L.tileLayer(this.choosenTile.link, {
        maxZoom: this.choosenTile.maxZoom,
        continuousWorld: true,
      }).addTo(this.map);
      return;
    }
    this.tileLayer = L.tileLayer(this.choosenTile.link, {
      maxZoom: this.choosenTile.maxZoom,
      subdomains: this.choosenTile.subdomains,
      continuousWorld: true,
    }).addTo(this.map);
  }
  initMap() {
    // let scale=[10000000,5000000,3000000,1000000,500000,300000,100000,50000,30000,20000,10000,5000,3000,1000,500,300,100,50,30,20];
    // this.crs=new L.Proj.CRS("EPSG:26191","+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=-5.4 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs",{resolutions:scale,origin:[0,0]});
    this.map = L.map("map", {
      attributionControl: false,
      editable: true,
      printable: true,
      preferCanvas: true,
    }).setView([35.25128, -3.93556], 15);
    this.map.createPane("snapshot-pane");
    this.map.createPane("dont-include");
    this.scale = L.control.scale({ imperial: false, pane: "snapshot-pane" });
    this.scale.addTo(this.map);
  }
  saveImage() {
    return;
  }
  onUploadGeotiff(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.geotiff_form.get("file").setValue(file);
    }
  }
  initDraw() {
    this.map.addLayer(this.drawnItems);
    this.drawControl = new L.Control.Draw({
      //Hide the drawn toolbar, because my project does not need to be drawn manually
      draw: {
        circle: false,
        rectangle: false,
        circlemarker: false,
        polygon: {
          title: "Measure area",
        },
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: false,
      },
    });

    //hide edit handlers tip
    L.drawLocal.edit.handlers.edit.tooltip.text = null;
    L.drawLocal.edit.handlers.edit.tooltip.subtext = null;
    this.map.addControl(this.drawControl, { pane: "dont-include" });
    this.map["pm"]["addControls"]({
      position: "topright",
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: true,
      snappable: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
      drawMarker: false,
      pane: "dont-include",
    });
    this.map["pm"]["setGlobalOptions"]({
      snappable: false,
      tooltips: false,
      editable: false,
    });
  }
  getCurrentScale() {
    // Get the y,x dimensions of the map
    var y = this.map.getSize().y,
      x = this.map.getSize().x;
    // calculate the distance the one side of the map to the other using the haversine formula
    var maxMeters = this.map
      .containerPointToLatLng([0, y])
      .distanceTo(this.map.containerPointToLatLng([x, y]));
    // calculate how many meters each pixel represents
    var meterPerPixel = maxMeters / x;
    let currentScale = Math.floor(meterPerPixel * this.scale.options.maxWidth);
    return currentScale;
  }
  buildImage(logosArray, lambertCoords) {
    let me = this;
    let imageSource = "";
    leafletImage(this.map, function (err, canvas) {
      // now you have canvas
      // example thing to do with that canvas:
      var img = document.createElement("img");
      var dimensions = me.map.getSize();
      img.width = dimensions.x;
      img.height = dimensions.y;
      img.src = canvas.toDataURL("image/jpeg", 1.0);
      // saveAs(img.src,"image.png")
      imageSource = img.src;
      me.generatePdf(imageSource, logosArray, lambertCoords);
      // console.log(imageSource);
    });
  }
  async ngAfterViewInit() {
  // ngAfterViewInit() {
    this.initMap();
    if (this.route.url === "/admin/geo-ins/projets") this.isGeoIns = true;
    this.initTile();
    this.initDraw();
    // this.initPrint();

    let map = this.map;
    let me = this;
    this.map.on("pm:create", async (e) => {
      // this.map.on("pm:create",  (e) => {
      let isAuthenticated:boolean;

      if(this.route.url==='/main/landingPage'){
        this.lambdaAuthService.user.pipe(take(1)).subscribe(user=>{
          if(user===null){
            this.notAthenticated.emit(false);
            isAuthenticated=false;
            return;
          }
          else{
            isAuthenticated=true;
          }
        }
        )
        if(!isAuthenticated){
          this.map.removeLayer(e.layer);
          return;
        }
      }
      if (this.route.url != "/admin/geo-ins/projets") {
        // me.loading = true;
        let lambertCoordinates = [];
        me.map.removeLayer(e.layer);

        // console.log(this.getRawLatLng(e.layer.getLatLngs()));
        this.geoColService
          .convertCoords(this.getRawLatLng(e.layer.getLatLngs()[0]))
          .subscribe((results: any) => {
            lambertCoordinates = results.data;
          });
        me.drawnLayer = e.layer;
        me.intersections = [];
        me.minimizedIntersections = [];
        me.intersections = me.geoColService.getIntersections(
          e.layer.toGeoJSON(),
          me.layerArray
        );


        me.intersections.forEach((element) => {
          if (!me.map.hasLayer(element.layer)) {
            me.map.addLayer(element.layer);
          }
          if (me.minimizedIntersections.length === 0) {
            me.minimizedIntersections.push(element);
            return;
          }
          let searchedElement = me.minimizedIntersections.find(
            (el) => el.className === element.className
          );
          if (searchedElement == undefined || searchedElement == null) {
            me.minimizedIntersections.push(element);
          } else {
            me.minimizedIntersections[
              me.minimizedIntersections.indexOf(searchedElement)
            ].area += element.area;
          }
        });
        me.map.addLayer(e.layer);
        let logosArray = [];
        this.geoColService
          .getLogosByCommune("Ait Youssef Ou Ali")
          .subscribe((data: any[]) => {
            logosArray = data;
            me.buildImage(logosArray, lambertCoordinates);
          });
      } else {
        this.doneDrawing.emit(e.layer.toGeoJSON());
      }
    });
    this.map.on(L.Draw.Event.CREATED, function (e, area) {
      var type = e.layerType,
        layer = e.layer;
      me.map.addLayer(layer, { pane: "snapshot-pane" });

      if (type === "polygon") {
        var seeArea = L.GeometryUtil.geodesicArea(e.layer.getLatLngs()[0]);
        me.area = seeArea;
        // console.log(e.layer);
      } else if (type === "polyline") {
        var tempLatLng = null;
        var totalDistance = 0.0;
        let beforeConversion = 0.0;
        e.layer._latlngs.forEach((f) => {
          if (tempLatLng == null) {
            tempLatLng = f;
            return;
          }
          beforeConversion = +(tempLatLng.distanceTo(f) / 1000).toFixed(0);
          totalDistance += beforeConversion;
          tempLatLng = f;
        });
        me.distance = totalDistance;
      }
    });
    await this.fetchUrbaDocs();
    // this.fetchUrbaDocs();



    // this.getAllPorjects();
  }
  fetchGeotiffs(){
    this.geoColService.getAllGeotiffs().subscribe((data:any[])=>{
      this.loading=true;
      console.log("this is the result from fetching geotiffs : ",data);
      if(data.length===0) {
        this.loading=false;
        return;
      }
      this.initGeoTIFF(data);
    })
  }
  async fetchUrbaDocs(){
    // fetchUrbaDocs(){
    this.initializationPhase=true;
    this.loading=true;
    this.geoColService
    .getAllUrbanismeDocuments()
    .subscribe(async (data: any) => {
      // .subscribe((data: any) => {

      if(data==null || data==undefined || data.length==0){
        this.loading=false;
        return;

      }
      this.urbaDocuments=data;
      this.urbaDocument = {
        nom: data[0].nom,
        reference: data[0].referenceHomologation,
        localite: data[0].localite,
      };
      if (data.length === 0) this.loading = false;
      else {
        console.log("this is the urba : ",data[0]);
       await this.iterateAndFetch([data[0]]);
      // this.iterateAndFetch([data[0]]);


      }
    });
  }
  onChangeUrba(event:any){
    console.log(event);
    // let urbaHomologation=
    // this.iterateAndFetch([this.urbaDocuments.find(elm=>elm.refrenceHomologation===urbaHomologation)])
  }
  getArea(layer) {
    return L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
  }
  onScreen() {
    // this.buildImage();
  }
  switchTile(index: any) {
    this.map.removeLayer(this.tileLayer);
    this.choosenTile = this.tilesArray[index];
    this.initTile();
  }
  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }
  setGlobalView(){
    this.map.setZoom(13);
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.urbanismeForm.get("file").setValue(file);
    }
  }
  processBeforeGPDF(layer, lambertCoordinates) {
    this.drawnLayer = layer;
    this.intersections = [];
    this.minimizedIntersections = [];
    this.intersections = this.geoColService.getIntersections(
      layer.toGeoJSON(),
      this.layerArray
    );

    this.intersections.forEach((element) => {
      if (!this.map.hasLayer(element.layer)) {
        this.map.addLayer(element.layer);
      }
      if (this.minimizedIntersections.length === 0) {
        this.minimizedIntersections.push(element);
        return;
      }
      let searchedElement = this.minimizedIntersections.find(
        (el) => el.className === element.className
      );
      if (searchedElement == undefined || searchedElement == null) {
        this.minimizedIntersections.push(element);
      } else {
        this.minimizedIntersections[
          this.minimizedIntersections.indexOf(searchedElement)
        ].area += element.area;
      }
    });
    this.map.addLayer(layer);
    let logosArray = [];
    this.geoColService
      .getLogosByCommune("Fahs Anjra")
      .subscribe((data: any[]) => {
        logosArray = data;
        this.buildImage(logosArray, lambertCoordinates);
      });
  }
  onUploadCommuneLogo(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.logosForm.get("communeLogo").setValue(file);
    }
  }
  onUploadMinistreLogo(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.logosForm.get("ministreLogo").setValue(file);
    }
  }
  onSubmitLogosForm() {
    this.loading = true;
    console.log(this.logosForm.value);
    const form = new FormData();
    form.append("communeName", this.logosForm.get("communeName").value);
    form.append("communeLogo", this.logosForm.get("communeLogo").value);
    form.append("ministreLogo", this.logosForm.get("ministreLogo").value);
    this.geoColService.uploadLogos(form).subscribe(
      (res) => {
        this.loading = false;
      },
      (err) => {
        console.log("There is an error ", err);
      }
    );
  }
  onSubmitGeoTiff() {
    let formData = new FormData();
    let values: any = this.geotiff_form.value;
    console.log(values);
    formData.append("nom", values["nom"]);
    formData.append("echelle_de_production", values["echelle"]);
    formData.append("date_de_prise_de_vue", values["date_de_prise_de_vue"]);
    formData.append("type", this.typeTiff);
    formData.append("file", values["file"]);
    if (values["reference"]) {
      formData.append("reference", values["reference"]);
    }
    this.geoColService.uploadGeotiffs(formData, values["nom"]);
    this.modalService.dismissAll();
    // let headers=new HttpHeaders().append("Content-Type","application/json")
    // this.http.post('http://127.0.0.1:5000/uploadGeoTIFF',formData,{responseType:'json',reportProgress:true,observe:'events'}).subscribe((event:any)=>{
    //   if(event.type===HttpEventType.UploadProgress){

    //     console.log(Math.round(100* event.loaded/event.total))
    //   }
    //   else{
    //     console.log(event);
    //   }
    // },err=>{
    //   console.log(err);
    //     })
  }
 onSubmitShpForm() {
    this.loading = true;
    const form = new FormData();
    form.append("nom", this.urbanismeForm.get("nom").value);
    form.append(
      "referenceHomologation",
      this.urbanismeForm.get("referenceHomologation").value
    );
    form.append("typeUrba", this.urbanismeForm.get("type").value);
    form.append("localite", this.urbanismeForm.get("localite").value);
    form.append("surface", this.urbanismeForm.get("surface").value);
    form.append("file", this.urbanismeForm.get("file").value);

    this.geoColService.uploadUrbanismeDocument(form).subscribe(
     async (data) => {
    // (data) => {
        await this.fetchUrbaDocs();
        // this.fetchUrbaDocs();
      },

      (err) => {
        this.loading = false;
      }
    );
  }
  displayMap() {
    if (this.loading) {
      return "none";
    } else {
      return "block";
    }
  }
  addGeoJSON(filename, color, className: string) {
    let geoJSON = L.geoJSON(
      {
        features: [],
      },

      {
        style: () => {
          return { fillColor: color, color };
        },
        onEachFeature: function popup(f: any, l: any) {
          const out = [];
          if (f.properties) {
            for (const key of Object.keys(f.properties)) {
              if(f.properties[key]!=undefined && f.properties[key]!=null && f.properties[key]!="")
              out.push(key + " : " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
          }
        },
      }
    );
    let subLayer = { className, color, layers: geoJSON };
    if (
      this.layerArray.indexOf(
        this.layerArray.find((elem) => elem.filename === filename)
      ) === -1
    ) {
      let fileLayersObject = { filename, fileLayers: [] };
      fileLayersObject.fileLayers.push(subLayer);
      this.layerArray.push({ ...fileLayersObject, showSub: false });
    } else {
      let currentLayer = this.layerArray.find((l) => l.filename === filename);
      let currentElement = currentLayer.fileLayers.find(
        (e) => e.className === className
      );
      if (currentElement == undefined) {
        currentLayer.fileLayers.push(subLayer);
      }
    }

    return geoJSON;
  }
   async iterateAndFetch(docs: any) {
    console.log("start iterating and ferching");
    await new Promise((resolve,reject)=>{
      for (let doc of docs) {
          this.geoColService.fetchGeoJSONFiles(doc.src).subscribe(
            (geoJSONData: any[]) => {

              const primaryArray = this.mapService.processShapeFile(geoJSONData);
              this.allLayers = primaryArray;
              for (let elem of primaryArray) {
                for (let f of elem.layers) {
                  if (f.layers[0] === null) {
                    continue;
                  }
                  let geoj = this.addGeoJSON(elem.name, f.color, f.class);
                  geoj.addData(f.layers);

                }
              }
              resolve("got");

            },

            (err) => {
              console.log(err);

              this.loading = false;

            }
          );
        }
        })
      console.log("fully loaded");
      this.loading = false;
      if(this.initializationPhase){
        this.fetchGeotiffs();
        this.initializationPhase=false;
      }

    // this.geoJSON.addData(elemenToAdd.features);
  }
  toggleProject(element){
    if(this.map.hasLayer(element)){
      this.map.removeLayer(element);
    }
    else{
      this.map.addLayer(element);
      this.map.fitBounds(element.getBounds());
    }
  }
  toggleLayer(layers: any) {
    if(layers.length===1){
      if (this.map.hasLayer(layers[0])) {
        this.map.removeLayer(layers[0]);

      } else {
        this.map.addLayer(layers[0]);
        this.map.fitBounds(layers[0].getBounds());
      }
      return;
    }
    const layersToShow = [];
    for (let element of layers) {
      layersToShow.push(element.layers);
    }
    const layerGg = L.layerGroup(layersToShow);
    if (this.showed_hidden_layers.length === 0) {
      this.showed_hidden_layers.push(layerGg);
      this.map.addLayer(layerGg);
    } else {
      for (let el of this.showed_hidden_layers) {
        if (el.getLayers().length === layerGg.getLayers().length) {
          if (this.map.hasLayer(el)) {
            this.map.removeLayer(el);
          } else {
            this.map.addLayer(el);
          }
          return;
        }
      }
      this.map.addLayer(layerGg);
      this.showed_hidden_layers.push(layerGg);
    }

    //   const layerGroup=L.layerGroup(layersToShow)
    //   if (this.map.hasLayer(layerGroup)){
    //     this.map.removeLayer(layerGroup);
    //     console.log("it does have the layer");
    //   }

    // else {
    //   this.map.addLayer(layerGroup);
    //   // this.map.fitBounds(layerGroup);
    // }
  }
  // listLayers(){
  //   for(let l of this.layerArray){
  //       let filename=l.filename.substring(l.filename.indexOf('/')+1,l.filename.length);
  //       this.allLayers.push(filename);
  //   }
  //   console.log(this.allLayers);
  // }
  closePopup() {
    this.area = "";
    this.distance = 0;
  }
  getMargin() {
    if (this.route.url == "/admin/map") {
      return "4rem";
    } else {
      return "0";
    }
  }
  getHeight() {
    if (this.route.url == "/admin/map") {
      return "91vh";
    } else if (this.route.url == "/geo-ins/projets") {
      return "80vh";
    } else {
      if(window.innerWidth <= 512) return "75vh";
      return "85vh";
    }
  }
  showProjectsBox(){
    this.showProjects=!this.showProjects;
  }

  initGeoTIFF(geotiffs:any[]) {
    for(let geo of geotiffs){
      parse_georaster(geo.src).then((georaster) => {
        console.log("parsed now");
        var layer = new GeoRasterLayer({
          attribution: "Planet",
          georaster: georaster,
          opacity: 0.9,
          resolution: 128,
        });
        let fileLayersObject = { filename:geo.nom, fileLayers: [layer] };
        this.layerArray.push({ ...fileLayersObject, showSub: false });

      });
    }
    this.loading=false;

  }

  showLayerBox() {
    this.showLayers = !this.showLayers;
  }
  showTileLayers() {
    this.showTiles = !this.showTiles;
  }
  addfile(event) {
    let isAuthenticated;
    if(this.route.url==='/main/landingPage'){
      this.lambdaAuthService.user.pipe(take(1)).subscribe(user=>{
        if(user===null){
          this.notAthenticated.emit(false);
          isAuthenticated=false;
          return;
        }
        else{
          isAuthenticated=true;
        }
      }
      )
      if(!isAuthenticated){
        return;
      }
    }
    let file: any;
    let arrayBuffer: any;
    let filelist: any;
    let coords = [];
    file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      arrayBuffer = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist:any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (let el of arraylist) {
        coords.push([+el.X, +el.Y]);
      }

      this.modalService.dismissAll();
      this.geoColService.convertToWGS84(coords).subscribe(data=>{
        let poly=L.polygon(data,{color:'red'}).addTo(this.map);
        this.map.fitBounds(poly.getBounds());
        this.processBeforeGPDF(poly,coords);
      })

      filelist = [];
    };
  }
  getAllPorjects(){
    this.geoColService.getAllProjects().subscribe((data:any[])=>{
      if(data.length!=0){
        for(let element of data){
          if(element.src){
            let layer =L.geoJSON(JSON.parse(element.src),{features:[]})
            let out=[];
            for(let key of Object.keys(element)){
              if(key==='_id'|| key==='src' ||key==='__v'){
                continue;
              }
              out.push(key + " : " + element[key]);

            }
            layer.bindPopup(out.join("<br />"))
            this.projects.push({reference:element.referenceFonciere,layer:layer});



          }
        }
      }
    })
  }

}
function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber: any = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
}
