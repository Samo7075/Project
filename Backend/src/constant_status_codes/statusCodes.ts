// src/constants/statusCodes.ts

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const RESPONSE_MESSAGES = {
  SUCCESS: 'Ähli maglumatlar üstünlikli getirildi',
  CREATED: 'Haryt üstünlikli döredildi',
  UPDATED: 'Maglumatlar üstünlikli üýtgedildi',
  DELETED: 'Haryt üstünlikli öçirildi',
  UNAUTHORIZED: 'Avtorizasiya geçilmändir',
  NOT_FOUND: 'Degişli haryt tapylmadi',
  SERVER_ERROR: 'Serverde näsazlyk ýüze çykdy',
} as const;


export const PRODUCT_MESSAGES = {
  SUCCESS:'HARYT ÜSTÜNLÜKLI GOŞULDY',
  UNSUCCESS:'HARYT GOŞULMADY',
  DELETED:'HARYT ÜSTÜNLÜKLI POZULDY',
  UPDATE:'HARYT ÜSTÜNLÜKLI TÄZELENDI',
  NOT_FOUND:'HARYT TAPYLMADY',
  UNFILLED:'MEÝDANÇALARY DOLDURUŇ'
}
