import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PlayerDetails } from './pages/player-details/player-details';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'player/:name/:tag', component: PlayerDetails},
    { path: '**', redirectTo: '' }
];
