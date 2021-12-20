import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController, AlertController, Events, Platform, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';
import { App } from 'ionic-angular';
import { UtilProvider } from '../../providers/util/util';
import { PopularCatogoryPage } from '../popular-catogory/popular-catogory';
import { SearchCategoryPage } from '../search-category/search-category';
import { SearchNamePage } from '../search-name/search-name';
import { SearchCityPage } from '../search-city/search-city';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../../providers/database/database';
import { HomeCategoryResultPage } from '../home-category-result/home-category-result';
import { Lovbypage } from '../lovbypage/lovbypage';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { HTTP } from '@ionic-native/http';
import { AllserviceProvider } from '../../providers/allservice/allservice';
@Component({
  selector: 'home',
  templateUrl: 'home.html',
})
export class HomePage {
  modal: any;
  hardwareBackBtn: any = true;
  private options = { name: "mmypnew_000.db", location: 'default', createFromLocation: 1 };
  private queryNames = "SELECT catName from tblcategory ORDER BY catName";
  textEng: any = ["Myanmar Super Pages", "Business Name", "Search", "Popular Categories", "Search by Category",
"Search by Name", "Search by City"];
  textMyan: any = ["Myanmar Super Pages", "လုပ်ငန်းအမည်", "ရှာဖွေပါ",  "Popular Categories", "Search by Category",
"Search by Name", "Search by City"];
  textData: string[] = [];
  font: string = '';

  passTemp1: any;
  passTemp2: any;
  passTemp3: any;
  passTemp4: any;
  passTemp5: any;//wcs

  dataValue: any = [];
  userData: any;
  businessName: string = '';
  categoryName: string = 'Choose Category';
  reference: string = '';
  today: any;
  popover: any;
  errormsg1: string = '';
  categorylist: any;
  category: any = '';
  searchKey = {"name": "", "value":"", "busiName":""};
  type: any = "eng";
  public alertPresented: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public events: Events, public alertCtrl: AlertController,
    public global: GlobalProvider, public viewCtrl: ViewController,
    public platform: Platform, public popoverCtrl: PopoverController, 
    public appCtrl: App, private nhttp: HTTP, private all: AllserviceProvider,
    public util: UtilProvider, public sqlite: SQLite, public databaseprovider: DatabaseProvider, public toastCtrl: ToastController) {
    this.events.subscribe('changelanguage', lan => {
      if (lan == "" || lan == null) {
        this.storage.set('language', "eng");
        lan = "eng";
      }
      this.changelanguage(lan);
    });
    this.storage.get('language').then((lan) => {
      if (lan == "" || lan == null) {
        this.storage.set('language', "eng");
        lan = "eng";
      }
      this.changelanguage(lan);
    });
    /* this.platform.registerBackButtonAction(() => {
      this.backButtonAction();
    }); */
  }

  getAllCategory() {
    this.databaseprovider.getAllCategoryEng().then(data => {
      this.categorylist = data;
    })
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
  changeAlpha(type){
    if(type == 'eng'){
      this.categoryName = "Choose Category";
    } else {
      this.categoryName = "အမျိုးအစား ရွေးချယ်ပါ";
    }
    
    this.category = "";
    this.type = type;
  }

  goCategoryList(){
    this.navCtrl.push(Lovbypage, {
      data: this.type
    });
  }

  changeCategory(data){
    this.category = data;
  }

  search(){
    if(this.businessName == "" && this.category == ''){
      let msg = "Please select at least one!";
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true,
      });
      toast.present(toast);
    } else {
      if(this.category == '' || this.categoryName == 'Choose Category' || this.categoryName == 'အမျိုးအစား ရွေးချယ်ပါ'){
        this.searchKey.name = "";
        this.searchKey.value = "";
      } else {
        this.searchKey.name = this.category.name;
        this.searchKey.value = this.category.value;
      }
      this.searchKey.busiName = this.businessName;
      this.navCtrl.push(HomeCategoryResultPage, {
        param: this.searchKey
      });
    }
    
  }

  goMenu(index){
    if (index == 1) {
      this.navCtrl.push(PopularCatogoryPage);
    } else if (index == 2) {
      this.navCtrl.push(SearchCategoryPage);
    } else if (index == 3) {
      this.navCtrl.push(SearchNamePage);
    } else if (index == 4) {
      this.navCtrl.push(SearchCityPage);
    }
  }

  ionViewWillEnter() {
    this.events.subscribe('pop-data', cat => {
      this.category = cat
      if(this.category != undefined){
        this.categoryName = this.category.name;  
      }
    });
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
    /*  this.databaseprovider.updatePublichedDate().then(date => {
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

  backButtonAction() {
    if (this.alertPresented == undefined) {
      let alert = this.alertCtrl.create({
        title: '',
        enableBackdropDismiss: false,
        message: 'Are you sure you want to exit?',
        buttons: [{
          text: 'No',
          handler: () => {
            this.hardwareBackBtn = true;
            this.alertPresented = undefined;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.platform.exitApp();
            this.alertPresented = undefined;
          }
        }],
        cssClass: 'confirmAlert'
      });
      this.alertPresented = alert.present();
      this.hardwareBackBtn = false;
    } 
   
  }

  
}
