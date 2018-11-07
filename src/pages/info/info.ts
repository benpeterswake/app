import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase';

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
  constructor(private auth: AuthProvider, private camera: Camera, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.user = firebase.auth().currentUser; 
    this.email = this.user.email
    this.storage = firebase.storage().ref().child(`${this.user.uid}/image`);
    this.profileData = this.afDatabase.object(`users/${this.user.uid}`).valueChanges();
    this.userImage = this.auth.image;
  }

  openPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.userImage = 'data:image/jpeg;base64,' + imageData;    
      console.log(imageData)
      this.change = true;  
     }, (err) => {
      // Handle error
     });

  }

  updateProfile(profile){  
    this.storage.putString(this.userImage, 'data_url').then(() => {
      this.auth.getPhoto(this.user);
      this.navCtrl.pop();
    }, (err) => alert(err));

    
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
