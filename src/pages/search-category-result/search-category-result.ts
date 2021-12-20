import { Component } from '@angular/core';
import { Platform, PopoverController, NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BusinessDetailsPage } from '../business-details/business-details';
import { DatabaseProvider } from '../../providers/database/database';
import { PopularCategoryResultPage } from '../popular-category-result/popular-category-result';
import { SearchNamePage } from '../search-name/search-name';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { HTTP } from '@ionic-native/http';
import { DataUpdatePage } from '../data-update/data-update';
import { GlobalProvider } from '../../providers/global/global';
import { AllserviceProvider } from '../../providers/allservice/allservice';
@Component({
  selector: 'page-search-category-result',
  templateUrl: 'search-category-result.html',
})
export class SearchCategoryResultPage {
  textEng: any = ["Search by Category"];
  textMyan: any = ["Search by Category"];
  textData: string[] = []; font: string = '';
  searchKey: any = {"name": "", "type":""};
  description: any; flag: any;
  data: any = {"text": "", "code":"", "image":""};
  public isLoading = 0; popover: any;
  constructor(private nhttp: HTTP, private global: GlobalProvider, private alertCtrl: AlertController, private all: AllserviceProvider, private toastCtrl: ToastController, private platform: Platform, private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    private events: Events, private storage: Storage, private databaseprovider: DatabaseProvider) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });
    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.searchKey = this.navParams.get('param');
    this.isLoading = 0;
    this.searchByCategory(this.searchKey);
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

  goMenu(data){
    this.data.text = data.name;
    this.data.code = data.value;
    this.navCtrl.push(PopularCategoryResultPage,{
      param: this.data
    });
  }

  
  searchByCategory(searchKey) {
    this.databaseprovider.searchByCategory(searchKey.name, searchKey.type).then(data => {
      this.description = data;
      if(this.description.length > 0){
        this.flag = 1;
      } else {
        this.flag = 0;
      }
      this.isLoading = 1;
    })
  }

  home(){
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
    // console.log("this.searchKey>>"+JSON.stringify(this.searchKey));
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
