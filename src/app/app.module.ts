// module
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { SQLite } from '@ionic-native/sqlite';
import { MyApp } from './app.component';
import { Keyboard } from '@ionic-native/keyboard';
// provider
import { GlobalProvider } from '../providers/global/global';
import { ChangelanguageProvider } from '../providers/changelanguage/changelanguage';
import { UtilProvider } from '../providers/util/util';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { HTTP } from '@ionic-native/http';
// page
import { HomePage } from '../pages/home/home';
import { Language } from '../pages/language/language';
import { AllserviceProvider } from '../providers/allservice/allservice';
import { Network } from '@ionic-native/network';
import { PopularCatogoryPage } from '../pages/popular-catogory/popular-catogory';
import { SearchCategoryPage } from '../pages/search-category/search-category';
import { SearchNamePage } from '../pages/search-name/search-name';
import { SearchCityPage } from '../pages/search-city/search-city';
import { PopularCategoryResultPage } from '../pages/popular-category-result/popular-category-result';
import { BusinessDetailsPage } from '../pages/business-details/business-details';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { SearchCategoryResultPage } from '../pages/search-category-result/search-category-result';
import { DatabaseProvider } from '../providers/database/database';
import { HomeCategoryResultPage } from '../pages/home-category-result/home-category-result';
import { SearchNameResultPage } from '../pages/search-name-result/search-name-result';
import { SearchCityResultPage } from '../pages/search-city-result/search-city-result';
import { Lovbypage } from '../pages/lovbypage/lovbypage';
import { DataUpdatePage } from '../pages/data-update/data-update';
import { MenuPopover } from '../pages/menu-popover/menu-popover';
@NgModule({
  declarations: [
    HomePage,
    MyApp,
    Language,
    PopularCatogoryPage,
    SearchCategoryPage,
    SearchNamePage,
    SearchCityPage,
    HomeCategoryResultPage,
    PopularCategoryResultPage,
    SearchCategoryResultPage,
    SearchNameResultPage,
    SearchCityResultPage,
    BusinessDetailsPage,
    AboutUsPage,
    ContactUsPage,
    Lovbypage,
    DataUpdatePage,
    MenuPopover
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      tabsPlacement: 'bottom',
      scrollAssist: false,
      autoFocusAssist: false,
      platforms: {
        android: {
          tabsPlacement: 'bottom'
        },
        ios: {
          tabsPlacement: 'bottom',
          menuType: 'overlay'
        },
        windows:
        {
          tabsPlacement: 'top'
        }
      }
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Language,
    HomeCategoryResultPage,
    PopularCatogoryPage,
    SearchCategoryPage,
    SearchNamePage,
    SearchCityPage,
    PopularCategoryResultPage,
    SearchCategoryResultPage,
    SearchNameResultPage,
    SearchCityResultPage,
    BusinessDetailsPage,
    AboutUsPage,
    ContactUsPage,
    Lovbypage,
    DataUpdatePage,
    MenuPopover
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    SQLite,
    Keyboard,
    GlobalProvider,
    ChangelanguageProvider,
    UtilProvider,
    AllserviceProvider,
    Network,
    PhotoViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    HTTP
    
  ]
})
export class AppModule { }
