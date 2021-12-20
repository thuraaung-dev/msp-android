import { Component } from '@angular/core';
import { PopoverController, NavController, NavParams, Events, Platform, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SearchCategoryResultPage } from '../search-category-result/search-category-result';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { GlobalProvider } from '../../providers/global/global';
import { HTTP } from '@ionic-native/http';
import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the SearchCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-category',
  templateUrl: 'search-category.html',
})
export class SearchCategoryPage {
  textEng: any = ["Search by Category", "View All Categories"];
  textMyan: any = ["Search by Category", "View All Categories"];
  textData: string[] = [];
  engAlpha : any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  mmAlpha : any = ['က', 'ခ', 'ဂ', 'ဃ', 'င', 'စ', 'ဆ', 'ဇ', 'ဈ', 'ည', 'ဋ', 'ဌ', 'ဍ', 'ဎ', 'ဏ', 'တ', 'ထ',
'ဒ', 'ဓ', 'န', 'ပ', 'ဖ', 'ဗ', 'ဘ', 'မ', 'ယ', 'ရ', 'လ', 'ဝ', 'သ', 'ဟ', 'ဠ', 'အ'];
  alphaTypeList = ['eng', 'mm'];
  alpha : any;  font: string = '';
  data: any = {"name": "", "type": ""}
  modal: any; popover: any;
  hardwareBackBtn: any = true;
  constructor(private nhttp: HTTP, private all: AllserviceProvider, private toastCtrl: ToastController,
    private global: GlobalProvider, private databaseprovider: DatabaseProvider, private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    private events: Events, private storage: Storage, private platform: Platform, private alertCtrl: AlertController) {
    this.alpha = this.alphaTypeList[0];
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });
    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
  }
  
  changeAlpha(type){
    if(type == 'eng'){
      this.alpha = 'eng';
    } else {
      this.alpha = 'mm';
    }
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
    this.data.name = data;
    this.data.type = this.alpha;
    this.navCtrl.push(SearchCategoryResultPage,{
      param: this.data
    });
  }

  goMenuAll(){
    this.data.name = "";
    this.data.type = this.alpha;
    this.navCtrl.push(SearchCategoryResultPage,{
      param: this.data
    });
  }
  
  home(){
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchCategoryPage');
  }

  /* backButtonAction() {
    if (this.modal && this.modal.index === 0) {
      this.modal.dismiss();
    } else {
      if (this.hardwareBackBtn) {
        let alert = this.alertCtrl.create({
          title: 'Are you sure you want to exit?',
          enableBackdropDismiss: false,
          message: '',
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
  } */
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
