import { Component, ViewChild } from '@angular/core';
import { NavController,  NavParams, ToastController, MenuController, AlertController,  Slides} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import "rxjs/Rx";

//Pages
import { FindtutorPage } from '../findtutor/findtutor';
import { OrderPage } from '../order/order';
import { TutorPage } from '../tutor/tutor';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  message: any;
  items;
  profileData: any;
  topTutors: any = [];

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, private toast: ToastController,
    private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.menuCtrl.enable(true, 'myMenu');
    let ref = firebase.database().ref("tutors");
    ref.orderByChild("rank").limitToFirst(3).on("child_added", (snapshot) => {
      this.topTutors.push(snapshot.val())
    });
    this.afAuth.authState.take(1).subscribe(auth => {
      this.profileData = this.afDatabase.object(`profile/${auth.uid}`).valueChanges();
    })
  }

  goToTutor(tutor){
    this.navCtrl.push(TutorPage, { tutor: tutor })
  }

  goToOrder(){
    this.navCtrl.setRoot(OrderPage)
  }
  goToSearch(){
    this.navCtrl.setRoot(FindtutorPage)
  }

}
