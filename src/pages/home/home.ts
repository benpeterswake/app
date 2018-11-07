import { Component, ViewChild, Input, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController, TextInput, Content, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase/app';
import 'firebase/database'
import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import mapTheme from '../../theme/mapTheme.json';
import "rxjs/Rx";
declare var google;
declare var $;

//Pages
import { TutorPage } from '../tutor/tutor';
import { AgmMap } from '@agm/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('myInput') myInput: TextInput;
  @ViewChild('AgmMap') agmMap: AgmMap;
  content: Content;
  message: any;
  items: any;
  hits = new BehaviorSubject([]);
  geoFire: any;
  profileData: any;
  topTutors: any = [];
  tutorLocation: any;
  order: any = {};
  show: any = false;
  showLocation: any = false;
  showMap: any = true;
  showInputs: any = true;
  dummy: any = [];
  courses: any = [];
  goTutor: any = false;
  userID: any;
  trendingCourses: any = [];
  tutors: any = [];
  lat: number;
  lng: number;
  markers: any;
  url: any;
  styles: any;
  user: any;
  map:any;
  id: any;
  offCenter: Boolean = false;
  initLoad: Boolean = true;

  constructor(public loadingCtrl: LoadingController, private zone: NgZone, public menuCtrl: MenuController,
    private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController,
    public navParams: NavParams, private toast: ToastController, private authProvider: AuthProvider) {
    this.url = {
      url:"https://cdn.bocatutor.me/icons/tutor-icon-set/textbooks.png",
      scaledSize: {
          width: 20,
          height: 20
      }
    }
    this.user = {
      url:"https://maps.umd.edu/map/img/ResearchAndDiscovery_c.png",
      scaledSize: {
          width: 30,
          height: 30
      }
    }
    this.styles = mapTheme.style;
    this.menuCtrl.enable(true, 'myMenu');
    this.authProvider.getProfileData().then((data) => {
        this.profileData = data;
    });
    this.tutorLocation = firebase.database().ref('/tutors/locations');
    this.geoFire = new GeoFire(this.tutorLocation);
    this.dummy = [
      {
        name: "IS 4000"
      },
      {
        name: "IS 4500"
      },
      {
        name: "IS 4100"
      },
      {
        name: "IS 4501"
      },
      {
        name: "IS 4003"
      },
      {
        name: "IS 4522"
      }
    ]

    this.trendingCourses = [
        {
            name: 'IS 4160',
            icon:'cloud-circle'
        },
        {
            name: 'Math 3440',
            icon: 'calculator'
        }
    ]
  }

  ionViewDidLoad(){
    this.initLoad = true;
    this.agmMap.mapReady.subscribe(map => {
        console.log(map);
        this.map = map;
        this.getUserLocation();
    })
    this.hits.subscribe(hits => this.markers = hits);
    let value1 = 34.036838399999995
    let value2 = -84.63204629999999
    // for(let i=0; i<50; i++){
    //   setTimeout(() => {
    //     this.setTutorLocation('0', [value1+=0.00003, value2+=0.00003])
    //   }, i*2000)
    // }
  }

  reCenter(){
    this.offCenter = false;
    this.map.panTo({ lat: this.lat+0.004, lng: this.lng })
    this.map.setZoom(15)
  }

  fadeInCenterBtn() {
    this.offCenter = true;
    $("#centerBtn").fadeIn();
  }

  getUserLocation() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      let latlng = { lat: this.lat, lng: this.lng }
      this.getAddress(latlng)
      this.reCenter()
      this.getTutorLocations(500, [this.lat, this.lng])
      this.updateTutorLocation(500, [this.lat, this.lng])  
      $("#inputFields").animate({
        top: '1%'
      }, 1800, () => {
        $("#trending").slideDown("slow");
      });
      this.initLoad = false;
      this.watchUserLocation();
    }, (error) => {
      console.log(error);
    }, options)
  }

  watchUserLocation() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      let latlng = { lat: this.lat, lng: this.lng }
      this.getAddress(latlng)
    }, (error) => {
      console.log(error);
    }, options)
  }

  getAddress(latlng) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location' : latlng}, (result) => {
      this.zone.run(() => {
        this.order.location = result[0].formatted_address;
      });
    })
  }

  setTutorLocation(key: string, coords: Array<number>){
    this.geoFire.set(key, coords)
      .then(() => console.log('location update'))
      .catch((err) => console.log(err))
  }

  getTutorLocations(radius: number, coords: Array<number>){
    this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_entered', (key, location, distance) => {
      console.log(this.hits)
      let hit = {
        key: key,
        location: location,
        distance: distance
      }
      let currentHits = this.hits.value;
      currentHits.push(hit);
      this.hits.next(currentHits);
    })
  }

  updateTutorLocation(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_moved', (key, location, distance) => {
      let hit = {
        key: key,
        location: location,
        distance: distance
      }
      var elementPos = this.hits.value.map(function(x) {return x.key; }).indexOf(key);
      this.hits.value[elementPos] = hit;
      console.log(this.hits)
    })
  }

  viewTutor(tutor){
    this.navCtrl.push(TutorPage, {tutor: tutor, order: this.order})
  }

  presentLoading() {
   let loading = this.loadingCtrl.create({
     spinner: 'dots',
   });
   loading.present();
   // NOTE: remove this
   setTimeout(() => {
     loading.dismiss();
   }, 5000);
  }

  getActiveTutors(){
    let load = false;
    this.tutors = [];
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });
    loading.present();
    firebase.database().ref("tutors/profiles").orderByChild("school").equalTo(this.profileData.school).on("child_added", (snapshot) => {
      if(snapshot.val().certifications.includes(this.order.course) && snapshot.val().active){
        this.tutors.push(snapshot.val());
        if(!load) {
          loading.dismiss();
          load = true;
        }
      }
    });
  }

  setMeetUpLocation() {
    this.order.location = this.map.getCenter();
    this.getActiveTutors();
  }

  getCourses(){
    this.courses = this.dummy;
  }

  expandAnimation() {
    $('#inputFields').animate({padding: "0", top: "0"});
  }

  showMore(){
    this.expandAnimation();
    $('#trending').fadeIn();
    $('#trending').css('border-bottom-width', 0);
    $('#trending').css("display", "block");
    $('#trending').css("position", "relative");
    $('#trending').animate({ borderBottomLeftRadius: 0, borderBottomRightRadius: 0});
    this.order.course = null;
    this.show = true;
    this.showMap = false;
    this.showLocation = false;
  }

  cancel(){
    $('#map').css("height", "100%")
    $('#inputFields').animate({padding: "16", top: "1%"});
    $('#trending').css("display", "block");
    $('#trending').css("position", "relative");
    $('#trending').css('border-bottom-width', 10);
    $('#trending').animate({ borderBottomLeftRadius: "6%", borderBottomRightRadius: "6%"});
    this.tutors = [];
    this.show = false;
    this.showMap = true;
    this.showLocation = false;
    this.courses = [];
    this.order.course = null;
    this.reCenter();
  }

  selectCourse(course){
    $('#inputFields').addClass("location");
    $('agm-map').css("top", "0px");
    $('#trending').css("display", "none");
    $('#trending').css("position", "absolute");
    this.order.course = course.name
    this.courses = [];
    this.show = true;
    this.showMap = true;
    this.showLocation = true;
    this.map.panTo({ lat: this.lat, lng: this.lng })
    this.map.setZoom(18)
  }

}
