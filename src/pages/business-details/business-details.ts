import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events, Platform, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { UtilProvider } from '../../providers/util/util';
import { MenuPopover } from '../menu-popover/menu-popover';
import { DataUpdatePage } from '../data-update/data-update';
import { HTTP } from '@ionic-native/http';
import { AllserviceProvider } from '../../providers/allservice/allservice';
declare var google;
@Component({
  selector: 'page-business-details',
  templateUrl: 'business-details.html',
})
export class BusinessDetailsPage {
  textEng: any = ["Business Details"];
  textMyan: any = ["Business Details"];
  textData: string[] = []; font: string = '';
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latLng: any;
  lat: any = "16.7709787";
  lng: any = "96.1781036";
  markers = []; data: any; image: any; imageUrl: any = "";
  network = true; area: any;
  phoneList: any;
  popover: any;
  constructor(private nhttp: HTTP, private all: AllserviceProvider, private alertCtrl: AlertController, private toastCtrl: ToastController,
    private platform: Platform, private popoverCtrl: PopoverController, private navCtrl: NavController, public navParams: NavParams, public http: Http,
    private global: GlobalProvider, private photoViewer: PhotoViewer, private util: UtilProvider,
    private events: Events, private storage: Storage, private databaseprovider: DatabaseProvider) {
    this.events.subscribe('changelanguage', lan => {
      this.changelanguage(lan);
    });
    this.storage.get('language').then((font) => {
      this.changelanguage(font);
    });
    this.data = this.navParams.get('param');
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

  getImageByBusiId(busid) {
    this.databaseprovider.getImageByBusiId(busid).then(data => {
      this.image = data;    
      this.imageUrl = this.global.image_folder_url + this.image;
    })
  }

  getAreacode(locid) {
    this.databaseprovider.getAreacode(locid, "Address").then(data => {
      this.area = data;    
      this.data.address = this.util.specificTrim(this.data.address, ",");
      this.data.address+=this.area;
    })
  }
 
  loadMap(mapLat, mapLon) {
    try {
      this.lat = mapLat; this.lng = mapLon;
      this.latLng = new google.maps.LatLng(this.lat, this.lng);
      console.log("this.latLng>>" + this.latLng)
      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.latLng
      });
      let content = "<h6>" + this.data.name + "</h6>";
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    } catch (e) {
        console.log("error>>"+e);
     
    }
  }

  viewPhoto(){
    this.photoViewer.show(this.imageUrl);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BusinessDetailsPage');
    this.data = this.navParams.get('param');
    this.getAreacode(this.data.locId);
    this.getPhoneList(this.data.phone, this.data.locId);
    if(this.data.adsStatus == '1'){
      this.getImageByBusiId(this.data.syskey);
      if(this.global.netWork == 'disconnected'){
        this.network = false;
      } 
    }
    if(this.data.mapLat.trim()!= "" && this.data.mapLat!= undefined && this.data.mapLat != null && this.data.mapLat != 'undefined'){
      this.loadMap(this.data.mapLat, this.data.mapLon);
    }
    if(this.data.websit != ''){
      this.data.websit = this.util.checkHttp(this.data.websit);
    }
  }

  getPhoneList(phone, locid){
    this.phoneList = this.util.getNormalizedPhones(phone, locid);
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
