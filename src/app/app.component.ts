import {Component, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';

const fontSizes = {
  small: '0.75rem',
  normal: 'initial',
  large: '1.2rem'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  openChatBot = false;
  openSettingsDrawer = false;
  fontSize = 'normal';
  defaultTheme = 'default';

  constructor(private themeService: NbThemeService) {
  }

  ngOnInit(): void {
    const userPreferenceFont = localStorage.getItem('user-preferred-font');
    if (userPreferenceFont && ['small', 'normal', 'large'].includes(userPreferenceFont)) {
      this.fontSize = userPreferenceFont;
    }
  }

  openChatBotWindow() {
    this.openChatBot = true;
    setTimeout(() => {
      this.startResizing();
    }, 0);
  }

  startResizing() {
    // tslint:disable-next-line:one-variable-per-declaration
    let x, y, dx, dy;
    const main: HTMLElement = document.querySelector('#resizable');
    const mainStyles = getComputedStyle(main);
    let ht = Number(mainStyles.height.replace('px', ''));
    let wd = Number(mainStyles.width.replace('px', ''));
    const resizeHook = document.querySelector('#resize-hook');

    const startResize = (evt) => {
      x = evt.screenX;
      y = evt.screenY;
    };
    const resize = (evt) => {
      dx = evt.screenX - x;
      dy = evt.screenY - y;
      x = evt.screenX;
      y = evt.screenY;
      wd -= dx;
      ht -= dy;
      main.style.width = wd + 'px';
      main.style.height = ht + 'px';
    };
    resizeHook.addEventListener('mousedown', (evt) => {
      startResize(evt);
      document.body.addEventListener('mousemove', resize);
      document.body.addEventListener('mouseup', () => {
        document.body.removeEventListener('mousemove', resize);
      });
    });
  }

  closeChatBot() {
    this.openChatBot = false;
    this.openSettingsDrawer = false;
  }

  changeFontSize(size?) {
    if (size && size === this.fontSize) {
      return;
    }
    if (size && size !== this.fontSize) {
      localStorage.setItem('user-preferred-font', size);
      this.fontSize = size;
    }
    const messages = [];
    const chatMessages = document.querySelectorAll('nb-chat-message-text');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < chatMessages.length; i++) {
      messages.push(chatMessages[i].childNodes[2]);
    }
    if (messages.length) {
      messages.forEach(message => {
        if (message.style) {
          message.style.fontSize = fontSizes[this.fontSize];
        }
      });
    }
  }

  openSettings() {
    this.openSettingsDrawer = !this.openSettingsDrawer;
  }

  closeSettings() {
    this.openSettingsDrawer = false;
  }

  messageAdded() {
    if (this.fontSize !== 'normal') {
      this.changeFontSize();
    }
  }

  changeTheme(themeName: string) {
     if (themeName !== this.defaultTheme) {
       this.defaultTheme = themeName;
       this.themeService.changeTheme(this.defaultTheme);
     }
  }

  openInNewWindow() {
    window.open('http://localhost:4200', 'myconsole',
      'width=350,height=250'
      + ',menubar=0'
      + ',toolbar=1'
      + ',status=0'
      + ',scrollbars=1'
      + ',resizable=1');
  }

  toggleChatBotWindow() {
    this.openChatBot = !this.openChatBot;
    this.openChatBot ? this.openChatBotWindow() : this.closeChatBot();
  }
}
