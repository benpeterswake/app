import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  user: any;
  profileData: any;
  storage: any;
  profilePicture: any;
  image: any;
  setPhoto: Subject<any> = new Subject<any>();

  constructor(public http: HttpClient, private afAuth: AngularFireAuth) {
    this.user = firebase.auth().currentUser; 
    console.log('Hello AuthProvider Provider');
    this.setPhoto.subscribe((url) => {
      this.image = url;
      console.log(url);
    })
  }

  getPhoto(user) {
    this.storage = firebase.storage().ref().child(`${user.uid}/image`);
    this.storage.getDownloadURL().then((url) => {
      this.setPhoto.next(url);
    })
  }

  getProfileData() {
    return new Promise( resolve => {
      if(this.user) {
        let profile = firebase.database().ref(`users/${this.user.uid}`);
        profile.on("value", (snapshot) => {
          this.profileData = snapshot.val()
          resolve(this.profileData);
        });
      }
    })
  }
}
