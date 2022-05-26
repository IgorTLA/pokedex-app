import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PokeDataService } from 'src/app/services/poke-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-poke-details',
  templateUrl: './poke-details.component.html',
  styleUrls: ['./poke-details.component.scss']
})
export class PokeDetailsComponent implements OnInit {

  public baseUrl = environment.baseUrl;

  public pokemon: any;
  public isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokeApiService: PokeDataService,
  ) { }

  ngOnInit(): void {
    this.getPokemon;
  }

  get getPokemon() {
    const id = this.activatedRoute.snapshot.params['id']
    const pokemon = this.pokeApiService.apiGetPokemon(`${this.baseUrl}/pokemon/${id}`);
    const name = this.pokeApiService.apiGetPokemon(`${this.baseUrl}/pokemon-species/${id}`)

    return forkJoin([pokemon, name]).subscribe(
      res => {
        this.pokemon = res;
        this.isLoading = true;
      }
    );
  }
}
