export type OnLoadCompleteEventPayload = { pageCount: number }

export type OnPageChangedEventPayload = { pageIndex: number, pageCount: number }

export type ErrorCode = 'invalid_uri' | 'invalid_document' | 'password_required' | 'password_incorrect'

export type OnErrorEventPayload = { code: ErrorCode, message: string }

export type ContentPadding = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type FitMode = 'width' | 'height' | 'both';
