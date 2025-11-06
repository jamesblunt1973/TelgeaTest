import * as fs from 'node:fs/promises';
import type { IMvnoService } from '../types';

export class MvnoMockService implements IMvnoService {
	async getSmsUsage(): Promise<string> {
		return fs.readFile('./src/mock/mvno_soap_spec.xml', 'utf-8');
	}

	async getDataUsage(): Promise<string> {
		return fs.readFile('./src/mock/mvno_rest_spec.json', 'utf-8');
	}

	async getNormalized(): Promise<string> {
		return fs.readFile('./src/mock/telgea_normalized_spec.json', 'utf-8');
	}
}
