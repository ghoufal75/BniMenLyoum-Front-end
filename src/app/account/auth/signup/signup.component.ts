import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthenticationService } from "../../../core/services/auth.service";
import { environment } from "../../../../environments/environment";
import { first } from "rxjs/operators";
import { UserProfileService } from "../../../core/services/user.service";
import { AccountService } from "../account.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  error = "";
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService:AccountService
  ) {}

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    const passwordMatchValidator: ValidatorFn = (
      control: AbstractControl
    ): ValidationErrors | null => {
      const password=control.get('password');
      const conf=control.get('confirmation');
      if(password.value!=conf.value){
        conf.setErrors({notMatched:true});
      }
      return (password?.value!=conf?.value)?{notMatched:true}:null;
    };
    this.signupForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", Validators.required),
      profile: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(30),
      ]),
      confirmation: new FormControl("", [Validators.required]),
    },{validators:passwordMatchValidator});
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.accountService.signUp(this.signupForm.value).subscribe(res=>{
      this.submitted=true;
      this.successmsg=true;
      console.log(res);
    },err=>{
      console.log(err);
    })
  }
}
