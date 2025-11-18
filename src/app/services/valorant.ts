import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({ providedIn: 'any' })
export class Valorant {
  private baseUrl = '/api/valorant/v1';
  
  constructor(private http: HttpClient) {}

  getAccount(name: string, tag: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/account/${name}/${tag}`, {
      headers: {
        "Accept": "*/*",
        'Authorization': environment.riotKey,
      },
    });
  }

  getMMR(name: string, tag: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/mmr/eu/${name}/${tag}`, {
      headers: {
        "Accept": "*/*",
        'Authorization': environment.riotKey,
      },
    });
  }

  getMatches(name: string, tag: string): Observable<any> {
    return this.http.get(`/api/valorant/v3/matches/eu/${name}/${tag}`, {
      headers: {
        "Accept": "*/*",
        'Authorization': environment.riotKey,
      },
    });
  }

  getMatchDetails(matchId: string): Observable<any> {
    return this.http.get(`/api/valorant/v2/match/${matchId}`, {
      headers: {
        "Accept": "*/*",
        'Authorization': environment.riotKey,
      },
    });
  }
}
