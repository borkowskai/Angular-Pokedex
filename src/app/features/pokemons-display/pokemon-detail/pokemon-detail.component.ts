import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokemonDetail } from '../../../core/models/pokemon-detail';
import { PokeApiService } from '../../../core';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {

  public pokemon!: PokemonDetail;
  public pokemonName!: string;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private pokeApiService: PokeApiService,
              private router: Router,
              private destroyRef: DestroyRef) {
  }

  public ngOnInit(): void {
    this.listeningRoute();
  }

  listeningRoute() {
    if (this.activatedRoute.queryParams) {
      // we can't use snapshot here because snapshot isn't working on queryParam change
      this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (queryParams: Params) => {
          this.pokemonName = queryParams['name'];
          this.loadPokemonDetails(this.pokemonName);
        },
        error: (err: Error) => {
          console.error(`Pokemon Detail page: issue in receiving the query param from activated route.
          Detail error: ${err}`);
        }
      });
    }
  }

  private loadPokemonDetails(pokemonName: string) {
    this.pokeApiService.loadPokemonDetailByName(pokemonName).subscribe({
      next: (data: PokemonDetail) => {
        this.pokemon = data;
      }, error(err: Error) {
        console.error(`Pokemon Detail page: issue in receiving the data from api. Detail error: ${err}`);
      }
    });
  }

  public backToMainPage(){
    this.router.navigate(['/'], );
  }


}
