"use strict";(self.webpackChunkskote=self.webpackChunkskote||[]).push([[500],{85500:(M,c,a)=>{a.r(c),a.d(c,{ReclamationsModule:()=>S});var r=a(69808),m=a(84490),e=a(5e3),u=a(10168),p=a(28675);function g(n,o){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"li",7),e.\u0275\u0275elementStart(1,"div",8),e.\u0275\u0275elementStart(2,"div",9),e.\u0275\u0275elementStart(3,"h4",10),e.\u0275\u0275text(4),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(5,"div",11),e.\u0275\u0275elementStart(6,"h6",12),e.\u0275\u0275elementStart(7,"b"),e.\u0275\u0275text(8,"Emetteur : "),e.\u0275\u0275elementEnd(),e.\u0275\u0275text(9),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(10,"p",13),e.\u0275\u0275elementStart(11,"b"),e.\u0275\u0275text(12,"Corps : "),e.\u0275\u0275elementEnd(),e.\u0275\u0275text(13),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(14,"p",14),e.\u0275\u0275elementStart(15,"b"),e.\u0275\u0275text(16,"Envoy\xe9e le : "),e.\u0275\u0275elementEnd(),e.\u0275\u0275text(17),e.\u0275\u0275pipe(18,"date"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(19,"div",15),e.\u0275\u0275elementStart(20,"div"),e.\u0275\u0275elementStart(21,"button",16),e.\u0275\u0275text(22,"Supprimer"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(23,"button",17),e.\u0275\u0275listener("click",function(){const i=e.\u0275\u0275restoreView(t).$implicit,d=e.\u0275\u0275nextContext(),y=e.\u0275\u0275reference(8);return d.onTransmettre(i,y)}),e.\u0275\u0275text(24,"Transmettre"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd()}if(2&n){const t=o.$implicit;e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate1("Type de r\xe9clamation : ","equ"==t.type?"\xc9quipements et services publics":"urba"==t.type?"Urbanisme et construction":"budg"==t.type?"Budget, affaires financi\xe8res et programmation":"coop"==t.type?"Coop\xe9ration et partenariat":"Autre",""),e.\u0275\u0275advance(5),e.\u0275\u0275textInterpolate(t.senderId),e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate(t.message),e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind2(18,4,t.sentAt,"short"),"")}}function _(n,o){if(1&n&&(e.\u0275\u0275elementStart(0,"div",27),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext().$implicit;e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",t.lastName?t.lastName[0]:t.nom[0]," ")}}const f=function(n){return{background:n,"backgroud-size":"cover","background-repeat":"not-repeat"}};function C(n,o){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"li",23),e.\u0275\u0275listener("click",function(){const i=e.\u0275\u0275restoreView(t).$implicit;return e.\u0275\u0275nextContext(2).selectTheContact(i)}),e.\u0275\u0275elementStart(1,"div",24),e.\u0275\u0275template(2,_,2,1,"div",25),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(3,"div",26),e.\u0275\u0275elementStart(4,"h3"),e.\u0275\u0275text(5),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd()}if(2&n){const t=o.$implicit;e.\u0275\u0275advance(1),e.\u0275\u0275property("ngStyle",e.\u0275\u0275pureFunction1(3,f,null!=t&&t.imageUrl?"url("+(null==t?null:t.imageUrl)+")":"black")),e.\u0275\u0275advance(1),e.\u0275\u0275property("ngIf",!(null!=t&&t.imageUrl)),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",t.lastName?t.lastName:t.nom,"")}}function h(n,o){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"div",18),e.\u0275\u0275elementStart(1,"h5",19),e.\u0275\u0275text(2,"Choisissez l'entit\xe9 r\xe9ceptrice"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(3,"button",20),e.\u0275\u0275listener("click",function(){return e.\u0275\u0275restoreView(t).$implicit.dismiss("Cross click")}),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(4,"div",21),e.\u0275\u0275elementStart(5,"ul"),e.\u0275\u0275template(6,C,6,5,"li",22),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd()}if(2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275advance(6),e.\u0275\u0275property("ngForOf",t.entiteExternesArray)}}const x=[{path:"",component:(()=>{class n{constructor(t,l){this.communicationService=t,this.modalService=l,this.reclamations=[],this.entiteExternesArray=[],this.elementToForward=null}ngOnInit(){this.onNewReclamations(),this.getInitialReclamations(),this.communicationService.entiteExterneSUbject.subscribe(t=>{this.entiteExternesArray=t})}getInitialReclamations(){this.communicationService.getInitialReclamations()}onNewReclamations(){this.communicationService.reclamationsSubject.subscribe(t=>{console.log("a new reclamation arrived"),this.reclamations=t})}onTransmettre(t,l){this.elementToForward=t,this.communicationService.getAllEntitesExternes(),this.showModal(l)}selectTheContact(t){this.communicationService.forwardReclamation(this.elementToForward,t),this.modalService.dismissAll()}showModal(t){this.modalService.open(t,{size:"lg",centered:!0})}}return n.\u0275fac=function(t){return new(t||n)(e.\u0275\u0275directiveInject(u.O),e.\u0275\u0275directiveInject(p.FF))},n.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["app-reclamations"]],decls:9,vars:1,consts:[[1,"container"],[1,"pageTitle"],[1,"content"],[1,"content__list"],["class","content__element",4,"ngFor","ngForOf"],[1,"modal"],["selectEntiteModal",""],[1,"content__element"],[1,"reclamation"],[1,"reclamation__header"],[1,"reclamation__type","mb-4"],[1,"reclamation__body"],[1,"reclamation__emetter","mb-3"],[1,"reclamation__message","mb-3"],[1,"reclamation__sentAt","mb-3"],[1,"reclamation__footer"],[1,"btn","btn-danger","me-2"],[1,"btn","btn-secondary",3,"click"],[1,"modal-header"],[1,"modal-title","mt-0"],["type","button","aria-hidden","true",1,"btn-close",3,"click"],[1,"modal-body"],["class","account",3,"click",4,"ngFor","ngForOf"],[1,"account",3,"click"],[1,"account__img",3,"ngStyle"],["class","initials",4,"ngIf"],[1,"account__name"],[1,"initials"]],template:function(t,l){1&t&&(e.\u0275\u0275elementStart(0,"div",0),e.\u0275\u0275elementStart(1,"h2",1),e.\u0275\u0275text(2,"Espace r\xe9clamations"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(3,"div",2),e.\u0275\u0275elementStart(4,"ul",3),e.\u0275\u0275template(5,g,25,7,"li",4),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(6,"div",5),e.\u0275\u0275template(7,h,7,1,"ng-template",null,6,e.\u0275\u0275templateRefExtractor),e.\u0275\u0275elementEnd()),2&t&&(e.\u0275\u0275advance(5),e.\u0275\u0275property("ngForOf",l.reclamations))},directives:[r.NgForOf,r.NgStyle,r.NgIf],pipes:[r.DatePipe],styles:[".pageTitle[_ngcontent-%COMP%]{padding-left:.7rem;margin:4% 0;border-left:4px solid #556ee6;font-family:Raleway Light;text-transform:uppercase;color:#556ee6;letter-spacing:.1rem}.content[_ngcontent-%COMP%]{height:62vh;border-radius:20px;box-shadow:0 .6rem .8rem #0003;padding:0}.content__list[_ngcontent-%COMP%]{height:62vh;list-style:none;overflow-y:auto}.content__list[_ngcontent-%COMP%]::-webkit-scrollbar{width:8px;background-color:#f0f0f0;border-radius:15px}.content__list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background-color:#b9b9b9;border-radius:15px}.content__element[_ngcontent-%COMP%]{margin:2rem}.content[_ngcontent-%COMP%]   .reclamation[_ngcontent-%COMP%]{padding:.6rem;border-radius:10px;box-shadow:0 .6rem .8rem #0003}.content[_ngcontent-%COMP%]   .reclamation__footer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end}.account[_ngcontent-%COMP%]{cursor:pointer;padding:.6rem 0;display:flex;transition:all .4s}.account[_ngcontent-%COMP%]:not(:last-child){border-bottom:1px solid #efefef}.account[_ngcontent-%COMP%]:hover{background-color:#efefef}.account__img[_ngcontent-%COMP%]{width:3.5rem;height:3.5rem;position:relative;border-radius:100px;box-shadow:0 .7rem 2rem #0000001a}.account__img[_ngcontent-%COMP%]   .initials[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:.6rem;font-family:Raleway Regular}.account[_ngcontent-%COMP%]   .badgeContainer[_ngcontent-%COMP%]{margin-left:auto}.account[_ngcontent-%COMP%]   .badgeContainer[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%]{display:inline-block;transform:translateY(100%)}.account__name[_ngcontent-%COMP%]{font-family:Raleway Light;color:#0000;margin-left:.8rem}.account__name[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.1rem;transform:translateY(60%)}"]}),n})()}];let v=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.\u0275\u0275defineNgModule({type:n}),n.\u0275inj=e.\u0275\u0275defineInjector({imports:[[m.Bz.forChild(x)],m.Bz]}),n})();var b=a(40520),E=a(70895);let S=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.\u0275\u0275defineNgModule({type:n}),n.\u0275inj=e.\u0275\u0275defineInjector({providers:[{provide:b.TP,useClass:E.s,multi:!0}],imports:[[r.CommonModule,v]]}),n})()}}]);