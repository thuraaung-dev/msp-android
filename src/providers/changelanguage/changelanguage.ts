import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ChangelanguageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChangelanguageProvider {
  textFont : any = [];
  font:string;
  popoverItemList : any [] = [{name: '',key:0},{name: '',key:1}, {name: '',key:2},{name: '',key:3}];
  constructor( public http: Http) {
    //// console.log('Hello ChangelanguageProvider Provider');
  }

  changelanguage(lan, txtEng, txtMyan) {
    if (lan == 'uni') {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.textFont[j] = txtMyan[j];
      }

    }
    else if(lan=='myan')
    {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.textFont[j] = txtMyan[j];
      }
    }
    else{
      for (let j = 0; j <  txtEng.length;j++) {
        this.textFont[j] = txtEng[j];
      }
    }
    return Promise.resolve(this.textFont);
  }

  changeLanguageForPopup(lan, txtEng, txtMyan){
    //// console.log("hh="+JSON.stringify(txtMyan))
    if (lan == 'uni') {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.popoverItemList[j].name = txtMyan[j].name;
      }
    }
    else{
      for (let j = 0; j <  txtEng.length;j++) {
        this.popoverItemList[j].name = txtEng[j].name;
      }
    }
    return Promise.resolve(this.popoverItemList);
  }

}
