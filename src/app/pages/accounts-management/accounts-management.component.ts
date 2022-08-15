import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsRoutingModule } from '../contacts/contacts-routing.module';
import { AccountsService } from './accounts.service';
enum FormTypes{
  EntiteExterne='EntiteExterne',
  BureauOrdre='BureauOrdre',
  Responsable='Responsable'
}
@Component({
  selector: 'app-accounts-management',
  templateUrl: './accounts-management.component.html',
  styleUrls: ['./accounts-management.component.scss']
})
export class AccountsManagementComponent implements OnInit {
  responsableAccounts:any[];
  clientAccounts:any[];
  responsableForm:FormGroup;
  entiteExterneForm:FormGroup;
  bureauOrdreForm:FormGroup;
  formType:string;
  choosenUser:any;
  infosType:string;
  constructor(private accountsService:AccountsService,private modalService:NgbModal ) { }

  ngOnInit(): void {
    this.initForms();
    this.accountsService.getAllResponsables().subscribe((data:any[])=>{
      this.responsableAccounts=data;
    },);
    this.accountsService.getAllClients().subscribe((data:any[])=>{
      console.log(data);
      this.clientAccounts=data;
    })
  }
  initForms(){
    this.responsableForm=new FormGroup({
      nom : new FormControl(null,Validators.required),
      prenom:new FormControl(null,Validators.required),
      service:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.email]),
      numeroTelephone:new FormControl(null,[Validators.required,Validators.min(111111111),Validators.max(999999999)])
    });
    this.entiteExterneForm=new FormGroup({
      nom:new FormGroup({
        nom:new FormControl(null,Validators.required),
        email:new FormControl(null,[Validators.required,Validators.email]),
      })
    });
    this.bureauOrdreForm=new FormGroup({
      email:new FormControl(null,[Validators.required,Validators.email]),
    });
  }
  getColor(){
    let colors = ["#014983","#012483",'#2E0183',"#580183","#017983","#018371","#018342","#01830D","#368301","#638301","#838101","#836201","#834401","#832201","#830D01","#83013E"];
    var index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }
  chooseResponsable(element,newUser,infosType){
    this.infosType=infosType;
    this.choosenUser=element;
    this.showModal(newUser);

  }
  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: "md", windowClass:'modal-rounded' , centered: true });
  }
  showNewUtilisateurModal(centerDataModal: any,typeForm:string) {
    this.formType=typeForm;
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }
  onSubmitResponsableForm(){
    this.accountsService.signUpResponsable(this.responsableForm.value).subscribe(res=>{
      this.modalService.dismissAll();
      console.log(res);
    },err=>{
      this.modalService.dismissAll();
      console.log(err);
    })
  }
  onSubmitEntiteExterneForm(){

  }
  onSubmitBureauOrdreForm(){

  }
}
