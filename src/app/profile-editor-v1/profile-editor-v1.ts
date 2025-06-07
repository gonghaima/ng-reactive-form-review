import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile-editor-v1',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-editor-v1.html',
  styleUrls: ['../shared/form-styles.css', './profile-editor-v1.css'],
})
export class ProfileEditorV1 {
  private formBuilder = inject(FormBuilder);
  profileFormV1 = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: [''],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
  });

  updateProfile() {
    this.profileFormV1.patchValue({
      firstName: 'Nancy',
      address: {
        street: '123 Drew Street',
      },
    });
    console.log(this.profileFormV1.value);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileFormV1.value);
  }
}
