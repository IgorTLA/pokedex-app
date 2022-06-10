import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { PokemonDetail } from 'src/app/models/pokemon.detail';
import { PokemonList } from 'src/app/models/pokemon.list';
import { PokemonService } from 'src/app/services/pokemon.service';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  search: FormControl = new FormControl('');
  pokemons: PokemonDetail[] = [];
  classicMode: boolean = true;

  private offset: number;
  isLoading!: boolean;
  isLastPage = false;

  searchPokemon!: PokemonDetail;
  isSearching = false;

  constructor(
    private pokemonService: PokemonService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar
  ) { this.offset = 0; }

  ngOnInit(): void {
    this.getPage(this.offset);
  }
  //buscar na lista e trazer mais pokemons, apos scrollar a pagina
  getPage(offset: number) {
    if (!this.isLoading && !this.isLastPage) {
      this.isLoading = true;
      this.pokemonService.getPokemonList(offset).subscribe((list: PokemonList[]) => {
        if (list.length === 0) {
          this.isLastPage = true;
        }

        if (!this.isLastPage) {
          this.getPokemon(list);
        }
      });
    }
  }

  onSearchPokemon(): void {
    const value = this.search.value;
    if (value === '') {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      this.isLoading = true;

      this.pokemonService.getPokemonDetail(value).subscribe((pokemon: PokemonDetail) => {
        this.searchPokemon = pokemon;
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.snackBar.open('Sorry, Pokemon not found', 'Ok', {
            duration: 5000,
          });
        }
      });
    }
  }

  private getPokemon(list: PokemonList[]) {
    const arr: Observable<PokemonDetail>[] = [];
    list.map((value: PokemonList) => {
      arr.push(
        this.pokemonService.getPokemonDetail(value.name)
      );
    });

    forkJoin([...arr]).subscribe((pokemons: any[]) => {
      this.pokemons.push(...pokemons);
      this.offset += 20;
      this.isLoading = false;
    });
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1 ? 1 : 2)[0].type.name
  }

  onDetail(pokemon: PokemonDetail): void {
    this.bottomSheet.open(PokemonDetailComponent, {
      data: { pokemon, classicMode: this.classicMode }
    })
  }
}