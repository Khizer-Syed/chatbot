import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatService} from './chat.service';


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @Output() messageAdded = new EventEmitter();
  messages = [];
  loading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // this.loading = true;
    // this.chatService.query('hello')
    //   .subscribe(message => {
    //     this.addBotMessage(message);
    //     this.loading = false;
    //   });
    this.addBotMessage('hello from the othjer side eeee');
    this.addBotMessage('hello from the othjer side eeee');
    this.addBotMessage('hello from the othjer side eeee');
    this.addBotMessage('hello from the othjer side eeee');
    this.addBotMessage('hello from the othjer side eeee');
  }

  handleUserMessage(event) {
    const text = event.message;
    this.addUserMessage(text);
    this.loading = true;
    this.chatService.query(event.message)
      .subscribe(message => {
        this.loading = false;
        this.addBotMessage(message);
      });
  }

  addUserMessage(text) {
    this.messages.push({
      text,
      sender: 'You',
      reply: true,
      avatar: '/assets/bot.jpg',
      date: new Date()
    });
    this.emitMessage();
  }

  addBotMessage(text) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: '/assets/bot.jpg',
      date: new Date()
    });
    this.emitMessage();
  }

  emitMessage() {
    setTimeout(() => {
      this.messageAdded.emit();
    }, 0);
  }

}
