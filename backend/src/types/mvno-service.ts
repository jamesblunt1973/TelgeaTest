export interface IMvnoService {
	getSmsUsage(): Promise<string>;
	getDataUsage(): Promise<string>;
}
