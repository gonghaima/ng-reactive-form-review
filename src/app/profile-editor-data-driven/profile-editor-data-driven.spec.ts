import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditorDataDriven } from './profile-editor-data-driven';

describe('ProfileEditorDataDriven', () => {
  let component: ProfileEditorDataDriven;
  let fixture: ComponentFixture<ProfileEditorDataDriven>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditorDataDriven]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditorDataDriven);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
