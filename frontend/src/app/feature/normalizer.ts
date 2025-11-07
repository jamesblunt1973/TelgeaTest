import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NormalizedResponse } from '../core/models';
import { DataService } from '../core/services/data.serice';

@Component({
  selector: 'app-normalizer',
  styleUrl: './normalizer.scss',
  templateUrl: './normalizer.html',
  imports: [FormsModule, CommonModule],
})
export class Normalizer {
  public readonly mockLoading = signal(false);
  public readonly dataLoading = signal(false);
  public inputType: 'xml' | 'json' = 'xml';
  public xmlData = '';
  public jsonData = '';
  public errorMsg = '';
  public inputTxt = '';
  public normalized?: NormalizedResponse;

  private dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);

  public updateData() {
    this.errorMsg = '';

    const { inputType, inputTxt } = this;

    if (inputType === 'xml') {
      this.updateXmlData(inputTxt);
      return;
    }

    if (inputType === 'json') {
      this.updateJsonData(inputTxt);
      return;
    }
  }

  private updateXmlData(input: string) {
    this.xmlData = '';
    if (this.isValidXml(input)) {
      this.xmlData = input;
    } else {
      this.errorMsg = 'Invalid XML!';
    }
  }

  private updateJsonData(input: string) {
    this.jsonData = '';
    if (this.isValidJson(input)) {
      this.jsonData = input;
    } else {
      this.errorMsg = 'Invalid JSON!';
    }
  }

  public inputTypeChange() {
    this.errorMsg = '';
    if (this.inputType === 'xml') {
      this.inputTxt = this.xmlData;
    } else if (this.inputType === 'json') {
      this.inputTxt = this.jsonData;
    }
  }

  public async normalizeData(): Promise<void> {
    this.normalized = undefined;

    if (!this.jsonData || !this.xmlData) {
      return;
    }

    this.dataLoading.set(true);
    this.normalized = await this.dataService.getNormalized({
      xml: this.xmlData,
      json: this.jsonData,
    });
    this.dataLoading.set(false);

    this.cd.detectChanges();
  }

  public async importMock() {
    this.mockLoading.set(true);
    const mockData = await this.dataService.getMockData();
    this.mockLoading.set(false);
    this.xmlData = mockData.xml;
    this.jsonData = mockData.json;

    this.inputTypeChange();
    this.cd.detectChanges();
  }

  private isValidXml(xmlString: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'application/xml');
      const parserError = doc.querySelector('parsererror');
      return !parserError;
    } catch {
      return false;
    }
  }

  private isValidJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}
