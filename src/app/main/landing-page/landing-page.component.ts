import { trigger, transition, style, animate } from "@angular/animations";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { exhaustMap, take } from "rxjs/operators";
import { AuthenticationService } from "../auth.service";
import { MainService } from "../main.service";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
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
    trigger("showNav", [
      transition(":enter", [
        style({ opacity: 1, transform: "translateX(-90%)" }),
        animate("300ms", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate("300ms", style({ opacity: 1, transform: "translateX(-90%)" })),
      ]),
    ]),
  ],
})
export class LandingPageComponent implements OnInit {
  @ViewChild("navbar") nav: ElementRef;
  suivieDossierForm: FormGroup;
  signUpForm: FormGroup;
  signInForm: FormGroup;
  isAuthLoading:boolean=false;
  isLoading = false;
  dossierTrouve: any;
  isSignUp = false;
  navIsShown=false;
  keys = [];
  authSuccess = null;
  authError = null;
  isAuthenticated: boolean = false;
  avisProjet: string;
  alertSuccessMessage="";
  alertUnsuccessMessage='';
  isAutre: boolean = false;
  reclamationForm: FormGroup;
  alertShown: boolean = false;
  disconnectAlert: boolean = false;
  constructor(
    private mainService: MainService,
    private modalService: NgbModal,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
      }
    });
    this.initForms();
  }
  initForms() {
    const passwordMatchingValidatior: ValidatorFn = (
      control: AbstractControl
    ): ValidationErrors | null => {
      const password = control.get("password");
      const confirmPassword = control.get("confirmation");
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ notmatched: true });
      }
      return password?.value === confirmPassword?.value
        ? null
        : { notmatched: true };
    };
    this.suivieDossierForm = new FormGroup({
      referenceFonciere: new FormControl(null),
      nom: new FormControl(null, [Validators.required]),
      topographe: new FormControl(null, [Validators.required]),
    });
    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
        confirmation: new FormControl(null, [Validators.required]),
      },
      {
        validators: passwordMatchingValidatior,
      }
    );
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
    });
    this.reclamationForm = new FormGroup({
      type: new FormControl("Choisissez le type de réclamation"),
      message: new FormControl(""),
    });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let element = this.nav.nativeElement;
    if (window.pageYOffset > element.clientHeight - 40) {
      element.classList.add("navbar-inverse");
    } else {
      element.classList.remove("navbar-inverse");
    }
  }

  onSubmitSuivieDossierForm(modal: any) {
    this.dossierTrouve = null;
    this.avisProjet = null;
    this.keys = [];
    console.log(this.suivieDossierForm.value);
    this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {
            this.showNotAuthenticatedModal(false, modal);
            return null;
          }
          return this.mainService.searchProject(this.suivieDossierForm.value);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.dossierTrouve = res;
          for (let key of Object.keys(res)) {
            if (
              key === "_id" ||
              key === "__v" ||
              key === "idMaitreOuvrage" ||
              key === "type" ||
              key === "src" ||
              key === "approuve" ||
              key === "typeProjet" ||
              key === "referenceFonciere"
            )
              continue;
            !this.dossierTrouve.approuve
              ? (this.avisProjet = "Pas décidé")
              : (this.avisProjet = this.dossierTrouve.approuve);
            this.keys.push(key);
          }
        }
      });
  }
  toggleNav(){
    this.navIsShown=!this.navIsShown;
  }
  onSignUp() {
    this.isAuthLoading = true;
    const formValues = this.signUpForm.value;
    this.authService
      .signUp({
        lastName: formValues.lastName,
        firstName: formValues.firstName,
        email: formValues.email,
        password: formValues.password,
      })
      .subscribe(
        (res) => {
          this.authSuccess = "Utilisateur crée avec succées.";
          this.isAuthLoading = false;
        },
        (err) => {
          this.authError = err;
          this.isAuthLoading = false;
        }
      );
  }
  onSignIn() {
    this.isAuthLoading = true;
    const formValues = this.signInForm.value;
    this.authService
      .signIn({ email: formValues.email, password: formValues.password })
      .subscribe(
        (res) => {
          this.isAuthenticated = true;
          this.showAlert(0,'Vous êtes connectés avec succées');
          this.modalService.dismissAll();
          this.isAuthLoading = false;

          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  onLogout() {
    this.isLoading=true;
    this.authService.logout();
    this.showAlert(1,"Vous êtes déconnecté");
    this.isAuthenticated = false;
    this.isLoading=false;
  }
  showNotAuthenticatedModal(data, notAuthenticated) {
    if (data === false) {
      this.showModal(notAuthenticated);
    }
  }
  authNow(modal) {
    this.modalService.dismissAll();
    this.showModal(modal);
  }

  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, {
      size: "lg",
      centered: true,
      windowClass: "authModal",
    });
  }
  switchToSignIn() {
    this.isSignUp = false;
  }
  switchToSignUp() {
    this.isSignUp = true;
  }
  setAutreInput(event) {
    if (event.target.value === "autre") {
      this.isAutre = true;
      this.reclamationForm.get("type").setValue("");
    }
  }
  showAlert(alertIndex,message) {
    if (alertIndex === 0) {
      this.alertSuccessMessage=message;
      this.alertShown = true;
    } else {
      this.alertUnsuccessMessage=message;
      this.disconnectAlert = true;
    }
    setTimeout(() => {
      if (alertIndex === 0) {
        this.alertShown = false;
      } else {
        this.disconnectAlert = false;
      }
    }, 3500);
  }
  closeAlert() {
    this.alertShown = false;
    this.disconnectAlert = false;
  }
  onSubmitReclamation() {
    const { type, message } = this.reclamationForm.value;
    const dataToSend = { type, message, sentAt: new Date() };
    this.mainService.sendReclamation(dataToSend).subscribe(res=>{
      this.reclamationForm.reset();
      this.showAlert(0,'Votre réclamation a été envoyé avec succées')
    })
  }
}
