import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { PlayerService } from "./services/player.service";
import { TeamTableComponent } from './components/team-table/team-table.component';
import { PlayerTableComponent } from './components/player-table/player-table.component';
import { PlayerDialogComponent } from './components/player-dialog/player-dialog.component';

@NgModule({
  declarations: [AppComponent, TeamTableComponent, PlayerTableComponent, PlayerDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
