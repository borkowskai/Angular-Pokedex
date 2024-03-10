import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonComponent } from './pokemon.component';
import { MockComponent, MockDirective, MockProvider } from 'ng-mocks';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { PokemonDetail, Sprite } from '../../../core/models/pokemon-detail';

describe('PokemonComponent', () => {
  let component: PokemonComponent;
  let fixture: ComponentFixture<PokemonComponent>;

  beforeEach(() => {

    const activatedRouteMock = {
      queryParams: of({ name: 'test' })
    };
    const pokemon = <PokemonDetail>{};
    pokemon.name = 'test';
    const sprites = <Sprite>{};
    sprites.front_default = 'test.png';
    pokemon.sprites = sprites;

    TestBed.configureTestingModule({
      declarations: [PokemonComponent,
        MockComponent(MatCard), MockComponent(MatCardHeader),
        MockDirective(MatCardTitle), MockDirective(MatCardActions)],
      providers: [MockProvider(ActivatedRoute, activatedRouteMock)]
    });
    fixture = TestBed.createComponent(PokemonComponent);
    component = fixture.componentInstance;
    component.pokemon = pokemon;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
