import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonDetail } from '../../../core/models/pokemon-detail';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {

  @Input() pokemon!: PokemonDetail;

  @Output() favoritePokemonName: EventEmitter<string> = new EventEmitter<string>();
  saveToFavorites(pokemonName: string){
    this.favoritePokemonName.emit(pokemonName);
  }

}
