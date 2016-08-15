import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';

import { Parties }   from '../../../both/collections/parties.collection';
import {Party} from "../../../both/interfaces/party.interface";
import { PartiesFormComponent } from './parties-form.component';

import template from './parties-list.component.html';

@Component({
    selector: 'parties-list',
    template,
    directives: [PartiesFormComponent, ROUTER_DIRECTIVES, LoginButtons],
    styles: [`
        .panel {
            margin: 16px;
            padding: 16px;
            background-color: #fcfcfc;
        }
        .list-group-item-text {
            font-size: 1.2em;
            line-height: 200%;
        }
        .search {
            margin-bottom: 16px;
        }
    `]
})
export class PartiesListComponent extends MeteorComponent implements OnInit {
    parties: Mongo.Cursor<Party>;

    constructor() {
        super();
    }

    ngOnInit() {
        this.parties = Parties.find();

        this.subscribe('parties', () => {
            this.parties = Parties.find();
        }, true);
    }

    search(value: string) {
        this.parties = Parties.find(value ? { location: value } : {});
    }
}
