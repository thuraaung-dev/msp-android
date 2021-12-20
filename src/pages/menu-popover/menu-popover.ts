import 'rxjs/add/operator/map';
import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ToastController, LoadingController, ViewController, App, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';
import { HomePage } from '../home/home';
import { PopularCatogoryPage } from '../popular-catogory/popular-catogory';
import { SearchCategoryPage } from '../search-category/search-category';
import { SearchNamePage } from '../search-name/search-name';
import { SearchCityPage } from '../search-city/search-city';
import { ContactUsPage } from '../contact-us/contact-us';
import { AboutUsPage } from '../about-us/about-us';
import { Keyboard } from '@ionic-native/keyboard';
import { GlobalProvider } from '../../providers/global/global';
import { UtilProvider } from '../../providers/util/util';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DatabaseProvider } from '../../providers/database/database';
import { DataUpdatePage } from '../data-update/data-update';

@Component({
  selector: 'page-menu-popover',
  templateUrl: 'menu-popover.html',
})
export class MenuPopover {
  
  lang: string;
  textMyan: any;
  language: string;
  font: string = 'eng';
  textEng: any;
  textData: string[] = [];
  rootPage: any;
  pages: any;
  username: string = '';

  textMyanfirst: any;
  textEngfirst: any;
  constructor(private keyboard: Keyboard,
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
    public nav: NavController,
    public viewCtrl: ViewController, 
    private nhttp: HTTP) {
    this.textMyan = ["Home", "Popular Categories", "Search by Category", "Search by Name", "Search by City", "About Us", "Contact Us", "Check for Update Data"];
    this.textEng = ["Home", "Popular Categories", "Search by Category", "Search by Name", "Search by City", "About Us", "Contact Us", "Check for Update Data"];
    this.pages = [{
      "name": "", "data": [
        { title: 'Home', component: HomePage, index: '', icon: 'smalllogo.png' },
        { title: 'Popular Categories', component: PopularCatogoryPage, index: '', icon: 'smalllogo.png' },
        { title: 'Search by Category', component: SearchCategoryPage, index: '', icon: 'smalllogo.png' },
        { title: 'Search by Name', component: SearchNamePage, index: '', icon: 'smalllogo.png' },
        { title: 'Search by City', component: SearchCityPage, index: '', icon: 'smalllogo.png' },
        { title: 'About Us', component: AboutUsPage, index: '', icon: 'smalllogo.png' },
        { title: 'Contact Us', component: ContactUsPage, index: '', icon: 'smalllogo.png' },
        { title: 'Check for Update Data', component: "", index: '', icon: 'smalllogo.png' },

      ]
    }
    ];
   
    this.storage.get('language').then((lan) => {
      if (lan == "" || lan == null) {
        this.storage.set('language', "eng");
        lan = "eng";
      }
      this.changelanguage(lan);
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MenuPopoverPage');
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
    this.viewCtrl.dismiss(page);
    /* if (page.title != '') {
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
    } */
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
