import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { AccountService } from "src/app/account/auth/account.service";
const API_LINK = "http://localhost:3000";

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
            return;
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
    console.log("this is the id of connected user : ", this.sender);
    this.ioSocket.io.opts.query = { auth: id };
    this.connect();
  }
  getConversations() {
    return this.fromEvent("conversations");
  }
  newUser() {
    return this.fromEvent("newUser");
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
  sendMessage(receiver, message, objet, file, filename, fileSrc) {
    console.log("This is the file to send : ", file);
    let sentAt =new Date().toLocaleString();
    if (file) {
      // this.emit('uploadFile',file);
      this.emit("newMessage", {
        sender: this.sender,
        receiver,
        message,
        objet,
        sentAt,
        file: file,
      });
      return;
    }
    console.log("this is the filename : ",filename);
    console.log("this is the file src : ",fileSrc)
    this.emit(
      "newMessage",
      JSON.stringify({ sender: this.sender, receiver, message, objet, sentAt,filename,fileSrc})
    );
  }
  newMessage() {
    return this.fromEvent("newMessage");
  }
  fetchNewContacts(name: string) {
    console.log(name);
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
    console.log("i'll strat sharing");
    return this.fromEvent("fs-share");
  }
  onFsMeta() {
    return this.fromEvent("fs-meta");
  }
  onFileInfos(){
    return this.fromEvent('fileInfos');
  }
}
