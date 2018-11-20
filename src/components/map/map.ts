import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import firebase from 'firebase/app';
import 'firebase/database';
import * as GeoFire from 'geofire';
declare var $;

/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {

  @Input() 

  public map;
  //geo fire
  geoFire: any;
  tutorLocation: any;
  hits = new BehaviorSubject([]);
  initLoad: Boolean = true;
  markers: any = [];
  offCenter: Boolean = false;
  showLocation: any = false;
  lat: number;
  lng: number;
  order: any = {};

  constructor() {
    console.log('Hello MapComponent Component');
    this.tutorLocation = firebase.database().ref('/tutors/locations');
    this.geoFire = new GeoFire(this.tutorLocation);
  }

  ngOnInit(){
    this.map = this.initMap();
    this.initLoad = true;
    this.getUserLocation();
    this.hits.subscribe(hits => {
      this.markers = hits
    });
  }

  initMap(){
   let options = {
     cetner: new google.maps.LatLng(-90,90),
     zoom: 15,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     disableDefaultUI: true,
   }
   
   let mapEl = document.getElementById('map');
   let map =  new google.maps.Map(mapEl, options);

   return map;
  }

  reCenter(){
    if(!this.showLocation){
     this.map.panTo({ lat: this.lat+0.0025, lng: this.lng })
     this.offCenter = false;
     this.map.setZoom(15)
    }
  }

  getUserLocation() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.watchPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      let latlng = { lat: this.lat, lng: this.lng }
      this.getAddress(latlng)
      if(this.initLoad){
        this.reCenter()
        this.getTutorLocations(500, [this.lat, this.lng])
        this.watchTutorLocation(500, [this.lat, this.lng]) 
        $('#trending').removeAttr("style"); 
        $("#inputFields").animate({
          top: '1.5%'
        }, 1800, () => {
           $("#trending").slideDown("slow");
        });
        this.initLoad = false;
      }
    }, (error) => {
      console.log(error);
    }, options);
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
      if(result){
        this.order.location = result[0].formatted_address;
      }
    })
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
      let currentHits = this.hits.value;
      currentHits.push(hit);
      this.hits.next(currentHits);
    })
  }
  watchTutorLocation(radius: number, coords: Array<number>){
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
      var elementPos = this.hits.value.map(function(x) {return x.key}).indexOf(key);
      this.markers[elementPos].location[0] = location[0];
      this.markers[elementPos].location[1] = location[1];
    })
  }
}
