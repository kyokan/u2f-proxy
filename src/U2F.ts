import {RegisterRequest, SignRequest} from "u2f-api";

export interface IRegisterOpts {
  registerRequests: RegisterRequest | ReadonlyArray<RegisterRequest>;
  signRequests: SignRequest | ReadonlyArray<SignRequest> | number | null;
  timeout: number | null;
}

export interface ISignOpts {
  signRequests: SignRequest | ReadonlyArray<SignRequest>;
  timeout: number | null;
}
