import { Component, OnInit } from '@angular/core';
import { PokeApiService } from 'src/app/core';

@Component({
  selector: 'app-pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.scss']
})
export class PokemonsPageComponent implements OnInit {

  constructor(private pokeApiService: PokeApiService) {
  }

  public ngOnInit(): void {
    this.loadPokemons();
    this.loadPokemonDetails('ditto');
  }

  private loadPokemons(){
    this.pokeApiService.loadPokemons().subscribe();
  }

  private loadPokemonDetails(pokemonName: string){
    this.pokeApiService.loadPokemonDetails(pokemonName).subscribe();
  }


}
