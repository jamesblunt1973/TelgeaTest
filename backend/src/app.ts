import cors from 'cors';
import express from 'express';
import { normalizeData } from './normalizer/normalize.ts';
import { parseRest } from './parsers/json-parser.ts';
import { parseSoap } from './parsers/xml-parser.ts';
import { MvnoMockService } from './services/mvnoService.mock.ts';
import { MvnoService } from './services/mvnoService.ts';
import type { NormalizePostReq } from './types/index.ts';

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:4200'],
		methods: '*',
		allowedHeaders: '*',
	}),
);

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

app.post('/normalized', async (req: NormalizePostReq, res) => {
	try {
		const data = req.body;
		const smsRes = data.xml;
		const dataRes = data.json;

		const smsData = parseSoap(smsRes);
		const dataData = parseRest(dataRes);
		const normalized = normalizeData(smsData, dataData);

		res.json(normalized);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch MVNO data' });
	}
});

app.get('/mock-data', async (_req, res) => {
	const mockService = new MvnoMockService();
	const xml = await mockService.getSmsUsage();
	const json = await mockService.getDataUsage();
	res.json({
		xml,
		json,
	});
});

app.listen(3000, () =>
	console.log('✅ Server running at http://localhost:3000/normalized'),
);
