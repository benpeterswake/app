import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Slides } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//Firebase
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
  @ViewChild(Slides) slides: Slides;
  user: any;
  autocomplete: any = [];
  profile: any;
  message: any;

  constructor(private http: HttpClient, private afAuth: AngularFireAuth , private afDatabase: AngularFireDatabase, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.user = {};
    this.profile = {};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.slides.lockSwipeToNext(true)
  }

  getSchools(){
    if(this.profile.school){
      this.http.post('http://localhost:3000/schools/autocomplete', this.profile).subscribe(data => {
        this.autocomplete = data;
      })
    }
  }

  setSchool(school){
    this.profile.school = school.name;
    this.autocomplete = [];
  }

  async signUp(){
    try {
         const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
         if(result){
         this.afAuth.authState.take(1).subscribe(auth => {
           this.afDatabase.object(`profile/${auth.uid}`).set(this.profile)
           .then(() => this.navCtrl.setRoot(HomePage));
         });
          this.navCtrl.push(LoginPage);
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

  swipe(){
    this.slides.lockSwipeToNext(false)
    this.slides.slideNext()
    this.slides.lockSwipeToNext(true)
  }

  changeSlide(direction, validate){
    if(direction){
      if(validate === 2){
        if(this.profile.full_name && this.profile.email){
          this.swipe()
        }else{
          this.toast.create({
            message: "All fields are required",
            duration: 2500,
            cssClass: "error"
          }).present();
        }
      }else if(validate === 3){
        if(this.profile.school && this.autocomplete.length){
          this.toast.create({
            message: "Please select a school",
            duration: 2500,
            cssClass: "error"
          }).present();

        }else if(this.profile.school && !this.autocomplete.length){
          this.swipe()
        }else {
          this.toast.create({
            message: "School is required",
            duration: 2500,
            cssClass: "error"
          }).present();
        }
      }else{
        this.swipe()
      }
    }else{
       this.slides.slidePrev()
    }
  }

  goToLogin(){
    this.navCtrl.setRoot(LoginPage)
  }

}
