import { Component } from '@angular/core';
import { PopoverController, NavController, NavParams, Events, ToastController, Platform, AlertController, LoadingController, Header } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DatabaseProvider } from '../../providers/database/database';
import { HTTP } from '@ionic-native/http';
import { MenuPopover } from '../menu-popover/menu-popover';
@Component({
  selector: 'page-data-update',
  templateUrl: 'data-update.html',
})
export class DataUpdatePage {

  textEng: any = ["Update Data",];
  textMyan: any = ["Update Data"];
  textData: string[] = [];
  font: string = ''; companyName: string = ''; type: any;
  data: any = { "companyName": "", "type": "1" };
  modal: any;
  hardwareBackBtn: any = true;
  publishDate: any;
  public loading; popover: any;
  updateDate: any;
  constructor(private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams, private platform: Platform,
    private alertCtrl: AlertController, private nhttp: HTTP,
    public loadingCtrl: LoadingController, private databaseprovider: DatabaseProvider,
    public http: Http, private global: GlobalProvider, private all: AllserviceProvider,
    private events: Events, private storage: Storage, public toastCtrl: ToastController, ) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });

    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.publishDate = this.navParams.get('data');
  }
  changelanguage(font) {
    if (font == "eng") {
      this.font = "";
      for (let i = 0; i < this.textEng.length; i++) {
        this.textData[i] = this.textEng[i];
      }
    } else {
      this.font = "uni";
      for (let i = 0; i < this.textMyan.length; i++) {
        this.textData[i] = this.textMyan[i];
      }
    }
  }

  home() {
    this.navCtrl.setRoot(HomePage);
  }

  goCancel() {
    this.navCtrl.setRoot(HomePage);
  }

  goUpdate() {
    this.loading = this.loadingCtrl.create({
      content: "Updating data...",
      dismissOnPageChange: true
      // duration: 3000
    });
    this.loading.present();
    let header = new Headers();
    header.append('Access-Control-Allow-Origin' , '*');
    header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    header.append('Accept','application/json');
    header.append('content-type','application/json');
     let options = new RequestOptions({ headers : header, withCredentials: true});
    this.http.get(this.global.update_db_api_url + "key=" + this.global.api_key + "&modify_at=" +
      this.publishDate + "&limit_start=0&limit_end=5000", options
    ).map(res => res.json()).subscribe(result => {
      // console.log("update-data-result>>" + JSON.stringify(result))
      // update to local db
      this.updateToLocalDBV2(result.resultData.data);
    },
      error => {
        let msg = this.all.getErrorMessage(error);
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 5000,
          position: 'bottom',
          //  showCloseButton: true,
          dismissOnPageChange: true,
          // closeButtonText: 'OK'
        });
        toast.present(toast);

      });
  }

  goUpdateV2() {
    this.loading = this.loadingCtrl.create({
      content: "Updating data...",
      dismissOnPageChange: true
      // duration: 3000
    });
    this.loading.present();
    
    this.nhttp.get(this.global.update_db_api_url + "key=" + this.global.api_key + "&modify_at=" +
      this.publishDate + "&limit_start=0&limit_end=5000", {},{}
      ).then(result => {
      let ret = JSON.parse(result.data);
      this.updateToLocalDBV2(ret.resultData.data);
    },
      error => {
        let msg = this.all.getErrorMessage(error);
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 5000,
          position: 'bottom',
          //  showCloseButton: true,
          dismissOnPageChange: true,
          // closeButtonText: 'OK'
        });
        toast.present(toast);
        this.loading.dismiss();
      });
  }

  backButtonAction() {
    if (this.modal && this.modal.index === 0) {
      this.modal.dismiss();
    } else {
      if (this.hardwareBackBtn) {
        let alert = this.alertCtrl.create({
          title: '',
          enableBackdropDismiss: false,
          message: 'Are you sure you want to exit?',
          buttons: [{
            text: 'No',
            handler: () => {
              this.hardwareBackBtn = true;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.platform.exitApp();
            }
          }],
          cssClass: 'confirmAlert'
        });
        alert.present();
        this.hardwareBackBtn = false;
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataUpdatePage');
  }

  updateToLocalDBV2(data) {
    if (data.delete.length > 0) {
      this.databaseprovider.deleteTBDataV2(data.delete).then(del => {
        // tblcategory
          this.databaseprovider.updateAllCategoryData(data.tblcategory).then(category => {
            // tblbuscat
              this.databaseprovider.updateAllBusCatData(data.tblbuscat).then(buscat => {
                // tblbusiness
                  this.databaseprovider.updateAllBusinessData(data.tblbusiness).then(business => {
                    // tbllocation
                      this.databaseprovider.updateAllLocationData(data.tbllocation).then(location => {
                        // tblimage
                          this.databaseprovider.updateAllImageData(data.tblimage).then(image => {
                            // tblsetting
                            if (data.modify_at != '') {
                              this.databaseprovider.updateSettingData(data.modify_at).then(ret => {
                                if (ret) {
                                  this.loading.dismiss();
                                  let confirm = this.alertCtrl.create({
                                    title: "",
                                    message: "App data is updated Successfully.",
                                    enableBackdropDismiss: false,
                                    buttons: [
                                      {
                                        text: 'OK',
                                        handler: () => {
                                          this.navCtrl.setRoot(HomePage);
                                        }
                                      }
                                    ]
                                  });
                                  confirm.present();
                                }
                              });
                            }
                          });
                      });
                  });
              });
          });
      });
    }

  }

  presentPopover(ev) {
    this.popover = this.popoverCtrl.create(MenuPopover, {
    });
    this.popover.present({
      ev: ev
    });
    let doDismiss = () => this.popover.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.popover.onDidDismiss(unregBackButton);
    this.popover.onWillDismiss(page => {
      if (page.title != '') {
        if (page.title == 'Home') {
          this.navCtrl.setRoot(page.component);
        }
        else if (page.title == 'Check for Update Data') {
          // check internet connection
          if (this.global.netWork == 'disconnected') {
            let msg = "Please check network connection and try again!";
            let toast = this.toastCtrl.create({
              message: msg,
              duration: 3000,
              position: 'bottom',
              dismissOnPageChange: true,
            });
            toast.present(toast);
          } else {
            this.checkForUpdate();
          }
        } else {
          this.navCtrl.push(page.component)
        }
        // this.nav.setRoot(page.component);
      }      
    });
  }

  checkForUpdate() {
       // console.log("updated date>>" + date) */
     this.databaseprovider.getPublishedDate().then(date => {
       this.nhttp.get(this.global.check_version_api_url + "key=" + this.global.api_key + "&modify_at=" + date, {}, {}).then(result => {
         // console.log("result>>" + result.data)
         let ret = JSON.parse(result.data);
         if (ret.isUpdate == true) {
           this.navCtrl.setRoot(DataUpdatePage, {
             data: date
           })
         } else {
           let confirm = this.alertCtrl.create({
             title: "",
             message: "App data is already updated.",
             enableBackdropDismiss: false,
             buttons: [
               {
                 text: 'OK',
                 handler: () => {
                 }
               }
             ]
           });
           confirm.present();
         }
       },
         error => {
           let msg = this.all.getErrorMessage(error);
           let toast = this.toastCtrl.create({
             message: msg,
             duration: 5000,
             position: 'bottom',
             //  showCloseButton: true,
             dismissOnPageChange: true,
             // closeButtonText: 'OK'
           });
           toast.present(toast);
 
         });
     })
   //})
   }
}
