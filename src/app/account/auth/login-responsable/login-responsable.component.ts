import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "../account.service";

@Component({
  selector: "app-login-responsable",
  templateUrl: "./login-responsable.component.html",
  styleUrls: ["./login-responsable.component.scss"],
})
export class LoginResponsableComponent implements OnInit {
  passwordUpdateForm: FormGroup;
  showPasswordAsText: boolean;
  firstConnection: boolean = false;
  constructor(private accountService: AccountService,private router:Router,private route:ActivatedRoute) {}
  ngOnInit(): void {
    this.initForms();
  }
  initForms() {
    const mustMatch: ValidatorFn = (control: AbstractControl) => {
      const password = control.get("password");
      const conf = control.get("confirmation");
      if (password.value != conf.value) {
        conf.setErrors({ mustMatch: true });
      }
      return password.value != conf.value ? { mustMatch: true } : null;
    };

    this.passwordUpdateForm = new FormGroup(
      {
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(30),
        ]),
        confirmation: new FormControl("", Validators.required),
      },
      { validators: mustMatch }
    );
  }
  onSubmit() {
    this.accountService.changePassword(this.passwordUpdateForm.get('password').value).subscribe(res=>{
      this.router.navigate(['/dashboard'],{relativeTo:this.route});
    })
  }
  get f() {
    return this.passwordUpdateForm.controls;
  }
  showPassword() {
    this.showPasswordAsText = !this.showPasswordAsText;
  }
  showPasswordForm(event:any){
    this.firstConnection=event;
  }
}
