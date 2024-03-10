import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsPageComponent } from './pokemons-page.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { PokeApiService } from '../../../core';
import { DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { of } from 'rxjs';

describe('PokemonsPageComponent', () => {
  let component: PokemonsPageComponent;
  let fixture: ComponentFixture<PokemonsPageComponent>;

  const pokeApiServiceMock = {
    loadPokemons: jest.fn().mockImplementation(() => of({})),
    loadPokemonsDetails: jest.fn().mockImplementation(() => of({}))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokemonsPageComponent, MockComponent(MatPaginator)],
      providers: [
        MockProvider(PokeApiService, pokeApiServiceMock),
        MockProvider(DestroyRef),
        MockProvider(Router)
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
