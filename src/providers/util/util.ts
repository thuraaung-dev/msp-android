import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from '../database/database';
/*
  Generated class for the UtilProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var require: any
let num = /^[0-9-\+]*$/;
let flag: boolean;
let phoneData = { phone: "", flag: false }
let normalizePhOld;
let mnum = /^[၀-၉-\+]*$/;
let phone;
let institutionData = { fromInstitutionName: "", toInstitutionName: "", fromInstitutionCode: "", toInstitutionCode: "" }
@Injectable()
export class UtilProvider {

  constructor(public http: Http, private databaseprovider: DatabaseProvider) {
    //// console.log('Hello UtilProvider Provider');
  }

  formatToDouble(amount) {
    return amount.replace(/[,]/g, '');
  }

  formatAmount(n) {
    return (+n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }

  // removePlus(n) {
  //   return n.replace(/\+/g, '');
  //}

  checkTwoStringAreEqual(firstString, secondString) {
    if (firstString.trim().equal(secondString.trim())) {
      return true;
    } else {
      return false;
    }
  }

  checkInputIsEmpty(dataFromUser) {
    if (dataFromUser == undefined || dataFromUser == null || dataFromUser.trim().length == 0) {
      return true;
    } else {
      return false;
    }
  }

  checkAmountIsZero(amountFromUser) {
    let amountFloat = parseFloat(amountFromUser);

    if (amountFloat == 0) {
      return true;
    } else {
      return false;
    }
  }

  checkAmountIsLowerThanZero(amountFromUser) {
    let amountFloat = parseFloat(amountFromUser);

    if (amountFloat < 0) {
      return true;
    } else {
      return false;
    }
  }

  checkNumberOrLetter(amountFromUser) {
    if (isNaN(amountFromUser)) {
      return true;
    } else {
      return false;
    }
  }

  checkPlusSign(amountFromUser) {
    let amountString = amountFromUser.toString();
    let result = amountString.includes("+");
    //// console.log("RE checkInputIncludesPlusSign result:" + JSON.stringify(result));
    return result;
  }

  checkMinusSign(amountFromUser) {
    let amountString = amountFromUser.toString();
    let result = amountString.includes("-");
    //// console.log("RE checkInputIncludesPlusSign result:" + JSON.stringify(result));
    return result;
  }

  checkStartZero(amountFromUser) {
    let amountString = amountFromUser.toString();
    let result = amountString.startsWith("0");
    //// console.log("RE checkInputIncludesPlusSign result:" + JSON.stringify(result));
    return result;
  }

  checkHttp(website){
    if(website.startsWith("http")){
      return website;
    } else {
      let ret = "http://"+website;
      return ret;
    }
  }

  specificTrim(str, prefix) {
    let resultStr = str.trim();
    while (resultStr.startsWith(prefix)) {
      resultStr = resultStr.substring(1, resultStr.length);
    }

    while (resultStr.endsWith(prefix)) {
      resultStr = resultStr.substring(0, resultStr.length - 1);
    }
    return resultStr.trim();
  }

  checkOnlyNumber(amountFromUser) {
    var reg = new RegExp(/^\d+$/);
    let result = reg.test(amountFromUser);
    //// console.log("RE checkInputIsOnlyNumber result:" + JSON.stringify(result));
    return result;
  }

  /* gettting today date and time without any special character.
  return example is like that -> "1452018143321"
   */
  getImageName() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + ""
      + (currentdate.getMonth() + 1) + ""
      + currentdate.getFullYear() + ""
      + currentdate.getHours() + ""
      + currentdate.getMinutes() + ""
      + currentdate.getSeconds();
    return datetime;
  }

  /* gettting today date and time.
  return example is like that -> "14/5/2018 @ 14:32:40" */
  getTodayDateAndTime() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " @ "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    return datetime;
  }

  getNormalizedPhones(str_phone, locid) {
    let phSplitArr = [];
    phSplitArr = str_phone.split(",");
    let ph =[];
    phSplitArr.forEach(phStr => {
      if(phStr.trim() != ""){
        if (phStr.trim().startsWith("09")) {
          ph.push(phStr.trim());
        } else {
          let area;
          area = this.getAreacode(locid);
          if(area != undefined && area != 'undefined' && area != ''){
            ph.push(area + phStr.trim());
          } else {
            ph.push(phStr.trim());
          }
        }
      }
   });
   return ph;
  }

  normalizePhone(phoneNumber) {
    let normalizePhone = "";
    if (phoneNumber != undefined && phoneNumber != null && phoneNumber != "") {
      if (phoneNumber.indexOf("09") == 0 && (phoneNumber.length == 9 || phoneNumber.length == 10 || phoneNumber.length == 11)) {
        normalizePhone = "+95" + phoneNumber.substring(1);
        flag = true;
      } else if (phoneNumber.indexOf("959") == 0 && (phoneNumber.length == 10 || phoneNumber.length == 11 || phoneNumber.length == 12)) {
        normalizePhone = "+" + phoneNumber;
        flag = true;
      } else if (phoneNumber.indexOf("+959") == 0 && (phoneNumber.length == 11 || phoneNumber.length == 12 || phoneNumber.length == 13)) {
        normalizePhone = phoneNumber;
        flag = true;
      } else if (phoneNumber.length == 7 || phoneNumber.length == 8 || phoneNumber.length == 9) {
        normalizePhone = "+959" + phoneNumber;
        flag = true;
      }
    } else {
      normalizePhone = '';
      flag = false;
    }

    phoneData.flag = flag;
    phoneData.phone = normalizePhone;
    //// console.log("normalizePhone-Provider-phoneData>>" + JSON.stringify(phoneData));

    return phoneData;
  }

  getAreacode(locid) {
    this.databaseprovider.getAreacode(locid, "phone").then(data => {
     phone = data;
    })
    return phone;
  }

}
