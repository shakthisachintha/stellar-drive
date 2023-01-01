export interface IURLService {
    getBaseURL(): string;
    generateURL(path: string): string;
}