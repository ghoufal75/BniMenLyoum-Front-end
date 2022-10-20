import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { map, tap } from "rxjs/operators";
import * as turf from "@turf/turf";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { get } from "http";
import { element } from "protractor";
// import * as turf from  '@turf/intersect';

@Injectable({providedIn:'root'})
export class GeoColService {
  public status_notifier: Subject<any> = new Subject<any>();
  geotiffs=[];
  constructor(private http: HttpClient) {}
  getAllGeotiffs(){
  return  this.http.get(environment.api_link+'/geo-col/geotiffs')
  }
  uploadUrbanismeDocument(form: FormData): Observable<any> {
    return this.http.post(
      environment.api_link+"/geo-col/ubanismeDocument",
      form,
      { observe: "response" }
    );
  }

  getAllUrbanismeDocuments() {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1vaGFtZWQgR2hvdWZhbCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY1MTYxMzI1OCwiZXhwIjoxNjUxNjE2ODU4fQ.GJ6Gr9OulqxLAKjtsXpG99MMdLlYdG0-_z-w7067u3Q";
    const headers = new HttpHeaders().set("Authorization", [`Bearer ${token}`]);
    return this.http.get(environment.api_link+"/geo-col/urbanismeDocument", {
      headers: headers,
    });
  }
  fetchGeoJSONFiles(file: string): Observable<any> {
    const linkToFile = "../../../assets/urba.txt";
    return this.http.get(file);
  }
  fetchGeoTIFF(): Observable<any> {
    return this.http.get("https://bnimenlyoumbucket.s3.eu-west-3.amazonaws.com/PA+KSAR+SGHIR+KSAR+MAJAZ+VARIANTE+HOMOLOGATION+decret2-11-593DU14HIJA1432-11NOV2011_BO_5999DU2MOH.tif", {
      responseType: "arraybuffer",
    });
  }
  getIntersections(geojson: any, shpGeoJSON: any) {
    // let geojsonTab=this.convertGeoJSON(geojson);
    const intersectionsArray = [];
    for (let element of shpGeoJSON) {
      if(element.filename!='F2'){
        for (let subElement of element.fileLayers) {
          if(subElement!=undefined && subElement.layers!=undefined){
            console.log("here is the element : ",element);
            for (let l of subElement.layers.getLayers()) {
              // let latlng=this.convertGeoJSON(l.getLatLngs()[0]);
              // latlng[latlng.length-1]=latlng[0];
              // let polygone=turf.polygon(latlng);
              // console.log(latlng);
              // let polygone2=turf.polygon([geojsonTab])
              // console.log(l.toGeoJSON())

              if (
                l.toGeoJSON().type == "Feature" &&
                l.toGeoJSON().geometry.type === "Polygon"
              ) {
                let intersection = turf.intersect(l.toGeoJSON(), geojson);
                if (intersection != null) {
                  intersectionsArray.push({
                    layer: l,
                    className: subElement.className,
                    area: turf.area(intersection),
                    color: subElement.color,
                  });
                }
              }
            }
          }



        }
      }

    }
    return intersectionsArray;
  }
  convertGeoJSON(geojson: any) {
    let geojsonTab = [];
    for (let elm of geojson) {
      geojsonTab.push([elm.lat, elm.lng]);
    }
    return geojsonTab;
  }
  uploadLogos(form: FormData) {
    return this.http
      .post(environment.api_link+"/geo-urba/pdfLogos", form)
      .pipe(catchError(this.handleResponseErrors));
  }
  handleResponseErrors(err: HttpErrorResponse): Observable<any> {
    console.log(err);
    return throwError(err);
  }
  //Get pdf logos by commune name
  getLogosByCommune(commune: string): Observable<any[]> {
    return this.http
      .get(`${environment.api_link}/geo-urba/pdfLogos/${commune}`)
      .pipe(
        map((data: any[]) => {
          const logosArray = [];
          if (data.length != 0) {
            data.forEach((elem) => {
              logosArray.push(elem.src);
            });
          }
          return logosArray;
        })
      );
  }
  convertCoords(latlngArray: any[]) {

    return this.http.post(environment.flask_link+"/coordsConverter", {
      coords: [latlngArray],
    });
  }
  uploadGeotiffs(form: FormData, filename: string) {
    this.http
      .post(environment.flask_link+"/uploadGeoTIFF", form, {
        reportProgress: true,
        responseType: "json",
        observe: "events",
      })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / event.total);
          console.log('Progress : ',progress);
          this.status_notifier.next({ filename, progress });
        } else if (event instanceof HttpResponse) {
          this.status_notifier.next({ done: true });
        }
      });
  }

  convertToWGS84(array: any[]) {
    return this.http
      .post(environment.flask_link+"/revertCoordsConverter", { coords: [array] })
      .pipe(
        map((data: any) => {
          let polygonCoords = [];
          for (let pair of data.data) {
            polygonCoords.push(pair);
          }
          return polygonCoords;
        })
      );
  }

  getAllProjects() {
    return this.http.get(environment.api_link+"/geo-ins/allProjects");
  }
}
