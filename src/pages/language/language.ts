import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class Language {

  chooseLanguage: any;
  textMyan: any = ['ဘာသာစကား', 'English', 'မြန်မာ'];
  textEng: any = ['Language Setting', 'English', 'Myanmar'];
  textData: any = [];

  constructor(
    public storage: Storage,
    public events: Events
  ) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });

    this.storage.get('language').then((lan) => {
      this.chooseLanguage = lan;
      this.changelanguage(lan);
    });
  }

  changelanguage(lan) {
    if (lan == 'eng') {
      for (let j = 0; j < this.textEng.length; j++) {
        this.textData[j] = this.textEng[j];
      }
    } else {
      for (let j = 0; j < this.textMyan.length; j++) {
        this.textData[j] = this.textMyan[j];
      }
    }
  }

  mcqAnswer(s) {
    this.storage.set('language', s);
    this.events.publish('changelanguage', s);
  }

  ionViewCanEnter() {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    }) //...

    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
  } 

}
