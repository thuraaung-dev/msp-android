import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { SQLiteObject } from '@ionic-native/sqlite';
@Injectable()
export class GlobalProvider {

  appName: any = '';  
  ipaddress: any; 
  netWork: string = '';
  apptype: any = '';
  appCode: any; 
  public phone: any;
  public type: any = "android";
  public version: any = "1.0.3";
  public db: SQLiteObject;
  public check_version_api_url: any = '';
  public update_db_api_url: any = '';
  public image_folder_url: any = '';
  public api_key: any = '';
  constructor(public network: Network) {
    this.appName = "msp";  
    this.api_key="E75XIPKcMPX";
    this.check_version_api_url="http://myanmarsuperpages.com/superpanel/api/updatecheck.php?";
    this.update_db_api_url="http://myanmarsuperpages.com/superpanel/api/alltable.php?";
    this.image_folder_url="http://myanmarsuperpages.com/superpanel/";
   
    this.netWork = 'connected';
    this.network.onDisconnect().subscribe(() => {
      this.netWork = 'disconnected';
      //// console.log('network was disconnected :-(');
    });

    this.network.onConnect().subscribe(() => {
      this.netWork = 'connected';
      //// console.log('network connected!');
    });
  }

}
