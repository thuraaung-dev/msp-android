import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DatabaseProvider } from '../../providers/database/database';
import { HTTP } from '@ionic-native/http';
import { GlobalProvider } from '../../providers/global/global';
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  textEng: any = ["Contact Us", "Choose Category", "Search"];
  textMyan: any = ["Contact Us", "Company Category", "ရှာဖွေပါ"];
  data: any;
  textData: string[] = [];
  font: string = ''; companyName: string = '';
  modal: any; popover: any;
  hardwareBackBtn: any = true;
  constructor(private global: GlobalProvider, private all: AllserviceProvider, private toastCtrl: ToastController, private databaseprovider: DatabaseProvider, private nhttp: HTTP,
    private popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    private events: Events, private storage: Storage, private platform: Platform, private alertCtrl: AlertController) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });

    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.data = "<b>NI LWIN SOE PUBLISHING HOUSE</b>" +
    "<br><b>(The Publisher of MYANMAR SUPER PAGES, THE NAYPYITAW DIRECTORY AND GUIDE MAP)</b>" +

    "<br><br><b>YANGON HEAD OFFICE</b>" +
    "<br>Managing Director :Ni Lwin Soe (nilwinsoe-md@myanmarsuperpages.com)" +

    "<br><br><b>SALES DEPARTMENT</b>" +
    "<br>Moe Moe Aye - Director (mmsppgsales@myanmarsuperpages.com) " +

    "<br><br><b>UNIT(1)</b>" +
    "<br>Phyu Phyu Tun - Manager" +
    "<br>Han Ko Win - Senior Sales Manager" +
    "<br>Ei Thinzar Moe - Senior Sales Executive" +
    "<br>Thazin Myint Aung - Sales Executive " +
    "<br>Myat Kay Khine - Sales Executive " +

    "<br><br><b>UNIT(2)</b>" +
    "<br>Than Win Kyaw - Manager" +
    "<br>Saw Ei Khine - Senior Sales Executive" +
    "<br>Chue Thet Lae - Senior Sales Executive" +
    "<br>Cherry Win - Sales Executive" +
    "<br>Thet Naung Zaw - Sales Executive" +

    "<br><br><b>UNIT(3)</b>" +
    "<br>Aye Aye Win - Manager" +
    "<br>Myo Myo Thaw -Senior Sales Executive" +
    "<br>Set Paing Htoo - Sales Executive" +
    "<br>Moe Thet Thet Kyaw - Sales Executive" +
    "<br>Cherry Soe - Sales Executive" +

    "<br><br><b>UNIT(4)</b>" +
    "<br>Aung Nyein Chan - Manager (1) " +
    "<br>Sandar Aung - Manager (2) " +
    "<br>Hnin Hnin Yu - Sales Executive " +
    "<br>Nwe Yee Win - Sales Executive " +
    "<br>Khant Nay Zin - Sales Executive" +

    "<br><br><b>PRODUCTION DEPARTMENT (mmsppgitpro@myanmarsuperpages.com)</b>" +
    "<br>Swe Swe Le` - Director " +
    "<br>Data & Contract Processing " +
    "<br>Pyu Pyu kyaw - Senior Production Staff " +
    "<br>Ei Khant Khant Chaw - Production Staff" +

    "<br><br><b>Graphic Design</b>" +
    "<br>Nu Nu Kyi - Manager " +
    "<br>Phoo Pwint Han - Senior Graphic Designer " +
    "<br>Zhon Wai Moe - Graphic Designer" +

    "<br><br><b>IT</b>" +
    "<br>Nway Nway Linn - Manager " +
    "<br>Saw Kyi Win Hlaing" +

    "<br><br><b>FINANCE & ADMIN DEPARTMENT (mmsppganf@myanmarsuperpages.com)</b>" +
    "<br>Myint Zu - Director" +

    "<br><br><b>FINANCE</b>" +
    "<br>Aye Aye Aung - Accountant " +
    "<br>Kay Thi Myint - Assistant Accountant" +

    "<br><br><b>ADMIN</b>" +
    "<br>Aung Ko Ko Win - Manager " +
    "<br>Aye Aye Mon - Admin Executive" +
    "<br>Yee Yee Khine" +
    "<br>Myint Tun" +
    "<br>Sann Nyunt Win" +
    "<br>Ohn Kyaw" +
    "<br>Ye Naing Oo" +
    "<br>Kyaw Htoo" +
    "<br>Kyaw Thu Win" +
    "<br>Saw Yin Thein" +

    "<br><br><b>NAYPYITAW BRANCH OFFICE</b>" +
    "<br>Mar Mar Swe - Branch Manager " +
    "<br>Thein Than Aung - Senior Sales Executive " +
    "<br>Nwe Nwe Aung- Sales Executive " +
    "<br>Zin Min Swe- Sales Executive " +
    "<br>Ei Yadanar - Sales Executive" +

    "<br><br><b>MANDALAY BRANCH & SURVEY TEAM</b>" +
    "<br>Aung Ko Ko Win - Manager <br><br><br>";
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

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ContactUsPage');
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
