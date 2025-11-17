import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Valorant } from '../../services/valorant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.html',
  imports: [CommonModule],
  styleUrls: ['./player-details.css']
})
export class PlayerDetails implements OnInit {
  name!: string;
  tag!: string;
  account: any;
  mmr: any;
  matches: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private valorantService: Valorant
  ) {}

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name')!;
    this.tag = this.route.snapshot.paramMap.get('tag')!;
    this.loadPlayer();
  }

  loadPlayer() {
    this.valorantService.getAccount(this.name, this.tag).subscribe({
      next: (res) => {
        this.account = res.data;
        this.valorantService.getMMR(this.name, this.tag).subscribe({
          next: (mmrRes) => {
            this.mmr = mmrRes.data;
            this.loadMatches();
          }
        });
      },
      error: () => (this.loading = false)
    });
  }

  loadMatches() {
    this.valorantService.getMatches(this.name, this.tag).subscribe({
      next: (res) => {
        this.matches = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
