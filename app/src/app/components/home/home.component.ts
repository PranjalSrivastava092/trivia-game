import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  list = []

  constructor(api: ApiService) {
    api.getGames().subscribe(data => this.list = data);      
  }

  ngOnInit() {
  }

}