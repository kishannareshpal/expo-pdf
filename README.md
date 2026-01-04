# @kishannareshpal/expo-pdf

A cross-platform, high-performance PDF viewer for React Native and Expo, built on top of native PDF rendering engines.

### Core features

- [X] Supports Android and iOS
  - Uses Apple's [`PDFKit`](https://developer.apple.com/documentation/pdfkit/pdfview) on iOS and [`androidx.pdf`](https://developer.android.com/jetpack/androidx/releases/pdf) on Android. So you should expect native performance and no unnecessary workarounds.
- [X] Load PDFs from remote URLs or local file paths
- [X] Pinch-to-zoom / double-tap-to-zoom and drag gestures
- [ ] Support for password-protected PDFs
- [ ] Jump to a specific page
- [ ] Horizontal and vertical reading modes

### Installation

```
npm install @kishannareshpal/expo-pdf

# bun add @kishannareshpal/expo-pdf
# pnpm add @kishannareshpal/expo-pdf
```

### Usage

```tsx
import { PdfView } from '@kishannareshpal/expo-pdf'

export const App = () => {
    return (
        <PdfView 
            style={{ flex: 1 }} 
            url="https://pdfobject.com/pdf/sample.pdf" 
        />
    )
}
```

### API

| Prop             | Required | Type                                   | Description                                            |
| ---------------- | -------- | -------------------------------------- | ------------------------------------------------------ |
| `uri`            | Required | `string`                               | PDF document URL or local file path.                   |
| `onLoadComplete` | Optional | `(OnLoadCompleteEventPayload) => void` | Triggered once the document has been fully loaded.     |
| `onPageChanged`  | Optional | `(OnPageChangedPayload) => void`       | Triggered when the user navigates to a different page. |
| `onError`        | Optional | `(OnErrorPayload) => void`             | Triggered when the PDF fails to load or render.        |


#### API Reference

##### `OnLoadCompleteEventPayload`

```ts
{
    pageCount: number
}
```

##### `OnPageChangedEventPayload`

```ts
{
    pageIndex: number, 
    pageCount: number
}
```

##### `OnErrorEventPayload`

```ts
{
    code: 'no_url' | 'invalid_url' | 'invalid_document', 
    message: string
}
```

### Contributing

Please read [CONTRIBUTING.md](./contri)

### License

MIT
