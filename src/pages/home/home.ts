import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  map: GoogleMap;
  mapElement: HTMLElement;
  address: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public googleMaps: GoogleMaps, public nativeGeocoder: NativeGeocoder) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getCurrentLocation().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
      this.reverseGeoCoding(resp.coords.latitude, resp.coords.longitude);
    });
  }

  getCurrentLocation(): Promise<any> {
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then((resp) => {
        resolve(resp);
      }).catch((error) => {
        console.log();
      })
    })
  }

  loadMap(lat, lng) {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: lat,
          lng: lng
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    // Wait the MAP_READY before using any methods.

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: lat,
            lng: lng
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }

  reverseGeoCoding(lat, lng) {
    this.nativeGeocoder.reverseGeocode(lat, lng).then((resp) => {
      this.address = resp.thoroughfare +" ," + resp.locality + " ,"+resp.subLocality + " ,"+resp.administrativeArea + " ," +resp.countryName ;
    })
  }
}
