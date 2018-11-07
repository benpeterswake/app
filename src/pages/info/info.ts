import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ImagePicker } from '@ionic-native/image-picker';
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
  constructor(private imgPicker: ImagePicker, private lib: PhotoLibrary, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.user = firebase.auth().currentUser; 
    this.email = this.user.email
    this.storage = firebase.storage().ref().child(`${this.user.uid}/image`);
    this.profileData = this.afDatabase.object(`users/${this.user.uid}`).valueChanges();
    this.updateData = this.afDatabase.object(`users/${this.user.uid}`);
    this.getPhoto();
  }

  choosePhoto(){
    let options = {
      maximumImagesCount:1,
      outputType: 1
    }
    this.imgPicker.hasReadPermission().then(result => {
      if(result) {
        this.lib.requestAuthorization().then(() => {
          this.selectPhoto(options)
        })
      } else {
        this.imgPicker.requestReadPermission().then(() => {
          this.selectPhoto(options)
        })
      }
    })
  }

  getPhoto() {
    this.storage.getDownloadURL().then((url) => {
      if(url){
        this.userImage = url;
      } else {
        this.userImage = 'https://mbtskoudsalg.com/images/push-pin-icon-png-5.png';
      }
    }, (err) => this.userImage = 'https://mbtskoudsalg.com/images/push-pin-icon-png-5.png');
  }

  selectPhoto(options) {
    this.imgPicker.getPictures(options).then(photo => {
      this.data = photo;
      this.userImage = 'data:image/png;base64,' + this.data;
    },  (err) => { 
      this.userImage = 'https://mbtskoudsalg.com/images/push-pin-icon-png-5.png';
      console.log(err)
    })
  }

  updateProfile(profile){  
    let test = "/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgCWAJYAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/VOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAorxD/hY/iL/oI/8AkCP/AOJo/wCFj+Iv+gj/AOQI/wD4mvf/ALFxH80fvf8AkeR/adHs/wAP8z2+ivEP+Fj+Iv8AoI/+QI//AImj/hY/iL/oI/8AkCP/AOJo/sXEfzR+9/5B/adHs/w/zPb6K8Q/4WP4i/6CP/kCP/4mj/hY/iL/AKCP/kCP/wCJo/sXEfzR+9/5B/adHs/w/wAz2+ivEf8AhY/iL/oI/wDkCP8A+JpP+Fj+Iv8AoIf+QI//AImj+xcR/NH73/kH9p0ez/D/ADPb6K8Q/wCFj+Iv+gj/AOQI/wD4mj/hY/iL/oI/+QI//iaP7FxH80fvf+Qf2nR7P8P8z2+ivEf+FjeIv+gj/wCQI/8A4mj/AIWP4i/6CP8A5Aj/APiaP7FxH80fx/yD+06PZ/h/me3UV4h/wsfxF/0EP/IEf/xNH/CxvEX/AEEf/IEf/wATR/YuI/mj97/yD+06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AFFJRSAKWikpgLSUtFABRRRQAUlLRQAlLSUtABSUUtACUUtJQAtJS0lABRRRQAUtJS0AJRRRQAUUUUALSUtJQAtJS0UAFFFFABRRRQAlLRRQAUUUUAFJS0UAFFFFABRRRQAlLRRQAUUUUAFJS0UAFFFFABRRRQACikpaACkopaACiiigAoopKACloooAKKKKACkopaACiiigAoopKACloooAKKKKACikooAKWkpaACkpaSgBaSiigApaSigAooooAKMUUUALSUUUAFFGKWgBKKKWgBKKKMUAFFLSUAFFLSUAFFGKWgBKWiigAooooASilooAKKKKACkpaKAEpaKKACiiigBKKWigAooooAKSlooASloooAKKKKAEopaKACiiigAooooAKKSloAKKKKACiikoAWiiigAooooAKKSloAKKKKACiikoAWiiigAooooAKSiloASilpKACjFLSUAFLSUtACUtJS0AFJRRQAtJS0lAC0UlFABRRRQAUtJRQAtJRRQAUUUUALRSUUALRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIAooxRTAKKKKACiijFABRRRQAUUUUgCijFFMAooooAKKKMUAFFFFABRRRSAKKSlpgFFFFABRRRQAGikxRQAUUtJQAUUtJQAtJRS0AJRRiloASlopKACilpMUAFFLRQAUlFLQAlFGKWgAoopKAFooooAKKKKACikpaACiiikAUUUlMBaKKKACiiigAopKWgAooopAFFFJTAWiiigAooooAKKSloAKKKKACiikoAWiiigAooooAKKSloAKKKKACiikoAWiiigAooooAKKSloAKKKKQBRSUtMApKWkoAWiiigAooooATvS0UlAC0UUUAFFFJQAtFFFABSdqKWgAopKWgAoopKADtS0UlAC0UUUAJRS0UAFFFFABSUUtACUtFFABRRSUAFFLRQAUUUUAFJRS0AJS0UUAFFFJQAUUtFABRRRQAUlFLQAUUUUAJRS0UAFFFFABSUtFACUtFFABRRRQAlFLRQAUUUUAFJS0UAJS0UUAFFFFACUUtFIBKWu3/4VHrH/PzY/wDfx/8A4ij/AIVHrH/PzY/9/H/+Irg+v4X/AJ+I6/qlf+RnEUldx/wqPWP+fmx/7+P/APEUf8Kj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oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//Z"
    this.storage.putString(test, 'base64').then((snapshot) => {
      alert('Uploaded a base64 string!');
      this.getPhoto();
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
