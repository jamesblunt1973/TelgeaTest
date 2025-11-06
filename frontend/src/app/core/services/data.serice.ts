import { inject, Injectable } from '@angular/core';
import { MockDataResponse, NormalizedResponse, NormalizeRequest } from '../../core/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  public getMockData(): Promise<MockDataResponse> {
    return firstValueFrom(this.httpClient.get<MockDataResponse>(`${this.apiUrl}mock-data`));
  }

  public getNormalized(data: NormalizeRequest): Promise<NormalizedResponse> {
    return firstValueFrom(this.httpClient.post<NormalizedResponse>(this.apiUrl + 'normalized', data));
  }
}
