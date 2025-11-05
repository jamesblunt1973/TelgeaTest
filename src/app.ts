import express from 'express';
import { normalizeData } from './normalizer/normalize.ts';
import { parseRest } from './parsers/json-parser.ts';
import { parseSoap } from './parsers/xml-parser.ts';
import { MvnoService } from './services/mvnoService.ts';

const app = express();
const mvnoService = new MvnoService(
	'https://mvno-dartner.com/api/soap',
	'https://mvno-dartner.com/api/rest/usage',
);

app.get('/normalized', async (_req, res) => {
	try {
		const smsRes = await mvnoService.getSmsUsage();
		const dataRes = await mvnoService.getDataUsage();

		const smsData = parseSoap(smsRes);
		const dataData = parseRest(dataRes);
		const normalized = normalizeData(smsData, dataData);

		res.json(normalized);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch MVNO data' });
	}
});

app.listen(3000, () =>
	console.log('✅ Server running at http://localhost:3000/normalized'),
);
