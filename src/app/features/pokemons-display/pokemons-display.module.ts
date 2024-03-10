import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { PokemonComponent } from './pokemon/pokemon.component';
import { MaterialModule } from '../../material.module';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';


@NgModule({
  declarations: [
    PokemonComponent,
    PokemonDetailComponent
  ],
  exports: [
    PokemonComponent
  ],
  imports: [
    CommonModule, CoreModule, MaterialModule
  ]
})
export class PokemonsDisplayModule {
}
