import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

//Pages
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { FindtutorPage } from '../pages/findtutor/findtutor';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  profileData: FirebaseObjectObservable<any>;
  item: any;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private platform: Platform,
     private statusBar: StatusBar, private splashScreen: SplashScreen, private toast: ToastController) {
    this.initializeApp();
    this.afAuth.authState.take(1).subscribe(auth => {
      if (auth) {
        this.profileData = this.afDatabase.object(`profile/${auth.uid}`).valueChanges();
      }
    });

    firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.rootPage = HomePage;
        this.toast.create({
          message: `Success!`,
          duration: 1000,
          cssClass: "success"
        }).present();
      } else {
        this.rootPage = LoginPage;
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Find Tutor', component: FindtutorPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  signOut(){
    this.afAuth.auth.signOut()
  }﻿

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
