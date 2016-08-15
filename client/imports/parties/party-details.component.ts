import { Component, NgZone, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';

import { Parties } from '../../../both/collections/parties.collection';
import {Party} from "../../../both/interfaces/party.interface";

import { CanActivate } from '@angular/router';

import template from './party-details.component.html';

@Component({
    selector: 'party-details',
    template,
    directives: [ROUTER_DIRECTIVES],
    styles: [`
        .panel {
            margin: 16px;
            padding: 16px;
            background-color: #fcfcfc;
        }
    `]

})
export class PartyDetailsComponent extends MeteorComponent implements CanActivate, OnInit {
    partyId: string;
    party: Party;

    constructor(private route: ActivatedRoute,
                private ngZone: NgZone,
                private router: Router) {
        super();
    }


    ngOnInit() {
        this.route.params
            .map(params => params['partyId'])
            .subscribe(partyId => {
                this.partyId = partyId;
                // We have to make it reactive,
                // because we don't know if the subscription is ready by now.
                // Tracker.autorun(() => {
                //     // To apply any change of party to UI, we have to use NgZone.run() method.
                //     this.ngZone.run(() => {
                //         this.party = Parties.findOne(this.partyId);
                //     });
                // });
                this.subscribe('party', this.partyId, () => {
                    this.party = Parties.findOne(this.partyId);
                }, true);
            });
    }

    saveParty() {
        Parties.update(this.party._id, {
            $set: {
                name: this.party.name,
                description: this.party.description,
                location: this.party.location
            }
        });
        this.navigateBack();
    }

    removeParty(party) {
        Parties.remove(party._id);
        this.navigateBack();
    }

    private navigateBack() {
        this.router.navigate(['/']);
    }

    canActivate() {
        const party = Parties.findOne(this.partyId);
        return (party && party.owner == Meteor.userId());
    }
}
