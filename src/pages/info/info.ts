import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import * as firebase from 'firebase';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  profileData: any;
  updateData: any;
  email: any;
  constructor(private file: File, private filePath: FilePath, private fileChooser: FileChooser, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.afAuth.authState.take(1).subscribe(auth => {
        this.profileData = this.afDatabase.object(`profile/${auth.uid}`).valueChanges();
        this.email = auth.email
        this.updateData = this.afDatabase.object(`profile/${auth.uid}`)
    });
  }

  choosePhoto(){
    this.fileChooser.open()
    .then(uri => {
      this.filePath.resolveNativePath(uri)
        .then(filePath => {
          let nameFile = uri.replace(filePath, '');
          this.file.readAsDataURL(filePath, nameFile).then(data => alert(data))
        })
        .catch(err => alert(err));
      })
    .catch(err => alert(err));
  }

  updateProfile(profile){
    let user = firebase.auth().currentUser;
    if(profile.first_name && profile.last_name && profile.school){
      this.updateData.update(profile)
      if(this.email){
        user.updateEmail(this.email).then(() => {
          // Update successful.
          this.navCtrl.setRoot(HomePage)
        }).catch((error) => {
          // An error happened.
          alert("error")
          console.log(error)
        });
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
