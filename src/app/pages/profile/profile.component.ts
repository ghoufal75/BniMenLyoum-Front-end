import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/auth/account.service';
import { ProfileService } from './profile.service';

interface Profile{
  firstName:string;
  lastName:string;
  imgUrl:string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile:Profile=null;
  role:string;
  inputForm:FormGroup;
  pswd:string='';
  error:string='';
  success:string='';
  isFile:boolean=false;
  file=null;
  loading:boolean=false;
  credentials_roles={
  admin:[
      {name : "Changer le nom", formCtrl:'lastName',displayed:false},
      {name : "Changer le prenom",formCtrl:'firstName',displayed:false},
      {name:"Changer l'email",formCtrl:'email',displayed:false},
      {name : "Changer le profile",formCtrl:'profile',displayed:false},
      {name:"Changer le mot de passe",formCtrl:'password',displayed:false},

    ],
    responsable:[
        {name : "Changer le nom", formCtrl:'nom',displayed:false},
        {name : "Changer le prenom",formCtrl:'prenom',displayed:false},
        {name:"Changer l'email",formCtrl:'email',displayed:false},
        {name : "Changer le service",formCtrl:'service',displayed:false},
        {name : "Changer le numéro de téléphone",formCtrl:'numeroTelephone',displayed:false},
        {name:"Changer le mot de passe",formCtrl:'password',displayed:false},
      ]

  }
  credentials_list=null;
  constructor(private authService:AccountService,private fb:FormBuilder,private modalService:NgbModal,private profileServ:ProfileService) { }

  ngOnInit(): void {
    this.profileServ.userEmitter.subscribe(user=>{
      switch(this.role){
        case 'Admin':
          this.profile={firstName:user.firstName,lastName:user.lastName,imgUrl:user.imgUrl};
        break;
        case 'Responsable':
          this.profile={firstName:user.prenom,lastName:user.nom,imgUrl:user.imgUrl};
        }
    })
    this.authService.adminEmitter.pipe(take(1)).subscribe((admin:any)=>{
      if(admin){
        this.profile={firstName:admin.firstName,lastName:admin.lastName,imgUrl:admin.imgUrl}
      }
      else{
        this.authService.responsableEmitter.pipe(take(1)).subscribe((responsable:any)=>{
          if(responsable){
            this.profile={firstName:responsable.firstName,lastName:responsable.lastName,imgUrl:responsable.imgUrl}
          }
        })
      }

    });
    this.authService.connectedRole.pipe(take(1)).subscribe(role=>{
      this.role=role;
      console.log("this is the role : ",this.role)
      this.initCredentialsList();
    });
  }

  initCredentialsList(){
    switch(this.role){
      case "Admin":
        this.credentials_list=this.credentials_roles.admin;
        break;
      case "Responsable":
        this.credentials_list=this.credentials_roles.responsable;
    }
  }

  toggleDisplay(element){
    this.credentials_list=this.credentials_list.map(el=>{
      if(el.name===element.name){
        if(!el.displayed) {this.initForm(el.formCtrl)};
        return {...el,displayed:!el.displayed};
      }
      else{
        return {...el,displayed:false};
      }
    });

  }

  initForm(element){
    const passwordMatchingValidatior: ValidatorFn = (
      control: AbstractControl
    ): ValidationErrors | null => {
      const password = control.get("password");
      const confirmPassword = control.get("confirmation");
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ notmatched: true });
      }
      return password?.value === confirmPassword?.value
        ? null
        : { notmatched: true };
    };
    if(element==='password'){
      this.inputForm=new FormGroup({
        password : new FormControl('',[Validators.minLength(12),Validators.maxLength(20)]),
        confirmation:new FormControl('',Validators.required),
      },
      {
        validators: passwordMatchingValidatior,
      });
      return;
    }
    else{
     switch(element){
      case 'lastName':
        this.inputForm=new FormGroup({
          lastName:new FormControl('')
        });
        break;
        case 'firstName':
        this.inputForm=new FormGroup({
          firstName:new FormControl('')
        });
        break;
        case 'email':
        this.inputForm=new FormGroup({
          email:new FormControl('')
        });
        break;
        case 'numeroTelephone':
        this.inputForm=new FormGroup({
          numeroTelephone:new FormControl('')
        });
        break;
        case 'nom':
        this.inputForm=new FormGroup({
          nom:new FormControl('')
        });
        break;
        case 'prenom':
        this.inputForm=new FormGroup({
          prenom:new FormControl('')
        });
        break;
        case 'service':
        this.inputForm=new FormGroup({
          service:new FormControl('')
        });
        break;
     }
    }
  }
  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, {
      size: "lg",
      centered: true,
      windowClass: "authModal",
    });
  }
  async onUpload(event,modal){
    this.file=event.target.files[0];
    this.success='';
    this.error='';
    if(this.pswd==''){
      this.showModal(modal);
    }
  }
  async uploadPic(){
    this.loading=true;
    const link= await  this.profileServ.uploadProfilePic(this.file);
    this.profileServ.updateProfile({imgUrl:link},this.pswd,this.role).subscribe(msg=>{
      console.log("done");
      this.pswd='';
      this.success='updated';
      this.loading=false;
      this.file=null;
      this.profileServ.getUserCredetials(this.role);
    },err=>{
      this.pswd='';
      this.loading=false;
      this.isFile=false;
      this.file=null;
      console.log(err);
      this.error=err.error.message;
    })

  }

  onSubmit(modal){

    this.success='';
    this.error='';
    if(this.pswd==''){
      this.showModal(modal);
    }
    else{
      this.loading=true;
      this.profileServ.updateProfile(this.inputForm.value,this.pswd,this.role).subscribe(msg=>{
        console.log("done");
        this.pswd='';
        this.success='updated';
        this.loading=false;
        this.profileServ.getUserCredetials(this.role);
      },err=>{
        this.pswd='';
        this.loading=false;
        console.log(err);
        this.error=err.error.message;
      })
    }
  }



}
