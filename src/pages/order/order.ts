import { Component, ViewChild, Input, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController, TextInput, Content, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/Rx";
declare var google;
declare var $;

//Pages
import { HomePage } from '../home/home';
import { FindtutorPage } from '../findtutor/findtutor';
import { TutorPage } from '../tutor/tutor';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  constructor() {
  }

}
