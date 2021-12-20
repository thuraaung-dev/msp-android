

/**
 * Created by admin on 5/10/2017.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChangefontProvider {

  IS_MYANMAR_RANGE : any = "[က-အ]+";
  // IS_UNICODE_MY : any  = "[ဃငဆဇဈဉညတဋဌဍဎဏဒဓနဘရဝဟဠအ]်|ျ[က-အ]ါ|ျ[ါ-း]|[^\1031]စ် |\u103e|\u103f|\u1031[^\u1000-\u1021\u103b\u1040\u106a\u106b\u107e-\u1084\u108f\u1090]|\u1031$|\u100b\u1039|\u1031[က-အ]\u1032|\u1025\u102f|\u103c\u103d[\u1000-\u1001]";

  IS_ZAWGYI : any = "\u0020[\u103b\u107e-\u1084][က-အ]|\u0020\u1031[က-အ\u1040]|\u1031\u1005\u103A";

  reMyanmar : any = [new RegExp(this.IS_MYANMAR_RANGE)];

  // reUnicode_my :any = [new RegExp(this.IS_UNICODE_MY)];

  reZawgyi : any = [new RegExp(this.IS_ZAWGYI)];


  isMyanmar (str){

    for(let i=0; i < this.reMyanmar.length; i++){

      if(this.reMyanmar[i].test(str))
        return true;
      else
        return false;
    }

    return false;

  }

  isZawgyi(string){
    for(let i=0; i<this.reZawgyi.length; i++){
      if(this.reZawgyi[i].test(string)) return true;
    }
    return false;
  }

  /* identifyFont(string){

   if(!this.isUnicode_my(string)){
   let res : string ="zawgyi";
   return res;
   }
   else if(this.isUnicode_my(string)){
   let res : string ="unicode";
   return res;
   }
   } */

//...........................ztouni.................................//
  ZgtoUni(zgtext)
  {
    let utext : any = zgtext;

    utext =  utext.replace( /\u106A/g, " \u1009");
    utext =  utext.replace( /\u1025(?=[\u1039\u102C])/g, "\u1009");
    // new
    utext =  utext.replace( /\u1025\u102E/g, "\u1026");
    // new
    utext =  utext.replace( /\u106B/g, "\u100A");
    utext =  utext.replace( /\u1090/g, "\u101B");
    utext =  utext.replace( /\u1040/g, "\u1040");

    utext =  utext.replace( /\u108F/g, "\u1014");
    utext =  utext.replace( /\u1012/g, "\u1012");
    utext =  utext.replace( /\u1013/g, "\u1013");
    /////////////

    utext =  utext.replace( /[\u103D\u1087]/g, "\u103E");
    // ha
    utext =  utext.replace( /\u103C/g, "\u103D");
    // wa
    utext =  utext.replace( /[\u103B\u107E\u107F\u1080\u1081\u1082\u1083\u1084]/g, "\u103C");
    // ya yint(ra)
    utext =  utext.replace( /[\u103A\u107D]/g, "\u103B");
    // ya

    utext =  utext.replace( /\u103E\u103B/g, "\u103B" + "\u103E");
    // reorder

    utext =  utext.replace( /\u108A/g, "\u103D" + "\u103E");
    // wa ha

    ////////////////////// Reordering

    utext =  utext.replace( /(\u1031)?(\u103C)?([\u1000-\u1021])\u1064/g, "\u1064$1$2$3");
    // reordering kinzi
    utext =  utext.replace( /(\u1031)?(\u103C)?([\u1000-\u1021])\u108B/g, "\u1064$1$2$3\u102D");
    // reordering kinzi lgt
    utext =  utext.replace( /(\u1031)?(\u103C)?([\u1000-\u1021])\u108C/g, "\u1064$1$2$3\u102E");
    // reordering kinzi lgtsk
    utext =  utext.replace( /(\u1031)?(\u103C)?([\u1000-\u1021])\u108D/g, "\u1064$1$2$3\u1036");
    // reordering kinzi ttt

    ////////////////////////////////////////

    utext =  utext.replace( /\u105A/g, "\u102B" + "\u103A");
    utext =  utext.replace( /\u108E/g, "\u102D" + "\u1036");
    // lgt ttt
    utext =  utext.replace( /\u1033/g, "\u102F");
    utext =  utext.replace( /\u1034/g, "\u1030");
    utext =  utext.replace( /\u1088/g, "\u103E" + "\u102F");
    // ha  u
    utext =  utext.replace( /\u1089/g, "\u103E" + "\u1030");
    // ha  uu

    ///////////////////////////////////////

    utext =  utext.replace( /\u1039/g, "\u103A");
    utext =  utext.replace( /[\u1094\u1095]/g, "\u1037");
    // aukmyint

    /////////////////////////////////////// Pasint order human error
    utext =  utext.replace( /([\u1000-\u1021])([\u102C\u102D\u102E\u1032\u1036]){1,2}([\u1060\u1061\u1062\u1063\u1065\u1066\u1067\u1068\u1069\u1070\u1071\u1072\u1073\u1074\u1075\u1076\u1077\u1078\u1079\u107A\u107B\u107C\u1085])/g, "$1$3$2");
    // new


    /////////////

    utext =  utext.replace( /\u1064/g, "\u1004\u103A\u1039");

    utext =  utext.replace( /\u104E/g, "\u104E\u1004\u103A\u1038");

    utext =  utext.replace( /\u1086/g, "\u103F");

    utext =  utext.replace( /\u1060/g, '\u1039\u1000');
    utext =  utext.replace( /\u1061/g, '\u1039\u1001');
    utext =  utext.replace( /\u1062/g, '\u1039\u1002');
    utext =  utext.replace( /\u1063/g, '\u1039\u1003');
    utext =  utext.replace( /\u1065/g, '\u1039\u1005');
    utext =  utext.replace( /[\u1066\u1067]/g, '\u1039\u1006');
    utext =  utext.replace( /\u1068/g, '\u1039\u1007');
    utext =  utext.replace( /\u1069/g, '\u1039\u1008');
    utext =  utext.replace( /\u106C/g, '\u1039\u100B');
    utext =  utext.replace( /\u1070/g, '\u1039\u100F');
    utext =  utext.replace( /[\u1071\u1072]/g, '\u1039\u1010');
    utext =  utext.replace( /[\u1073\u1074]/g, '\u1039\u1011');
    utext =  utext.replace( /\u1075/g, '\u1039\u1012');
    utext =  utext.replace( /\u1076/g, '\u1039\u1013');
    utext =  utext.replace( /\u1077/g, '\u1039\u1014');
    utext =  utext.replace( /\u1078/g, '\u1039\u1015');
    utext =  utext.replace( /\u1079/g, '\u1039\u1016');
    utext =  utext.replace( /\u107A/g, '\u1039\u1017');
    utext =  utext.replace( /\u107B/g, '\u1039\u1018');
    utext =  utext.replace( /\u107C/g, '\u1039\u1019');
    utext =  utext.replace( /\u1085/g, '\u1039\u101C');
    utext =  utext.replace( /\u106D/g, '\u1039\u100C');

    utext =  utext.replace( /\u1091/g, '\u100F\u1039\u100D');
    utext =  utext.replace( /\u1092/g, '\u100B\u1039\u100C');
    utext =  utext.replace( /\u1097/g, '\u100B\u1039\u100B');
    utext =  utext.replace( /\u106F/g, '\u100E\u1039\u100D');
    utext =  utext.replace( /\u106E/g, '\u100D\u1039\u100D');

    /////////////////////////////////////////////////////////

    utext =  utext.replace( /(\u103C)([\u1000-\u1021])(\u1039[\u1000-\u1021])?/g, "$2$3$1");
    // reordering ra

    utext =  utext.replace( /(\u103E)(\u103D)([\u103B\u103C])/g, "$3$2$1");
    utext =  utext.replace( /(\u103E)([\u103B\u103C])/g, "$2$1");

    utext =  utext.replace( /(\u103D)([\u103B\u103C])/g, "$2$1");

    utext = utext.replace(/(([\u1000-\u101C\u101D\u101E-\u102A\u102C\u102E-\u103F\u104C-\u109F]))(\u1040)/g, function($0, $1)
      {
        return $1 ? $1 + '\u101D' : $0 + $1;

      }
    );
    // zero and wa

    utext = utext.replace(/(\u1040)(?=([\u1040\u1047])*([\u1000-\u101C\u101D\u101E-\u102A\u102C\u102E-\u103F\u104C-\u109F]))/g,  "\u101D");   // zero and wa


    utext = utext.replace(/(([\u1000-\u101C\u101D\u101E-\u102A\u102C\u102E-\u103F\u104C-\u109F]))(\u1047)/g, function($0, $1)
      {
        return $1 ? $1 + '\u101B' : $0 + $1;

      }
    );
    // seven and ra

    utext = utext.replace(/(\u1047)(?=([\u1047])*([\u1000-\u101C\u101D\u101E-\u102A\u102C\u102E-\u103F\u104C-\u109F]))/g,  "\u101B");   // seven and ra



    utext =  utext.replace( /(\u1031)?([\u1000-\u1021])(\u1039[\u1000-\u1021])?([\u102D\u102E\u1032])?([\u1036\u1037\u1038]{0,2})([\u103B-\u103E]{0,3})([\u102F\u1030])?([\u1036\u1037\u1038]{0,2})([\u102D\u102E\u1032])?/g, "$2$3$6$1$4$9$7$5$8");
    // reordering storage order

    utext =  utext.replace( /(\u103A)(\u1037)/g, "$2$1");
    // For Latest Myanmar3

    utext =  utext.replace( /(\u1036)(\u102F)/g, "$2$1");
    // For Latest Myanmar3


    return utext;

  }
// Z1_Uni
//....................................unitoz...........................................//
// JavaScript Document
//Version: 1.0
//Author: The` The` Aye
//Release:August 07,2009
//Name:Unicode5.1 to ZawgyiOne Converter
  UnitoZg(utext)
  {
    let zgtext : any = utext;


    zgtext = zgtext.replace(/\u104E\u1004\u103A\u1038/g, '\u104E');
    zgtext = zgtext.replace(/\u102B\u103A/g, '\u105A');
    zgtext = zgtext.replace(/\u102D\u1036/g, '\u108E');
    zgtext = zgtext.replace(/\u103F/g, '\u1086');


    zgtext = zgtext.replace(/(\u102F[\u1036]?)\u1037/g, function($0, $1)
      {
        return $1 ? $1 + '\u1094' : $0 + $1;
      }
    );
    zgtext = zgtext.replace(/(\u1030[\u1036]?)\u1037/g, function($0, $1)
      {
        return $1 ? $1 + '\u1094' : $0 + $1;
      }
    );
    zgtext = zgtext.replace(/(\u1014[\u103A\u1032]?)\u1037/g, function($0, $1)
      {
        return $1 ? $1 + '\u1094' : $0 + $1;
      }
    );
    zgtext = zgtext.replace(/(\u103B[\u1032\u1036]?)\u1037/g, function($0, $1)
      {
        return $1 ? $1 + '\u1095' : $0 + $1;
      }
    );

    zgtext = zgtext.replace(/(\u103D[\u1032]?)\u1037/g,  function($0, $1)
      {
        return $1 ? $1 + '\u1095' : $0 + $1;
      }
    );

    zgtext = zgtext.replace(/([\u103B\u103C\u103D][\u102D\u1036]?)\u102F/g, function($0, $1)
      {
        return $1 ? $1 + '\u1033' : $0 + $1;
      }
    );
    zgtext = zgtext.replace(/((\u1039[\u1000-\u1021])[\u102D\u1036]?)\u102F/g,  function($0, $1)
      {
        return $1 ? $1 + '\u1033' : $0 + $1;
      }
    );
    zgtext = zgtext.replace(/([\u100A\u100C\u1020\u1025\u1029][\u102D\u1036]?)\u102F/g, function($0, $1)
      {
        return $1 ? $1 + '\u1033' : $0 + $1;
      }
    );
    zgtext = zgtext.replace(/([\u103B\u103C][\u103D]?[\u103E]?[\u102D\u1036]?)\u1030/g, function($0, $1)
      {
        return $1 ? $1 + '\u1034' : $0 + $1;

      }
    );
    // uu - 2
    zgtext = zgtext.replace(/((\u1039[\u1000-\u1021])[\u102D\u1036]?)\u1030/g, function($0, $1)
      {
        return $1 ? $1 + '\u1034' : $0 + $1;

      }
    );
    // uu - 2
    zgtext = zgtext.replace(/([\u100A\u100C\u1020\u1025\u1029][\u102D\u1036]?)\u1030/g, function($0, $1)
      {
        return $1 ? $1 + '\u1034' : $0 + $1;

      }
    );
    // uu - 2

    zgtext = zgtext.replace(/(\u103C)\u103E/g, function($0, $1)
      {
        return $1 ? $1 + '\u1087' : $0 + $1;

      }
    );
    // ha - 2


    zgtext = zgtext.replace(/\u1009(?=[\u103A])/g, '\u1025');
    zgtext = zgtext.replace(/\u1009(?=\u1039[\u1000-\u1021])/g, '\u1025');



    // E render
    zgtext = zgtext.replace( /([\u1000-\u1021\u1029])(\u1039[\u1000-\u1021])?([\u103B-\u103E\u1087]*)?\u1031/g, "\u1031$1$2$3");

    // Ra render

    zgtext = zgtext.replace( /([\u1000-\u1021\u1029])(\u1039[\u1000-\u1021\u1000-\u1021])?(\u103C)/g, "$3$1$2");



    // Kinzi
    zgtext = zgtext.replace(/\u1004\u103A\u1039/g, "\u1064");
    // kinzi
    zgtext = zgtext.replace(/(\u1064)([\u1031]?)([\u103C]?)([\u1000-\u1021])\u102D/g, "$2$3$4\u108B");
    // reordering kinzi lgt
    zgtext = zgtext.replace(/(\u1064)(\u1031)?(\u103C)?([ \u1000-\u1021])\u102E/g, "$2$3$4\u108C");
    // reordering kinzi lgtsk
    zgtext = zgtext.replace(/(\u1064)(\u1031)?(\u103C)?([ \u1000-\u1021])\u1036/g, "$2$3$4\u108D");
    // reordering kinzi ttt
    zgtext = zgtext.replace(/(\u1064)(\u1031)?(\u103C)?([ \u1000-\u1021])/g, "$2$3$4\u1064");
    // reordering kinzi

    // Consonant

    zgtext = zgtext.replace(/\u100A(?=[\u1039\u102F\u1030])/g, "\u106B");
    // nnya - 2
    zgtext = zgtext.replace(/\u100A/g, "\u100A");
    // nnya

    zgtext = zgtext.replace(/\u101B(?=[\u102F\u1030])/g, "\u1090");
    // ra - 2
    zgtext = zgtext.replace(/\u101B/g, "\u101B");
    // ra

    zgtext = zgtext.replace(/\u1014(?=[\u1039\u103D\u103E\u102F\u1030])/g, "\u108F");
    // na - 2
    zgtext = zgtext.replace(/\u1014/g, "\u1014");
    // na

    // Stacked consonants
    zgtext = zgtext.replace(/\u1039\u1000/g, "\u1060");
    zgtext = zgtext.replace(/\u1039\u1001/g, "\u1061");
    zgtext = zgtext.replace(/\u1039\u1002/g, "\u1062");
    zgtext = zgtext.replace(/\u1039\u1003/g, "\u1063");
    zgtext = zgtext.replace(/\u1039\u1005/g, "\u1065");
    zgtext = zgtext.replace(/\u1039\u1006/g, "\u1066");
    // 1067
    zgtext = zgtext.replace(/([\u1001\u1002\u1004\u1005\u1007\u1012\u1013\u108F\u1015\u1016\u1017\u1019\u101D])\u1066/g, function($0, $1)
      {
        return $1 ? $1 + '\u1067' : $0 + $1;

      }
    );
    // 1067
    zgtext = zgtext.replace(/\u1039\u1007/g, "\u1068");
    zgtext = zgtext.replace(/\u1039\u1008/g, "\u1069");

    zgtext = zgtext.replace(/\u1039\u100F/g, "\u1070");
    zgtext = zgtext.replace(/\u1039\u1010/g, "\u1071");
    // 1072 omit (little shift to right)
    zgtext = zgtext.replace(/([\u1001\u1002\u1004\u1005\u1007\u1012\u1013\u108F\u1015\u1016\u1017\u1019\u101D])\u1071/g, function($0, $1)
      {
        return $1 ? $1 + '\u1072' : $0 + $1;

      }
    );
    // 1067
    zgtext = zgtext.replace(/\u1039\u1011/g, "\u1073");
    // \u1074 omit(little shift to right)
    zgtext = zgtext.replace(/([\u1001\u1002\u1004\u1005\u1007\u1012\u1013\u108F\u1015\u1016\u1017\u1019\u101D])\u1073/g, function($0, $1)
      {
        return $1 ? $1 + '\u1074' : $0 + $1;

      }
    );
    // 1067
    zgtext = zgtext.replace(/\u1039\u1012/g, "\u1075");
    zgtext = zgtext.replace(/\u1039\u1013/g, "\u1076");
    zgtext = zgtext.replace(/\u1039\u1014/g, "\u1077");
    zgtext = zgtext.replace(/\u1039\u1015/g, "\u1078");
    zgtext = zgtext.replace(/\u1039\u1016/g, "\u1079");
    zgtext = zgtext.replace(/\u1039\u1017/g, "\u107A");
    zgtext = zgtext.replace(/\u1039\u1018/g, "\u107B");
    zgtext = zgtext.replace(/\u1039\u1019/g, "\u107C");
    zgtext = zgtext.replace(/\u1039\u101C/g, "\u1085");


    zgtext = zgtext.replace(/\u100F\u1039\u100D/g, "\u1091");
    zgtext = zgtext.replace(/\u100B\u1039\u100C/g, "\u1092");
    zgtext = zgtext.replace(/\u1039\u100C/g, "\u106D");
    zgtext = zgtext.replace(/\u100B\u1039\u100B/g, "\u1097");
    zgtext = zgtext.replace(/\u1039\u100B/g, "\u106C");
    zgtext = zgtext.replace(/\u100E\u1039\u100D/g, "\u106F");
    zgtext = zgtext.replace(/\u100D\u1039\u100D/g, "\u106E");

    zgtext = zgtext.replace(/\u1009(?=\u103A)/g, "\u1025");
    // u
    zgtext = zgtext.replace(/\u1025(?=[\u1039\u102F\u1030])/g, "\u106A");
    // u - 2
    zgtext = zgtext.replace(/\u1025/g, "\u1025");
    // u
    /////////////////////////////////////

    zgtext = zgtext.replace(/\u103A/g, "\u1039");
    // asat

    zgtext = zgtext.replace(/\u103B\u103D\u103E/g, "\u107D\u108A");
    // ya wa ha
    zgtext = zgtext.replace(/\u103D\u103E/g, "\u108A");
    // wa ha

    zgtext = zgtext.replace(/\u103E\u102F/g, '\u1088');//ha u

    zgtext = zgtext.replace(/\u103E\u1030/g, '\u1089');//ha uu

    zgtext = zgtext.replace(/\u103B/g, "\u103A");
    // ya
    zgtext = zgtext.replace(/\u103C/g, "\u103B");
    // ra
    zgtext = zgtext.replace(/\u103D/g, "\u103C");
    // wa
    zgtext = zgtext.replace(/\u103E/g, "\u103D");
    // ha
    zgtext = zgtext.replace(/\u103A(?=[\u103C\u103D\u108A])/g, "\u107D");
    // ya - 2

    zgtext = zgtext.replace(/(\u100A(?:[\u102D\u102E\u1036\u108B\u108C\u108D\u108E])?)\u103D/g, function($0, $1)
      {
        //      return $1 ? $1 + '\u1087 ' : $0 + $1;
        return $1 ? $1 + '\u1087' : $0 ;

      }
    );
    // ha - 2

    zgtext = zgtext.replace(/\u103B(?=[\u1000\u1003\u1006\u100F\u1010\u1011\u1018\u101A\u101C\u101E\u101F\u1021])/g, "\u107E");
    // great Ra with wide consonants
    zgtext = zgtext.replace(/\u107E([\u1000-\u1021\u108F])(?=[\u102D\u102E\u1036\u108B\u108C\u108D\u108E])/g, "\u1080$1");
    // great Ra with upper sign
    zgtext = zgtext.replace(/\u107E([\u1000-\u1021\u108F])(?=[\u103C\u108A])/g, "\u1082$1");
    // great Ra with under signs

    zgtext = zgtext.replace(/\u103B([\u1000-\u1021\u108F])(?=[\u102D \u102E \u1036 \u108B \u108C \u108D \u108E])/g, "\u107F$1");
    // little Ra with upper sign

    zgtext = zgtext.replace(/\u103B([\u1000-\u1021\u108F])(?=[\u103C\u108A])/g, "\u1081$1");
    // little Ra with under signs

    zgtext = zgtext.replace(/(\u1014[\u103A\u1032]?)\u1037/g, function($0, $1)
      {
        return $1 ? $1 + '\u1094' : $0 + $1;

      }
    );
    // aukmyint
    zgtext = zgtext.replace(/(\u1033[\u1036]?)\u1094/g, function($0, $1)
      {
        return $1 ? $1 + '\u1095' : $0 + $1;

      }
    );
    // aukmyint
    zgtext = zgtext.replace(/(\u1034[\u1036]?)\u1094/g, function($0, $1)
      {
        return $1 ? $1 + '\u1095' : $0 + $1;

      }
    );
    // aukmyint
    zgtext = zgtext.replace(/([\u103C\u103D\u108A][\u1032]?)\u1037/g, function($0, $1)
      {
        return $1 ? $1 + '\u1095' : $0 + $1;

      }
    );
    // aukmyint
    return zgtext;

  }
// Uni_Z1


}

