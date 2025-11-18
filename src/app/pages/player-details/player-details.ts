import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Valorant } from '../../services/valorant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-details.html',
  styleUrls: ['./player-details.css']
})
export class PlayerDetails implements OnInit {
  loading = true;
  loadingMatchDetails = false;
  account: any;
  mmr: any;
  matches: any[] = [];
  matchDetails: any = null;
  performance: any = {};
  agentStats: any[] = [];
  mapStats: any[] = [];
  
  expandedMatch: number | null = null;

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'matches', label: 'Matches' },
    { id: 'performance', label: 'Performance' },
    { id: 'agents', label: 'Agents' },
    { id: 'maps', label: 'Maps' }
  ];

  activeTab = 'overview';

  constructor(
    private route: ActivatedRoute,
    private valorantService: Valorant
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    const tag = this.route.snapshot.paramMap.get('tag');
    
    if (name && tag) {
      this.loadPlayerData(name, tag);
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  toggleMatchDetails(index: number, matchId: string): void {
    if (this.expandedMatch === index) {
      this.expandedMatch = null;
      this.matchDetails = null;
    } else {
      this.expandedMatch = index;
      this.loadMatchDetails(matchId);
    }
  }

  private loadMatchDetails(matchId: string): void {
    this.loadingMatchDetails = true;
    this.matchDetails = null;

    this.valorantService.getMatchDetails(matchId).subscribe({
      next: (data: any) => {
        this.matchDetails = data.data;
        this.loadingMatchDetails = false;
      },
      error: (err: any) => {
        console.error('Error loading match details:', err);
        this.loadingMatchDetails = false;
      }
    });
  }

  // Helper per ottenere i dati del player dal match (lista)
  getPlayerData(match: any): any {
    return match.players.all_players.find((p: any) => 
      p.puuid === this.account.puuid
    ) || match.players.all_players[0];
  }

  // Helper per ottenere i dati del player dai dettagli caricati
  getPlayerDataFromDetails(): any {
    if (!this.matchDetails) return {};
    return this.matchDetails.players.all_players.find((p: any) => 
      p.puuid === this.account.puuid
    ) || this.matchDetails.players.all_players[0];
  }

  // Helper per ottenere il team del player
  getPlayerTeam(match: any): any {
    const playerData = this.getPlayerData(match);
    return playerData.team === 'Red' ? match.teams.red : match.teams.blue;
  }

  // Helper per ottenere lo score del match
  getTeamScore(match: any): string {
    return `${match.teams.red.rounds_won} - ${match.teams.blue.rounds_won}`;
  }

  // Helper per calcolare il K/D ratio
  getKDRatio(match: any): string {
    const player = this.getPlayerData(match);
    const ratio = player.stats.deaths === 0 
      ? player.stats.kills 
      : (player.stats.kills / player.stats.deaths);
    return ratio.toFixed(2);
  }

  // Helper per formattare la durata del match
  formatGameLength(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    return `${minutes}m`;
  }

  // Helper per calcolare i colpi totali (da lista)
  getTotalShots(match: any): number {
    const player = this.getPlayerData(match);
    return player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
  }

  // Helper per calcolare i colpi totali (da dettagli)
  getTotalShotsFromDetails(): number {
    const player = this.getPlayerDataFromDetails();
    if (!player.stats) return 0;
    return player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
  }

  // Helper per calcolare la percentuale di headshots (da lista)
  getHeadshotPercent(match: any): string {
    const player = this.getPlayerData(match);
    const total = this.getTotalShots(match);
    if (total === 0) return '0';
    return ((player.stats.headshots / total) * 100).toFixed(1);
  }

  // Helper per calcolare la percentuale di headshots (da dettagli)
  getHeadshotPercentFromDetails(): string {
    const player = this.getPlayerDataFromDetails();
    const total = this.getTotalShotsFromDetails();
    if (total === 0) return '0';
    return ((player.stats.headshots / total) * 100).toFixed(1);
  }

  private loadPlayerData(name: string, tag: string): void {
    this.loading = true;

    this.valorantService.getAccount(name, tag).subscribe({
      next: (data: any) => {
        this.account = data.data;
        this.loadMMR(name, tag);
        this.loadMatches(name, tag);
      },
      error: (err: any) => {
        console.error('Error loading account:', err);
        this.loading = false;
      }
    });
  }

  private loadMMR(name: string, tag: string): void {
    this.valorantService.getMMR(name, tag).subscribe({
      next: (data: any) => {
        this.mmr = data.data;
      },
      error: (err: any) => console.error('Error loading MMR:', err)
    });
  }

  private loadMatches(name: string, tag: string): void {
    this.valorantService.getMatches(name, tag).subscribe({
      next: (data: any) => {
        this.matches = data.data;
        this.calculateStats();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading matches:', err);
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    if (this.matches.length === 0) return;

    let totalKills = 0;
    let totalDeaths = 0;
    let totalWins = 0;
    const agentMap = new Map<string, number>();
    const mapMap = new Map<string, number>();

    this.matches.forEach(match => {
      const playerData = this.getPlayerData(match);
      const playerTeam = this.getPlayerTeam(match);

      totalKills += playerData.stats.kills;
      totalDeaths += playerData.stats.deaths;
      if (playerTeam.has_won) totalWins++;

      const agent = playerData.character;
      agentMap.set(agent, (agentMap.get(agent) || 0) + 1);

      const map = match.metadata.map;
      mapMap.set(map, (mapMap.get(map) || 0) + 1);
    });

    this.performance = {
      totalMatches: this.matches.length,
      avgKills: (totalKills / this.matches.length).toFixed(1),
      kd: totalDeaths === 0 ? totalKills.toFixed(2) : (totalKills / totalDeaths).toFixed(2),
      winRate: ((totalWins / this.matches.length) * 100).toFixed(1)
    };

    this.agentStats = Array.from(agentMap.entries())
      .map(([agent, count]) => ({ agent, count }))
      .sort((a, b) => b.count - a.count);

    this.mapStats = Array.from(mapMap.entries())
      .map(([map, count]) => ({ map, count }))
      .sort((a, b) => b.count - a.count);
  }
}
