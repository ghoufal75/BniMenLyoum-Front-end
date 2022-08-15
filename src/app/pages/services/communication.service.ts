import { HostListener, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { SocketService } from "./socket.service";
import { saveAs } from "file-saver";
export interface Contact {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  _id?: any;
}
export interface Conversation {
  id: string;
  messages: any[];
  receiver: string;
  online: boolean;
}
@Injectable({ providedIn: "root" })
export class CommunicationService {
  progressSubject: Subject<any> = new Subject<any>();
  objectPipedConversation: any;
  objectPipedFormat: BehaviorSubject<any[]> = new BehaviorSubject(null);
  chunk: any;
  buffer: any;
  actualReceiver: any;
  actualReceiverSubject: Subject<any> = new Subject<any>();
  total_buffer_size: any;
  buffer_size: any;
  unreadMessagesNumberSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  conversationsSubject: BehaviorSubject<Conversation[]> = new BehaviorSubject<
    Conversation[]
  >(null);
  fileShare = null;
  contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>(
    null
  );
  actualConversationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  newContactsNamesArraySubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  newContactsArraySubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  receiverIdSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  senderSubject = new BehaviorSubject(null);
  conversations: Conversation[] = [];
  isReceiver = false;
  initializing = false;
  sender: string;
  contacts: Contact[] = [];
  newContactsArray;
  newContactsNames = [];
  expandedEelement: any = null;
  actualConversation: any;
  messageIdentifier: Date;
  firstMessage: boolean = false;
  receiverId: string;
  senderFile: any = [];
  constructor(private socketService: SocketService) {
    this.initializing = true;
    this.socketService.connectToServer();
    this.onGetInitialConversations();
    this.newUserJoined();
    this.onGetAccounts();
    this.onNewContacts();
    this.onNewMessage();
    this.onFsMeta();
    this.onUserDisconnected();
    this.onFileInfos();
    this.saveConversations();
  }

  // Get unred messages
  getUnredMessages() {
    let counter: number = 0;
    console.log(this.sender);
    for (const element of this.conversations) {
      for (let message of element.messages) {
        if (message.receiver === this.sender && !message.read) counter++;
      }
    }
    this.unreadMessagesNumberSubject.next(counter);
  }

  // Listening to user joine
  newUserJoined() {
    this.socketService.newUser().subscribe((data: string) => {
      const res = JSON.parse(data);
      this.conversations = this.conversations.map((element) => {
        if (element.receiver === res.userId) {
          element.online = true;
        }
        return element;
      });
    });
    this.conversationsSubject.next(this.conversations);
  }

  // Listening to users disconnection
  onUserDisconnected() {
    this.socketService.userDisconnected().subscribe((data: string) => {
      let res = JSON.parse(data);
      this.conversations = this.conversations.map((element) => {
        if (element.receiver === res.userId) {
          element.online = false;
        }
        return element;
      });
      this.conversationsSubject.next(this.conversations);
    });
  }

  // Getting Conversations Initialy
  onGetInitialConversations() {
    this.socketService.getConversations().subscribe((data: string) => {
      this.sender = this.socketService.sender;
      this.senderSubject.next(this.sender);
      let res = JSON.parse(data);
      // console.log("this is the conversations comming from server : ", res.data);
      // console.log("this is the socket id : ", res.id);
      res = this.formatData(res.data);
      // console.log("conversations broo : ", res);
      const receiverIds = [];
      for (const element of res) {
        // console.log("this is the element id : ",element.receiver)
        receiverIds.push(element.receiver);
      }

      // console.log("These are the ids : ",receiverIds);
      this.socketService.getAccounts(receiverIds);
      console.log(res);
      localStorage.setItem("initialConversations", JSON.stringify(res));
      console.log(JSON.parse(localStorage.getItem("initialConversations")));
      this.conversations = res;
      this.conversationsSubject.next(this.conversations);
      this.getUnredMessages();
    });
  }

  // Formating incoming conversations
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

  // Getting Accounts
  onGetAccounts() {
    this.socketService.accounts().subscribe((data: string) => {
      if (this.isReceiver) {
        const res = JSON.parse(data);
        res.accounts.forEach((element) => {
          this.contacts.push(element);
        });
        return;
      }
      if (this.initializing) {
        // console.log("this is the accounts : ", data);
        const res = JSON.parse(data);
        res.accounts.forEach((element) => {
          this.contacts.push(element);
        });
      }
      this.initializing = false;
      this.contactsSubject.next(this.contacts);
    });
  }

  // Getting New Contacts Result
  onNewContacts() {
    this.socketService.getNewContactResult().subscribe((data: string) => {
      let res = JSON.parse(data);
      let result = res.result;
      this.newContactsArray = result;
      // console.log("this is the contact array : ", this.newContactsArray);
      if (result.length != 0) {
        result = result.map((elemnt) => {
          if (elemnt.firstName != undefined) {
            return elemnt["lastName"] + " " + elemnt["firstName"];
          }
          return elemnt["nom"] + " " + elemnt["prenom"];
        });
      }

      // console.log(result);
      this.newContactsNames = result;
      this.newContactsArraySubject.next(this.newContactsArray);
      this.newContactsNamesArraySubject.next(this.newContactsNames);
    });
  }
  // saveReadedConversation(){

  // }
  shareFile(metadata, buffer, message, objet) {
    this.buffer = buffer;
    const timeOfSending = new Date().toLocaleString();
    this.total_buffer_size = metadata.total_buffer_size;
    this.buffer_size = metadata.buffer_size;
    if (
      this.conversations.find(
        (element) => element.receiver === this.receiverId
      ) &&
      this.conversations
        .find((element) => element.receiver === this.receiverId)
        .hasOwnProperty("messages")
    ) {
      this.conversations
        .find((element) => element.receiver === this.receiverId)
        .messages.push({
          sender: this.sender,
          receiver: this.receiverId,
          message: message,
          objet: objet,
          sentAt: timeOfSending,
          progress: 0,
        });
    } else {
      this.conversations.find(
        (element) => element.receiver === this.receiverId
      )["messages"] = [
        {
          sender: this.sender,
          receiver: this.receiverId,
          message: message,
          objet: objet,
          sentAt: timeOfSending,
          progress: 0,
        },
      ];
    }

    if (this.actualConversation.receiver == this.receiverId) {
      this.actualConversation = this.conversations.find(
        (element) => element.receiver === this.receiverId
      );
      this.pipeToObjects();
      this.getPipedConversation();
    }
    this.socketService.emitFilesEvents("file-meta", {
      receiver: this.receiverId,
      sender: this.sender,
      metadata,
      message,
      objet,
      sentAt: timeOfSending,
    });

    this.socketService.onFileShare().subscribe((data) => {
      console.log("start sharing the file");
      if (this.buffer.length == this.total_buffer_size) {
        this.chunk = buffer.slice(0, this.buffer_size);
        buffer = buffer.slice(this.buffer_size, buffer.length);
      }

      if (this.chunk.length != 0) {
        this.senderFile.push(this.chunk);
        this.socketService.emitFilesEvents("file-raw", {
          sender: this.sender,
          receiver: this.receiverId,
          buffer: this.chunk,
        });
        this.conversations.find(
          (element) => element.receiver === this.receiverId
        ).messages = this.conversations
          .find((element) => element.receiver === this.receiverId)
          .messages.map((element) => {
            if (element.sentAt == timeOfSending) {
              console.log("it wow same");
              return {
                ...element,
                progress: Math.trunc(
                  ((metadata.total_buffer_size - this.buffer.length) /
                    metadata.total_buffer_size) *
                    100
                ),
              };
            }
            return element;
          });
        if (this.actualConversation.receiver == this.receiverId) {
          this.actualConversation.messages = this.conversations.find(
            (element) => element.receiver === this.receiverId
          ).messages;
          this.pipeToObjects();
          this.getPipedConversation();
        }
        this.chunk = this.buffer.slice(
          this.chunk.length,
          this.chunk.length + this.buffer_size
        );
        this.buffer = this.buffer.slice(
          this.chunk.length,
          this.total_buffer_size
        );
        // if(this.buffer.length<=this.buffer_size){
        //   this.conversations.find(element=>element.receiver===this.receiverId).messages=this.conversations.find(element=>element.receiver===this.receiverId).messages.map(element=>{
        //     if(element.sentAt==timeOfSending){
        //       return{...element,progress:undefined,file:buffer,filename:metadata.filename}
        //     }
        //     return element;
        //   });
        //   if(this.actualConversation==this.conversations.find(element=>element.receiver===this.receiverId)){
        //     this.pipeToObjects();
        //     this.getPipedConversation();
        //   }
        // }
        console.log("this is the new buffer length : ", this.buffer.length);
        if (this.buffer.length < this.buffer_size) {
          console.log("the file is sent all of it");
          this.chunk = null;
          this.buffer = null;
          this.total_buffer_size = 0;
          this.conversations.find(
            (element) => element.receiver === this.receiverId
          ).messages = this.conversations
            .find((element) => element.receiver === this.receiverId)
            .messages.map((element) => {
              if (element.sentAt == timeOfSending) {
                return {
                  ...element,
                  progress: undefined,
                  file: this.senderFile,
                  filename: metadata.filename,
                };
              }
              return element;
            });
          if (this.actualConversation.receiver === this.receiverId) {
            this.actualConversation.messages = this.conversations.find(
              (element) => element.receiver === this.receiverId
            ).messages;
            this.pipeToObjects();
            this.getPipedConversation();
          }
        }
      }
    });
  }
  onFileInfos() {
    this.socketService.onFileInfos().subscribe((data: any) => {
      console.log("file infos arrived : ", data);
      console.log(
        "here is it gooooo : ",

        this.conversations.find((el) => el.receiver === data.receiver)
      );
      if(data.receiver===this.sender){
        this.conversations.find(el=>el.receiver==data.sender).messages=this.conversations.find(el=>el.receiver==data.sender).messages.map((el) => {
          if (el.sentAt == data.sentAt) {
            return {
              ...el,
              file: undefined,
              fileSrc: data.fileSrc,
              filename: data.filename,
            };
          }
          return el;
        });
        return
      }
      this.conversations.find((el) => el.receiver == data.receiver).messages =
        this.conversations
          .find((el) => {
            if (el.receiver === data.receiver) {
              console.log("found igoo");
              return true;
            }
          })
          .messages.map((el) => {
            if (el.sentAt == data.sentAt) {
              return {
                ...el,
                file: undefined,
                fileSrc: data.fileSrc,
                filename: data.filename,
              };
            }
            return el;
          });
      this.conversationsSubject.next(this.conversations);
      if (this.actualConversation.receiver === data.receiver) {
        this.actualConversation.messages = this.conversations.find(
          (el) => el.receiver === data.receiver
        ).messages;
        this.pipeToObjects();
        this.actualConversationSubject.next(this.actualConversation);
        this.getPipedConversation();
      }
    });
  }
  onFsMeta() {
    this.socketService.onFsMeta().subscribe((data: any) => {
      console.log("got");
      console.log("this is the metada : ", data);
      this.fileShare = {};
      this.fileShare.metadata = data.metadata;
      this.fileShare.transmited = 0;
      this.fileShare.buffer = [];
      this.messageIdentifier = data.sentAt;
      if (
        this.conversations.find(
          (element) => element.receiver === data.sender
        ) &&
        this.conversations
          .find((element) => element.receiver === data.sender)
          .hasOwnProperty("messages")
      ) {
        this.conversations
          .find((element) => element.receiver === data.sender)
          .messages.push({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            objet: data.objet,
            progress: 0,
            read: false,
            sentAt: data.sentAt,
          });
        this.conversationsSubject.next(this.conversations);
      } else {
        let messages = [];
        if (
          this.conversations.find((elem) => elem.receiver === data.sender) ===
            undefined ||
          this.conversations.find((elem) => elem.receiver === data.sender) ===
            null
        ) {
          console.log("happenning 0");
          messages.push({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            objet: data.objet,
            read: false,
            sentAt: data.sentAt,
            progress: 0,
          });
          let conv = {
            id: null,
            messages: messages,
            receiver: data.sender,
            online: data.online,
          };
          this.isReceiver = true;

          this.socketService.getAccounts([data.sender]);
          this.conversations.push(conv);
          this.actualConversation = conv;
          this.conversationsSubject.next(this.conversations);
          this.actualConversationSubject.next(this.actualConversation);
          let initialConvs = [];
          if (
            localStorage.getItem("initialConversations") != null &&
            localStorage.getItem("initialConversations") != undefined
          ) {
            initialConvs = JSON.parse(
              localStorage.getItem("initialConversations")
            );
            initialConvs.push(conv);
            localStorage.setItem(
              "initialConversations",
              JSON.stringify(initialConvs)
            );
          }
        } else {
          this.conversations.find(
            (element) => element.receiver === data.sender
          )["messages"] = [
            {
              sender: data.sender,
              receiver: data.receiver,
              message: data.message,
              objet: data.objet,
              read: false,
              sentAt: data.sentAt,
              progress: 0,
            },
          ];
        }
      }
      if (this.actualConversation.receiver == data.sender) {
        this.actualConversation = this.conversations.find(
          (element) => element.receiver === data.sender
        );
        this.pipeToObjects();
        this.getPipedConversation();
      }
      this.socketService.emitFilesEvents("fs-start", { receiver: data.sender });
      this.socketService.fromEvent("fs-share").subscribe((data: any) => {
        console.log("this is the data that got shared : ", data);
        this.fileShare.buffer.push(data.buffer);
        this.fileShare.transmited += data.buffer.byteLength;
        this.conversations.find(
          (element) => element.receiver === data.sender
        ).messages = this.conversations
          .find((element) => element.receiver === data.sender)
          .messages.map((element) => {
            if (
              element.progress != undefined &&
              element.sentAt == this.messageIdentifier
            ) {
              return {
                ...element,
                progress: Math.trunc(
                  (this.fileShare.transmited /
                    this.fileShare.metadata.total_buffer_size) *
                    100
                ),
              };
            }
            return element;
          });
        if (
          this.fileShare.transmited == this.fileShare.metadata.total_buffer_size
        ) {
          console.log("this is the buffer : ", this.fileShare.buffer.length);
          console.log(
            "this is the file length : ",
            this.fileShare.buffer.length
          );
          this.socketService.emit("finishTransmitting", {
            buffer: this.fileShare.buffer,
          });
          this.conversations.find(
            (element) => element.receiver === data.sender
          ).messages = this.conversations
            .find((element) => element.receiver === data.sender)
            .messages.map((element) => {
              if (
                element.progress &&
                element.sentAt == this.messageIdentifier
              ) {
                console.log(
                  "this is the buffer from receiver bruh : ",
                  this.fileShare.buffer
                );
                return {
                  ...element,
                  file: this.fileShare.buffer,
                  filename: this.fileShare.metadata.filename,
                  progress: undefined,
                };
              }
              return element;
            });
          this.fileShare = null;
        } else {
          this.socketService.emitFilesEvents("fs-start", {
            receiver: data.sender,
          });
        }
        if (
          (this.actualConversation = this.conversations.find(
            (element) => element.receiver === data.sender
          ))
        ) {
          this.pipeToObjects();
          this.getPipedConversation();
        }
      });
    });
  }
  onNewMessage() {
    this.socketService.newMessage().subscribe((data: string) => {
      console.log("a new msg here");
      this.isReceiver = false;
      let result = JSON.parse(data);
      console.log("mssssssssssss : ", result);
      console.log(result.file);
      // result.message=result.message.replace(/[\r\n]/gm, "<br>")
      const messages = [];
      //the receiver of the message receives it
      if (this.sender === result.receiver) {
        //First time receiving the message from that sender
        if (
          this.conversations.find((elem) => elem.receiver === result.sender) ===
            undefined ||
          this.conversations.find((elem) => elem.receiver === result.sender) ===
            null
        ) {
          console.log("happenning 0");
          messages.push({
            sender: result.sender,
            receiver: result.receiver,
            message: result.message,
            objet: result.objet,
            read: false,
            sentAt: result.sentAt,
            fileSrc:
              result.fileSrc != undefined && result.fileSrc != null
                ? result.fileSrc
                : null,
            filename:
              result.filename != undefined && result.filename != null
                ? result.filename
                : null,
          });
          let conv = {
            id: null,
            messages: messages,
            receiver: result.sender,
            online: result.online,
          };
          this.isReceiver = true;
          this.socketService.getAccounts([result.sender]);
          this.conversations.push(conv);
          this.conversationsSubject.next(this.conversations);
          let initialConvs = [];
          if (
            localStorage.getItem("initialConversations") != null &&
            localStorage.getItem("initialConversations") != undefined
          ) {
            initialConvs = JSON.parse(
              localStorage.getItem("initialConversations")
            );
            initialConvs.push(conv);
            localStorage.setItem(
              "initialConversations",
              JSON.stringify(initialConvs)
            );
            return;
          }

          //Not the first time receiving the message
        } else {
          this.conversations = this.conversations.map((element) => {
            if (element.receiver === result.sender) {
              element.messages.push({
                sender: result.sender,
                receiver: result.receiver,
                message: result.message,
                objet: result.objet,
                read: false,
                sentAt: result.sentAt,
                fileSrc:
                  result.fileSrc != undefined && result.fileSrc != null
                    ? result.fileSrc
                    : null,
                filename:
                  result.filename != undefined && result.filename != null
                    ? result.filename
                    : null,
              });
            }
            return element;
          });
          this.conversationsSubject.next(this.conversations);
          // console.log(this.conversations);
          if (
            this.actualConversation &&
            this.actualConversation.receiver === result.sender
          ) {
            this.actualConversation = this.conversations.find(
              (element) => element.receiver === result.sender
            );
            this.actualConversation = this.readMeessages(
              this.actualConversation
            );
            // this.conversations[
            //   this.conversations.indexOf(
            //     this.conversations.find(
            //       (conv) => conv.receiver === result.sender
            //     )
            //   )
            // ] = this.readMeessages(
            //   this.conversations.find((conv) => conv.receiver === result.sender)
            // );
            this.conversationsSubject.next(this.conversations);
            this.actualConversationSubject.next(this.actualConversation);
          }
        }
      }
      //the sender of the message receives it
      else {
        // The first time sending the message to that receiver
        if (this.firstMessage) {
          // console.log("yes this is the first One");
          this.conversations = this.conversations.map((element) => {
            if (element.receiver === result.receiver) {
              element["messages"] = [];
              element.messages.push({
                sender: result.sender,
                receiver: result.receiver,
                message: result.message,
                objet: result.objet,
                read: false,
                sentAt: result.sentAt,
                fileSrc:
                  result.fileSrc != undefined && result.fileSrc != null
                    ? result.fileSrc
                    : null,
                filename:
                  result.filename != undefined && result.filename != null
                    ? result.filename
                    : null,
              });
            }
            return element;
            //temporairement
          });
          this.firstMessage = false;
          // console.log(
          //   "this is the actual conversation : ",
          //   this.actualConversation
          // );
          this.conversationsSubject.next(this.conversations);
          if (this.actualConversation.receiver === result.receiver) {
            this.actualConversation = this.conversations.find(
              (element) => element.receiver === result.receiver
            );
            this.actualConversationSubject.next(this.actualConversation);
            this.pipeToObjects();
            this.getPipedConversation();
          }
          return;
        }
        // Not the first Time sending a message to that receiver
        console.log("broo there is a new msg");
        this.conversations = this.conversations.map((element) => {
          if (element.receiver === result.receiver) {
            element.messages.push({
              sender: result.sender,
              receiver: result.receiver,
              message: result.message,
              objet: result.objet,
              read: false,
              sentAt: result.sentAt,
              file:
                result.file != undefined && result.file != null
                  ? result.file
                  : null,
            });
            // console.log("this are the messages : ", element.messages);
          }
          return element;
        });
        this.conversationsSubject.next(this.conversations);
        // console.log("this is actuallllll :::::::::", this.actualConversation);
        console.log("this is the sender : ", result.receiver);
        console.log(
          "this is the actual conv receiver : ",
          this.actualConversation.receiver
        );
        if (this.actualConversation.receiver === result.receiver) {
          this.actualConversation = this.conversations.find(
            (element) => element.receiver === result.receiver
          );
          this.actualConversationSubject.next(this.actualConversation);
        }
      }
      this.pipeToObjects();
      this.getPipedConversation();
    });
  }
  saveConversations() {
    setInterval(() => {
      this.savingConvs();
    }, 1000);
  }
  getEpanded(element) {
    this.expandedEelement = element;
  }
  savingConvs() {
    const initialConvs = JSON.parse(
      localStorage.getItem("initialConversations")
    );
    const convsToSave = [];
    for (let i = 0; i < this.conversations.length; i++) {
      if (initialConvs.length != 0) {
        if (this.conversations[i].hasOwnProperty("messages")) {
          if (
            !initialConvs[i].hasOwnProperty("messages") ||
            initialConvs[i].messages.length !=
              this.conversations[i].messages.length
          ) {
            let convToSave = {
              id: this.conversations[i].id,
              messages: this.conversations[i].messages,
              receiver: this.conversations[i].receiver,
            };

            convsToSave.push(convToSave);
          }
        }
      }
    }
    if (convsToSave.length != 0) {
      this.socketService.saveConversations(convsToSave);
      localStorage.removeItem("initialConversations");
      localStorage.setItem(
        "initialConversations",
        JSON.stringify(this.conversations.slice())
      );
    }
  }

  // onReadingMessages
  readMeessages(conversation) {
    let messages_to_read = [];
    console.log("this is the conv before reading it : ", conversation);
    if (!conversation.messages || conversation.messages.length == 0) {
      return conversation;
    }
    conversation.messages = conversation.messages.map((element) => {
      if (element.sender != this.sender && !element.read) {
        messages_to_read.push(element);
        return { ...element, read: true };
      }
      return element;
    });
    console.log("this is the unred messages : ", messages_to_read);
    this.socketService.emit("readMessages", {
      sender: this.sender,
      receiver: this.receiverId,
      messages: messages_to_read,
    });
    console.log("this is the conversation after reading it : ", conversation);

    return conversation;
  }

  //Selecting the contact to talk with
  selectTheContact(element: any) {
    // console.log("selected");
    this.firstMessage = false;
    this.receiverId = element._id.toString();
    this.receiverIdSubject.next(this.receiverId);
    // console.log(this.receiverId);
    this.actualReceiver = element;
    this.actualReceiverSubject.next(this.actualReceiver);
    // console.log(this.conversations);
    this.actualConversation = this.conversations.find(
      (conv) => conv.receiver === this.receiverId
    );
    this.pipeToObjects();
    if (
      this.actualConversation.messages &&
      this.actualConversation.messages.length != 0
    ) {
      this.actualConversation = this.readMeessages(this.actualConversation);
      this.pipeToObjects();

      // console.log("this is the selected one : ", this.actualConversation);
    }
    this.conversationsSubject.next(this.conversations);
    this.actualConversationSubject.next(this.actualConversation);
    // this.socketService.saveConversations([
    //   this.conversations.find((conv) => conv.receiver === this.receiverId),
    // ]);
    this.getPipedConversation();
    if (
      this.actualConversation.messages &&
      this.actualConversation.messages.length != 0
    )
      this.getUnredMessages();
  }

  // Selecting a name from the search result
  selectContact(item: any) {
    this.firstMessage = true;
    const index = this.newContactsNames.indexOf(item.originalObject);
    let contact = null;
    if (index != -1) {
      contact = this.newContactsArray[index];
      console.log("this is the contact");
      this.actualReceiver = contact;
      this.actualReceiverSubject.next(this.actualReceiver);
      this.receiverId = contact["_id"];
      this.receiverIdSubject.next(this.receiverId);
    }
    // console.log("online status : ", contact.online);
    this.actualConversation = {
      receiver: this.receiverId,
      online: contact.online,
    };
    // console.log("actual after selection : ", this.actualConversation);
    this.conversations.push(this.actualConversation);
    console.log(this.conversations);
    const convs = JSON.parse(localStorage.getItem("initialConversations"));
    console.log(convs);
    convs.push({ ...this.actualConversation });
    localStorage.setItem("initialConversations", JSON.stringify(convs));
    this.contacts.push(contact);
    this.contactsSubject.next(this.contacts);
    this.conversationsSubject.next(this.conversations);
    this.actualConversationSubject.next(this.actualConversation);
  }
  pipeToObjects() {
    let newConversation = [];
    if (
      !this.actualConversation.messages ||
      this.actualConversation.messages.length == 0
    )
      return newConversation;
    for (let message of this.actualConversation.messages) {
      let messageObject = newConversation.find((element) =>
        element.hasOwnProperty(message.objet)
      );
      if (messageObject != null && messageObject != undefined) {
        if (this.expandedEelement) {
          if (message.objet === Object.keys(this.expandedEelement)[0]) {
            messageObject.expand = true;
          }
        }
        newConversation[newConversation.indexOf(messageObject)][
          message.objet
        ].push(message);
      } else {
        let newObject = {};
        newObject[message.objet] = [message];
        newConversation.push(newObject);
      }
    }
    this.objectPipedConversation = newConversation;
  }
  getPipedConversation() {
    this.objectPipedFormat.next(this.objectPipedConversation);
  }
  searchByObject(value) {
    if (value === "" || value == " ") {
      this.getPipedConversation();
      return;
    }
    let newSearchRes = this.objectPipedConversation.filter(
      (element) =>
        Object.keys(element)[0].match(new RegExp(`^${value}`)) != null
    );
    this.objectPipedFormat.next(newSearchRes);
  }
}
