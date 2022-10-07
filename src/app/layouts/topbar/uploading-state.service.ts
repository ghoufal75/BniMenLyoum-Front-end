import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GeoColService } from "src/app/shared/geoportail/geocol.service";

@Injectable({providedIn:'root'})
export class UploadingStateService{
  fileOnUploadSubject:Subject<any>=new Subject<any>()
  constructor(private geocolService:GeoColService){
    console.log("Upload service will get initialized");
    this.geocolService.status_notifier.subscribe((value:any)=>{
      console.log("i'm attatched");
      console.log('this is the progress : ',value.progress);
     this.fileOnUploadSubject.next(value)
    })
  }


}
