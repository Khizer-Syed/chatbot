import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import * as uuid from 'uuid';
import {filter, map} from 'rxjs/operators';

const apiUrl = environment.apiUrl;

@Injectable()
export class ChatService {
  sessionId = uuid.v4();

  constructor(private http: HttpClient) {
  }

  query(text) {
    return this.http.post<any>(
      apiUrl + '/query',
      {
        sessionId: this.sessionId,
        queryInput: {
          text: {
            text,
            languageCode: 'en-US'
          }
        }
      }
    ).pipe(map(res => res.fulfillmentMessages[0].text.text[0]),
      filter(message => !!message));
  }
}
