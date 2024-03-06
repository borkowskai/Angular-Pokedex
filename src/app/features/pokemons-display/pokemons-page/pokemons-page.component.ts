import { Component, OnInit } from '@angular/core';
import { PokeApiService, PokemonsList } from 'src/app/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.scss']
})
export class PokemonsPageComponent implements OnInit {

  public pokemonsToDisplay: any[] = [];

  constructor(private pokeApiService: PokeApiService) {
  }

  public ngOnInit(): void {
    this.loadPokemons();
    // this.loadPokemonDetails('ditto');
  }

  private loadPokemons() {
    this.pokeApiService.loadPokemons().subscribe({
      next: (data: PokemonsList) => {

        data.results.forEach(el => {

          this.pokeApiService.loadPokemon(el.url).subscribe({

            next: subData => {
              this.pokemonsToDisplay.push(subData);
            }
          })
        });
      }
    });
  }

  private loadPokemonDetails(pokemonName: string) {
    this.pokeApiService.loadPokemonDetails(pokemonName).subscribe();
  }


}
