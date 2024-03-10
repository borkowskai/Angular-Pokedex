import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailComponent } from './pokemon-detail.component';
import { ActivatedRoute } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { PokeApiService } from '../../../core';
import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;

  const pokeApiServiceMock = {
    loadPokemonDetailByName: jest.fn().mockImplementation(() => of({}))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokemonDetailComponent],
      providers: [MockProvider(ActivatedRoute),
        MockProvider(PokeApiService, pokeApiServiceMock),
        MockProvider(DestroyRef)
      ]
    });
    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
