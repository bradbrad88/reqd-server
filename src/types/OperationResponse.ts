type OperationSuccess = {
  success: true;
};

type OperationFail = {
  success: false;
  error: unknown;
};

export type OperationResponse = OperationSuccess | OperationFail;
