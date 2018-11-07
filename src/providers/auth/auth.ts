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
  user: any;
  profileData: any;

  constructor(public http: HttpClient, private afAuth: AngularFireAuth) {
    this.user = firebase.auth().currentUser; 
    console.log('Hello AuthProvider Provider');
  }

  getProfileData() {
    return new Promise( resolve => {
      let profile = firebase.database().ref(`users/${this.user.uid}`);
      profile.on("value", (snapshot) => {
        this.profileData = snapshot.val()
        resolve(this.profileData);
      });
    })
  }
}
