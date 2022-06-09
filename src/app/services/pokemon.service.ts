import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonList } from '../models/pokemon.list';
import { PokemonDetail } from '../models/pokemon.detail';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon'

  constructor(private http: HttpClient) { }

  getPokemonList(offset: number, limit: number = 20): Observable<PokemonList[]> {
    return this.http.get<PokemonList[]>(this.baseUrl + '?offset=' + offset + '&limit=' + limit).pipe(
      map((res: any) => res.results)
    )

  }

  getPokemonDetail(pokemonId: number | string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(this.baseUrl + '/' + pokemonId)
  }

}
