import { normalizeData } from '../normalizer/normalize.ts';
import { parseRest } from '../parsers/json-parser.ts';
import { parseSoap } from '../parsers/xml-parser.ts';
import { MvnoMockService } from '../services/mvnoService.mock.ts';

describe('Normalization integration', () => {
	it('should normalize mock SOAP + REST data correctly', async () => {
		// Initial
		const service = new MvnoMockService();

		const soapXml = await service.getSmsUsage();
		const restJson = await service.getDataUsage();

		const soapData = parseSoap(soapXml);
		const restData = parseRest(restJson);

		// Execute
		const normalized = normalizeData(soapData, restData);

		// Assert
		const expected = JSON.parse(await service.getNormalized());

		expect(normalized).toEqual(expected);
	});
});
