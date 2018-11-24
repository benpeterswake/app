import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';

@Injectable()
export class AuthProvider {
  user: any;
  profileData: any;
  storage: any;
  profilePicture: any;
  image: any;
  setPhoto: Subject<any> = new Subject<any>();
  setProfile: Subject<any> = new Subject<any>();

  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
    this.image = false;
    this.setPhoto.subscribe((url) => {
      this.image = url;
    });
    this.setProfile.subscribe((data) => {      
      this.profileData = data;
    });
  }

  getPhoto(user) {
    this.storage = firebase.storage().ref().child(`${user.uid}/image`);
    this.storage.getDownloadURL().then((url) => {
      this.setPhoto.next(url);
    })
  }

  getProfileData(user) {
    let profile = firebase.database().ref(`users/${user.uid}`);
    profile.on("value", (snapshot) => {  
      this.setProfile.next(snapshot.val());
    });
  }
}
