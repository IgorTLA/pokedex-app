import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeDataService {

  constructor(private http: HttpClient) { }

  //Obtem lista pokemons da API
  public apiListAllPokemons(index: string): Observable<any> {

    return this.http.get<any>(index).pipe(
      tap(res => res),
      tap(res => {
        res.results.map((resPokemons: any) => { //map JS

          this.apiGetPokemon(resPokemons.url).subscribe(
            res => resPokemons.status = res
          );
        })
      })
    )
  }

  //Obtem URL de cada pokemon
  public apiGetPokemon(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      map(res => res) //map RXJS
    )
  }
}
