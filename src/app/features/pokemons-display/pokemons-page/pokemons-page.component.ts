import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';

import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokeApiService, Pokemon } from '../../../core';
import { PokemonDetail } from '../../../core/models/pokemon-detail';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.scss']
})
export class PokemonsPageComponent implements OnInit, OnDestroy {

  private offset = 0;
  private localStorageKey = 'favorites';
  public tempTotalNumber: number = 100; // till the moment the call to API isn't done for next elements

  public pokemonsToDisplay: PokemonDetail[] = [];
  public fullPokemonsList: PokemonDetail[] = [];
  public totalNumber!: number;
  public pageSize: number = 5;
  public selectedCardId!: number;
  public savedAsFavorites: string[] = [];

  constructor(
    private pokeApiService: PokeApiService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.displayPokemons();
  }

  public ngOnDestroy(): void {
    localStorage.removeItem(this.localStorageKey);
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.savedAsFavorites));
  }

  public displayPokemons() {
    this.loadPokemonsDetails()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data: PokemonDetail[]) => {
        this.fullPokemonsList = data;
        const storedFavorites = localStorage.getItem(this.localStorageKey);
        if (storedFavorites) {
          // if somebody clear localStorage or cache, to see changes the page needs to be refreshed
          // could be treated on the future
          this.savedAsFavorites = JSON.parse(storedFavorites);
          this.fullPokemonsList = this.updateFavoritesLocal(this.savedAsFavorites, this.fullPokemonsList);
        }
        // we need cloneDeep as Object is nested, the spread operator is only making the shallow copy
        this.pokemonsToDisplay = cloneDeep(this.fullPokemonsList);
        this.setDefaultPagination();

      }, error(err: Error) {
        console.error(`Pokemons page: issue in receiving the data from api. Detail error: ${err}`);
      }
    });
  }

  public handleFavorites(pokemonName: string) {
    this.savedAsFavorites = this.prepareFavoriteListToStore(pokemonName, this.savedAsFavorites);

    this.fullPokemonsList = this.updateFavoritesLocal([pokemonName], this.fullPokemonsList);
    this.pokemonsToDisplay = this.updateFavoritesLocal([pokemonName], this.pokemonsToDisplay);
  }

  private updateFavoritesLocal(pokemonNames: string[], currentPokemonList: PokemonDetail[]): PokemonDetail[] {
    const pokemonList: PokemonDetail[] = cloneDeep(currentPokemonList);
    for (const pokemoName of pokemonNames) {

      const itemToUpdate = pokemonList.find(item => item.name === pokemoName);
      const index = pokemonList.findIndex(item => item.name === pokemoName);
      if (itemToUpdate) {
        itemToUpdate.favorite = itemToUpdate.favorite ? false : true;
        pokemonList[index] = itemToUpdate;
      }
    }
    return pokemonList;
  }

  private prepareFavoriteListToStore(pokemonName: string, currentFavorites: string[]): string[] {
    let favorites = currentFavorites;
    const existingItem = favorites.find(item => item === pokemonName);
    if (existingItem) {
      favorites = favorites.filter(item => item !== pokemonName);
    } else {
      favorites.push(pokemonName);
    }
    return favorites;
  }

  private loadPokemonsDetails(): Observable<PokemonDetail[]> {
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

  public setPagination($event: PageEvent) {
    this.pokemonsToDisplay = this.fullPokemonsList.slice($event.pageIndex * $event.pageSize,
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

  public selectItem(pokemon: PokemonDetail, index: number): void{
    this.selectedCardId = index;
    this.router.navigate(['/', 'detail'], { queryParams: { name: pokemon.name } });
  }
}

