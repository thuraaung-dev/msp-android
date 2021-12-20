import { Component } from '@angular/core';
import { Platform, PopoverController, NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BusinessDetailsPage } from '../business-details/business-details';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { HTTP } from '@ionic-native/http';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DataUpdatePage } from '../data-update/data-update';
import { GlobalProvider } from '../../providers/global/global';
@Component({
  selector: 'page-search-city-result',
  templateUrl: 'search-city-result.html',
})
export class SearchCityResultPage {
  textEng: any = ["Search by City"];
  textMyan: any = ["Search by City"];
  searchKey: any = {"name": "", "value":"", "catid":""};;
  description: any; popover: any;
  textData: string[] = []; font: string = '';
  public isLoading; flag: any;
  constructor(private nhttp: HTTP, private all: AllserviceProvider, private global: GlobalProvider, private toastCtrl: ToastController, private alertCtrl: AlertController,
    private platform: Platform, private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    private events: Events, private storage: Storage, private databaseprovider: DatabaseProvider) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });
    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.searchKey = this.navParams.get('param');
    this.searchByCity(this.searchKey);
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

  goDetails(data){
    this.navCtrl.push(BusinessDetailsPage,{
      param: data
    });
  }

  home(){
    this.navCtrl.setRoot(HomePage);
  }

  searchByCity(searchKey) {
    this.isLoading = 0;
    this.databaseprovider.searchByCity(searchKey.value, searchKey.catid).then(data => {
      this.description = data;
      if(this.description.length > 0){
        this.flag = 1;
      } else {
        this.flag = 0;
      }
      this.isLoading = 1;
    })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchCityResultPage');
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
