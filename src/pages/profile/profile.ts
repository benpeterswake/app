import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { InfoPage } from '../info/info';
import { PaymentPage } from '../payment/payment';
import { HistoryPage } from '../history/history';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  links: any;

  constructor( private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
      this.links = [
        { name: "Account", link: InfoPage },
        { name: "Payment", link: PaymentPage },
        { name: "History", link: HistoryPage }
      ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  goToPage(page){
    this.navCtrl.push(page.link)
  }

  signOut(){
    this.afAuth.auth.signOut()
  }﻿


}
