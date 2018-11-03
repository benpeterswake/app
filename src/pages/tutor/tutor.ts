import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-tutor',
  templateUrl: 'tutor.html',
})
export class TutorPage {

  tutorData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tutorData = this.navParams.get('tutor');
    console.log(this.tutorData);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorPage');
  }

}
