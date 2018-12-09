import {Dispatcher} from "./Dispatcher";
import {DispatcherHandler, IDispatcherHandlers} from "./JsonRPC";

export class DispatcherBuilder {
  private methods: IDispatcherHandlers = {};

  public withMethod(name: string, handler: DispatcherHandler) {
    this.methods[name] = handler;
    return this;
  }

  public build(): Dispatcher {
    if (!Object.keys(this.methods).length) {
      throw new Error("No methods registered.");
    }

    return new Dispatcher(this.methods);
  }
}
