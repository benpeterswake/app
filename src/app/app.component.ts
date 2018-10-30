import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

//Pages
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { FindtutorPage } from '../pages/findtutor/findtutor';
import { OrderPage } from '../pages/order/order';
import { ProfilePage } from '../pages/profile/profile';
import { InfoPage } from '../pages/info/info';
import { PaymentPage } from '../pages/payment/payment'
;
@Component({
  selector: 'app',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  profileData: any;
  item: any;
  subPages: any;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private platform: Platform,
     private statusBar: StatusBar, private splashScreen: SplashScreen, private toast: ToastController) {
    this.initializeApp();
    firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.profileData = this.afDatabase.object(`users/${auth.uid}`).valueChanges();
        this.rootPage = HomePage;
      } else {
        this.profileData = null;
        this.rootPage = SignupPage;
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Explore', component: FindtutorPage },
      { title: 'History', component: FindtutorPage },
      { title: 'Help', component: ProfilePage },
      { title: 'Payment', component: PaymentPage },
      { title: 'Settings', component: ProfilePage },
    ];
    this.subPages = [
      { title: 'Become a Tutor', component: FindtutorPage },
      { title: 'Legal', component: FindtutorPage },
      { title: 'Contact Us', component: FindtutorPage }
    ]

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.afAuth.authState.take(1).subscribe(auth => {
        if (auth) {
          this.rootPage = HomePage;
        }else{
          this.rootPage = SignupPage;
        }
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  goToInfo(){
    this.nav.push(InfoPage);
  }

  goToProfile(){
    this.nav.setRoot(ProfilePage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
