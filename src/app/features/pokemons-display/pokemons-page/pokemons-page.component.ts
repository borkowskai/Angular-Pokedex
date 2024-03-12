import { Component, DestroyRef, HostListener, OnDestroy, OnInit } from '@angular/core';

import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokeApiService, Pokemon, PokemonDetail } from '../../../core';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

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
  public searchFormControl!: FormControl<string | null>;
  public favoriteView!: boolean;

  private typingTimer!: ReturnType<typeof setTimeout>;
  private typingTimout = 1000;

  constructor(
    private pokeApiService: PokeApiService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.searchFormControl = new FormControl('', []);
    this.displayPokemons();
    this.listenSearchBar();
  }

  public ngOnDestroy(): void {
    this.saveInLocalStorage();
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
    for (const pokemonName of pokemonNames) {

      const itemToUpdate = pokemonList.find(item => item.name === pokemonName);
      const index = pokemonList.findIndex(item => item.name === pokemonName);
      if (itemToUpdate) {
        itemToUpdate.favorite = !itemToUpdate.favorite;
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

  private setDefaultPagination(): void {
    this.setPagination({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.tempTotalNumber
    });
  }

  private listenSearchBar() {
    this.searchFormControl.valueChanges
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: value => {
        if (this.typingTimer) {
          clearTimeout(this.typingTimer);
        }
        this.typingTimer = setTimeout(() => {
          const foundItem = this.fullPokemonsList.find(el =>
            el.name.toLowerCase().trim() === value);

          if (foundItem) {
            this.pokemonsToDisplay = [foundItem];
          } else {
            this.pokemonsToDisplay = this.fullPokemonsList.slice(0, 5);
          }
        }, this.typingTimout);

      }
    });
  }

  public selectItem(pokemon: PokemonDetail, index: number): void {
    this.selectedCardId = index;
    this.router.navigate(['/', 'detail'], { queryParams: { name: pokemon.name } });
  }

  public avoidEnter($event: any) {
    // added because enter triggers refresh page
    $event.preventDefault();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(_event: Event) {
    // Save data to local storage before the app is closed
    this.saveInLocalStorage();
  }

  private saveInLocalStorage() {
    localStorage.removeItem(this.localStorageKey);
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.savedAsFavorites));
  }

  public displayFavorites() {
    this.favoriteView = true;
    const savedFavorites: PokemonDetail[] = [];
    for (const item of this.savedAsFavorites) {
      const found = this.fullPokemonsList.find(el => el.name === item);
      if (found) {
        savedFavorites.push(found);
      }
    }
    this.pokemonsToDisplay = savedFavorites;
  }

  public backToMainPage() {
    this.favoriteView = false;
    this.pokemonsToDisplay = this.fullPokemonsList.slice(0, 5);
  }
}

