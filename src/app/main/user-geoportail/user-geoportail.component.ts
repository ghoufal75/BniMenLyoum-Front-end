import { Component, OnInit,EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-user-geoportail',
  templateUrl: './user-geoportail.component.html',
  styleUrls: ['./user-geoportail.component.scss']
})
export class UserGeoportailComponent implements OnInit {
@Output() notAuthenticated:EventEmitter<boolean>=new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }
  emitNotAuth(data:any){
    if(data===false){
      this.notAuthenticated.emit(false);
    }
  }
}
