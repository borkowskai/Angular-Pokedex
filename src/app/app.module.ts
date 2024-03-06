import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonsPageComponent } from './features/pokemons-display/pokemons-page/pokemons-page.component';
import { CoreModule } from './core/core.module';
import { PokemonsDisplayModule } from './features/pokemons-display/pokemons-display.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    PokemonsPageComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    PokemonsDisplayModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
