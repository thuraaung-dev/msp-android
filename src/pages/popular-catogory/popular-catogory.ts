import { Component } from '@angular/core';
import { PopoverController, NavController, NavParams, Events, Platform, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PopularCategoryResultPage } from '../popular-category-result/popular-category-result';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { HTTP } from '@ionic-native/http';
import { GlobalProvider } from '../../providers/global/global';
import { DataUpdatePage } from '../data-update/data-update';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DatabaseProvider } from '../../providers/database/database';
@Component({
  selector: 'page-popular-catogory',
  templateUrl: 'popular-catogory.html',
})
export class PopularCatogoryPage {
  textEng: any = ["Popular Categories", "Air Line", "Bank (Foreign)", "Bank (Local)",
  "Car Servicing", "Cinema", "Clinics", "Computer Sales/Services",
  "Education", "Furniture", "Guest House",
  "Highway", "Hospitals", "Hotels,Motels&Inns",
  "Restaurants", "Shopping", "Mobile Phone Shop", "Motocar Rental", "Tourism"];
  textMyan: any = ["Popular Categories", "Air Line", "Bank (Foreign)", "Bank (Local)",
  "Car Servicing", "Cinema", "Clinics", "Computer Sales/Services",
  "Education", "Furniture", "Guest House",
  "Highway", "Hospitals", "Hotels,Motels&Inns",
  "Restaurants", "Shopping", "Mobile Phone Shop", "Motocar Rental", "Tourism"];
  textData: string[] = [];
  itemList: any = [
    {"text": "Air Line", "image": "cibtn1.png", "code": "15"},
    {"text": "Bank (Foreign)", "image": "cibtn2.png", "code": "44"},
    {"text": "Bank (Local)", "image": "cibtn3.png", "code": "45"},
    {"text": "Car Servicing", "image": "cibtn13.png", "code": "386"},
    {"text": "Cinema", "image": "cibtn4.png", "code": "98"},
    {"text": "Clinics", "image": "cibtn5.png", "code": "102"},
    {"text": "Computer Sales/Services", "image": "cibtn6.png", "code": "119"},
    {"text": "Education", "image": "cibtn8.png", "code": "186"},
    {"text": "Furniture", "image": "cibtn21.png", "code": "249"},
    {"text": "Guest House", "image": "cibtn9.png", "code": "274"},
    {"text": "Highway", "image": "cibtn10.png", "code": "285"},
    {"text": "Hospitals", "image": "cibtn11.png", "code": "289"},
    {"text": "Hotels,Motels&Inns", "image": "cibtn12.png", "code": "294"},
    {"text": "Restaurants", "image": "cibtn20.png", "code": "460"},
    {"text": "Shopping", "image": "cibtn7.png", "code": "358"},
    {"text": "Mobile Phone Shop", "image": "cibtn15.png", "code": "371"},
    {"text": "Motocar Rental", "image": "cibtn19.png", "code": "385"},
    {"text": "Tourism", "image": "cibtn16.png", "code": "551"},
  ];
  font: string = '';
  modal: any; popover: any;
  hardwareBackBtn: any = true;
  constructor(private nhttp: HTTP, private all: AllserviceProvider, private databaseprovider: DatabaseProvider,
    private global: GlobalProvider, private toastCtrl: ToastController, private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    private events: Events, private storage: Storage, public platform: Platform) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });
    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopularCatogoryPage');
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

  home(){
    this.navCtrl.setRoot(HomePage);
  }

  goMenu(data){
    this.navCtrl.push(PopularCategoryResultPage,{
      param: data
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
}
