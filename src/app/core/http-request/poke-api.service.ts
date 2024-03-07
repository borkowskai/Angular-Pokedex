import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { PokemonsList } from '../models/pokemons-list';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  private static readonly baseUrl = 'https://pokeapi.co/api/v2';
  private static readonly pokemonEndpoint = 'pokemon';
  constructor(
    private readonly http: HttpClient
  ) {}

  public loadPokemons(): Observable<PokemonsList> {
    const maxNumberOfDisplays = 5;
    return this.http
    .get<PokemonsList>(
      `${PokeApiService.baseUrl}/${PokeApiService.pokemonEndpoint}?offset=0&limit=${maxNumberOfDisplays}`
    )
    .pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  public loadPokemonsDetails(url: string): Observable<any>{
    return this.http
    .get<any>(
      url
    )
    .pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  public loadPokemonDetails(pokemonName: string): Observable<any> {
    return this.http
    .get<any>(
      `${PokeApiService.baseUrl}/${PokeApiService.pokemonEndpoint}/${pokemonName}`
    )
    .pipe(
      tap((item) => console.log(item.weight)),
      catchError((error) => {
        throw error;
      })
    );
  }
}
