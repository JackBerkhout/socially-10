import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../both/collections/parties.collection';

import {MeteorComponent} from "angular2-meteor";
import {InjectUser} from "angular2-meteor-accounts-ui";

import template from './parties-form.component.html';

@Component({
    selector: 'parties-form',
    template,
    directives: [REACTIVE_FORM_DIRECTIVES],
    styles: [`
        .panel {
            margin: 16px;
            padding: 16px;
            background-color: #f8f8f8;
        }
    `]
})
@InjectUser('user')
export class PartiesFormComponent extends MeteorComponent implements OnInit {
    addForm: FormGroup;
    user: Meteor.User;

    constructor(private formBuilder: FormBuilder) {
        super();
        console.log(this.user);
    }

    ngOnInit() {
        this.addForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [],
            location: ['', Validators.required],
            public: [false]
        });
    }

    resetForm() {
        this.addForm.controls['name']['updateValue']('');
        this.addForm.controls['description']['updateValue']('');
        this.addForm.controls['location']['updateValue']('');
        this.addForm.controls['public']['updateValue'](false);
    }

    addParty() {
        if (this.addForm.valid) {
            if (Meteor.userId()) {
                Parties.insert(Object.assign({}, this.addForm.value, { owner: Meteor.userId() }));

                // XXX will be replaced by this.addForm.reset() in RC5+
                this.resetForm();
            } else {
                alert('Please log in to add a party');
            }
        }
    }
}