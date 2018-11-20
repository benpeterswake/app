import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  profileData: any;
  updateData: any;
  userImage: any;
  email: any;
  data: any;
  user:any;
  storage: any;
  change: Boolean = false;

  constructor(public loadingCtrl: LoadingController, private auth: AuthProvider, private camera: Camera, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.user = firebase.auth().currentUser; 
    this.email = this.user.email
    this.storage = firebase.storage().ref().child(`${this.user.uid}/image`);
    this.profileData = this.auth.profileData;
    this.userImage = this.auth.image;
  }

  cancel() {
    this.navCtrl.pop();
  }

  openPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });
    loading.present();
    this.camera.getPicture(options).then((imageData) => {
      this.change = true;
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.userImage = 'data:image/jpeg;base64,' + imageData;    
      this.change = true;  
      loading.dismiss();
    }, (err) => {
      loading.dismiss();
     // Handle error
     console.log(err);
     
    });
  }

  updateProfile(profile){ 
    if(this.change){
      let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'This may take a few seconds...'
      });
      let loading2 = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Succces'
      });
      loading.present();
      this.storage.putString(this.userImage, 'data_url').then(() => {
        this.auth.getPhoto(this.user);
        loading.dismiss();
        loading2.present();
        setTimeout(() => {
          loading2.dismiss();
          this.navCtrl.pop();
        }, 1000)
      }, (err) => alert(err))
    } else {
      this.cancel();
    }
       
    // if(profile.first_name && profile.last_name && profile.school){
    //   this.updateData.update(profile)
    //   if(this.email){
    //     user.updateEmail(this.email).then(() => {
    //       // Update successful.
    //       this.navCtrl.setRoot(HomePage)
    //     }).catch((error) => {
    //       // An error happened.
    //       alert("error")
    //       console.log(error)
    //     });
    //   }
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
