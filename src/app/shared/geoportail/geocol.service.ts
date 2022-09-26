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
// import * as turf from  '@turf/intersect';

@Injectable()
export class GeoColService {
  status_notifier: Subject<any> = new Subject<any>();
  constructor(private http: HttpClient) {}
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
    return this.http.get("../../../assets/pat_cog.tif", {
      responseType: "arraybuffer",
    });
  }
  getIntersections(geojson: any, shpGeoJSON: any) {
    // let geojsonTab=this.convertGeoJSON(geojson);
    const intersectionsArray = [];
    for (let element of shpGeoJSON) {
      for (let subElement of element.fileLayers) {
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

    return this.http.post("http://127.0.0.1:5000/coordsConverter", {
      coords: [latlngArray],
    });
  }
  uploadGeotiffs(form: FormData, filename: string) {
    this.http
      .post("http://127.0.0.1:5000/uploadGeoTIFF", form, {
        reportProgress: true,
        responseType: "json",
        observe: "events",
      })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / event.total);
          this.status_notifier.next({ filename, progress });
        } else if (event instanceof HttpResponse) {
          this.status_notifier.next({ done: true });
        }
      });
  }

  convertToWGS84(array: any[]) {
    return this.http
      .post("http://127.0.0.1:5000/revertCoordsConverter", { coords: [array] })
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
