import { Component } from '@angular/core';
import { Valorant } from '../../services/valorant';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  name = '';
  tag = '';
  account: any;

  constructor(private valorantService: Valorant) {}

  search() {
    this.valorantService.getAccount(this.name, this.tag).subscribe({
      next: (res) => this.account = res.data,
      error: (err) => console.error(err)
    });
  }
}
