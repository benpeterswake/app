import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  userID: any;
  profileData: any;

  constructor(public http: HttpClient, private afAuth: AngularFireAuth,) {
    console.log('Hello AuthProvider Provider');
  }

  getProfileData() {
    return new Promise( resolve => {
      this.afAuth.authState.take(1).subscribe(auth => {
        if(auth)this.userID = auth.uid
        let profile = firebase.database().ref(`users/${this.userID}`);
        profile.on("value", (snapshot) => {
          this.profileData = snapshot.val()
          resolve(this.profileData);
        });
      })
    })

  }



}
