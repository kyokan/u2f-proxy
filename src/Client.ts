import {RegisterRequest, RegisterResponse, SignRequest, SignResponse} from "u2f-api";
import {IJsonRPCError, IJsonRPCResponse, makeReq} from "./JsonRPC";

const TIMEOUT = 60 * 1000;

export interface IClientOpts {
  frameUrl: string;
}

export class Client {
  private frameUrl: string;
  private frame: HTMLIFrameElement;

  constructor(opts: IClientOpts) {
    if (!opts.frameUrl) {
      throw new Error("You must set an iFrame URL.");
    }

    this.frameUrl = opts.frameUrl;
    const el = document.createElement("iframe");
    el.src = this.frameUrl;
    el.style.width = "0";
    el.style.height = "0";
    el.style.display = "none";
    document.body.appendChild(el);
    this.frame = el;
  }

  public isSupported(): Promise<boolean> {
    return this.send<boolean>("isSupported", []);
  }

  public ensureSupport(): Promise<void> {
    return this.send<void>("ensureSupport", []);
  }

  public register(
    registerRequests: RegisterRequest | ReadonlyArray<RegisterRequest>,
    signRequests: SignRequest | ReadonlyArray<SignRequest>,
    timeout?: number,
  ): Promise<RegisterResponse>;
  public register(
    registerRequests: RegisterRequest | ReadonlyArray<RegisterRequest>,
    timeout?: number,
  ): Promise<RegisterResponse>;
  public register(
    registerRequests: RegisterRequest | ReadonlyArray<RegisterRequest>,
    signRequests?: SignRequest | ReadonlyArray<SignRequest> | number,
    timeout?: number,
  ): Promise<RegisterResponse> {
    if (typeof signRequests === "number") {
      return this.send<RegisterResponse>("register", [{
        registerRequests,
        signRequests,
        timeout: timeout || null,
      }]);
    }

    if (arguments.length === 2) {
      return this.send<RegisterResponse>("register", [{
        registerRequests,
        timeout: timeout || null,
      }]);
    }

    return this.send<RegisterResponse>("register", [{
      registerRequests,
      signRequests: signRequests || null,
      timeout: timeout || null,
    }]);
  }

  public sign(signRequests: SignRequest | ReadonlyArray<SignRequest>,
              timeout?: number): Promise<SignResponse> {
    return this.send<SignResponse>("sign", [{
      signRequests,
      timeout: timeout || null,
    }]);
  }

  private send<T>(method: string, args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const req = makeReq<any>(method, args.length === 1 ? args[0] : args);
      const channel = new MessageChannel();
      const timeout = setTimeout(() => reject("Timed out."), TIMEOUT);

      channel.port1.onmessage = (e: MessageEvent) => {
        const res = e.data as IJsonRPCResponse<T>;
        if (req.id !== res.id) {
          return;
        }

        clearTimeout(timeout);

        if (e.data.error) {
          const err = e.data as IJsonRPCError;
          reject(err.error.message);
          return;
        }

        resolve(res.result);
      };

      this.frame.contentWindow!.postMessage(req, this.frameUrl, [channel.port2]);
    });
  }
}
