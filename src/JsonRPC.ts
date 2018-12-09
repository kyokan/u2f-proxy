export interface IJsonRPCRequest<T> {
  jsonrpc: "2.0";
  method: string;
  params: T;
  id: number | string;
}

export function makeReq<T>(method: string, params: T): IJsonRPCRequest<T> {
  return {
    jsonrpc: "2.0",
    method,
    params,
    id: Date.now(),
  };
}

export function validateReq(data: any): boolean {
  return data.jsonrpc === "2.0" &&
    typeof data.method === "string" &&
    data.method.length > 0 &&
    typeof data.params !== "undefined" &&
    typeof data.id !== "undefined" &&
    !!data.id;
}

export interface IJsonRPCResponse<T> {
  jsonrpc: "2.0";
  result: T;
  id: number | string;
}

export function makeRes<T>(result: T, id: number | string): IJsonRPCResponse<T> {
  return {
    jsonrpc: "2.0",
    result,
    id,
  };
}

export interface IJsonRPCError {
  jsonrpc: "2.0";
  error: IError;
  id: number | string;
}

export interface IError {
  code: number;
  message: string;
}

export function makeErr(code: number, message: string, id: number | string): IJsonRPCError {
  return {
    jsonrpc: "2.0",
    error: {
      code,
      message,
    },
    id,
  };
}

export type DispatcherCallback = (err: IJsonRPCError | null, res: IJsonRPCResponse<any> | null) => void;
export type HandlerCallback<T> = (err: IError | null, res: T | null) => void;
export type DispatcherHandler = (req: IJsonRPCRequest<any>, cb: HandlerCallback<any>) => void;

export interface IDispatcherHandlers {
  [name: string]: DispatcherHandler;
}
