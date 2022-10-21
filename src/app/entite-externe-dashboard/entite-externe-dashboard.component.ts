import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../account/auth/account.service';
import { CommunicationService } from '../pages/services/communication.service';
import { SocketService } from '../pages/services/socket.service';

@Component({
  selector: 'app-entite-externe-dashboard',
  templateUrl: './entite-externe-dashboard.component.html',
  styleUrls: ['./entite-externe-dashboard.component.scss']
})
export class EntiteExterneDashboardComponent implements OnInit {
  entiteId:string;
  reclamations:any[]=[];
  user:any;
  userModal:any=null;
  constructor(private router:Router,private authService:AccountService,private communicationService:CommunicationService,private socketService:SocketService,private modalService:NgbModal) { }

  ngOnInit(): void {
    this.entiteId=JSON.parse(localStorage.getItem("currentEntiteExterne")).userID;
    console.log("this si the connected enetity : ",this.entiteId);
    this.communicationService.reclamationsEntiteSubject.subscribe((data:any)=>{
      this.reclamations=data;

    this.communicationService.userSUbject.subscribe(user=>{
      console.log("this is the user : ",user);
      this.user=user;
      this.showModal(this.userModal);
    })
    });
    this.communicationService.getInitialReclamationsEntiteExterne(this.entiteId);
    this.communicationService.singleReclamation.subscribe((data:any)=>{
      this.reclamations.unshift(data);
    });
    // this.communicationService.getInitialReclamations();

  }
  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: "md", windowClass:'modal-rounded' , centered: true });
  }
  onLogout(){
    this.authService.logoutEntiteExterne();

    this.router.navigateByUrl('/account/loginEntiteExterne');
  }
  getSender(id,modalToShow){
    this.modalService.dismissAll();
    this.userModal=modalToShow;
    this.communicationService.getSender(id);
  }
  deleteReclamation(reclamation){
    this.communicationService.deleteReclamation(reclamation);
  }


}
