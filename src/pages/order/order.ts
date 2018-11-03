import { Component, ViewChild, Input, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController, TextInput, Content, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/Rx";
declare var google;
declare var $;

//Pages
import { HomePage } from '../home/home';
import { FindtutorPage } from '../findtutor/findtutor';
import { TutorPage } from '../tutor/tutor';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  tutors: any = [];

  constructor(public navCtrl: NavController,  public navParams: NavParams,) {
    console.log(this.navParams.get('tutors'));
    
    this.tutors = this.navParams.get('tutors');
  }

  viewTutor(tutor) {
    this.navCtrl.push(TutorPage, {
      tutor: tutor
    })
  }

  cancel() {
    this.navCtrl.setRoot(HomePage)
  }

  // orderTutor(){
  //   try{
  //     this.afAuth.authState.take(1).subscribe(auth => {
  //       this.order.active = false;
  //       this.afDatabase.object(`orders/${auth.uid}`).set(this.order)
  //       .then(() => this.navCtrl.setRoot(HomePage));
  //     });
  //   } catch(e) {
  //     this.toast.create({
  //       message: e.message,
  //       duration: 2500,
  //       cssClass: "error"
  //     }).present();
  //   }
  // }

}
