import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements AfterViewInit, OnInit {

  contact: any;
  contactId: any;
  LKGovernorateId: any;
  LKCityId: any;
  LKAreaId: any;
  tags: any;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.contactId = window.localStorage.getItem("editContactId");

    if (!this.contactId) {
      alert("Invalid action.")
      this.router.navigate(['list-contact']);
      return;
    }
    this.editForm = this.formBuilder.group({
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

    this.apiService.getContactById(this.contactId)
      .subscribe(res => {
        let obj = {};
        obj['name'] = res['data']['name'];
        obj['number'] = res['data']['number'];
        obj['address'] = res['data']['address'];
        // obj['id'] = res['data']['id'];
        this.LKGovernorateId = obj['LKGovernorateId'] = res['data']['LKGovernorateId'];
        this.LKCityId = obj['LKCityId'] = res['data']['LKCityId'];
        this.LKAreaId = obj['LKAreaId'] = res['data']['LKAreaId'];
        obj['type'] = res['data']['type'];
        this.tags = res['data']['contactTags'];
        this.clientIcon = obj['image'] = res['data']['image'];
        obj['longitude'] = "";
        if (res['data']['longitude'])
          this.lng = obj['longitude'] = res['data']['longitude'];
        obj['latitudes'] = "";
        if (res['data']['latitudes'])
          this.lat = obj['latitudes'] = res['data']['latitudes'];
        console.log(obj);
        this.editForm.setValue(obj);
      });

    this.apiService.getCitys()
      .subscribe(response => {
        var citys = response['data'];
        citys.forEach(city => {
          var sel = document.getElementById('LKCityId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(city.name));

          // set value property of opt
          opt.value = city.id;
          if (this.LKCityId && city.id == this.LKCityId) {
            opt.selected = true;
          }
          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });

    this.apiService.getAreas()
      .subscribe(response => {
        var areas = response['data'];
        areas.forEach(area => {
          var sel = document.getElementById('LKAreaId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(area.name));

          // set value property of opt
          opt.value = area.id;

          if (this.LKAreaId && area.id == this.LKAreaId) {
            opt.selected = true;
          }

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
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

          if (this.LKGovernorateId && governorate.id == this.LKGovernorateId) {
            opt.selected = true;
          }

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
          if (this.tags.filter(tag => tag.LKTagId == opt.value).length != 0) {
            opt.selected = true;
          }

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });
  }

  back() {
    this.router.navigate(['list-contact']);
  }

  onSubmit() {
    let obj = this.editForm.value;
    obj.id = this.contactId;
    let keys = Object.keys(obj);
    for (let key of keys) {
      if (obj[key] == null || obj[key].length == 0) {
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
    obj['contactTags'] = contactTags;
    this.apiService.updateContact(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 201) {
            alert('contact updated successfully.');
            this.router.navigate(['list-contact']);
          } else {
            alert(data['errors'] ? data['errors'] : data);
          }
        },
        error => {
          alert(error);
        });
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
          self.editForm.value.image = self.clientIcon = data;
          self.clientIconUploader.nativeElement.style.width = "75%"
        });
      }
    }
  }

  public removeClientIcon() {
    this.clientIconInvalidText = false;
    this.clientIcon = "";
    this.editForm.value.image = "";
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
      self.editForm.value.longitude = evt.latLng.lng();
      self.editForm.value.latitudes = evt.latLng.lat();
      // document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
    });
  }
}
