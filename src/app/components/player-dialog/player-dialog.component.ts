import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Countries, SquadNumber, Player } from "src/app/interfaces/player";
import { PlayerService } from "src/app/services/player.service";
import { TeamService } from "src/app/services/team.service";
import { take } from "rxjs/operators";
import { NgForm } from "@angular/forms";
import { Team } from "src/app/interfaces/team";

@Component({
  selector: "app-player-dialog",
  templateUrl: "./player-dialog.component.html",
  styleUrls: ["./player-dialog.component.scss"]
})
export class PlayerDialogComponent implements OnInit {
  @Input() player: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter();
  private team: Team;
  public countries = Object.keys(Countries).map(key => ({
    label: key,
    key: Countries[key]
  }));
  public squadNumber = Object.keys(SquadNumber)
    .slice(Object.keys(SquadNumber).length / 2)
    .map(key => ({
      label: key,
      key: SquadNumber[key]
    }));
  constructor(
    private playerService: PlayerService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe(teams => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }

  private newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key
    };
    const formattedTeam = {
      ...this.team,
      players: [
        ...(!this.team.players ? [] : this.team.players),
        playerFormValueKey
      ]
    };

    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue) {
    const playerFormValueWithKey = {
      ...playerFormValue,
      $key: this.player.$key
    };
    console.log(playerFormValueWithKey);
    const playerFormValueWithFormattedKey = {
      ...playerFormValue,
      key: this.player.$key
    };
    delete playerFormValueWithFormattedKey.$key;

    const moddifiedPlayers = this.team.players
      ? this.team.players.map((player: any) => {
          return player.key === this.player.$key
            ? playerFormValueWithFormattedKey
            : player;
        })
      : this.team.players;

    const formattedTeam = {
      ...this.team,
      players: [
        ...(moddifiedPlayers
          ? moddifiedPlayers
          : [playerFormValueWithFormattedKey])
      ]
    };
    this.playerService.editPlayer(playerFormValueWithKey);
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue = { ...playerForm.value };
    if (playerForm.valid) {
      playerFormValue.leftFooted =
        playerFormValue.leftFooted === "" ? false : playerFormValue.leftFooted;
    }
    if (this.player) {
      this.editPlayer(playerFormValue);
    } else {
      this.newPlayer(playerFormValue);
    }
    window.location.replace("#");
  }

  onClose() {
    this.closeDialog.emit(true);
  }
}
