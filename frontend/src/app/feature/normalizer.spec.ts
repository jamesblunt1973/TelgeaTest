import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Normalizer } from './normalizer';
import { DataService } from '../core/services/data.serice';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Normalizer', () => {
  let component: Normalizer;
  let fixture: ComponentFixture<Normalizer>;
  let mockDataService: Partial<DataService>;

  beforeEach(async () => {
    mockDataService = {
      getNormalized: jasmine.createSpy('getNormalized').and.returnValue(Promise.resolve({})),
      getMockData: jasmine
        .createSpy('getMockData')
        .and.returnValue(Promise.resolve({ xml: '<root/>', json: '{"key":1}' })),
    };

    await TestBed.configureTestingModule({
      imports: [Normalizer],
      providers: [{ provide: DataService, useValue: mockDataService }, provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Normalizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update xmlData when inputType is xml and input is valid', () => {
    component.inputType = 'xml';
    component.inputTxt = '<note><to>Tove</to></note>';

    component.updateData();

    expect(component.xmlData).toBe('<note><to>Tove</to></note>');
    expect(component.errorMsg).toBe('');
  });

    it('should set errorMsg when xml input is invalid', () => {
      component.inputType = 'xml';
      component.inputTxt = '<note><to>Tove</note>';

      component.updateData();

      expect(component.xmlData).toBe('');
      expect(component.errorMsg).toBe('Invalid XML!');
    });

    it('should update jsonData when inputType is json and input is valid', () => {
      component.inputType = 'json';
      component.inputTxt = '{"name":"Alice"}';

      component.updateData();

      expect(component.jsonData).toBe('{"name":"Alice"}');
      expect(component.errorMsg).toBe('');
    });

    it('should call dataService.getNormalized when both xmlData and jsonData are set', async () => {
      component.xmlData = '<root/>';
      component.jsonData = '{"key":1}';

      await component.normalizeData();

      expect(mockDataService.getNormalized).toHaveBeenCalledWith({
        xml: '<root/>',
        json: '{"key":1}',
      });
      expect(component.dataLoading()).toBe(false);
    });
});
