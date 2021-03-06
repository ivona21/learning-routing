import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, CanDeactivate } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { ServersService } from '../servers.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {
  server: { id: number, name: string, status: string };
  serverName = '';
  serverStatus = '';
  allowEdit: boolean = false;
  changesSaved = false;

  constructor(private serversService: ServersService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment);
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.allowEdit = queryParams["allowEdit"] === '1' ? true : false;
      }
    );
    this.route.fragment.subscribe();
    const id = this.route.snapshot.params["id"] ? Number(this.route.snapshot.params["id"]) : 2;
    this.server = this.serversService.getServer(id); 
    //Subscribe route params to update the id if params changed;
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, { name: this.serverName, status: this.serverStatus });  
    this.changesSaved = true;
    this.router.navigate(["../"], {relativeTo: this.route})
  }

  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit){
      return true;
    }
    if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status) && !this.changesSaved){
      return confirm("Do you want to discard the changed?");
    } else {
      return true;
    }
  }

}
