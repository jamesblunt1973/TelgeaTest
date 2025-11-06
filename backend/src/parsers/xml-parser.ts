import { XMLParser } from 'fast-xml-parser';
import type { SoapSmsResponse } from '../types';

export function parseSoap(xmlData: string): SoapSmsResponse {
	const parser = new XMLParser({ ignoreAttributes: false });
	const json = parser.parse(xmlData);

	const sms = json['soapenv:Envelope']['soapenv:Body']['sms:ChargeSMS'];

	return {
		userId: sms['sms:UserID'],
		phoneNumber: sms['sms:PhoneNumber'],
		messageId: sms['sms:MessageID'],
		timestamp: sms['sms:Timestamp'],
		chargeAmount: parseFloat(sms['sms:ChargeAmount']),
		currency: sms['sms:Currency'],
	};
}
