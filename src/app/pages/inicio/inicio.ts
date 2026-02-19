import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [NgFor],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {

  currentIndex = 0;

  visibleScreens: string[] = [];

  ngOnInit(){
  this.updateVisible();
  }

  updateVisible(){
  this.visibleScreens = [];

  for (let i = 0; i < 4; i++) {
    const index = (this.currentIndex + i) % this.screens.length;
    this.visibleScreens.push(this.screens[index]);
  }
}


  screens = [
    'screen1.png',
    'screen2.png',
    'screen3.png',
    'screen4.png',
    'screen5.png',
    'screen6.png',
    'screen7.png'
  ];

  next(){
  this.currentIndex = (this.currentIndex + 1) % this.screens.length;
  this.updateVisible();
}

prev(){
  this.currentIndex =
    (this.currentIndex - 1 + this.screens.length) % this.screens.length;
  this.updateVisible();
}



}
