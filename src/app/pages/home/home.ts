import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RecentSearch {
  name: string;
  tag: string;
  timestamp: number;
}

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  searchText = '';
  recentSearches: RecentSearch[] = [];
  showRecentSearches = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.loadRecentSearches();
  }

  onSearch() {
    if (this.searchText.includes('#')) {
      const [name, tag] = this.searchText.split('#');
      this.saveRecentSearch(name, tag);
      this.router.navigate(['/player', name, tag]);
    } else {
      alert('Inserisci il Riot ID completo (es. player#EUW)');
    }
  }

  // Salva la ricerca in localStorage
  saveRecentSearch(name: string, tag: string) {
    const search: RecentSearch = {
      name,
      tag,
      timestamp: Date.now()
    };

    let searches = this.getStoredSearches();

    searches = searches.filter(s => !(s.name === name && s.tag === tag));
    searches.unshift(search);
    searches = searches.slice(0, 5);

    localStorage.setItem('valorant_recent_searches', JSON.stringify(searches));
    this.recentSearches = searches;
  }

  // Carica le ricerche da localStorage
  loadRecentSearches() {
    this.recentSearches = this.getStoredSearches();
  }

  // Ottieni le ricerche salvate
  getStoredSearches(): RecentSearch[] {
    const stored = localStorage.getItem('valorant_recent_searches');
    return stored ? JSON.parse(stored) : [];
  }

  // Seleziona una ricerca recente
  selectRecentSearch(search: RecentSearch) {
    this.searchText = `${search.name}#${search.tag}`;
    this.showRecentSearches = false;
    this.onSearch();
  }

  // Rimuovi una ricerca dalla lista
  removeRecentSearch(event: Event, search: RecentSearch) {
    event.stopPropagation(); 

    let searches = this.getStoredSearches();
    searches = searches.filter(s => !(s.name === search.name && s.tag === search.tag));
    
    localStorage.setItem('valorant_recent_searches', JSON.stringify(searches));
    this.recentSearches = searches;
  }

  // Mostra le ricerche recenti
  onInputFocus() {
    if (this.recentSearches.length > 0) {
      this.showRecentSearches = true;
    }
  }

  // Nascondi le ricerche recenti (con delay per permettere il click)
  onInputBlur() {
    setTimeout(() => {
      this.showRecentSearches = false;
    }, 200);
  }

  // Clear all recent searches
  clearAllSearches() {
    localStorage.removeItem('valorant_recent_searches');
    this.recentSearches = [];
    this.showRecentSearches = false;
  }
}