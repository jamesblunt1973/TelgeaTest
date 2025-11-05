import type { RestResponse } from '../types';

export function parseRest(data: string): RestResponse {
	return JSON.parse(data);
}
