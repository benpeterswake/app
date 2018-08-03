import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';

//Pages
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user: any;
  profile: any;
  message: any;

  constructor(private afAuth: AngularFireAuth , private afDatabase: AngularFireDatabase, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.user = {};
    this.profile = {};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  async signUp(){
    try {
      if(!this.profile.first_name && !this.profile.last_name){
          this.toast.create({
            message: 'All fields are required',
            duration: 2500,
            cssClass: "error"
          }).present();
       }else{
         const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
         if(result){
         this.profile.school = false;
         this.afAuth.authState.take(1).subscribe(auth => {
           this.afDatabase.object(`profile/${auth.uid}`).set(this.profile)
           .then(() => this.navCtrl.setRoot(HomePage));
         });
          this.navCtrl.push(LoginPage);
        }
       }
     }
     catch(e){
        if (e.code === 'auth/email-already-in-use') {
          this.toast.create({
            message: e.message,
            duration: 2500,
            cssClass: "error"
          }).present();
        } else if (e.code === 'auth/invalid-email') {
          this.toast.create({
            message: e.message,
            duration: 2500,
            cssClass: "error"
          }).present();
        } else if (e.code === 'auth/weak-password'){
          this.toast.create({
            message: e.message,
            duration: 2500,
            cssClass: "error"
          }).present();
        } else if (e.code === 'auth/argument-error'){
            this.toast.create({
              message: "All fields are required",
              duration: 2500,
              cssClass: "error"
            }).present();
        } else {
          this.toast.create({
            message: "Error connecting to servers",
            duration: 2500,
            cssClass: "error"
          }).present();
        }
        console.log(e);
      }
  }

  goToLogin(){
    this.navCtrl.pop()
  }

}
