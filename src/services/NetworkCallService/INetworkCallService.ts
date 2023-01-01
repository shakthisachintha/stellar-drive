export interface INetworkCallService {
  delete(data: any, headers?: any): Promise<any>;
  post(data: any, headers?: any): Promise<any>;
  put(data: any, headers?: any): Promise<any>;
  get(headers?: any): Promise<any>;
}
