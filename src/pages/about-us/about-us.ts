import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform, AlertController , PopoverController, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { HTTP } from '@ionic-native/http';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DatabaseProvider } from '../../providers/database/database';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  textEng: any = ["About Us", "Choose Category", "Search"];
  textMyan: any = ["About Us", "Company Category", "ရှာဖွေပါ"];
  data: any;
  textData: string[] = [];
  font: string = ''; companyName: string = '';
  modal: any;
  hardwareBackBtn: any = true;
  popover: any;
  constructor(private nhttp: HTTP, private all: AllserviceProvider, private databaseprovier: DatabaseProvider,
    private global: GlobalProvider, private toastCtrl: ToastController, private databaseprovider: DatabaseProvider,
    public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController, 
    private events: Events, private storage: Storage, private platform: Platform, private alertCtrl: AlertController) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });

    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.data = "<b>MYANMAR SUPER PAGES DIRECTORY</b>" +
    "<br><b>(THE MARKETING PLATFORM for your products and services)</b>" +
    "<br><br><b>- NI LWIN SOE PUBLISHING HOUSE -</b>" +
    "<br><br>Ni Lwin Soe and Associates Co. Ltd. (NLS & A) or more commonly referred to as Ni Lwin Soe Publishing House, is a member of Myanmar Telephone Directory Group and one of the Myanmar\'s publisher of business/telephone directories in the Union. Myanmar Telephone Directory Group was also the sole and exclusive owner of Myanmar\'s Telephone Directory publishing rights on 1994 to 2016." +
  
    "<br><br>Following the phasing out of its Telephone Directory, the Ni Lwin Soe Publishing House was launching of its new product \"MYANMAR SUPER PAGES DIRECTORY\" in beginning of 2017. This INAUGURAL business directory is scheduled to be out in the market every year. Furthermore, its online and mobile applications will be developed and expanded rapidly with a view to sustain the ours position as the Union premium operator/publisher of Myanmar\'s business directory, offering not only an EFFECTIVE/ INTEGRATED MULTI-PLATFORM ON LINE ADVERTISING SOLUTIONS to businesses, but the state of the art DIRECTORY MARKETING SERVICES with far reaching results." +
  
    "<br><br>The Ni Lwin Soe Publishing House without doubt has successfully over the previous years or so forged a lasting relationship with the people of Myanmar and this has been the cornerstone of the Group ability to emerge as the number ONE business directory publisher. The Group currently boasts of the following products and services;" +
  
    "<br><br>Myanmar Super Pages Business Directory" +
    "(An annual publication and circulated in printed copies, website and mobile application )" +
    "<br>The Naypyitaw Directory (Annual Publication)" +
    "<br>The Greater Naypyitaw Map ( Wall Poster Map - 98Cm X 68Cm)" +
  
    "<br><br><b>OUR VISION:</b>" +
    "<br><br>To be a bridge as well as a gateway for enterprises and businesses, both local and foreign to succeed in Myanmar, an emerging new market in Asia." +
  
    "<br><br><b>CORPORATE MISSION:</b>" +
    "<br><br>To be the Union number \"1\" Directory publisher dedicated and committed in providing not only an INTEGRATED MULTIPLATFORM ADVERTISING SOLUTION but the state of the art DIRECTORY LISTING SERVICES with far reaching results." +
  
    "<br><br><b>VISIT MYANMAR SUPER PAGES WEBSITE FOR MORE INFORMATION AND GUIDANCE:</b>" +
    "<br><br>Interested clients are cordially invited to visit our internet websites as indicated below which are also available in Mobile Version;" +
  
    "<br><br>www.myanmarsuperpages.com" +
    "<br><br>Mobile Application free download installation is available. The Myanmar Super Pages Directory mobile phone application is available in Android Version at Google Play Store and www.myanmarsuperpages.com ." +
  
    "<br><br><b>CIRCULATION AND DISTRIBUTION:</b>" +
    "<br><br>The Myanmar Super Pages Directory which is partly a continuation of the Myanmar Telephone Directory is not only the most widely circulated directory in the Union of Myanmar but it also takes pride in being the nation\'s oldest and most respectable directory. Its circulation is nationwide with emphasis on target groups such as companies, hotels, motels & Inns, stores, restaurants, shops & factories. Distributions and circulations are being undertaken efficiently and on a fixed schedule by our mobile sales and collection teams located at the head office in Yangon and its branches in Naypyitaw & Mandalay. Circulation and distribution in selected countries abroad are being done through our appointed sales agents overseas." +
  
    "<br><br><b>PRINTING AND PRODUCTION:</b>" +
    "<br><br>To guarantee its excellent quality and clarity, one of Asia\'s leading and respectable printer in Singapore has been tasked to undertake the printing and binding of this important premium Publication." +
  
    "<br><br>The Mobile Application and Internet Websites have been developed in collaboration with qualified and competent local IT companies. The internet websites www.myanmarsuperpages.com came online in 2017 and www.myanmar-yellowpages.com was online in 2004 and proudly both have received excellent ratings with the number of visitors increasing annually." +
  
    "<br><br><b>SALES AND CIRCULATION SCHEDULES for forthcoming Year 2019 publication:</b>" +
    "<br><br>1.Closing Date for Advertising Submission: August 31st 2018" +
    "<br>2.Closing Date for Design Submission: September 30th 2018" +
    "<br>3.Closing Date for Advertising Submission: October 31st 2018" +
    "<br>4.Distribution/Circulation Date: January 2019" +
  
    "<br><br><b>Historical Facts:</b>" +
    "<br><br>" +
  
    "17th March 1994   -   Incorporation of Myanmar Telephone Directory Group in accordance with the law of the Union of Myanmar</td>" +
    "<br>29th July 1994   -   The signing of the first 5 year Telephone Directory Concession Agreement (1994-1999) with Myanma Posts and Telecommunications (MPT) Ministry of Communications, Posts and Telegraph</td>" +
    "<br>First quarter 1995   -   The inaugural publication and distribution of nationwide Myanmar\'s Telephone Directory and Official Yellow Pages.</td>" +
    "<br>1999   -   The signing of the 2nd five year Telephone Directory Concession Agreement (2000-2004)." +
    "<br>2002   -   The launching of Myanmar Telephone Directory & Official Yellow Pages Website \"myanmarteldir.com.mm\".</td>" +
    "<br>2002   -   Incorporation of Ni Lwin Soe & Associates Co., Ltd. in accordance with the law of Myanmar.</td>" +
    "<br>2003   -   The launching of Myanmar Telephone Directory & Official Yellow Pages Website \"myanmarteldir.com\" and \"myanmar-yellowpages.com\") in collaboration with a qualified and competent local IT Company Myanmars.net.</td>" +
    "<br>2004   -   The inaugural publication of ACM\'s first regional directory i.e. The Shan State (South) Telephone Directory.</td>" +
    "<br>November 2004   -   The signing of the 3rd five year Telephone Directory Concession Agreement (2005-2009).</td>" +
    "<br>2005   -   The introduction of Myanmar Telephone Directory & Official Yellow Pages new product \"CD-ROM\".</td>" +
    "<br>2006   -   The opening of the Mandalay branch office.</td>" +
    "<br>2007   -   The publication of Naypyitaw Telephone Directory, the first directory for Myanmar's new capital.</td>" +
    "<br>The opening of the Naypyitaw branch office.</td>" +
    "<br>2009   -   The signing of the 4th five year Telephone Directory Concession Agreement (2010-2014).</td>" +
    "<br>2010   -   The launching of \"The Naypyitaw Directory and The Map of Naypyitaw\" by \"Ni Lwin Soe & Associates Co., Ltd. (Mother Company of Ni Lwin Soe Publishing House). In collaboration with Naypyitaw Development Committee.</td>" +
    "<br>2011   -   The inaugural publication of the ACM\'s regional directory i.e. The Chin State Telephone Directory ? 2011</td>" +
    "<br>2012   -   The inaugural publication of ACM\'s regional directory i.e. The Magwe Telephone Directory (2012-13).</td>" +
    "<br>2014	The launching of Myanmar Telephone Directory Mobile applications (Android and iOS) in collaboration with qualified and competent IT Company \"Myanmars.Net\".</td>" +
    "<br>2015   -   Incorporation of Ni Lwin Soe Publishing House in accordance with the law of the Union of Myanmar.</td>" +
    "<br>The launching of the Super Pages Directory Android Mobile applications at Google Play Store by Ni Lwin Soe Publishing House.</td>" +
    "<br>2016   -   The inaugural launching of Myanmar Telephone Directory Group new product \"MYANMAR SUPER PAGES DIRECTORY\" to replace the Myanmar Telephone Directory and Yellow Pages beginning 2017.</td>" +
    "<br>2017   -   Relocation of \"MYANMAR SUPER PAGES DIRECTORY\" office to its new premises in Bayint Naung Road, Kamaryut Township.</td>" +
    "<br>The inaugural publication of The Greater Naypyitaw Map was published by Ni Lwin Soe Publishing House.</td>" +
  
    "<br><br><b>CONTACT US FOR ASSISTANCE AND CONSULTATION:</b>" +
    "<br><br><b>Contact Information:</b>" +
  
    "<br><br><b>Head Office:</b>" +
    "<br>Contact Person : U Ni Lwin Soe, Managing Director" +
    "<br>Address : No. (9), Bayint Naung Road, Lion City Building, Near Shwe Marlar Yeikmon, Ward 4, Kamaryut Township, Yangon, MYANMAR." +
    "<br>Phone : + (95-1) 525380, 525384, 525372, 525364, 504212, 534310" +
    "<br>Email : nilwinsoe-md@myanmarsuperpages.com; acmmyanmar@gmail.com; mmsuperpages@gmail.com" +
    "<br>Website : www.myanmarsuperpages.com" +
  
    "<br><br><b>Naypyitaw : Regional Office</b>" +
    "<br>Contact Person : Daw Mar Mar Swe, Manager" +
    "<br>Address : Blk-1191, Yarza Htarni Rd., Paung Laung (3) Qtr, Pyinmana, Naypyitaw, Myanmar." +
    "<br>Phone : + (95-67) 23593, 23594 <br><br><br>";
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
    // console.log('ionViewDidLoad AboutUsPage');
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
