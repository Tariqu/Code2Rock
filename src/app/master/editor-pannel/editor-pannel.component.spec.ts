import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPannelComponent } from './editor-pannel.component';

describe('EditorPannelComponent', () => {
  let component: EditorPannelComponent;
  let fixture: ComponentFixture<EditorPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
