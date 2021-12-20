import { Component, ViewChild } from '@angular/core';
import { PopoverController, NavController, NavParams, Events, ToastController, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { SearchCityResultPage } from '../search-city-result/search-city-result';
import { HomePage } from '../home/home';
import { Lovbypage } from '../lovbypage/lovbypage';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { HTTP } from '@ionic-native/http';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-search-city',
  templateUrl: 'search-city.html',
})
export class SearchCityPage {
  textEng: any = ["Search by City", "Choose Category", "Search"];
  textMyan: any = ["Search by City", "Company Category", "ရှာဖွေပါ"];
  cityList: any = ["Naypyitaw", "Yangon", "Mandalay","Other Cities"]
  categorylist: any; townshiplist: any;
  category: any; township: any;
  textData: string[] = [];
  font: string = ''; companyName: string = ''; townshipName: string = '';
  searchKey = {"name": "", "value":"", "catid":""};
  categoryName: string = 'Choose Category';
  type: any = "eng";
  modal: any; popover: any;
  hardwareBackBtn: any = true;
  constructor(private all: AllserviceProvider, private nhttp: HTTP, private global: GlobalProvider,
    private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController,
    private events: Events, private storage: Storage, public databaseprovider: DatabaseProvider, private platform: Platform, private alertCtrl: AlertController) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });

    this.storage.get('language').then((font) => {
      this.changelanguage(font);
      ////// console.log("state data=" + JSON.stringify(this.textData));
    });
    this.getAllCategory();
    this.getTownshipByCity();
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

  getAllCategory() {
    this.databaseprovider.getAllCategoryEng().then(data => {
      this.categorylist = data;
    })
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

  getTownshipByCity(){
    this.databaseprovider.getTownshipByCity(this.cityList[1]).then(data => {
      this.townshiplist = data;
    })
    this.townshipName = this.cityList[1];
  }

  goMenu(city){
    this.databaseprovider.getTownshipByCity(city).then(data => {
      this.townshiplist = data;
    })
    this.townshipName = city;
  }

  changeCategory(data){
    this.category = data;
  }

  changeTownship(data){
    // console.log("changeTownship>>" + data)
    this.township = data;
  }

  home(){
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchCityPage');
  }

  search(){
    if(this.township == undefined || this.township == ''){
      let msg = "Please choose Township!";
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true,
      });
      toast.present(toast);
    } else {
      if(this.category == undefined || this.category == ''){
        this.searchKey.catid = "";
        this.searchKey.name = this.township.name;
        this.searchKey.value = this.township.value;
      } /* else if(this.township == undefined){
        this.searchKey.catid = this.category.value;
        this.searchKey.name = "";
        this.searchKey.value = "";
      }  */else {
        this.searchKey.name = this.township.name;
        this.searchKey.value = this.township.value;
        this.searchKey.catid = this.category.value;
      }
      this.navCtrl.push(SearchCityResultPage, {
        param: this.searchKey
      });
    }
  }

  goCategoryList(){
    this.navCtrl.push(Lovbypage, {
      data: this.type
    });
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
