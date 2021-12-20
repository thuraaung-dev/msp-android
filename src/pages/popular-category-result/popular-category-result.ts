import { Component } from '@angular/core';
import { Platform, PopoverController, NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BusinessDetailsPage } from '../business-details/business-details';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { GlobalProvider } from '../../providers/global/global';
import { HTTP } from '@ionic-native/http';


@Component({
  selector: 'page-popular-category-result',
  templateUrl: 'popular-category-result.html',
})
export class PopularCategoryResultPage {
  textEng: any = ["Search by Category"];
  textMyan: any = ["Search by Category"];
  textData: string[] = []; font: string = '';
  searchKey: any = {"text": "", "code":"", "image":""};
  description: any; popover: any;
  cityList: any = ["Naypyitaw", "Yangon", "Mandalay","Other Cities"]
  public isLoading; flag: any; flag2: any;
  constructor(private nhttp: HTTP, private all: AllserviceProvider, private alertCtrl: AlertController,
    private global: GlobalProvider, private toastCtrl: ToastController,private platform: Platform, private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    private events: Events, private storage: Storage, private databaseprovider: DatabaseProvider) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });
    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.searchKey = this.navParams.get('param');
    this.searchByPopularCatetory(this.searchKey);
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
    // console.log("popular-category-result-data>>"+JSON.stringify(data))
    this.navCtrl.push(BusinessDetailsPage,{
      param: data
    });
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopularCategoryResultPage');
  }

  searchByPopularCatetory(searchKey) {
    this.isLoading = 0;
    this.databaseprovider.searchByPopularCatetory("", searchKey.code).then(data => {
      this.description = data;
      if(this.description.length > 0){
        this.flag = 1;
        this.flag2 = 1;
      } else {
        this.flag = 0;
      }
      this.isLoading = 1;
    })
  }
  searchByCityCatetory(searchKey) {
    this.isLoading = 0;
    this.databaseprovider.searchByPopularCatetory(searchKey, this.searchKey.code).then(data => {
      this.description = data;
      if(this.description.length > 0){
        this.flag2 = 1;
      }  else {
        this.flag2 = 0;
      }
      this.isLoading = 1;
    })
  }
  home(){
    this.navCtrl.setRoot(HomePage);
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
