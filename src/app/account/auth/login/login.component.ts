import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from "../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";

import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "../account.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  @Input() permission: boolean = true;
  @Input() role=null;
  @ViewChild("password") passwordInput: ElementRef;
  @Output() firstTime: EventEmitter<boolean> = new EventEmitter<boolean>();
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {

    this.submitted = true;
    if (!this.permission) {
      if(this.role){

        return this.accountService.loginEntieExterne(this.loginForm.value).subscribe((res:any)=>{

          if(res.firstConnection){
            this.firstTime.emit(true);
          }
          else{
            this.router.navigate(["/dashboardReclamations"], { relativeTo: this.route });
          }
        },err=>{
          this.error = err.error.message;
        })
      }
      else{
        return this.accountService.loginReponsable(this.loginForm.value).subscribe(
          (responsable) => {
            if (responsable.firstConnection) {
              this.firstTime.emit(true);
            } else {
              this.router.navigate(["/admin/map"], { relativeTo: this.route });
            }
          },
          (err) => {
            this.error = err.error.message;
          }
        );
      }
    }
    this.accountService.login(this.loginForm.value).subscribe(
      (res) => {
        this.router.navigate(["/",'admin', "map"], { relativeTo: this.route });
      },
      (err) => {
        console.log(err);
        this.error = err.error.message;
      }
    );
  }
  showPassword() {
    this.passwordInput.nativeElement.type =
      this.passwordInput.nativeElement.type === "text" ? "password" : "text";
  }
}
