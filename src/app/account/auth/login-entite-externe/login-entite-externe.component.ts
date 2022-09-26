import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login-entite-externe',
  templateUrl: './login-entite-externe.component.html',
  styleUrls: ['./login-entite-externe.component.scss']
})
export class LoginEntiteExterneComponent implements OnInit {
  passwordUpdateForm: FormGroup;
  showPasswordAsText: boolean;
  firstConnection: boolean = false;
  constructor(private accountService: AccountService,private router:Router,private route:ActivatedRoute) { }

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
    this.accountService.changeEntiteExternePassword(this.passwordUpdateForm.get('password').value).subscribe(res=>{
      this.router.navigate(['/dashboardReclamations']);
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
