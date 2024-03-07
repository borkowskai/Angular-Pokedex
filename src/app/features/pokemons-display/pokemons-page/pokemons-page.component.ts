import { AfterViewInit, Component, DestroyRef, OnInit, ViewChild } from '@angular/core';

import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokeApiService, Pokemon } from '../../../core';

@Component({
  selector: 'app-pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.scss']
})
export class PokemonsPageComponent implements OnInit, AfterViewInit {

  public pokemonsToDisplay: any[] = [];
  public totalNumber!: number;
  public tempTotalNumber: number = 100; // till the moment the call next to API isn't done
  public pageSize: number = 10;
  public displayFrom: number = 0;
  public displayTo: number = 9;

  public selectedCard: boolean = false;

  constructor(
    private pokeApiService: PokeApiService,
    private destroy: DestroyRef) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public ngOnInit(): void {
    this.displayPokemons();


    // this.loadPokemonDetails('ditto');
  }

  ngAfterViewInit() {
    if (this.paginator?.page) {
      this.managePageChanges();
    }
  }

  public displayPokemons() {
    this.loadPokemonsDetails()
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
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

  private managePageChanges() {
    this.paginator.page
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({ next: (data: PageEvent) => console.log(data) });
  }


}

