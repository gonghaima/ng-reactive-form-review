import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NameEditor } from './name-editor/name-editor';
import { ProfileEditor } from './profile-editor/profile-editor';
import { ProfileEditorV1 } from './profile-editor-v1/profile-editor-v1';
import { ProfileEditorDynamic } from './profile-editor-dynamic/profile-editor-dynamic';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NameEditor,
    ProfileEditor,
    ProfileEditorV1,
    ProfileEditorDynamic,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ng-reactive-form-review';
}
