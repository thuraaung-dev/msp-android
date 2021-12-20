import 'rxjs/add/operator/map';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, LoadingController, App, ViewController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { GlobalProvider } from '../providers/global/global';
import { Keyboard } from '@ionic-native/keyboard';

import { UtilProvider } from '../providers/util/util';
import { HomePage } from '../pages/home/home';
import { PopularCatogoryPage } from '../pages/popular-catogory/popular-catogory';
import { SearchCategoryPage } from '../pages/search-category/search-category';
import { SearchNamePage } from '../pages/search-name/search-name';
import { SearchCityPage } from '../pages/search-city/search-city';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { AboutUsPage } from '../pages/about-us/about-us';
import { AllserviceProvider } from '../providers/allservice/allservice';
import { DatabaseProvider } from '../providers/database/database';
import { DataUpdatePage } from '../pages/data-update/data-update';
import { HTTP } from '@ionic-native/http';
export const myConst = {
  walletApp: {
    ios: {
      storeUrl: 'itms-apps://itunes.apple.com/us/app/',
      appId: 'NSB Pay://'
    },
    android: {
      storeUrl: 'https://play.google.com/store/apps/details?id=com',
      appId: 'NSB Pay'
    }
  }
}
@Component({
  templateUrl: 'app.html',
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;
  lang: string;
  textMyan: any;
  language: string;
  font: string = 'eng';
  textEng: any;
  textData: string[] = [];
  appName: string = '';
  rootPage: any;
  fontType: string;
  pages: any;

  //original
  ipaddress: string;
  flag: any;

  textMyanfirst: any;
  textEngfirst: any;
  constructor(
    private keyboard: Keyboard,
    public platform: Platform,
    public app: App,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public sqlite: SQLite,
    public events: Events,
    public global: GlobalProvider,
    public util: UtilProvider,
    public all: AllserviceProvider,
    private databaseprovider: DatabaseProvider,
    private nhttp: HTTP
  ) {
    this.flag = false;
    this.textMyan = ["Home", "Popular Categories", "Search by Category", "Search by Name", "Search by City", "About Us", "Contact Us", "Check for Update Data"];
    this.textEng = ["Home", "Popular Categories", "Search by Category", "Search by Name", "Search by City", "About Us", "Contact Us", "Check for Update Data"];
    this.flag = true;
    this.pages = [{
      "name": "", "data": [
        { title: 'Home', component: HomePage, index: '', icon: 'ios-home-outline' },
        { title: 'Popular Categories', component: PopularCatogoryPage, index: '', icon: 'ios-search-outline' },
        { title: 'Search by Category', component: SearchCategoryPage, index: '', icon: 'ios-search-outline' },
        { title: 'Search by Name', component: SearchNamePage, index: '', icon: 'ios-search-outline' },
        { title: 'Search by City', component: SearchCityPage, index: '', icon: 'ios-search-outline' },
        { title: 'About Us', component: AboutUsPage, index: '', icon: 'ios-information-circle-outline' },
        { title: 'Contact Us', component: ContactUsPage, index: '', icon: 'ios-call-outline' },
        { title: 'Check for Update Data', component: "", index: '', icon: 'ios-cloud-download-outline' },

      ]
    }
    ];
    
    this.initializeApp();
    this.appName = this.global.appName;
    
  }

  initializeApp() {
    this.keyboard.disableScroll(false);
    this.platform.ready().then(() => {
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
      this.ipaddress = this.global.ipaddress;
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = HomePage
      this.platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        let activeView: ViewController = nav.getActive();
        if (activeView != null) {
          if (nav.canGoBack()) {
            nav.pop();
          } else if (typeof activeView.instance.backButtonAction === 'function') {
            activeView.instance.backButtonAction();
          }
          else {
            this.platform.exitApp();
          }
        }
      });
    });
  }
  changelanguage(lan) {
    if (lan == "eng") {
      for (let i = 0; i < this.pages.length; i++) {
        if (this.pages[i].name != '') {
          this.pages[i].name = this.textEng[11];
        }
        for (let j = 0; j < this.pages[i].data.length; j++) {
          this.pages[i].data[j].title = this.textEng[j];
        }
      }
    } else {
      for (let i = 0; i < this.pages.length; i++) {
        if (this.pages[i].name != '') {
          this.pages[i].name = this.textMyan[11];
        }
        for (let j = 0; j < this.pages[i].data.length; j++) {
          this.pages[i].data[j].title = this.textMyan[j];
        }
      }
    }
  }


  openPage(page) {
    if (page.title != '') {
      if (page.title == 'Home') {
        this.nav.setRoot(page.component);
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
        this.nav.push(page.component)
      }
      // this.nav.setRoot(page.component);
    } else {
    }
  }

  checkForUpdate() {
    /*  this.databaseprovider.updatePublichedDate().then(date => {
       // console.log("updated date>>" + date) */
     this.databaseprovider.getPublishedDate().then(date => {
       this.nhttp.get(this.global.check_version_api_url + "key=" + this.global.api_key + "&modify_at=" + date, {}, {}).then(result => {
         // console.log("result>>" + result.data)
         let ret = JSON.parse(result.data);
         if (ret.isUpdate == true) {
           this.nav.setRoot(DataUpdatePage, {
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

