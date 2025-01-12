import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTravelModalComponent } from './modals/create-travel-modal/create-travel-modal.component';
import { DetailTravelModalComponent } from './modals/detail-travel-modal/detail-travel-modal.component';
import { EditTravelModalComponent } from './modals/edit-travel-modal/edit-travel-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateTravelModalComponent,
    DetailTravelModalComponent,
    EditTravelModalComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    IonicModule.forRoot({
      mode: 'ios',
    }), 
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
