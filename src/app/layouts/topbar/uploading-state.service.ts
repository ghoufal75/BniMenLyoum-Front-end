import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GeoColService } from "src/app/shared/geoportail/geocol.service";

@Injectable({providedIn:'root'})
export class UploadingStateService{
  fileOnUploadSubject:Subject<any>=new Subject<any>()
  constructor(private geocolService:GeoColService){
    this.geocolService.status_notifier.subscribe((value:any)=>{
     this.fileOnUploadSubject.next(value)
    })
  }


}
