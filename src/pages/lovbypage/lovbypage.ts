import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ToastController, LoadingController, PopoverController, AlertController, Events, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AllserviceProvider } from '../../providers/allservice/allservice';
import { DatabaseProvider } from '../../providers/database/database';
@Component({
  selector: 'page-lovbypage',
  templateUrl: 'lovbypage.html',
})
export class Lovbypage {
  userdata: any;
  list: any;
  loading: any;
  lastPing: Date = null;
  min: any;
  sec; any;
  useraccount: any;
  dataList: any;
  title: any; 
  type: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, 
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private databaseprovider: DatabaseProvider,
    public http: Http, public popoverCtrl: PopoverController, public alertCtrl: AlertController,
    public events: Events, public app: App, 
    public platform: Platform, public all: AllserviceProvider) {
    this.type = this.navParams.get('data');
    this.goCategoryList(this.type);
  }

  selectedData(a) {
    // console.log("a>>"+a)
    this.events.publish('pop-data', a);
    this.navCtrl.pop();
  }
  
  goCategoryList(type){
    if(type == 'eng'){
      this.databaseprovider.getAllCategoryEng().then(data => {
        this.dataList = data;
      })
    } else {
      this.databaseprovider.getAllCategoryMM().then(data => {
        this.dataList = data;
      })
    }
  }
}
