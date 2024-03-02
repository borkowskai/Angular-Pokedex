import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonsPageComponent } from './features/pokemons-display/pokemons-page/pokemons-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: PokemonsPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
