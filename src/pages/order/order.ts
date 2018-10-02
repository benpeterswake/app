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
  @ViewChild('myInput') myInput: TextInput;
  message: any;
  items: any;
  hits = new BehaviorSubject([]);
  geoFire: any;
  profileData: any;
  topTutors: any = [];
  tutorLocation: any;
  order: any = {};
  show: any = false;
  dummy: any = [];
  courses: any = [];
  showLocation: any = false;
  showMap: any = true;
  goTutor: any = false;
  userID: any;
  potentialTutors: any = [];
  lat: number;
  lng: number;
  markers: any;
  url: any;
  styles: any;
  user: any;
  map: any;

  constructor(public loadingCtrl: LoadingController, private zone: NgZone, public menuCtrl: MenuController, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, private toast: ToastController) {
    this.url = {
      url:"https://cdn.bocatutor.me/icons/tutor-icon-set/textbooks.png",
      scaledSize: {
          width: 20,
          height: 20
      }
    }
    this.user = {
      url:"https://png.pngtree.com/svg/20170401/hm_ico_dot_blue_526715.png",
      scaledSize: {
          width: 20,
          height: 20
      }
    }
    this.styles = [
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#7fc8ed"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#7fc8ed"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#83cead"
              },
              {
                  "saturation": 1
              },
              {
                  "lightness": -15
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#f3f4f4"
              },
              {
                  "saturation": -84
              },
              {
                  "lightness": 59
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#bbbbbb"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 26
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -35
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -22
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "poi.school",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      }
  ]
    this.menuCtrl.enable(true, 'myMenu');
    this.afAuth.authState.take(1).subscribe(auth => {
      if(auth)this.userID = auth.uid
      let profile = firebase.database().ref(`users/${this.userID}`);
      profile.on("value", (snapshot) => {
        this.profileData = snapshot.val()
      });

    let tutors = firebase.database().ref("tutors");
    tutors.orderByChild("rank").limitToFirst(3).on("child_added", (snapshot) => {
      this.topTutors.push(snapshot.val())
    });
  })
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
  }

  ionViewWillLoad(){
    this.hits.subscribe(hits => this.markers = hits);
    setTimeout(() => {
      this.setTutorLocation('0', [34.034538399999995,-84.63204629999999])
    }, 6000)
  }

  getUserLocation(map: any) {
    this.map = map;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        let latlng = { lat: this.lat+0.004, lng: this.lng }
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location' : latlng}, (result, status) => {
          this.zone.run(() => {
            this.order.location = result[0].formatted_address;
          });
        })
        map.setCenter(latlng)
        this.getLocations(500, [this.lat, this.lng])
        $("#inputFields").fadeIn();
        $("#inputFields").animate({
          marginTop: 10
        }, 1500, () => {
          $("#trending").slideDown("slow");
        });
      })
    }
  }

  setTutorLocation(key: string, coords: Array<number>){
    this.geoFire.set(key, coords)
      .then(() => console.log('location update'))
      .catch((err) => console.log(err))
  }

  getLocations(radius: number, coords: Array<number>){
    this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_entered', (key, location, distance) => {
      console.log(this.hits.value)
      let hit = {
        key: key,
        location: location,
        distance: distance
      }
      let currentHits = this.hits.value;
      currentHits.push(hit);
      this.hits.next(currentHits);
    })
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
    })
  }


  presentLoading() {
   let loading = this.loadingCtrl.create({
     spinner: 'dots',
   });
   loading.present();
   setTimeout(() => {
     loading.dismiss();
   }, 5000);
  }

  hideTrending(){
    $('#trending').slideUp()
  }

  getActiveTutors(){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });
    loading.present();
    firebase.database().ref("tutors").orderByChild("school").equalTo(this.profileData.school.toLowerCase()).on("child_added", (snapshot) => {
      loading.dismiss();
      if(snapshot.val().certifications.includes(this.order.course) && snapshot.val().active){
        this.potentialTutors.push(snapshot.val());
      }
    });
  }

  showMore(){
    $('#inputFields').animate({padding: "0", marginTop: "0"});
    $('#trending').fadeIn();
    $('#trending').css('border-bottom-width', 0);
    $('#trending').animate({ borderBottomLeftRadius: 0, borderBottomRightRadius: 0});
    $('#prices').slideDown();
    this.order.course = null;
    this.show = true;
    this.showMap = false;
    this.showLocation = false;
  }

  getCourses(){
    this.courses = this.dummy;
  }

  cancel(){
    $('#inputFields').removeClass("top");
    $('#map').css("height", "100%")
    $('#inputFields').animate({padding: "16", marginTop: "10"});
    $('#trending').css("display", "block");
    $('#trending').css("position", "relative");
    $('#trending').css('border-bottom-width', 10);
    $('#trending').animate({ borderBottomLeftRadius: "6%", borderBottomRightRadius: "6%"})
    $('#prices').fadeOut()
    this.potentialTutors = [];
    this.show = false;
    this.showMap = true;
    this.showLocation = false;
    this.courses = [];
    this.order.course = null;
  }

  selectCourse(course){
    $('#inputFields').removeClass("top");
    $('#inputFields').addClass("location");
    $('agm-map').css("top", "0px");
    $('#trending').css("display", "none");
    $('#trending').css("position", "absolute");
    $('#prices').hide()
    this.order.course = course.name
    this.courses = [];
    this.showMap = true;
    this.showLocation = true;
  }

  setLocation(){
    this.getActiveTutors();
  }

  goToSearch(){
    this.goTutor = false;
    this.navCtrl.push(FindtutorPage)
  }

  goToTutor(tutor){
    this.goTutor = true;
    this.navCtrl.push(TutorPage, { tutor: tutor })
  }

  orderTutor(){
    try{
      this.afAuth.authState.take(1).subscribe(auth => {
        this.order.active = false;
        this.afDatabase.object(`orders/${auth.uid}`).set(this.order)
        .then(() => this.navCtrl.setRoot(HomePage));
      });
    }catch(e){
      this.toast.create({
        message: e.message,
        duration: 2500,
        cssClass: "error"
      }).present();
    }
  }
}
