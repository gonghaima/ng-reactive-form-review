import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NameEditor } from './name-editor/name-editor';
import { ProfileEditor } from './profile-editor/profile-editor';
import { ProfileEditorV1 } from './profile-editor-v1/profile-editor-v1';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NameEditor, ProfileEditor, ProfileEditorV1],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ng-reactive-form-review';
}
