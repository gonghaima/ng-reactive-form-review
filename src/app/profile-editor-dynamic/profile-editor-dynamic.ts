import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-editor-dynamic',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-editor-dynamic.html',
  styleUrls: ['../shared/form-styles.css', './profile-editor-dynamic.css'],
})
export class ProfileEditorDynamic {
  private formBuilder = inject(FormBuilder);

  // Configuration object for the form
  formConfig = {
    firstName: { type: 'text', validators: [Validators.required] },
    lastName: { type: 'text', validators: [] },
    address: {
      group: {
        street: { type: 'text', validators: [] },
        city: { type: 'text', validators: [] },
        state: { type: 'text', validators: [] },
        zip: { type: 'text', validators: [] },
      },
    },
    aliases: { array: { type: 'text', validators: [] } },
  };

  profileForm = this.createForm(this.formConfig);

  // Dynamically create the form structure
  private createForm(config: any): FormGroup {
    const group: any = {};
    for (const key in config) {
      if (config[key].group) {
        group[key] = this.createForm(config[key].group);
      } else if (config[key].array) {
        group[key] = this.formBuilder.array([
          this.createControl(config[key].array),
        ]);
      } else {
        group[key] = this.createControl(config[key]);
      }
    }
    return this.formBuilder.group(group);
  }

  private createControl(config: any): FormControl {
    return this.formBuilder.control('', config.validators || []);
  }

  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }

  addAlias() {
    this.aliases.push(this.createControl(this.formConfig.aliases.array));
  }
}
