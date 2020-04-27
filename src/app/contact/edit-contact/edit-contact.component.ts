import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

  
  cities;
  areas;
  contact: any;
  contactId: any;
  LKGovernorateId: any;
  LKCityId: any;
  LKAreaId: any;
  tags: any;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    
    this.mapLoader()
    
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
      description: ['', Validators.required],
      LKGovernorateId: ['', Validators.required],
      LKCityId: ['', Validators.required],
      LKAreaId: ['', Validators.required],
      type: ['', Validators.required],
      image: ['', Validators.required],
      longitude: ['', Validators.required],
      latitudes: ['', Validators.required],
      optin: ['', Validators.required],
      optout: ['', Validators.required],
      workingHours: ['', Validators.required],
      fbPage: ['', Validators.required],
    });

    this.apiService.getContactById(this.contactId)
      .subscribe(res => {
        let obj = {};
        obj['name'] = res['data']['name'];

        let numbers = res['data'].number.split("$$");
        obj['number'] = numbers[0];

        for(let i = 1; i < numbers.length; i++)
          if (numbers[i] && numbers[i].length != 0)
            this.addNumber(numbers[i]);

        //obj['number'] = res['data']['number'];
        obj['address'] = res['data']['address'];
        obj['description'] = res['data']['description'];
        obj['optin'] = res['data']['optin'];
        obj['optout'] = res['data']['optout'];
        obj['workingHours'] = res['data']['workingHours'];
        obj['fbPage'] = res['data']['fbPage'];
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

        if(this.lat && this.lng) {
          var latlng = new google.maps.LatLng(this.lat, this.lng);
          this.marker.setPosition(latlng);
          this.map.setCenter(latlng);
        }
        console.log(obj);
        this.editForm.setValue(obj);
      });

    this.apiService.getCitys()
      .subscribe(response => {
        this.cities = response['data'];
        this.cities.forEach(city => {
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
        this.areas = response['data'];
        this.areas.forEach(area => {
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
          //key == 'number' ||
          key == 'address' ||
          key == 'description' ||
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

    let numbers = document.getElementsByName('number');

    if (!numbers || numbers.length == 0) {
      alert("you should to fill all numbers");
      return;
    }

    let number = '';
    for (var i = 0; i < numbers.length; i++) {
      if (!numbers[i]['value'] || numbers[i]['value'].length == 0) {
        alert("you should to fill all numbers");
        return;
      }
      number += numbers[i]['value'] + "$$";
    }
    this.editForm.value['number'] = number;
    obj['number'] = number;

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
            alert("error");
            console.log(data);
          }
        },
        error => {
          alert("error");
          console.log(error);
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

      if (file.size > (100000 / 2)) {
        this.clientIconInvalidText = true;
      } else {
        this.getBase64(file).then(function (data) {
          self.editForm.value.image = self.clientIcon = data;
          self.clientIconUploader.nativeElement.style.width = "75%"
        });
      }
    }
  }

  public addNumber(value) {
    let numbers = document.getElementsByName('number');

    if (numbers.length >= 20) {
      alert("the max numbers is 20");
      return;
    }
    
    var div = document.createElement("div");

    var deleteButton = document.createElement("span");
    deleteButton.style.marginLeft = "30px";
    deleteButton.className = "close";
    deleteButton.innerHTML = "-";
    deleteButton.onclick = this.deleteNumber;

    var input = document.createElement("input");
    input.className = "form-control";
    input.type = "text";
    input.placeholder = "number";
    input.name = "number";
    input.value = value;

    div.appendChild(input);
    div.appendChild(deleteButton);

    document.getElementById('moreNumbers').appendChild(div);
  }

  public deleteNumber() {
    var source = event.target || event.srcElement;
    source['parentElement'].parentNode.removeChild(source['parentElement']);
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

  coordinates
  mapOptions
  marker

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapLoader() {
    this.coordinates = new google.maps.LatLng(this.lat, this.lng);

    this.mapOptions = google.maps['MapOptions'] = {
      center: this.coordinates,
      zoom: 8
    };

    this.marker = new google.maps.Marker({
        position: this.coordinates,
        map: this.map,
        draggable: true
      });
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

  onGovernorateSelected(value: string) {
    console.log("the selected value is " + value);
    this.removeOptions(document.getElementById('LKCityId'));
    this.removeOptions(document.getElementById('LKAreaId'));
    this.editForm.value['LKCityId'] = this.editForm.value['LKAreaId'] = '';
    this.cities.forEach(city => {
      if (city.LKGovernorateId == value) {
        var sel = document.getElementById('LKCityId');
        // create new option element
        var opt = document.createElement('option');

        // create text node to add to option element (opt)
        opt.appendChild(document.createTextNode(city.name));

        // set value property of opt
        opt.value = city.id;

        // add opt to end of select box (sel)
        sel.appendChild(opt);
      }
    });
  }

  onCitySelected(value: string) {
    console.log("the selected value is " + value);
    this.removeOptions(document.getElementById('LKAreaId'));
    this.editForm.value['LKAreaId'] = '';
    this.areas.forEach(area => {
      if (area.LKCityId == value) {
        var sel = document.getElementById('LKAreaId');
        // create new option element
        var opt = document.createElement('option');

        // create text node to add to option element (opt)
        opt.appendChild(document.createTextNode(area.name));

        // set value property of opt
        opt.value = area.id;

        // add opt to end of select box (sel)
        sel.appendChild(opt);
      }
    });
  }

  onAreaSelected(value: string) {
    console.log("the selected value is " + value);
  }

  removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i > 0; i--) {
      selectElement.remove(i);
    }
  }
}
