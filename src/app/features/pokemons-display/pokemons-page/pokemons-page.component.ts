import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';

import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokeApiService, Pokemon } from '../../../core';
import { PokemonDetail } from '../../../core/models/pokemon-detail';

@Component({
  selector: 'app-pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.scss']
})
export class PokemonsPageComponent implements OnInit, OnDestroy {

  private offset = 0;
  public tempTotalNumber: number = 100; // till the moment the call to API isn't done for next elements

  public pokemonsToDisplay: PokemonDetail[] = [];
  public originalPokemonsList!: PokemonDetail[];
  public totalNumber!: number;
  public pageSize: number = 5;
  public selectedCard: boolean = false;
  public savedAsFavorites: string[] = [];

  constructor(
    private pokeApiService: PokeApiService,
    private destroy: DestroyRef) {
  }

  public ngOnInit(): void {
    this.displayPokemons();
  }

  public ngOnDestroy(): void {
    localStorage.removeItem('favorites');
    localStorage.setItem('favorites', this.savedAsFavorites.toString());
  }

  public displayPokemons() {
    this.loadPokemonsDetails()
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: (data) => {
        this.pokemonsToDisplay = data;
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          // if somebody clear localStorage or cache, to see changes the page needs to be refreshed
          // could be treated on the future
          this.savedAsFavorites = JSON.parse(storedFavorites);
          this.pokemonsToDisplay = this.updateFavoritesLocal(this.savedAsFavorites, this.pokemonsToDisplay);
        }
        this.originalPokemonsList = this.pokemonsToDisplay;
        this.setDefaultPagination();

      }, error(err: Error) {
        console.log(`Pokemons page: issue in receiving the data from api. Detail error: ${err}`);
      }
    });
  }

  public handleFavorites(pokemonName: string) {
    this.savedAsFavorites = this.prepareFavoriteListToStore(pokemonName, this.savedAsFavorites);

    this.pokemonsToDisplay = this.updateFavoritesLocal([pokemonName], this.pokemonsToDisplay);

    localStorage.removeItem('favorites');
    localStorage.setItem('favorites', JSON.stringify(this.savedAsFavorites));
  }

  private updateFavoritesLocal(pokemonNames: string[], currentPokemonList: PokemonDetail[]): PokemonDetail[] {
    const pokemonList = [...currentPokemonList];
    for (const pokemoName of pokemonNames) {
      const itemToUpdate = pokemonList.find(item => item.name === pokemoName);
      const index = pokemonList.findIndex(item => item.name === pokemoName);
      if (itemToUpdate) {
        itemToUpdate.savedInFavorite = itemToUpdate.savedInFavorite ? false : true;
        pokemonList[index] = itemToUpdate;
      }
    }
    return pokemonList;
  }

  private prepareFavoriteListToStore(pokemonName: string, currentFavorites: string[]): string[] {
    let favorites = [...currentFavorites];
    const existingItem = favorites.find(item => item === pokemonName);
    if (existingItem) {
      favorites = favorites.filter(item => item !== pokemonName);
    } else {
      favorites.push(pokemonName);
    }
    return favorites;
  }

  private loadPokemonsDetails(): Observable<any> {
    return this.pokeApiService.loadPokemons(this.offset, this.tempTotalNumber)
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

  public setPagination($event: PageEvent) {
    this.pokemonsToDisplay = this.originalPokemonsList.slice($event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize);
  }

  private setDefaultPagination(): void{
    this.setPagination({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.tempTotalNumber
    });
  }


}

