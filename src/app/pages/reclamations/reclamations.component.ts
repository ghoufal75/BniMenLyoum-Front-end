import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reclamation } from 'src/app/models/reclamation.model';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.scss']
})
export class ReclamationsComponent implements OnInit {
  reclamations:Reclamation[]=[];
  entiteExternesArray:any[]=[];
  elementToForward:any=null;

  constructor(private communicationService:CommunicationService,private modalService: NgbModal) { }

  ngOnInit(): void {

    this.onNewReclamations();
    this.getInitialReclamations();
    this.communicationService.entiteExterneSUbject.subscribe((data:any[])=>{
      this.entiteExternesArray=data;
    });


  }


  // Getting intial Reclamations
  getInitialReclamations(){
    this.communicationService.getInitialReclamations();
  }


  // Subscribing to reclamation Subject
    onNewReclamations(){
    this.communicationService.reclamationsSubject.subscribe((reclamations:Reclamation[])=>{
      console.log("a new reclamation arrived");
      this.reclamations=reclamations;
    })
  }

  onTransmettre(element,modal){
    this.elementToForward=element;
    this.communicationService.getAllEntitesExternes();
    this.showModal(modal);
  }

  selectTheContact(element){
    this.communicationService.forwardReclamation(this.elementToForward,element);
    this.modalService.dismissAll();

  }
  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }

}
