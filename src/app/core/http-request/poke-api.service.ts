import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { PokemonsList } from '../models/pokemons-list';
import { PokemonDetail } from '../models/pokemon-detail';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  private static readonly baseUrl = 'https://pokeapi.co/api/v2';
  private static readonly pokemonEndpoint = 'pokemon';
  constructor(
    private readonly http: HttpClient
  ) {}

  public loadPokemons(offset: number, maxNumberOfDisplays: number): Observable<PokemonsList> {
    return this.http
    .get<PokemonsList>(
      `${PokeApiService.baseUrl}/${PokeApiService.pokemonEndpoint}?offset=${offset}&limit=${maxNumberOfDisplays}`
    )
    .pipe(
      catchError((error) => {
        console.error(`PokemonApi: issue with getting data from ${PokeApiService.pokemonEndpoint}
        endoint for max number ${maxNumberOfDisplays}`);
        throw error;
      })
    );
  }

  public loadPokemonsDetails(url: string): Observable<PokemonDetail>{
    return this.http
    .get<PokemonDetail>(
      url
    )
    .pipe(
      catchError((error) => {
        console.error(`PokemonApi: issue with getting data for specific pokemon, search url ${url}`);
        throw error;
      })
    );
  }

  public loadPokemonDetailByName(pokemonName: string): Observable<PokemonDetail> {
    return this.http
    .get<PokemonDetail>(
      `${PokeApiService.baseUrl}/${PokeApiService.pokemonEndpoint}/${pokemonName}`
    )
    .pipe(
      catchError((error) => {
        console.error(`PokemonApi: issue with getting data from ${pokemonName} endoint`);
        throw error;
      })
    );
  }
}
