import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Subject } from "rxjs";
import { take } from "rxjs/operators";
import {v4 as uuid} from "uuid"
import * as S3 from 'aws-sdk/clients/s3';
import {environment} from '../../../environments/environment'
@Injectable({providedIn:"root"})
export class ProfileService{
  userEmitter:Subject<any>=new Subject<any>();
constructor(private http:HttpClient){}

updateProfile(data,password,role){
  data.pswd=password;
  switch(role){
  case 'Admin':
  return  this.http.patch(environment.api_link+'/account-management/admin',data);
  case 'Responsable':
  return  this.http.patch(environment.api_link+'/account-management/responsable',data);
}
}
getUserCredetials(role){
  switch(role){
    case 'Admin':
    this.http.get(environment.api_link+'/account-management/admin').pipe(take(1)).subscribe((user:any)=>{
        let currentAdmin=JSON.parse(localStorage.getItem('currentAdmin'));
        let newAdmin={...currentAdmin,firstName:user.firstName,lastName:user.lastName,imgUrl:user.imgUrl};
        localStorage.setItem('currentAdmin',JSON.stringify(newAdmin));
        user.role='Admin'
        this.userEmitter.next(user);
    });
    break;
    case 'Responsable':
    this.http.get(environment.api_link+'/account-management/responsable').pipe(take(1)).subscribe((user:any)=>{
      console.log("this si the responsable : ",user);
      user.role='Responsable';
      let currentResponsable=JSON.parse(localStorage.getItem('currentResponsable'));
      let newAdmin={...currentResponsable,firstName:user.prenom,lastName:user.nom,imgUrl:user.imgUrl};
        localStorage.setItem('currentResponsable',JSON.stringify(newAdmin));
        user.role='Responsable'
      this.userEmitter.next(user);
  });;
    break;
}
}
async uploadProfilePic(file:any){
  const bucket = new S3(
    {
        accessKeyId: 'AKIA5D66FPEHARVQYHYL',
        secretAccessKey: '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',
        region: 'eu-west-3'
    });
    let uploadedFiles=[]
      const contentType = file.type;

      const params = {
          Bucket: 'bnimenlyoumbucket',
          Key: uuid() + file.name,
          Body: file,
      };
      console.log("start uploading");
      let result = await bucket.upload(params).promise();
    return result.Location;

    //   this.bucket.upload(params).on('httpUploadProgress', function (evt) {
    //     this.
    //     console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
    // }).send(function (err, data) {
    //     if (err) {
    //         console.log('There was an error uploading your file: ', err);
    //         return false;
    //     }
    //     console.log('Successfully uploaded file.', data);
    //     return true;
    // });

//for upload progress

}
}

