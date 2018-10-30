import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FindtutorPage } from '../pages/findtutor/findtutor';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { OrderPage } from '../pages/order/order';
import { ProfilePage } from '../pages/profile/profile';
import { HistoryPage } from '../pages/history/history';
import { InfoPage } from '../pages/info/info';
import { PaymentPage } from '../pages/payment/payment';
import { TutorPage } from '../pages/tutor/tutor';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { env } from './firebase.cred';
export const FIREBASE_CRED = env.firebaseConfig;

import { AgmCoreModule } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FindtutorPage,
    LoginPage,
    SignupPage,
    OrderPage,
    ProfilePage,
    HistoryPage,
    InfoPage,
    PaymentPage,
    TutorPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CRED),
    AgmCoreModule.forRoot({
      apiKey: env.googleMapsKey
    }),
		AngularFireAuthModule,
		AngularFireStorageModule,
		AngularFireDatabaseModule,
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FindtutorPage,
    LoginPage,
    SignupPage,
    OrderPage,
    ProfilePage,
    HistoryPage,
    InfoPage,
    PaymentPage,
    TutorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    File,
    FileChooser,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule {}
