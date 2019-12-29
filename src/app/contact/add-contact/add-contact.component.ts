import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from
  '@angular/core';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements AfterViewInit, OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      address: ['', Validators.required],
      LKGovernorateId: ['', Validators.required],
      LKCityId: ['', Validators.required],
      LKAreaId: ['', Validators.required],
      type: ['', Validators.required],
      image: ['', Validators.required],
      longitude: ['', Validators.required],
      latitudes: ['', Validators.required]
    });

    this.apiService.getGovernorates()
      .subscribe(response => {
        var governorates = response['data'];
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKGovernorateId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(governorate.name));

          // set value property of opt
          opt.value = governorate.id;

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });

    this.apiService.getCitys()
      .subscribe(response => {
        var governorates = response['data'];
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKCityId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(governorate.name));

          // set value property of opt
          opt.value = governorate.id;

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });

    this.apiService.getAreas()
      .subscribe(response => {
        var governorates = response['data'];
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKAreaId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(governorate.name));

          // set value property of opt
          opt.value = governorate.id;

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });

    this.apiService.getTags()
      .subscribe(response => {
        var tags = response['data'];
        tags.forEach(tag => {
          var sel = document.getElementById('tags');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(tag.name));

          // set value property of opt
          opt.value = tag.id;

          // if (this.LKGovernorateId && tag.id == this.LKGovernorateId) {
          //   opt.selected = true;
          // }

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });
  }

  onSubmit() {
    debugger;
    let keys = Object.keys(this.addForm.value);
    for (let key of keys) {
      if (this.addForm.value[key] == null || this.addForm.value[key].length == 0) {
        if (key == 'name' ||
          key == 'number' ||
          key == 'address' ||
          key == 'LKGovernorateId' ||
          key == 'LKCityId' ||
          key == 'LKAreaId' ||
          key == 'type'
        ) {
          alert("you should to fill " + key);
          return;
        }
      }
    }
    let contactTags = [];
    var sel = document.getElementById('tags');
    var options = sel['options'];
    debugger;
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        contactTags.push({ "LKTagId": options[i].value });
      }
    }
    this.addForm.value['contactTags'] = contactTags;

    this.apiService.createContact(this.addForm.value)
      .subscribe(data => {
        debugger;
        if (data['status'] == 201) {
          alert('adding successfully');
          this.router.navigate(['list-contact']);
        } else {
          alert("error");
          console.log(data);
        }
      }, err => {
        alert("error");
        console.log(err);
      });
  }

  back() {
    this.router.navigate(['list-contact']);
  }


  @ViewChild('clientIconUploader', { static: true }) clientIconUploader;

  clientIcon;
  clientIconInvalidText;

  public clientIconChangeEvent(fileInput) {
    let self = this;

    this.clientIconInvalidText = false;

    if (fileInput.target.files && fileInput.target.files[0]) {

      let file = fileInput.target.files[0];

      if (file.size > (100000 / 1.32)) {
        this.clientIconInvalidText = true;
      } else {
        this.getBase64(file).then(function (data) {
          self.addForm.value.image = self.clientIcon = data;
          self.clientIconUploader.nativeElement.style.width = "75%"
        });
      }
    }
  }

  public removeClientIcon() {
    this.clientIconInvalidText = false;
    this.clientIcon = "";
    this.addForm.value.image = "";
    this.clientIconUploader.nativeElement.value = null;
    this.clientIconUploader.nativeElement.style.width = "95%"
  }

  public getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  lat = 29.420;
  lng = 31.160;
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;

  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8
  };

  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
    draggable: true
  });

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.marker.setMap(this.map);

    let self = this;
    google.maps.event.addListener(this.marker, 'dragend', function (evt) {
      self.addForm.value.longitude = evt.latLng.lng();
      self.addForm.value.latitudes = evt.latLng.lat();
      // document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
    });
  }

}
