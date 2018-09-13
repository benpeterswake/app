import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: any;
  message: any;

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.user = {}
    this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(){
    try{
      // this.test = true;
      const result = await this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password);
      if(result){
        this.navCtrl.setRoot(HomePage);
      }
    } catch(e){
      // this.test = false;
      console.log(e)
      this.toast.create({
        message: e.message,
        duration: 3000,
        cssClass: "error"
      }).present();
    }
  }

  goToSignup(){
    this.navCtrl.setRoot(SignupPage)
  }

}
