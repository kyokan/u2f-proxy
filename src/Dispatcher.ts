import {
  DispatcherCallback,
  HandlerCallback,
  IDispatcherHandlers,
  IError,
  IJsonRPCRequest,
  makeErr,
  makeRes,
} from "./JsonRPC";

export class Dispatcher {
  private methods: IDispatcherHandlers;

  constructor(methods: IDispatcherHandlers) {
    this.methods = methods;
  }

  public dispatch(req: IJsonRPCRequest<any>, cb: DispatcherCallback) {
    const meth = this.methods[req.method];

    if (!meth) {
      cb(makeErr(-32601, "method not found", req.id), null);
      return;
    }

    const handlerCb: HandlerCallback<any> = (err: IError | null, res: any) => {
      if (err) {
        const errObj = makeErr(err.code, err.message, req.id);
        cb(errObj, null);
        return;
      }

      cb(null, makeRes<any>(res, req.id));
    };

    if (Array.isArray(req.params)) {
      meth.call(null, req, handlerCb);
    } else {
      meth.call(null, req, handlerCb);
    }
  }
}
