import { Component } from '@angular/core';
import { NavController,  NavParams, ToastController, MenuController, AlertController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import "rxjs/Rx";

//pages
import {FindtutorPage} from '../findtutor/findtutor';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  message: any;
  items;

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, private toast: ToastController,
    private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.menuCtrl.enable(true, 'myMenu');

  }

}
