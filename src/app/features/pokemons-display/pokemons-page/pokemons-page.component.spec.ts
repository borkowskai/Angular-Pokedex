import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsPageComponent } from './pokemons-page.component';
import { MockProvider } from 'ng-mocks';
import { PokeApiService } from '../../../core';
import { DestroyRef } from '@angular/core';

describe('PokemonsPageComponent', () => {
  let component: PokemonsPageComponent;
  let fixture: ComponentFixture<PokemonsPageComponent>;

  const pokeApiServiceMock = {
    loadPokemons: jest.fn(),
    loadPokemonsDetails: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokemonsPageComponent],
      providers: [
        MockProvider(PokeApiService, pokeApiServiceMock),
        MockProvider(DestroyRef)
      ]
    });
    fixture = TestBed.createComponent(PokemonsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
