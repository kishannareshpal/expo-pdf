# `@kishannareshpal/expo-pdf`

A cross-platform, high-performance PDF viewer for React Native and Expo, built on top of native PDF rendering engines.

### Core features

- [X] Supports Android and iOS
  - Uses Apple's [`PDFKit`](https://developer.apple.com/documentation/pdfkit/pdfview) on iOS
  - Uses [kishannareshpal/AndroidPdfViewer](https://github.com/kishannareshpal/AndroidPdfViewer) on Android which is a maintained
    fork of [barteksc/AndroidPdfViewerV2](https://github.com/kishannareshpal/AndroidPdfViewer) which uses the open-source [PDFium](https://pdfium.googlesource.com/pdfium/+/HEAD/docs/getting-started.md) PDF rendering engine.
    - Note: We'll be looking to switch to [`androidx.pdf`](https://developer.android.com/jetpack/androidx/releases/pdf) on Android once that becomes stable.
- [x] Load PDFs from remote URLs or local file paths
  - [x] Supports local file URIs on android and iOS and ContentResolver URIs on android.
  - [x] Remote URLs cannot be passed directly to the PdfView component. You must download it and then use the local file URI to preview.
- [X] Pinch-to-zoom / double-tap-to-zoom and drag gestures
- [x] Support for password-protected PDFs
- [x] Horizontal and vertical reading modes
- [x] Support for content-insets 

### Demo

| [iOS](./docs/demo-ios.mp4)                                                                      | [Android](./docs/demo-android.mp4)                                                                      |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <video src="https://github.com/user-attachments/assets/6c88deb7-7801-4e3a-b93e-88f9688435a1" /> | <video src="https://github.com/user-attachments/assets/6c88deb7-7801-4e3a-b93e-88f9688435a1" /> |

### Installation

```
npm install @kishannareshpal/expo-pdf

# bun add @kishannareshpal/expo-pdf
# pnpm add @kishannareshpal/expo-pdf
```

### Usage

#### Use a locally bundled PDF

```jsx
import { PdfView } from '@kishannareshpal/expo-pdf'

export const App = () => {
  const [assets] = useAssets([require('./assets/sample.pdf')]);
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!assets?.length) {
      return;
    }

    assets[0].downloadAsync()
      .then((asset) => setUri(asset.localUri))
      .catch(console.error)
  }, [assets])

  if (!uri) {
    return null;
  }

  return (
    <PdfView 
      style={{ flex: 1 }} 
      uri={uri}
    />
  )
}
```

#### Load a file picked using a system picker

```jsx
import { File } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { PdfView } from '@kishannareshpal/expo-pdf'

export const App = () => {
  const [uri, setUri] = useState<string | null>(null)

  const pickFile = () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      const file = new File(result.assets[0]);
      setUri(file.localUri)
    } catch (error) {
      console.error(error);
    }
  }

  if (!uri) {
    return null;
  }

  return (
    <View>
      <Button onPress={pickFile}>Pick a file</Button>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {uri ? (
          <PdfView 
            style={{ flex: 1 }} 
            uri={uri}
          />
        ) : (
          <Text>Please pick a file<Text>
        )}
      </View>
    </View>
  )
}
```

#### Use remote URLs

```jsx
import { File } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { PdfView } from '@kishannareshpal/expo-pdf'

export const App = () => {
  const [uri, setUri] = useState<string | null>(null)

  const loadFromUrl = (url: string) => {
    const destination = new Directory(Paths.cache, 'pdfs');

    try {
      destination.create();
      const output = await File.downloadFileAsync(url, destination);
      setUri(output.uri)
    } catch (error) {
      console.error(error);
    }
  }

  if (!uri) {
    return null;
  }

  return (
    <View>
      <Button onPress={() => loadFromUrl("https://pdfobject.com/pdf/sample.pdf")}>
        Download and load from URL
      </Button>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {uri ? (
          <PdfView 
            style={{ flex: 1 }} 
            uri={uri}
          />
        ) : (
          <Text>Please download the file to preview<Text>
        )}
      </View>
    </View>
  )
}
```

### API

| Props                    | Required | Type                                                                  | Description                                            | Default                                    |
| ------------------------ | -------- | --------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `uri`                    | Required | `string`                                                              | PDF document URL or local file path.                   | -                                          |
| `password`               | No       | `string`                                                              | PDF document URL or local file path.                   | `undefined`                                |
| `pagingEnabled`          | No       | `boolean`                                                             | PDF document URL or local file path.                   | `false`                                    |
| `disableDoubleTapToZoom` | No       | `boolean`                                                             | PDF document URL or local file path.                   | `false`                                    |
| `horizontal`             | No       | `boolean`                                                             | PDF document URL or local file path.                   | `false`                                    |
| `pageGap`                | No       | `number`                                                              | PDF document URL or local file path.                   | `0`                                        |
| `contentPadding`         | No       | [`ContentPadding`](#contentpadding)                                   | PDF document URL or local file path.                   | `{ top: 0, left: 0, right: 0, bottom: 0 }` |
| `fitMode`                | No       | [`FitMode`](#fitmode)                                                 | PDF document URL or local file path.                   | `"width"`                                  |
| `onLoadComplete`         | No       | [`(OnLoadCompleteEventPayload) => void`](#onloadcompleteeventpayload) | Triggered once the document has been fully loaded.     | -                                          |
| `onPageChanged`          | No       | [`(OnPageChangedPayload) => void`](#onpagechangedeventpayload)        | Triggered when the user navigates to a different page. | -                                          |
| `onError`                | No       | [`(OnErrorPayload) => void`](#onerroreventpayload)                    | Triggered when the PDF fails to load or render.        | -                                          |


#### API Reference

##### `ContentPadding`

```ts
{ top?: number, left?: number, right?: number, bottom?: number }
```

##### `FitMode`

```ts
"width" | "height" | "both"
```

##### `OnLoadCompleteEventPayload`

```ts
{ pageCount: number }
```

##### `OnPageChangedEventPayload`

```ts
{ pageIndex: number, pageCount: number }
```

##### `OnErrorEventPayload`

```ts
{
    code: 'invalid_url' | 'invalid_document' | 'password_required' | 'password_incorrect', 
    message: string
}
```

### Contributing

Contributions are welcome! 

#### How to contribute

Please read [CONTRIBUTING.md](./CONTRIBUTING.md)

### License

MIT
