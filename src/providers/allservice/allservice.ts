import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
declare var AesUtil: any;
declare var CryptoJS: any;
/*
  Generated class for the AllserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AllserviceProvider {
  public alertPresented: any;
  constructor(public http: Http, public alertCtrl: AlertController) {
    
  }

  getErrorMessage(error) {
    /* ionic App error
    ............001) url link worng, not found method (404)
    ........... 002) server not response (500)
    ............003) cross fillter not open (403)
    ............004) server stop (-1)
    ............005) app lost connection (0)
    */
    let code;
    if (error.status == 404) {
      code = '001';
    }
    else if (error.status == 500) {
      code = '002';
    }
    else if (error.status == 403) {
      code = '003';
    }
    else if (error.status == -1) {
      code = '004';
    }
    else if (error.status == 0) {
      code = '005';
    }
    else if (error.status == 502) {
      code = '006';
    }
    else {
      code = '000';
    }
    let msg = "Can't connect right now. [" + code + "]";
    return msg;
  }
  showAlert(titleText, subTitleText) {
    if (this.alertPresented == undefined) {
      let alert = this.alertCtrl.create({
        title: titleText,
        subTitle: subTitleText,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.alertPresented = undefined;
            }
          }
        ],
      });

      this.alertPresented = alert.present();
      setTimeout(() => alert.dismiss(), 2000 * 60);
    }
  }

  getIvs() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
  }

  getEncryptText(iv, salt, dm, password) {
    var plaintext = password;
    var aesUtil = new AesUtil(128, 1000);
    password = aesUtil.encrypt(salt, iv, '!@#$29!@#$Gp**&*', plaintext);
    return password;
  }
}
