import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsPageComponent } from './pokemons-page.component';
import { MockModule, MockProvider } from 'ng-mocks';
import { PokeApiService } from '../../../core';
import { CoreModule } from '../../../core/core.module';

describe('PokemonsPageComponent', () => {
  let component: PokemonsPageComponent;
  let fixture: ComponentFixture<PokemonsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokemonsPageComponent],
      providers: [MockProvider(PokeApiService)]
    });
    fixture = TestBed.createComponent(PokemonsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
