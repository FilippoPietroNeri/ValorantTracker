import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  searchText = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchText.includes('#')) {
      const [name, tag] = this.searchText.split('#');
      alert(name);
      this.router.navigate(['/player', name, tag]);
    } else {
      alert('Inserisci il Riot ID completo (es. player#EUW)');
    }
  }
}
