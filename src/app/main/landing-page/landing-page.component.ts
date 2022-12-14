import { trigger, transition, style, animate } from "@angular/animations";
import {
  AfterViewInit,
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
export class LandingPageComponent implements OnInit, AfterViewInit {
  currentActive=0;
  quiSommesNousOffset=null;
  fonctionnalitesOffset=null;
  reclamationOffset=null;
  suivieDossierOffset=null;
  geoportailOffset=null;
  @ViewChild('quisommesNous') quiSommesNousEl:ElementRef;
  @ViewChild('fonctionnalites') fonctionnalitesEl:ElementRef;
  @ViewChild('suivieDossier') suivieDossierEl:ElementRef;
  @ViewChild('reclamation')reclamationEl:ElementRef;
  @ViewChild('geoportail') geoportailEl:ElementRef;

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
  error:string='';
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
      else{
        this.isAuthenticated=false;
      }
    });
    this.initForms();
    this.authService.autoLogout();
  }
  ngAfterViewInit(): void {

      this.fonctionnalitesOffset=this.fonctionnalitesEl.nativeElement.offsetTop;
      this.reclamationOffset=this.reclamationEl.nativeElement.offsetTop;
      this. quiSommesNousOffset=this. quiSommesNousEl.nativeElement.offsetTop;
      this.suivieDossierOffset=this.suivieDossierEl.nativeElement.offsetTop;
      this.geoportailOffset=this.geoportailEl.nativeElement.offsetTop;
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
      // referenceFonciere: new FormControl(null),
      nom: new FormControl(null, [Validators.required]),
      // topographe: new FormControl(null, [Validators.required]),
    });
    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(12),
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
        Validators.minLength(12),
        Validators.maxLength(20),
      ]),
    });
    this.reclamationForm = new FormGroup({
      type: new FormControl("Choisissez le type de r??clamation"),
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
    if (window.pageYOffset+100 >= this.quiSommesNousOffset && window.pageYOffset+100 < this.fonctionnalitesOffset ) {
      this.currentActive = 1;
    } else if (window.pageYOffset+100 >= this.fonctionnalitesOffset && window.pageYOffset+100 < this.geoportailOffset) {
      this.currentActive = 2;
    } else if (window.pageYOffset+100 >= this.geoportailOffset && window.pageYOffset+100 < this.suivieDossierOffset) {
      this.currentActive = 3;
    } else if (window.pageYOffset+100 >= this.suivieDossierOffset && window.pageYOffset+100 < this.reclamationOffset) {
      this.currentActive = 4;
    }else if (window.pageYOffset+100 >= this.reclamationOffset) {
      this.currentActive = 5;
    } else {
      this.currentActive = 0;
    }
  }

  move(currentActive){
    if(currentActive===1){
      window.scrollTo(0,this.quiSommesNousOffset);
    }
    else if(currentActive===2){
      window.scrollTo(0,this.fonctionnalitesOffset);
    }
    else if(currentActive===3){
      window.scrollTo(0,this.geoportailOffset);
    }
    else if(currentActive===4){
      window.scrollTo(0,this.suivieDossierOffset);
    }
    else if(currentActive===5){
      window.scrollTo(0,this.reclamationOffset);
    }
  }
  onSubmitSuivieDossierForm(modal: any) {
    this.dossierTrouve = null;
    this.avisProjet = null;
    this.keys = [];
    this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {

            this.showNotAuthenticatedModal(false, modal);
            return null;
          }
          return this.mainService.searchProject(this.suivieDossierForm.get('nom').value);
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
              ? (this.avisProjet = "Pas d??cid??")
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
          this.authSuccess = "Utilisateur cr??e avec succ??es.";
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
          this.showAlert(0,'Vous ??tes connect??s avec succ??es');
          this.modalService.dismissAll();
          this.isAuthLoading = false;
        },
        (err) => {
          this.error=err.error.message;
          this.isAuthLoading=false;
        }
      );
  }
  onLogout() {
    this.isLoading=true;
    this.authService.logout();
    this.showAlert(1,"Vous ??tes d??connect??");
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
    this.navIsShown=false;
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
  onSubmitReclamation(modal) {
    const { type, message } = this.reclamationForm.value;
    const dataToSend = { type, message, sentAt: new Date() };
       this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {
            this.reclamationForm.reset();
            this.showNotAuthenticatedModal(false, modal);
            return null;
          }
          return  this.mainService.sendReclamation(dataToSend)
        })
      )
      .subscribe((res) => {
          this.reclamationForm.reset();
          this.showAlert(0,'Votre r??clamation a ??t?? envoy?? avec succ??es')

      });

  }
  getColSize(){
    if(window.innerWidth<=1000)
    return true;
    else return false;
  }
}
