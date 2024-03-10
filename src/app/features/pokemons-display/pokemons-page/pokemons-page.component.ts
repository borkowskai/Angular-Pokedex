import { Component, OnInit } from '@angular/core';
import { PokeApiService, Pokemon } from 'src/app/core';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.scss']
})
export class PokemonsPageComponent implements OnInit {

  public pokemonsToDisplay: any[] = [];
  public totalNumber!: number;

  constructor(private pokeApiService: PokeApiService) {
  }

  public ngOnInit(): void {
    this.displayPokemons();

    // this.loadPokemonDetails('ditto');
  }

  public displayPokemons() {
    this.loadPokemonsDetails().subscribe({
      next: (data) => {
        this.pokemonsToDisplay = data;
      }
    })
  }

  private loadPokemonsDetails(): Observable<any> {
    return this.pokeApiService.loadPokemons()
    .pipe(
      tap(result => {
        this.totalNumber = result.count;
      }),
      switchMap(result => {
        const observables =
          result.results.map((el: Pokemon) => this.pokeApiService.loadPokemonsDetails(el.url));
        return forkJoin(observables);
      })
    );
  }

  private loadPokemonDetails(pokemonName: string) {
    this.pokeApiService.loadPokemonDetails(pokemonName).subscribe();
  }

}

