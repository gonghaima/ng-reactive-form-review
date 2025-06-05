import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NameEditor } from './name-editor/name-editor';
import { ProfileEditor } from './profile-editor/profile-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NameEditor, ProfileEditor],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ng-reactive-form-review';
}
