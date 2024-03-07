import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { PokemonComponent } from './pokemon/pokemon.component';
import { MaterialModule } from '../../material.module';


@NgModule({
  declarations: [
    PokemonComponent
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
