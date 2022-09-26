import { Component, OnInit } from "@angular/core";
import { Form, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountService } from "src/app/account/auth/account.service";
import { GeoInsService } from "../geo-ins.service";
import {take, tap} from 'rxjs/operators';
enum MaitreOuvrageTypes {
  physique = "physique",
  moral = "moral",
  orgPublic = "orgPublic",
}
@Component({
  selector: "app-maitre-ouvrage",
  templateUrl: "./maitre-ouvrage.component.html",
  styleUrls: ["./maitre-ouvrage.component.scss"],
})
export class MaitreOuvrageComponent implements OnInit {
  isLoading = false;
  isEditing=false;
  fetchingCriteria: any;
  maitreOuvrageType: string = MaitreOuvrageTypes.physique;
  moralForm:FormGroup;
  physiqueForm:FormGroup;
  orgForm:FormGroup;
  noResult=false;
  maitreOuvragePhysiqueArray: any[] = [];
  maitreOuvrageMoralArray: any[] = [];
  organismePublicArray: any[] = [];
  typeMaitreOuvrage: string = "physique";
  elementToDelete:any;
  permited:boolean=false;
  elementToEdit:any;
  constructor(
    private geoInsService: GeoInsService,
    private modalService: NgbModal,
    private accountService:AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.connectedRole.subscribe(role=>{
      if(role==='Responsable'){
        this.permited=true;
      }
      else{
        this.permited=false;
      }
    })
    this.initForms();
    this.fetchMaitrePhysique();
  }
  fetchMaitrePhysique() {
    this.isLoading = true;
    this.geoInsService.getMaitreOuvragePhysique().subscribe((data: any[]) => {
      this.maitreOuvragePhysiqueArray = data;
      this.maitreOuvrageType = MaitreOuvrageTypes.physique;

      this.isLoading = false;
    });
  }
  initForms(){
    this.physiqueForm=new FormGroup({
      cin:new FormControl(null,Validators.required),
      nom : new FormControl(null,Validators.required),
      prenom:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.email]),
      telephone:new FormControl(null,[Validators.required,Validators.min(100000000),
        Validators.max(999999999)]),
      qualite:new FormControl(null,[Validators.required]),
      type:new FormControl(null)
    });
    this.moralForm=new FormGroup({
      idRV:new FormControl(null,Validators.required),
      rc:new FormControl(null,[Validators.required]),
      nom:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.email]),
      telephone:new FormControl(null,[Validators.required,Validators.min(100000000),
        Validators.max(999999999)]),
      ville:new FormControl(null,[Validators.required]),
      type:new FormControl(null)
    });
    this.orgForm=new FormGroup({
      idOrganisme:new FormControl(null,[Validators.required]),
      nom:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.email]),
      telephone:new FormControl(null,[Validators.required,Validators.min(100000000),
        Validators.max(999999999)]),
      type:new FormControl(null)
    })
  }
  fetchMaitreMoral() {
    this.isLoading = true;
    this.geoInsService.getMaitreOuvrageMoral().subscribe((data: any[]) => {
      this.maitreOuvrageMoralArray = data;
      this.maitreOuvrageType = MaitreOuvrageTypes.moral;

      this.isLoading = false;
    });
  }
  fetchOrganismePublic() {
    this.isLoading = true;
    this.geoInsService.getOrganismePublic().subscribe((data: any[]) => {
      this.organismePublicArray = data;
      this.maitreOuvrageType = MaitreOuvrageTypes.orgPublic;
      this.isLoading = false;
    });
  }

  submitMaitrePhysiqueForm() {
    this.isLoading = true;
    if(this.isEditing){
      this.physiqueForm.get('type').setValue('MaitreOuvragePhysqiue');
      this.geoInsService.updateMaitreOuvrage(this.elementToEdit._id,this.physiqueForm.value).subscribe(data=>{
        this.fetchMaitrePhysique();
        this.isLoading=false;
        this.isEditing=false;
        this.elementToEdit=null;
        this.closeModal();

      },err=>{
        this.isLoading=false;
        this.isEditing=false;
        this.elementToEdit=null;
        console.log(err);
        this.closeModal();
      });
      return;
    }
    this.geoInsService.addMaitreOuvragePhysique(this.physiqueForm.value).subscribe(
      (data) => {

        this.fetchMaitrePhysique();
        this.closeModal();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  submitMaitreMoralForm() {
    this.isLoading = true;
    if(this.isEditing){
      this.moralForm.get('type').setValue('MaitreOuvrageMoral');
      this.geoInsService.updateMaitreOuvrage(this.elementToEdit._id,this.moralForm.value).subscribe(data=>{
        this.fetchMaitreMoral();
        this.isLoading=false;
        this.isEditing=false;
        this.elementToEdit=null;
        this.closeModal();

      },err=>{
        this.isLoading=false;
        this.isEditing=false;
        this.elementToEdit=null;
        console.log(err);
        this.closeModal();
      })
      return;
    }
    this.geoInsService.addMaitreOuvrageMoral(this.moralForm.value).subscribe(
      (data) => {

        this.fetchMaitreMoral();
        this.closeModal();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  submitOrganismePublicForm() {
    this.isLoading = true;
    if(this.isEditing){
      this.orgForm.get('type').setValue('OrganismePublic');
      this.geoInsService.updateMaitreOuvrage(this.elementToEdit._id,this.orgForm.value).subscribe(data=>{
        this.fetchOrganismePublic();
        this.isLoading=false;
        this.isEditing=false;
        this.elementToEdit=null;
        this.closeModal();

      },err=>{
        this.isLoading=false;
        this.isEditing=false;
        this.elementToEdit=null;
        console.log(err);
        this.closeModal();
      })
      return;
    }
    this.geoInsService.addOrganismePublic(this.orgForm.value).subscribe(
      (data) => {

        this.fetchOrganismePublic();
        this.closeModal();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  onWritingName(event) {
    if (event.target.value === "" || event.target.value === " ") {
      switch (this.maitreOuvrageType) {
        case MaitreOuvrageTypes.physique:
          this.fetchMaitrePhysique();
          break;
        case MaitreOuvrageTypes.moral:
          this.fetchMaitreMoral();
          break;
        case MaitreOuvrageTypes.orgPublic:
          this.fetchOrganismePublic();
          break;
      }
      return;
    }
    this.geoInsService
      .fetchMaitreOuvrageWithName(event.target.value, this.fetchingCriteria)
      .subscribe((newData: any) => {
        switch (this.maitreOuvrageType) {
          case "physique":
            this.maitreOuvragePhysiqueArray = newData;
            if(newData.length===0){
              this.noResult=true;
            }
            else{
              this.noResult=false;
            }
            break;
          case "moral":
            this.maitreOuvrageMoralArray = newData;
            if(newData.length===0){
              this.noResult=true;
            }
            else{
              this.noResult=false;
            }
            break;
          case "orgPublic":
            this.organismePublicArray = newData;
            if(newData.length===0){
              this.noResult=true;
            }
            else{
              this.noResult=false;
            }
            break;
        }
      });
  }
  showAlert(element,modal){
    this.elementToDelete=element;
    this.showModal(modal);
  }
  onUpdateItem(element:any,modal:any){
    this.elementToEdit=element;
    this.isEditing=true;
    switch(this.maitreOuvrageType){
      case MaitreOuvrageTypes.physique:
        this.typeMaitreOuvrage='physique';
        this.physiqueForm.get('cin').setValue(element.cin);
        this.physiqueForm.get('nom').setValue(element.nom);
        this.physiqueForm.get('prenom').setValue(element.prenom);
        this.physiqueForm.get('email').setValue(element.email);
        this.physiqueForm.get('telephone').setValue(element.numeroTelephone);
        this.physiqueForm.get('qualite').setValue(element.qualite);
        break;
      case MaitreOuvrageTypes.moral:
        this.typeMaitreOuvrage='moral';
        this.moralForm.get('idRV').setValue(element.idRV);
        this.moralForm.get('rc').setValue(element.rc);
        this.moralForm.get('nom').setValue(element.nom);
        this.moralForm.get('email').setValue(element.email);
        this.moralForm.get('telephone').setValue(element.numeroTelephone);
        this.moralForm.get('ville').setValue(element.ville);
        break;
      case MaitreOuvrageTypes.orgPublic:
        this.typeMaitreOuvrage='organismePublic'
        this.orgForm.get('idOrganisme').setValue(element.idOrganisme);
        this.orgForm.get('nom').setValue(element.nom);
        this.orgForm.get('email').setValue(element.email);
        this.orgForm.get('telephone').setValue(element.numeroTelephone);
        break;
    }
    this.showModal(modal);
  }
  deleteMaitreOuvrage(){
    let element=this.elementToDelete;
    this.isLoading=true;
    this.geoInsService.deleteMaitreOuvrage(element._id).subscribe(data=>{

      switch(this.maitreOuvrageType){
        case MaitreOuvrageTypes.physique:
          this.fetchMaitrePhysique();
          break;
        case MaitreOuvrageTypes.moral:
          this.fetchMaitreMoral();
          break;
        case MaitreOuvrageTypes.orgPublic:
          this.fetchOrganismePublic();
          break;
      }
      this.modalService.dismissAll();
    },err=>{
      console.log(err);
      this.isLoading=false;
      this.modalService.dismissAll();
    })
  }
}
