export type OnLoadCompleteEventPayload = { pageCount: number }

export type OnPageChangedEventPayload = { pageIndex: number, pageCount: number }

export type ErrorCode = 'no_url' | 'invalid_url' | 'invalid_document'

export type OnErrorEventPayload = { code: ErrorCode, message: string }

export type ContentPadding = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
