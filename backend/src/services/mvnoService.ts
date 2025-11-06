import axios from 'axios';
import type { IMvnoService } from '../types';

export class MvnoService implements IMvnoService {
	private smsApiUrl: string;
	private dataApiUrl: string;

	constructor(soapUrl: string, restUrl: string) {
		this.smsApiUrl = soapUrl;
		this.dataApiUrl = restUrl;
	}

	async getSmsUsage(): Promise<string> {
		const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
        <soapenv:Header/>
        <soapenv:Body>
          <sms:GetCharges/>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

		const response = await axios.post(this.smsApiUrl, soapEnvelope, {
			headers: {
				'Content-Type': 'text/xml',
				SOAPAction: 'GetCharges', // or similar
			},
		});

		return response.data;
	}

	async getDataUsage(): Promise<string> {
		const response = await axios.get(this.dataApiUrl, {
			headers: {
				Accept: 'application/json',
			},
		});
		return JSON.stringify(response.data);
	}
}
