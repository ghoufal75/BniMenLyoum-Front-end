import { trigger, transition, style, animate } from "@angular/animations";
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { saveAs } from "file-saver";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CompleterService } from "ng2-completer";
import { ElementArrayFinder } from "protractor";
import { textChangeRangeIsUnchanged, updateAwait } from "typescript";
import {
  CommunicationService,
  Contact,
  Conversation,
} from "../services/communication.service";
import { SocketService } from "../services/socket.service";
import { SelectFilterComponent } from "ng2-smart-table/lib/components/filter/filter-types/select-filter.component";
import { AccountService } from "src/app/account/auth/account.service";
import { take, tap } from "rxjs/operators";
@Component({
  selector: "app-exchange",
  templateUrl: "./exchange.component.html",
  styleUrls: ["./exchange.component.scss"],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-50%)" }),
        animate("500ms", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ transform: "translateY(0)", opacity: 1 }),
        animate("50ms", style({ transform: "translateY(-50%)", opacity: 0 })),
      ]),
    ]),
  ],
})
export class ExchangeComponent implements OnInit, OnDestroy {
  newContactsArray;
  newContactsNames = [];
  contacts: Contact[] = [];
  object: string = "";
  message: string = "";
  receiverId: string;
  conversations: Conversation[] = [];
  actualConversation: Conversation | any = null;
  actualReceiver: any;
  firstMessage = false;
  sender: string;
  uploadProgress:Number;
  isReceiver = false;
  initializing = false;
  pipedConversation: any[];
  lastOpenedObjet: any;
  isTransfering: boolean = null;
  file: any = null;
  transmitedFileName: string = "";
  transmitedFileSrc: string = "";
  lodingFile=false;
  @ViewChild('submitBtn',{static:true}) submitBtn:ElementRef;

  constructor(
    private socketService: SocketService,
    private completerService: CompleterService,
    private communicationService: CommunicationService,
    private modalService: NgbModal,
    private accountService:AccountService,
  ) {}

  ngOnInit(): void {
    this.communicationService.progressEmitter.subscribe((data:string | Number)=>{
      if (typeof data =='number'){
        this.uploadProgress=data;
      }
      else{
        this.transmitedFileSrc=<string> data;
      }
    })
    // this.initializing = true;

    // this.socketService.newUser().subscribe((data: string) => {
    //   const res = JSON.parse(data);
    //   this.conversations = this.conversations.map((element) => {
    //     if (element.receiver === res.userId) {
    //       element.online = true;
    //     }
    //     return element;
    //   });
    // });

    // this.socketService.getConversations().subscribe((data: string) => {
    //   this.sender = this.socketService.sender;
    //   let res = JSON.parse(data);
    //   // console.log("this is the conversations comming from server : ", res.data);
    //   // console.log("this is the socket id : ", res.id);
    //   res = this.formatData(res.data);
    //   // console.log("conversations broo : ", res);
    //   const receiverIds = [];
    //   for (const element of res) {
    //     // console.log("this is the element id : ",element.receiver)
    //     receiverIds.push(element.receiver);
    //   }

    //   // console.log("These are the ids : ",receiverIds);
    //   this.socketService.getAccounts(receiverIds);

    //   localStorage.setItem("initialConversations", JSON.stringify(res));

    //   this.conversations = res;

    //   // console.log(this.conversations);
    // });
    // this.socketService.userDisconnected().subscribe((data: string) => {
    //   // console.log("new user disconnected");
    //   let res = JSON.parse(data);
    //   this.conversations = this.conversations.map((element) => {
    //     if (element.receiver === res.userId) {
    //       element.online = false;
    //       // console.log(
    //       //   "heeeeeeeeeeeeerrrrrrrrrrrrrrreeeeeeee iiiiiiiiitttttttt issssssssssssssssss : ",
    //       //   element.online
    //       // );
    //     }
    //     return element;
    //   });
    // });

    // this.socketService.accounts().subscribe((data: string) => {
    //   if (this.isReceiver) {
    //     const res = JSON.parse(data);
    //     res.accounts.forEach((element) => {
    //       this.contacts.push(element);
    //     });
    //     return;
    //   }
    //   if (this.initializing) {
    //     // console.log("this is the accounts : ", data);
    //     const res = JSON.parse(data);
    //     res.accounts.forEach((element) => {
    //       this.contacts.push(element);
    //     });
    //   }
    //   this.initializing = false;
    // });
    // this.socketService.getNewContactResult().subscribe((data: string) => {
    //   let res = JSON.parse(data);
    //   let result = res.result;
    //   this.newContactsArray = result;
    //   // console.log("this is the contact array : ", this.newContactsArray);
    //   if (result.length != 0) {
    //     result = result.map((elemnt) => {
    //       if (elemnt.firstName != undefined) {
    //         return elemnt["lastName"] + " " + elemnt["firstName"];
    //       }
    //       return elemnt["nom"] + " " + elemnt["prenom"];
    //     });
    //   }

    //   // console.log(result);
    //   this.newContactsNames = result;
    // });
    // this.socketService.newMessage().subscribe((data: string) => {
    //   this.isReceiver = false;
    //   // console.log("new Message arrived");
    //   let result = JSON.parse(data);
    //   const messages = [];
    //   //the receiver of the message receives it
    //   if (this.sender === result.receiver) {
    //     // console.log("im the receiver");
    //     //First time receiving the message from that sender
    //     if (
    //       this.conversations.find((elem) => elem.receiver === result.sender) ===
    //         undefined ||
    //       this.conversations.find((elem) => elem.receiver === result.sender) ===
    //         null
    //     ) {
    //       console.log("happenning 0");
    //       messages.push({
    //         sender: result.sender,
    //         receiver: result.receiver,
    //         message: result.message,
    //         objet: result.objet,
    //         read: false,
    //         sentAt: result.sentAt,
    //       });
    //       let conv = {
    //         id: null,
    //         messages: messages,
    //         receiver: result.sender,
    //         online: result.online,
    //       };
    //       // this.receiverId = result.sender;
    //       this.isReceiver = true;
    //       this.socketService.getAccounts([result.sender]);
    //       this.conversations.push(conv);
    //       let initialConvs = [];
    //       if (
    //         localStorage.getItem("initialConversations") != null &&
    //         localStorage.getItem("initialConversations") != undefined
    //       ) {
    //         initialConvs = JSON.parse(
    //           localStorage.getItem("initialConversations")
    //         );
    //         initialConvs.push(conv);
    //         localStorage.setItem(
    //           "initialConversations",
    //           JSON.stringify(initialConvs)
    //         );
    //         return;
    //       }

    //       //Not the first time receiving the message
    //     } else {
    //       // console.log("convs before : ", this.conversations);
    //       // console.log("this is the sender : ", result.sender);
    //       this.conversations = this.conversations.map((element) => {
    //         if (element.receiver === result.sender) {
    //           element.messages.push({
    //             sender: result.sender,
    //             receiver: result.receiver,
    //             message: result.message,
    //             objet: result.objet,
    //             read: false,
    //             sentAt: result.sentAt,
    //           });
    //         }
    //         return element;
    //       });
    //       // console.log(this.conversations);
    //       if (
    //         this.actualConversation &&
    //         this.actualConversation.receiver === result.sender
    //       ) {
    //         this.actualConversation = this.conversations.find(
    //           (element) => element.receiver === result.sender
    //         );
    //         this.actualConversation = this.readMeessages(
    //           this.actualConversation
    //         );
    //         this.conversations[
    //           this.conversations.indexOf(
    //             this.conversations.find(
    //               (conv) => conv.receiver === result.sender
    //             )
    //           )
    //         ] = this.readMeessages(
    //           this.conversations.find((conv) => conv.receiver === result.sender)
    //         );
    //       }
    //     }
    //   }
    //   //the sender of the message receives it
    //   else {
    //     // The first time sending the message to that receiver
    //     if (this.firstMessage) {
    //       // console.log("yes this is the first One");
    //       this.conversations = this.conversations.map((element) => {
    //         if (element.receiver === result.receiver) {
    //           element["messages"] = [];
    //           element.messages.push({
    //             sender: result.sender,
    //             receiver: result.receiver,
    //             message: result.message,
    //             objet: result.objet,
    //             read: false,
    //             sentAt: result.sentAt,
    //           });
    //         }
    //         return element;
    //         //temporairement
    //       });
    //       this.firstMessage = false;
    //       // console.log(
    //       //   "this is the actual conversation : ",
    //       //   this.actualConversation
    //       // );
    //       return;
    //     }
    //     // Not the first Time sending a message to that receiver
    //     this.conversations = this.conversations.map((element) => {
    //       if (element.receiver === result.receiver) {
    //         element.messages.push({
    //           sender: result.sender,
    //           receiver: result.receiver,
    //           message: result.message,
    //           objet: result.objet,
    //           read: false,
    //           sentAt: result.sentAt,
    //         });
    //         // console.log("this are the messages : ", element.messages);
    //       }
    //       return element;
    //     });

    //     // console.log("this is actuallllll :::::::::", this.actualConversation);
    //     if (this.actualConversation.receiver === this.sender) {
    //       this.receiverId = this.sender;
    //       this.actualConversation = this.conversations.find(
    //         (element) => element.receiver === result.receiver
    //       );
    //     }
    //   }
    // });
    this.communicationService.actualReceiverSubject.subscribe(data=>{
      console.log("this is the actualReceiver : ",data );
      this.actualReceiver=data;
    })
    this.communicationService.contactsSubject.subscribe((contacts: any) => {
      this.contacts = contacts;
    });
    this.communicationService.senderSubject.subscribe((data) => {
      this.sender = data;
    });
    this.communicationService.newContactsArraySubject.subscribe((data: any) => {
      this.newContactsArray = data;
    });
    this.communicationService.newContactsNamesArraySubject.subscribe(
      (data: any) => {
        console.log("this is the results : ", data);
        this.newContactsNames = data;
      }
    );
    this.communicationService.actualConversationSubject.subscribe((data) => {
      console.log("this is the actual Conv : ", data);
      this.actualConversation = data;
      console.log("this is the sender : ", this.sender);
    });
    this.communicationService.receiverIdSubject.subscribe((data) => {
      console.log("this is the receiver id : ", data);
      this.receiverId = data;
    });
    this.communicationService.conversationsSubject.subscribe((data) => {
      this.conversations = data;
    });
    this.communicationService.objectPipedFormat.subscribe((data) => {
      console.log("this is the objects : ",data);
      if(data!=null){
        data=data.map(elem=>{
          for(let key of Object.keys(elem)){
            console.log("this is a message : ",elem[key]);
            elem[key]=elem[key].reverse();
          }
          return elem;
        });
        this.pipedConversation = data;
      }
    });
  }
  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(event) {
    setTimeout(() => {
      this.communicationService.savingConvs();
    });
  }

  // @HostListener("window:unload", ["$event"])
  // unloadHandler(event) {
  //   console.log("Going offline");
  //   this.communicationService.savingConvs();
  // }
  formatData(array: any[]) {
    let newRes = [];
    // console.log("start formatiing");
    array.forEach((element: any) => {
      let elem = {
        online: element.online,
        receiver: element.receiver,
        ...element["_doc"],
      };
      newRes.push(elem);
    });
    // console.log("new Array : ", newRes);
    return newRes;
  }
  transferMessage(messageToTransfer: any, modal: any) {
    this.isTransfering = true;
    let senderContact;
    let receiverContact;
    let userCredentials=null;
    this.accountService.adminEmitter.pipe(take(1)).subscribe(user=>{
      userCredentials={firstName:user.firstName,lastName:user.lastName}

      console.log("this is from subscription");
    });
    if(messageToTransfer.sender===this.sender){
      senderContact={...userCredentials};
      receiverContact=this.actualReceiver;
    }
    else{
      senderContact=this.contacts.find(el=>el._id===messageToTransfer.sender);
      receiverContact={...userCredentials};
    }
    this.message = 'Envoyé de la part de Monsieur : '+senderContact.firstName+' '+senderContact.lastName+' à monsieur '+receiverContact.firstName+' '+receiverContact.lastName+' le '+messageToTransfer.sentAt+'\nMessage : '+messageToTransfer.message;
    this.object = messageToTransfer.objet;
    this.transmitedFileSrc = messageToTransfer.fileSrc;
    console.log("this is the file source : ", messageToTransfer.fileSrc)
    this.transmitedFileName = messageToTransfer.filename;
    this.showModal(modal);
  }
  getAccounts(conversations: any) {
    let receiversIds = [];
    conversations.forEach((element) => {
      receiversIds.push(element.receiver);
    });
    this.socketService.getAccounts(receiversIds);
  }
  onWritingName(event: any) {
    if (event.target.value === "" || event.target.value === " ") {
      this.newContactsArray = [];
      event.target.value = "";
      return;
    }
    this.socketService.fetchNewContacts(event.target.value);
  }
  async onUploadFile(event: any) {
    this.lodingFile=true;
    this.file = event.target.files[0];
    this.transmitedFileSrc=await this.communicationService.uploadFile(this.file);
    this.transmitedFileName=this.file.name;
    this.lodingFile=false;
  }

  getUrl(file) {
    return window.URL.createObjectURL(file);
  }

  getColor() {
    let colors = [
      "#014983",
      "#012483",
      "#2E0183",
      "#580183",
      "#017983",
      "#018371",
      "#018342",
      "#01830D",
      "#368301",
      "#638301",
      "#838101",
      "#836201",
      "#834401",
      "#832201",
      "#830D01",
      "#83013E",
    ];
    var index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }
  selectTheContact(element: any) {
    // // console.log("selected");
    // this.firstMessage = false;
    // this.receiverId = element._id.toString();
    // // console.log(this.receiverId);
    // this.actualReceiver = element;
    // // console.log(this.conversations);
    // this.actualConversation = this.conversations.find(
    //   (conv) => conv.receiver === this.receiverId
    // );
    // this.actualConversation = this.readMeessages(this.actualConversation);
    // // console.log("this is the selected one : ", this.actualConversation);
    // this.conversations[
    //   this.conversations.indexOf(
    //     this.conversations.find((conv) => conv.receiver === this.receiverId)
    //   )
    // ] = this.readMeessages(
    //   this.conversations.find((conv) => conv.receiver === this.receiverId)
    // );
    this.communicationService.selectTheContact(element);
    if (this.isTransfering) {
      this.isTransfering = false;
    }
  }
  unreadMessages(item) {
    let conversation: Conversation | any = this.conversations.find(
      (element) => element.receiver == item._id.toString()
    );
    let i = 0;
    if (conversation.hasOwnProperty("messages")) {
      for (let message of conversation.messages) {
        if (!message.read && message.sender != this.sender) i++;
      }
    }
    return i;
  }
  getOnlineStatus(item) {
    let conversation: Conversation | any = this.conversations.find(
      (element) => {
        if (element.receiver === item._id.toString()) {
          return true;
        }
        return false;
      }
    );
    if (conversation.online) {
      return true;
    }
    return false;
  }
  selectContact(item: any) {
    // this.firstMessage = true;
    // const index = this.newContactsNames.indexOf(item.originalObject);
    // let contact = null;
    // if (index != -1) {
    //   contact = this.newContactsArray[index];
    //   this.actualReceiver = contact;
    //   this.receiverId = contact["_id"];
    // }
    // // console.log("online status : ", contact.online);
    // this.actualConversation = {
    //   receiver: this.receiverId,
    //   online: contact.online,
    // };
    // // console.log("actual after selection : ", this.actualConversation);
    // this.conversations.push(this.actualConversation);
    // console.log(this.conversations);
    // const convs = JSON.parse(localStorage.getItem("initialConversations"));
    // convs.push({ ...this.actualConversation });
    // localStorage.setItem("initialConversations", JSON.stringify(convs));
    // this.contacts.push(contact);
    this.communicationService.selectContact(item);
    if (this.isTransfering) {
      this.isTransfering = false;
    }
  }
  // readMeessages(conversation) {
  //   conversation.messages = conversation.messages.map((element) => {
  //     if (element.sender != this.sender) {
  //       return { ...element, read: true };
  //     }
  //     return element;
  //   });
  //   return conversation;
  // }
  reverseArray(array) {
    return array.reverse();
  }
  onSearchingObjet(event) {
    this.communicationService.searchByObject(event.target.value);
  }
  sendMessage() {
    // if (this.file != null && this.file != undefined) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     let buffer = new Uint8Array(<ArrayBufferLike>reader.result);

    //     this.communicationService.shareFile(
    //       {
    //         filename: this.file.name,
    //         total_buffer_size: buffer.length,
    //         buffer_size: 1024,
    //       },
    //       buffer,
    //       this.message,
    //       this.object
    //     );
    //     this.file = null;
    //   };

    //   reader.readAsArrayBuffer(this.file);
    // } else {
      this.socketService.sendMessage(
        this.receiverId,
        this.message,
        this.object,
        this.transmitedFileName,
        this.transmitedFileSrc
      );
      this.message = "";
      this.object = "";
    // }
    this.modalService.dismissAll();
  }
  respondToObj(element, object) {
    this.message='';
    this.object = object;
    this.showModal(element);
  }
  keys(element: any) {
    console.log("this is the element : ",element);
    return Object.keys(element)[0];
  }
  expandMessages(element) {
    for (let item of this.pipedConversation) {
      if (item == element) {
        if (!item.hasOwnProperty("expand")) {
          item["expand"] = true;
          this.communicationService.getEpanded(element);
        } else {
          if (!item["expanded"]) this.communicationService.getEpanded(null);
          item["expand"] = !item["expand"];
        }
      } else {
        item["expand"] = undefined;
      }
    }
  }

  showModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: "lg", centered: true });
  }
  saveFile(file, filename, filesrc) {
    if (file) {
      saveAs(new Blob(file), filename);
    } else {
      saveAs(filesrc, filename);
    }
  }
  ngOnDestroy(): void {
    this.communicationService.savingConvs();
  }
}
