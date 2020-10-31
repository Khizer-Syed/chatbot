import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatbotComponent} from './chatbot/chatbot.component';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {NbChatModule, NbThemeModule} from '@nebular/theme';
import {ChatService} from './chatbot/chat.service';

@NgModule({
  declarations: [ChatbotComponent],
  imports: [
    CommonModule,
    NbEvaIconsModule,
    NbChatModule,
    NbThemeModule,
  ],
  exports: [ChatbotComponent],
  providers: [ChatService]
})
export class ChatModule { }
