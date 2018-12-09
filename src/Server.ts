import * as u2f from "u2f-api";
import {RegisterResponse, SignResponse} from "u2f-api";
import {Dispatcher} from "./Dispatcher";
import {DispatcherBuilder} from "./DispatcherBuilder";
import {
  HandlerCallback,
  IJsonRPCError,
  IJsonRPCRequest,
  IJsonRPCResponse,
  validateReq,
} from "./JsonRPC";
import {IRegisterOpts, ISignOpts} from "./U2F";
import {removeNulls} from "./utils";

export interface IServerOpts {
  allowedOrigins: string[];
}

export class Server {
  private allowedOrigins: Set<string>;

  private dispatcher: Dispatcher;

  constructor(opts: IServerOpts) {
    this.allowedOrigins = new Set(opts.allowedOrigins);
    window.addEventListener("message", this.onMessage);

    this.dispatcher = new DispatcherBuilder()
      .withMethod("isSupported", this.isSupported)
      .withMethod("ensureSupport", this.ensureSupport)
      .withMethod("register", this.register)
      .withMethod("sign", this.sign)
      .build();
  }

  private isSupported = (req: IJsonRPCRequest<void>, cb: HandlerCallback<boolean>) => {
    u2f.isSupported().then((res: boolean) => cb(null, res)).catch((e: any) => cb({
      code: -1,
      message: e.message || "An unknown error occurred.",
    }, null));
  }

  private ensureSupport = (req: IJsonRPCRequest<void>, cb: HandlerCallback<void>) => {
    u2f.ensureSupport().then(() => cb(null, null)).catch((e: any) => cb({
      code: -1,
      message: e.message,
    }, null));
  }

  private register = (req: IJsonRPCRequest<IRegisterOpts>, cb: HandlerCallback<RegisterResponse>) => {
    const args = removeNulls([req.params.registerRequests, req.params.signRequests, req.params.timeout]);
    u2f.register.apply(null, args as any).then((res: RegisterResponse) => cb(null, res)).catch((e) => cb({
      code: -1,
      message: e.message,
    }, null));
  }

  private sign = (req: IJsonRPCRequest<ISignOpts>, cb: HandlerCallback<SignResponse>) => {
    const args = removeNulls([req.params.signRequests, req.params.timeout]);
    u2f.sign.apply(null, args as any).then((res: SignResponse) => cb(null, res)).catch((e) => cb({
      code: -1,
      message: e.message,
    }, null));
  }

  private onMessage = (e: MessageEvent) => {
    if (!this.allowedOrigins.has(e.origin)) {
      return;
    }

    const data = e.data;

    if (!validateReq(data)) {
      return;
    }

    const cb = (err: IJsonRPCError | null, res: IJsonRPCResponse<any>|null) => {
      e.ports[0].postMessage(err || res);
    };
    this.dispatcher.dispatch(e.data as IJsonRPCRequest<any>, cb);
  }
}
