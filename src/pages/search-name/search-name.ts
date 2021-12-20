import { Component } from '@angular/core';
import { PopoverController, NavController, NavParams, Events, ToastController, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SearchNameResultPage } from '../search-name-result/search-name-result';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { DatabaseProvider } from '../../providers/database/database';
import { HTTP } from '@ionic-native/http';
import { GlobalProvider } from '../../providers/global/global';
import { AllserviceProvider } from '../../providers/allservice/allservice';

@Component({
  selector: 'page-search-name',
  templateUrl: 'search-name.html',
})
export class SearchNamePage {
  textEng: any = ["Search by Name", "Company Name", "Search"];
  textMyan: any = ["Search by Name", "Company Name", "ရှာဖွေပါ"];
  textData: string[] = []; 
  font: string = ''; companyName: string = ''; type: any;
  data: any = {"companyName": "", "type": "1" };
  modal: any; popover: any;
  hardwareBackBtn: any = true;
  constructor( private databaseprovider: DatabaseProvider, private nhttp: HTTP, private global: GlobalProvider, private all: AllserviceProvider, private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private alertCtrl: AlertController,
    private events: Events, private storage: Storage, public toastCtrl: ToastController,) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });

    this.storage.get('language').then((font) => {
      this.changelanguage(font);
      ////console.log("state data=" + JSON.stringify(this.textData));
    });
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
  changeType(type){
    this.data.type = type;
  }

  home(){
    this.navCtrl.setRoot(HomePage);
  }

  search(){
    if(this.companyName == undefined || this.companyName == '' || this.companyName == 'Company Name'){
      let msg = "Please type Company Name!";
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true,
      });
      toast.present(toast);
    } else {
      this.data.companyName = this.companyName;
      this.navCtrl.push(SearchNameResultPage,{
        param: this.data
      });
    }  
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchNamePage');
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
