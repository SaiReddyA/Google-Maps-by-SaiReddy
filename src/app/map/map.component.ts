// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import * as L from 'leaflet';
// import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  private map: any;
  private leaflet: any;
  searchMode: 'latlng' | 'location' = 'latlng';
  lat: number = 12.9716;
  lng: number = 77.5946;
  location: string = '';
constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

async ngOnInit(): Promise<void> {
  if (isPlatformBrowser(this.platformId)) {
        const L = await import('leaflet');
        this.leaflet = L;

        // Use coordinates as per your logic (Bangalore for now)
        this.initMap("12.9716", "77.5946");
      // Map current location
      this.getCurrentLocation();

      // Map static coordinates (e.g. Hyderabad)
      this.addMarkerByCoordinates(17.3850, 78.4867, 'Hyderabad');

      // Map a location by name
      this.addMarkerByLocationName('Chennai');
    }
  }

  initMap(latStr?: string, lngStr?: string): void {
    let lat = parseFloat(latStr || '') || this.lat;
    let lng = parseFloat(lngStr || '') || this.lng;
  
    // Remove previous map if already initialized
    if (this.map) {
      this.map.remove();
    }
  const L = this.leaflet
    this.map = L.map('map').setView([lat, lng], 5); // Default view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; Sai Reddy Maps'
    }).addTo(this.map);
  }

  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.addMarkerByCoordinates(lat, lng, 'Your Location');
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }

  addMarkerByCoordinates(lat: number, lng: number, label: string): void {
    const L = this.leaflet
    const marker = L.marker([lat, lng], {
      icon: this.getMaterialIcon()
    }).addTo(this.map);
    marker.bindPopup(label);

    setTimeout(() => {
        const attributionEl = document.querySelector('.leaflet-control-attribution');
        if (attributionEl) {
          const links = attributionEl.querySelectorAll('a');
          links.forEach(link => {
            if (link.textContent?.trim().toLowerCase() === 'leaflet') {
              link.remove();
            }
          });
      
          const spans = attributionEl.querySelectorAll('span');
          spans.forEach(span => {
            span.remove();
          });
        }
      }, 0);
  }

  addMarkerByLocationName(location: string): void {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          this.addMarkerByCoordinates(lat, lng, location);
        } else {
          console.warn(`Location not found: ${location}`);
        }
      })
      .catch(err => console.error('Geocoding error:', err));
  }

  private getMaterialIcon(): L.DivIcon {
    const L = this.leaflet
    return L.divIcon({
      className: '',
      html: `<div style="font-size: 30px; color: red;" class="material-icons">location_on</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  }
}


// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';

// @Component({
//   selector: 'app-map',
//   standalone: true,
//   imports: [CommonModule, MatIconModule],
//   templateUrl: './map.component.html',
//   styleUrl: './map.component.css'
// })
// export class MapComponent implements OnInit {
//   private map: any;
//   private leaflet: any;

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

//   async ngOnInit(): Promise<void> {
//     if (isPlatformBrowser(this.platformId)) {
//       const L = await import('leaflet');
//       this.leaflet = L;

//       // Use coordinates as per your logic (Bangalore for now)
//       this.initMap(12.9716, 77.5946);
//     }
//   }

//   private initMap(lat: number, lng: number): void {
//     const L = this.leaflet;

//     this.map = L.map('map').setView([lat, lng], 13);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; Sai Reddy'
//     }).addTo(this.map);

//     const materialIconMarker = L.divIcon({
//       className: '',
//       html: `<div style="font-size: 30px; color: red;" class="material-icons">location_on</div>`,
//       iconSize: [30, 30],
//       iconAnchor: [15, 30]
//     });

//     L.marker([lat, lng], { icon: materialIconMarker })
//       .addTo(this.map)
//       .bindPopup('You are here')
//       .openPopup();
//        setTimeout(() => {
//         const attributionEl = document.querySelector('.leaflet-control-attribution');
//         if (attributionEl) {
//           const links = attributionEl.querySelectorAll('a');
//           links.forEach(link => {
//             if (link.textContent?.trim().toLowerCase() === 'leaflet') {
//               link.remove();
//             }
//           });
      
//           const spans = attributionEl.querySelectorAll('span');
//           spans.forEach(span => {
//             span.remove();
//           });
//         }
//       }, 0);
      
//   }
// }
