import { trigger, transition, style, animate } from "@angular/animations";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { eventTupleToStore } from "@fullcalendar/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { from } from "rxjs";
import {take, tap} from 'rxjs/operators';
import { AccountService } from "src/app/account/auth/account.service";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { GeoInsService } from "./geo-ins.service";
enum fethcingValue {
  cin = "cin",
  idrv = "idrv",
  rc = "rc",
  idOrganisme = "idOrganisme",
}
enum ProjectTypes {
  constructions = "constructions",
  lotissements = "lotissements",
  morcellements = "morcellements",
  groupesHabitaiton = "groupeHabitations",
}
@Component({
  selector: "app-geo-ins",
  templateUrl: "./geo-ins.component.html",
  styleUrls: ["./geo-ins.component.scss"],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("700ms", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("100ms", style({ opacity: 0 })),
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
export class GeoInsComponent implements OnInit {
  @ViewChild("newProject") newProjectModal: ElementRef;
  constructionsArray: any = [];
  morcellemntsArray: any = [];
  lotissementsArray: any = [];
  constructionForm:FormGroup;
  lotissementForm:FormGroup;
  groupeHabitationsForm:FormGroup;
  morcellementForm:FormGroup;
  groupeHabitationsArray: any = [];
  dateOfChange:any="";
  elementToDelete:any;
  maitreOuvrageName: string;
  typeProjet: string = "construction";
  typeMaitreOuvrage: string;
  fetchingCriteria: string = fethcingValue.cin;
  projectsType: string = ProjectTypes.constructions;
  maitreOuvragesNamesArray = [];
  maitreOuvragesTypesArray = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  geojsonLayer: any;
  elementToEdit: any;
  elementToChangeDateFor:any=null;
  eiditingExistingProject:boolean=false;
  tableauMaitreOuvrage=[];
  permited:boolean=false;
  constructor(
    private geoInsService: GeoInsService,
    private modalService: NgbModal,
    private accountService:AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.connectedRole.subscribe(role=>{
      if(role==="Admin"){
        this.permited=true;
      }
      else{
        this.permited=false;
      }
    });
    this.fetchConstructions();
    this.initForms();

  }
  initForms(){
    this.constructionForm=new FormGroup({
      referenceFonciere:new FormControl(''),
      topographe : new FormControl(''),
      surfaceTerrain : new FormControl(''),
      cos: new FormControl(''),
      cus : new FormControl('',[Validators.required,Validators.min(1),Validators.max(99)]),
      typeMaitreOuvrage:new FormControl(''),
      maitreOuvrageName:new FormControl(''),
    });
    this.lotissementForm=new FormGroup({
      referenceFonciere:new FormControl('',[Validators.required]),
      topographe : new FormControl('',[Validators.required]),
      surfaceTerrain : new FormControl('',[Validators.required]),
      cus : new FormControl('',[Validators.required,Validators.min(1),Validators.max(99)]),
      nbrLots: new FormControl('',[Validators.required]),
      programme:new FormControl('',[Validators.required]),
      typeMaitreOuvrage:new FormControl(''),
      maitreOuvrageName:new FormControl(''),
    });
    this.morcellementForm=new FormGroup({
      referenceFonciere:new FormControl('',[Validators.required]),
      topographe : new FormControl('',[Validators.required]),
      surfaceTerrain : new FormControl('',[Validators.required]),
      nbrLotsAMorceller:new FormControl('',[Validators.required]),
      solde:new FormControl('',[Validators.required]),
      typeMaitreOuvrage:new FormControl(''),
      maitreOuvrageName:new FormControl(''),
    });
    this.groupeHabitationsForm=new FormGroup({
      referenceFonciere:new FormControl('',[Validators.required]),
      topographe : new FormControl('',[Validators.required]),
      surfaceTerrain : new FormControl('',[Validators.required]),
      cus : new FormControl('',[Validators.required,Validators.min(1),Validators.max(99)]),
      cos: new FormControl('',[Validators.required]),
      nbrImmeuble: new FormControl("",[Validators.required]),
      nbrAppartements : new FormControl('',[Validators.required]),
      nbrSyndics: new FormControl(""),
      nbrLocauxCommerciaux:new FormControl('',[Validators.required]),
      programme: new FormControl('',[Validators.required]),
      typeMaitreOuvrage:new FormControl(''),
      maitreOuvrageName:new FormControl(''),
    })

  }
  fetchConstructions() {
    console.log("fetching constructions");
    this.geoInsService.getConstructions().subscribe((data) => {
      console.log(data);
      this.constructionsArray = data;
      this.projectsType = ProjectTypes.constructions;
      this.isLoading=false;
    });
  }
  fetchMorcellements() {
    console.log("fetching morcellements");
    this.geoInsService.getMorcellements().subscribe((data) => {
      console.log(data);
      this.morcellemntsArray = data;
      this.projectsType = ProjectTypes.morcellements;
      this.isLoading=false;
    });
  }
  fetchLotissements() {
    console.log("fetching lotissements");
    this.geoInsService.getLotissements().subscribe((data) => {
      console.log(data);
      this.lotissementsArray = data;
      this.projectsType = ProjectTypes.lotissements;
      this.isLoading=false;
    });
  }

  fetchGroupeHabitations() {
    console.log("fetching groupe");
    this.geoInsService.getGroupeHabitations().subscribe((data) => {
      console.log(data);
      this.groupeHabitationsArray = data;
      this.projectsType = ProjectTypes.groupesHabitaiton;
      this.isLoading=false;
    });
  }

  showModal(centerDataModal: any) {
    this.eiditingExistingProject=true;
    this.maitreOuvragesNamesArray=[];
    this.maitreOuvragesTypesArray=[];
    this.tableauMaitreOuvrage=[];
    this.modalService.open(centerDataModal, { size: "lg", centered: true });



  }
  showDateModal(centerDataModal:any,element:any){
    this.elementToChangeDateFor=element;
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }
  showNewProjectModal(centerDataModal: any) {
    this.eiditingExistingProject=false;
    this.initForms();
    this.maitreOuvragesNamesArray=[];
    this.maitreOuvragesTypesArray=[];
    this.tableauMaitreOuvrage=[];
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }
  submitConstructionForm() {
    this.isLoading = true;
    if(this.maitreOuvragesNamesArray.length!=0){
      let typeIndex = this.maitreOuvragesNamesArray.indexOf(
        this.constructionForm.get('maitreOuvrageName').value
      );
        this.constructionForm.get('maitreOuvrageName').setValue(this.tableauMaitreOuvrage[typeIndex].nom);
        console.log("This is it's name : ",this.tableauMaitreOuvrage[typeIndex].nom);

    }
    else{
      this.constructionForm.get('maitreOuvrageName').setValue(this.elementToEdit.nom);
    }
    this.constructionForm.value.typeProjet = "DC";
    if(this.eiditingExistingProject){
      this.geoInsService.updateConstruction(this.constructionForm.value,this.elementToEdit._id).subscribe(res=>{
        console.log(res);
        this.fetchConstructions();
        this.eiditingExistingProject=false;
        this.elementToEdit=null;
        this.maitreOuvragesNamesArray=[];
        this.maitreOuvragesTypesArray=[];
        this.tableauMaitreOuvrage=[];
      },err=>console.log(err));
      return;
    }
    this.geoInsService.addConstructions(this.constructionForm.value).subscribe(
      (data) => {
        console.log(data);
        this.fetchConstructions();
        this.modalService.dismissAll();
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.modalService.dismissAll();
      }
    );
  }
  onSubmitLotissementForm() {
    this.isLoading = true;
    if(this.maitreOuvragesNamesArray.length!=0){
      let typeIndex = this.maitreOuvragesNamesArray.indexOf(
        this.lotissementForm.get('maitreOuvrageName').value
      );
        this.lotissementForm.get('maitreOuvrageName').setValue(this.tableauMaitreOuvrage[typeIndex].nom);
        console.log("This is it's name : ",this.tableauMaitreOuvrage[typeIndex].nom);

    }
    else{
      this.lotissementForm.get('maitreOuvrageName').setValue(this.elementToEdit.nom);
    }
    this.lotissementForm.value.typeProjet = "DL";
    if(this.eiditingExistingProject){
      this.geoInsService.updateLotissement(this.lotissementForm.value,this.elementToEdit._id).subscribe(res=>{
        console.log(res);
        this.fetchLotissements();
        this.modalService.dismissAll();
        this.eiditingExistingProject=false;
        this.elementToEdit=null;
        this.maitreOuvragesNamesArray=[];
        this.maitreOuvragesTypesArray=[];
        this.tableauMaitreOuvrage=[];
      },err=>console.log(err));
      return;
    }
    this.geoInsService.addLotissements(this.lotissementForm.value).subscribe(
      (data) => {
        console.log(data);
        this.fetchLotissements();
        this.modalService.dismissAll();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.modalService.dismissAll();
      }
    );
  }
  onSubmitMorcelelmentForm() {
    this.isLoading = true;
    if(this.maitreOuvragesNamesArray.length!=0){
      let typeIndex = this.maitreOuvragesNamesArray.indexOf(
        this.morcellementForm.get('maitreOuvrageName').value
      );
        this.morcellementForm.get('maitreOuvrageName').setValue(this.tableauMaitreOuvrage[typeIndex].nom);
        console.log("This is it's name : ",this.tableauMaitreOuvrage[typeIndex].nom);

    }
    else{
      this.morcellementForm.get('maitreOuvrageName').setValue(this.elementToEdit.nom);
    }
    this.morcellementForm.value.typeProjet = "DM";
    if(this.eiditingExistingProject){
      this.geoInsService.updateMorcellement(this.morcellementForm.value,this.elementToEdit._id).subscribe(res=>{
        console.log(res);
        this.fetchMorcellements();
        this.modalService.dismissAll();
        this.eiditingExistingProject=false;
        this.elementToEdit=null;
        this.maitreOuvragesNamesArray=[];
        this.maitreOuvragesTypesArray=[];
        this.tableauMaitreOuvrage=[];
      },err=>console.log(err));
      return;
    }
    this.geoInsService.addMorcellements(this.morcellementForm.value).subscribe(
      (data) => {
        console.log(data);
        this.fetchMorcellements();
        this.modalService.dismissAll();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.modalService.dismissAll();
      }
    );
  }
  onSubmitGroupeHabitationsForm() {
    this.isLoading = true;
    if(this.maitreOuvragesNamesArray.length!=0){
      let typeIndex = this.maitreOuvragesNamesArray.indexOf(
        this.groupeHabitationsForm.get('maitreOuvrageName').value
      );
        this.groupeHabitationsForm.get('maitreOuvrageName').setValue(this.tableauMaitreOuvrage[typeIndex].nom);
        console.log("This is it's name : ",this.tableauMaitreOuvrage[typeIndex].nom);

    }
    else{
      this.groupeHabitationsForm.get('maitreOuvrageName').setValue(this.elementToEdit.nom);
    }
    this.groupeHabitationsForm.value.typeProjet = "DGH";
    if(this.eiditingExistingProject){
      this.geoInsService.updateGroupeHabitation(this.groupeHabitationsArray.value,this.elementToEdit._id).subscribe(res=>{
        console.log(res);
        this.fetchGroupeHabitations();
        this.modalService.dismissAll();
        this.eiditingExistingProject=false;
        this.elementToEdit=null;
        this.maitreOuvragesNamesArray=[];
        this.maitreOuvragesTypesArray=[];
        this.tableauMaitreOuvrage=[];
      },err=>console.log(err));
      return;
    }
    this.geoInsService.addGroupeHabitations(this.groupeHabitationsForm.value).subscribe(
      (data) => {
        console.log(data);
        this.fetchGroupeHabitations();
        this.modalService.dismissAll();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.modalService.dismissAll();
      }
    );
  }
  onWritingCredentials(event) {
    if (event.target.value === "" || event.target.value === " ") {
      switch (this.projectsType) {
        case ProjectTypes.constructions:
          this.fetchConstructions();
          break;
        case ProjectTypes.morcellements:
          this.fetchMorcellements();
          break;
        case ProjectTypes.lotissements:
          this.fetchLotissements();
          break;
        case ProjectTypes.groupesHabitaiton:
          this.fetchGroupeHabitations();
          break;
      }
      return;
    }

    this.geoInsService
      .fetchProjectsWithMaitreOuvrage(event.target.value, this.fetchingCriteria)
      .subscribe((data) => {
        console.log(data);
        switch (this.projectsType) {
          case ProjectTypes.constructions:
            this.constructionsArray = data;
            break;
          case ProjectTypes.morcellements:
            this.morcellemntsArray = data;
            break;
          case ProjectTypes.groupesHabitaiton:
            this.groupeHabitationsArray = data;
            break;
          case ProjectTypes.lotissements:
            this.lotissementsArray = data;
            break;
        }
      });
  }
  onWritingMaitreOuvrage(event) {
    if (event.target.value === "" || event.target.value === " ") {
      return;
    }
    this.geoInsService
      .fetchMaitreOuvrageWithName(event.target.value, "nom")
      .subscribe((data: any[]) => {
        console.log("received");
        if(data.length!=0){
          this.maitreOuvragesTypesArray = data.map((elem) => elem.type);
          this.maitreOuvragesNamesArray = data.map((elem) => {
            this.tableauMaitreOuvrage.push(elem)
            switch (elem.type) {
              case "MaitreOuvragePhysique":
                return elem.nom + " " + elem.prenom;
                break;
              default:
                return elem.nom;
                break;
            }
          });

        }



        console.log(this.maitreOuvragesNamesArray);
      });
  }
  onStartLocating(element: any) {
    this.isEditing = true;
    this.elementToEdit = element;
  }
  savePolygoneOfProject(layer) {
    this.geojsonLayer = layer;
  }
  saveLocation() {
    this.isLoading = true;
    let data = {
      id: this.elementToEdit._id,
      geojson: JSON.stringify(this.geojsonLayer),
    };
    this.geoInsService.updateProjectLocation(data).subscribe(
      (res) => {
        console.log(res);
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
    this.isEditing = false;
  }
  onUpdateProject(element: any, modal: any) {
    this.elementToEdit=element;
    switch (element.type) {
      case "Construction":
        this.typeProjet = "construction";
        this.constructionForm.get('referenceFonciere').setValue(element.referenceFonciere);
        this.constructionForm.get('topographe').setValue(element.topographe);
        this.constructionForm.get('surfaceTerrain').setValue(element.surfaceTerrain);
        this.constructionForm.get('cos').setValue(element.cos);
        this.constructionForm.get('cus').setValue(element.cus);
        this.constructionForm.get('typeMaitreOuvrage').setValue(element.typeMaitreOuvrage);
        this.constructionForm.get('maitreOuvrageName').setValue(element.maitreOuvrageName);
        break;
      case "Morcellement":
        this.typeProjet = "morcellement";
        this.morcellementForm.get('referenceFonciere').setValue(element.referenceFonciere);
        this.morcellementForm.get('topographe').setValue(element.topographe);
        this.morcellementForm.get('surfaceTerrain').setValue(element.surfaceTerrain);
        this.morcellementForm.get('nbrLotsAMorceller').setValue(element.nbrLotsAMorceller);
        this.morcellementForm.get('solde').setValue(element.solde);
        this.morcellementForm.get('typeMaitreOuvrage').setValue(element.typeMaitreOuvrage);
        this.morcellementForm.get('maitreOuvrageName').setValue(element.maitreOuvrageName);
        break;
      case "GroupeHabitation":
        this.typeProjet = "groupeHabitation";
        this.groupeHabitationsForm.get('referenceFonciere').setValue(element.referenceFonciere);
        this.groupeHabitationsForm.get('topographe').setValue(element.topographe);
        this.groupeHabitationsForm.get('surfaceTerrain').setValue(element.surfaceTerrain);
        this.groupeHabitationsForm.get('cos').setValue(element.cos);
        this.groupeHabitationsForm.get('cus').setValue(element.cus);
        this.groupeHabitationsForm.get('nbrImmeuble').setValue(element.nbrImmeuble);
        this.groupeHabitationsForm.get('nbrAppartements').setValue(element.nbrAppartements);
        this.constructionForm.get('nbrSyndics').setValue(element.nbrSyndics);
        this.groupeHabitationsForm.get('nbrLocauxCommerciaux').setValue(element.nbrLocauxCommerciaux);
        this.groupeHabitationsForm.get('typeMaitreOuvrage').setValue(element.typeMaitreOuvrage);
        this.groupeHabitationsForm.get('maitreOuvrageName').setValue(element.maitreOuvrageName);
        break;
      case "Lotissement":
        this.typeProjet = "lotissement";
        this.lotissementForm.get('referenceFonciere').setValue(element.referenceFonciere);
        this.lotissementForm.get('topographe').setValue(element.topographe);
        this.lotissementForm.get('surfaceTerrain').setValue(element.surfaceTerrain);
        this.lotissementForm.get('nbrLots').setValue(element.nbrLots);
        this.lotissementForm.get('cus').setValue(element.cus);
        this.lotissementForm.get('programme').setValue(element.programme);
        this.lotissementForm.get('typeMaitreOuvrage').setValue(element.typeMaitreOuvrage);
        this.lotissementForm.get('maitreOuvrageName').setValue(element.maitreOuvrageName);
        break;
    }
    this.showModal(modal);

  }
  deleteProject(){
    let element=this.elementToDelete;
    this.isLoading=true;
    this.geoInsService.deleteProject(element).subscribe(data=>{
      console.log(data);
      switch(this.projectsType){
        case ProjectTypes.constructions:
          this.fetchConstructions();
          break;
        case ProjectTypes.lotissements:
          this.fetchLotissements();
          break;
        case ProjectTypes.groupesHabitaiton:
          this.fetchGroupeHabitations();
          break;
        case ProjectTypes.morcellements:
          this.fetchMorcellements();
          break;
      }
      this.modalService.dismissAll();
    },err=>{
      console.log(err);
      this.isLoading=false;
      this.modalService.dismissAll();
    })
  }
  showAlert(element,modal){
    this.elementToDelete=element;
    this.showModal(modal);
  }
  approuverProjet(projet:any){
    this.geoInsService.approuverProjet(projet).subscribe(data=>{
      console.log(data);
      switch(this.projectsType){
        case ProjectTypes.constructions:
          this.fetchConstructions();
          break;
        case ProjectTypes.lotissements:
          this.fetchLotissements();
          break;
        case ProjectTypes.groupesHabitaiton:
          this.fetchGroupeHabitations();
          break;
        case ProjectTypes.morcellements:
          this.fetchMorcellements();
          break;
      }
});
  }

  rejeterProjet(projet:any){
    this.geoInsService.rejeterProjet(projet).subscribe(data=>{
      console.log(data);
      switch(this.projectsType){
        case ProjectTypes.constructions:
          this.fetchConstructions();
          break;
        case ProjectTypes.lotissements:
          this.fetchLotissements();
          break;
        case ProjectTypes.groupesHabitaiton:
          this.fetchGroupeHabitations();
          break;
        case ProjectTypes.morcellements:
          this.fetchMorcellements();
          break;
      }
});
  }
  changeDate(report:boolean){
    this.isLoading=true;
    this.geoInsService.reporterProjet(this.elementToChangeDateFor,this.dateOfChange,report).subscribe(res=>{
      this.modalService.dismissAll();
      switch(this.projectsType){
        case ProjectTypes.constructions:
          this.fetchConstructions();
          break;
        case ProjectTypes.lotissements:
          this.fetchLotissements();
          break;
        case ProjectTypes.groupesHabitaiton:
          this.fetchGroupeHabitations();
          break;
        case ProjectTypes.morcellements:
          this.fetchMorcellements();
          break;
      }
      this.isLoading=false;

    })
  }

//   reporterProjet(projet:any){
//     this.geoInsService.reporterProjet(projet,date).subscribe(data=>{
//       console.log(data);
// });
//   }
}
