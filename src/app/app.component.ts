import { Component , OnInit} from '@angular/core';
import { AccountService } from './account/auth/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  constructor(private accountService:AccountService){}
  ngOnInit() {
    this.accountService.autoLogin();
    this.accountService.autoLoginResponsable();
    this.accountService.autoLoginEntiteExterne();
    // document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  }
}
