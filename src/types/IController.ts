export type HttpRequest = {
  body: unknown;
  query: unknown;
  params: unknown;
  ip: string;
  method: string;
  path: string;
  // user: Object,
  // logger: Object,
  source: {
    ip: string;
    browser?: string;
  };
  headers: {
    "Content-Type"?: string;
    Referer?: string;
    "User-Agent"?: string;
  };
};
type HttpResponse = any;

export type Controller = (request: HttpRequest) => Promise<HttpResponse>;
