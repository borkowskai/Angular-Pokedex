import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonsPageComponent } from './features/pokemons-display/pokemons-page/pokemons-page.component';
import { PokemonDetailComponent } from './features/pokemons-display/pokemon-detail/pokemon-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PokemonsPageComponent
  },
  {
    path: 'detail',
    pathMatch: 'full',
    component: PokemonDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
