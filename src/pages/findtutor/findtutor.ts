import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from '../home/home';

@Component({
  selector: 'page-findtutor',
  templateUrl: 'findtutor.html',
})
export class FindtutorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindtutorPage');
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage)
  }

}
