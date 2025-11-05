import type { NormalizedData, RestResponse, SoapSmsResponse } from '../types';

export function normalizeData(
	soap: SoapSmsResponse,
	rest: RestResponse,
): NormalizedData {
	return {
		telgea_user_id: rest.user_id,
		msisdn: rest.msisdn,
		usage_data: {
			total_mb: rest.usage.data.total_mb,
			roaming_mb: rest.usage.data.roaming_mb,
			country: rest.usage.data.country,
			network_type: rest.network.type,
			provider_code: rest.network.provider_code,
		},
		sms_charges: [
			{
				message_id: soap.messageId,
				timestamp: soap.timestamp,
				amount: soap.chargeAmount,
				currency: soap.currency,
			},
		],
		billing_period: {
			start: rest.usage.period.start,
			end: rest.usage.period.end,
		},
	};
}
