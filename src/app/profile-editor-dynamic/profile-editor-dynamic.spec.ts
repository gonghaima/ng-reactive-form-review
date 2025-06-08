import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditorDynamic } from './profile-editor-dynamic';

describe('ProfileEditorDynamic', () => {
  let component: ProfileEditorDynamic;
  let fixture: ComponentFixture<ProfileEditorDynamic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditorDynamic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditorDynamic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
