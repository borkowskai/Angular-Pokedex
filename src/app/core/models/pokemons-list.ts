import { Pokemon } from './pokemon';

export interface PokemonsList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
 }

