import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { PokeDataService } from 'src/app/services/poke-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-poke-list',
  templateUrl: './poke-list.component.html',
  styleUrls: ['./poke-list.component.scss']
})
export class PokeListComponent implements OnInit {
  page!: number;
  data: any[] = []

  private setAllPokemons: any;
  public getAllPokemons: any;

  public baseUrl = environment.baseUrl;

  constructor(private pokeDataService: PokeDataService, private router: Router) { }

  ngOnInit(): void {
    this.pokeDataService.apiListAllPokemons(`${this.baseUrl}/pokemon?offset=0&limit=898"`).subscribe(
      res => {
        this.setAllPokemons = res.results;
        this.getAllPokemons = this.setAllPokemons
        this.data = this.getAllPokemons
      }
    )
  }

  //Details
  getDetail(id: number) {
    this.router.navigateByUrl(`details/${id}`);
  }

  //Search
  public getSearch(value: string) {
    const filter = this.setAllPokemons.filter((res: any) => {
      return !res.name.indexOf(value.toLowerCase());
    })
    if (this.page <= 1) {
      this.getAllPokemons = filter;
    } else {
      this.page = 1
    }
  }
}

