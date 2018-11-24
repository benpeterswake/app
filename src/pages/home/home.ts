import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController, TextInput, Content, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';
import "rxjs/Rx";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import mapTheme from '../../theme/mapTheme.json';

//Firebase
import firebase from 'firebase/app';
import 'firebase/database'
import * as GeoFire from 'geofire';

//Pages
import { TutorPage } from '../tutor/tutor';
import { Geolocation } from '@ionic-native/geolocation';

//Global
var SlidingMarker = require('marker-animate-unobtrusive');
declare var google;
declare var $;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  @ViewChild('myInput') myInput: TextInput;
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
  markers: any[] = [];
  styles: any;
  map:any;
  id: any;
  offCenter: Boolean = false;
  initLoad: Boolean = true;

  constructor(public locate: Geolocation,public loadingCtrl: LoadingController, private zone: NgZone, public menuCtrl: MenuController,
    private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController,
    public navParams: NavParams, private toast: ToastController, private authProvider: AuthProvider) {
    this.styles = mapTheme.style;
    this.menuCtrl.enable(true, 'myMenu');
    authProvider.setProfile.subscribe((data) => {
      this.profileData = data;
      console.log(data);
      
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


  ngOnInit(){
    this.map = this.initMap();
    this.initLoad = true;
    this.getUserLocation();
    this.hits.subscribe(hits => {
      for(let i=0; i< hits.length;i++) {
        let carMarker = new SlidingMarker({
          position: {lat: hits[i].location[0], lng: hits[i].location[1]},
          map: this.map,
          title: 'Tutor',
          icon: {
            url:"https://cdn.bocatutor.me/icons/tutor-icon-set/textbooks.png",
            scaledSize: {
                width: 20,
                height: 20
            }
          }
        });
        carMarker.setDuration(2000);
        carMarker.setEasing('linear');
        carMarker.set('key', hits[i].key);
        this.markers.push(carMarker);
      }
    });

    setTimeout(() => {
      this.setTutorLocation('0', [33.333333,-84])
    }, 5000)
    setTimeout(() => {
      this.setTutorLocation('0', [33.3344444,-84])
    }, 7000)
    setTimeout(() => {
      this.setTutorLocation('0', [33.3355555,-84])
    }, 9000)

  }

  initMap(){
   let options = {
     center: new google.maps.LatLng(-90,90),
     zoom: 15,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     disableDefaultUI: true,
   }
   let mapEl = document.getElementById('map');
   let map =  new google.maps.Map(mapEl, options);
   return map;
  }


  reCenter(){
    this.offCenter = false;
    this.map.panTo({ lat: this.lat+0.0025, lng: this.lng })
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
      this.locate.watchPosition(options).subscribe((position) => {
        console.log(position);
        if(position){
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          let latlng = { lat: this.lat, lng: this.lng }
          let location = new SlidingMarker({
            position: latlng,
            map: this.map,
            title: 'You are here!',
            icon: {
                url:"https://maps.umd.edu/map/img/ResearchAndDiscovery_c.png",
                scaledSize: {
                    width: 30,
                    height: 30
                }
              }
          });
          location.setDuration(2000);
          location.setEasing('linear'); 
          this.getAddress(latlng);
          if(this.initLoad){
            this.reCenter();
            this.getTutorLocations(500, [this.lat, this.lng]);
            this.updateTutorLocation(500, [this.lat, this.lng]); 
            $('#trending').removeAttr("style"); 
            $("#inputFields").animate({
              top: '1%'
            }, 1800, () => {
              $("#trending").slideDown("slow");
            });
            this.initLoad = false;
          }
        } else {
          throw new Error("Could Not Find Location")
        }
      }, (error) => {
        console.log(error);
      });
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
      let hit = {
        key: key,
        location: location,
        distance: distance
      }
      let currentHits = [];
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
      var elementPos = this.markers.map(function(x) {return x.key; }).indexOf(key);     
      this.markers[elementPos].setPosition({lat: location[0], lng: location[1]});
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

  alterTrending(border, left, right) {
    $('#trending').css("display", "block");
    $('#trending').css("position", "relative");
    $('#trending').css('border-bottom-width', border);
    $('#trending').animate({ borderBottomLeftRadius: left, borderBottomRightRadius: right});
  }

  showMore(){
    this.expandAnimation();
    $('#trending').fadeIn();
    this.alterTrending(0, 0, 0);
    this.order.course = null;
    this.show = true;
    this.showMap = false;
    this.showLocation = false;
  }

  cancel(){
    $('#map').css("height", "100%")
    $('#inputFields').animate({padding: "16", top: "1%"});
    this.alterTrending(10, "6%", "6%");
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
