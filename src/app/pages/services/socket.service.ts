import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { AccountService } from "src/app/account/auth/account.service";
import { environment } from "src/environments/environment";
const API_LINK = environment.api_link;

@Injectable({ providedIn: "root" })
export class SocketService extends Socket {
  sender: string;
  constructor(private authService: AccountService) {
    super({ url: API_LINK, options: { autoConnect: false } });
  }
  connectToServer() {
    let id: string;
    this.authService.adminEmitter.subscribe((admin) => {
      if (!admin) {
        this.authService.responsableEmitter.subscribe((responsable: any) => {
          if (!responsable) {
            this.authService.entiteExterneEmitter.subscribe((entiteExterne:any)=>{
              if(entiteExterne){
                id=entiteExterne.userID;
                this.sender = id;
              }
              else{
                return;
              }
            })
          } else {
            id = responsable.userID;
            this.sender = id;
          }
        });
      } else {
        id = admin.userID;
        this.sender = id;
      }
    });

    this.ioSocket.io.opts.query = { auth: id };
    this.connect();
  }
  onInitialReclamations(){
    return this.fromEvent('initialsReclamations');
  }
  getConversations() {
    return this.fromEvent("conversations");
  }
  newUser() {
    return this.fromEvent("newUser");
  }
  onEntiteExterne(){
    return this.fromEvent('entiteExterne');
  }
  firstMessage(receiver, objet, message) {
    let sentAt = new Date().toLocaleString();
    this.emit(
      "firstMessage",
      JSON.stringify({
        sender: this.sender,
        receiver: receiver,
        objet: objet,
        message: message,
        sentAt,
      })
    );
  }
  userDisconnected() {
    return this.fromEvent("userDisconnected");
  }
  onNewComplaint(){
    return this.fromEvent('newReclamation');
  }
  sendMessage(receiver, message, objet,  files) {

    let sentAt =new Date().toLocaleString();
    // if (file) {
    //   // this.emit('uploadFile',file);
    //   this.emit("newMessage", {
    //     sender: this.sender,
    //     receiver,
    //     message,
    //     objet,
    //     sentAt,
    //     file: file,
    //   });
    //   return;
    // }
    this.emit(
      "newMessage",
      JSON.stringify({ sender: this.sender, receiver, message, objet, sentAt,files})
    );
  }
  newMessage() {
    return this.fromEvent("newMessage");
  }
  fetchNewContacts(name: string) {
    this.emit("searchNewContacts", { contactName: name });
  }
  getNewContactResult() {
    return this.fromEvent("newContacts");
  }
  getAccounts(ids: any[]) {
    this.emit("getAccounts", JSON.stringify({ ids: ids }));
  }
  accounts() {
    return this.fromEvent("accounts");
  }
  saveConversations(conversations: any[]) {
    this.emit("saveConversations", { conversations });
  }
  emitFilesEvents(eventName, data) {
    this.emit(eventName, data);
  }
  onFileShare() {
    return this.fromEvent("fs-share");
  }
  onFsMeta() {
    return this.fromEvent("fs-meta");
  }
  onFileInfos(){
    return this.fromEvent('fileInfos');
  }

  onNewReclamation(){
    return this.fromEvent('newComplaint');
  }
}
