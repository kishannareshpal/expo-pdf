# `@kishannareshpal/expo-pdf`

[![NPM Version](https://img.shields.io/npm/v/%40kishannareshpal%2Fexpo-pdf?style=flat&logo=npm&label=%40kishannareshpal%2Fexpo-pdf)](https://www.npmjs.com/package/@kishannareshpal/expo-pdf)
[![GitHub Repo stars](https://img.shields.io/github/stars/kishannareshpal/expo-pdf?style=flat)](https://github.com/kishannareshpal/expo-pdf)

A cross-platform, high-performance PDF viewer for React Native and Expo, built on top of native PDF rendering engines.

| [iOS](./docs/demo-ios.mp4)                                                                      | [Android](./docs/demo-android.mp4)                                                              |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <video src="https://github.com/user-attachments/assets/57000914-4f7a-4139-9079-9cfd8ece740b" /> | <video src="https://github.com/user-attachments/assets/14faf4f1-b7cc-4e8b-97a5-c0da94fd26c2" /> |

## Features

- Supports Android and iOS
  - Uses Apple's [`PDFKit`](https://developer.apple.com/documentation/pdfkit/pdfview) on iOS
  - Uses [kishannareshpal/AndroidPdfViewer](https://github.com/kishannareshpal/AndroidPdfViewer) on Android which is a maintained
    fork of [barteksc/AndroidPdfViewerV2](https://github.com/kishannareshpal/AndroidPdfViewer) which uses the open-source [PDFium](https://pdfium.googlesource.com/pdfium/+/HEAD/docs/getting-started.md) PDF rendering engine.
    - Note: We'll be looking to switch to [`androidx.pdf`](https://developer.android.com/jetpack/androidx/releases/pdf) on Android once that becomes stable.
- Load PDFs from remote URLs or local file paths
  - Supports local file URIs on android and iOS and ContentResolver URIs on android.
  - Remote URLs cannot be passed directly to the PdfView component. You must download it and then use the local file URI to preview.
- Pinch-to-zoom / double-tap-to-zoom and drag gestures
- Support for password-protected PDFs
- Horizontal and vertical reading modes
- Support for content-insets

## Installation

This package works with both Expo and framework-less React Native projects but Expo provides a more streamlined experience.

### Expo

```bash
npx expo install @kishannareshpal/expo-pdf
```

### Bare React Native

1. Install this package

   ```bash
   npm add @kishannareshpal/expo-pdf

   # bun add @kishannareshpal/expo-pdf
   # pnpm add @kishannareshpal/expo-pdf
   # yarn add @kishannareshpal/expo-pdf
   ```

2. Install CocoaPods dependencies
   ```bash
   npx pod-install
   ```

## Usage

### Use a locally bundled PDF

```jsx
import { PdfView } from '@kishannareshpal/expo-pdf';

export const App = () => {
  const [assets] = useAssets([require('./assets/sample.pdf')]);
  const [uri, setUri] = (useState < string) | (null > null);

  useEffect(() => {
    if (!assets?.length) {
      return;
    }

    assets[0]
      .downloadAsync()
      .then((asset) => setUri(asset.localUri))
      .catch(console.error);
  }, [assets]);

  if (!uri) {
    return null;
  }

  return <PdfView style={{ flex: 1 }} uri={uri} />;
};
```

### Load a file picked using a system picker

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

### Use remote URLs

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

## API

<table>
   <thead>
      <tr>
         <th>Props</th>
         <th>Required</th>
         <th>Type</th>
         <th>Description</th>
         <th>Default</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>uri</code></td>
         <td>Required</td>
         <td><code>string</code></td>
         <td>PDF document URL or local file path.</td>
         <td>-</td>
      </tr>
      <tr>
         <td><code>password</code></td>
         <td>No</td>
         <td><code>string</code></td>
         <td>PDF document URL or local file path.</td>
         <td><code>undefined</code></td>
      </tr>
      <tr>
         <td><code>pagingEnabled</code></td>
         <td>No</td>
         <td><code>boolean</code></td>
         <td>PDF document URL or local file path.</td>
         <td><code>false</code></td>
      </tr>
      <tr>
         <td><code>doubleTapToZoom</code></td>
         <td>No</td>
         <td><code>boolean</code></td>
         <td>PDF document URL or local file path.</td>
         <td><code>true</code></td>
      </tr>
      <tr>
         <td><code>horizontal</code></td>
         <td>No</td>
         <td><code>boolean</code></td>
         <td>PDF document URL or local file path.</td>
         <td><code>false</code></td>
      </tr>
      <tr>
         <td><code>pageGap</code></td>
         <td>No</td>
         <td><code>number</code></td>
         <td>PDF document URL or local file path.</td>
         <td><code>0</code></td>
      </tr>
      <tr>
         <td><code>contentPadding</code></td>
         <td>No</td>
         <td><a href="#contentpadding"><code>ContentPadding</code></a></td>
         <td>PDF document URL or local file path.</td>
         <td><code>{ top: 0, left: 0, right: 0, bottom: 0 }</code></td>
      </tr>
      <tr>
         <td><code>fitMode</code></td>
         <td>No</td>
         <td><a href="#fitmode"><code>FitMode</code></a></td>
         <td>PDF document URL or local file path.</td>
         <td><code>"width"</code></td>
      </tr>
      <tr>
         <td><code>autoScale</code></td>
         <td>No</td>
         <td><code>boolean</code></td>
         <td>
            Whether the document should auto-scale when itself or its parent view changes its layout metrics. 
            Please note that the initial render will always auto-scale to fit whatever <code>fitMode</code> is set to. 
            This prop only affects subsequent layout changes.</td>
         <td><code>true</code></td>
      </tr>
      <tr>
         <td><code>onLoadComplete</code></td>
         <td>No</td>
         <td><a href="#onloadcompleteeventpayload"><code>(OnLoadCompleteEventPayload) =&gt; void</code></a></td>
         <td>Triggered once the document has been fully loaded.</td>
         <td>-</td>
      </tr>
      <tr>
         <td><code>onPageChanged</code></td>
         <td>No</td>
         <td><a href="#onpagechangedeventpayload"><code>(OnPageChangedPayload) =&gt; void</code></a></td>
         <td>Triggered when the user navigates to a different page.</td>
         <td>-</td>
      </tr>
      <tr>
         <td><code>onError</code></td>
         <td>No</td>
         <td><a href="#onerroreventpayload"><code>(OnErrorPayload) =&gt; void</code></a></td>
         <td>Triggered when the PDF fails to load or render.</td>
         <td>-</td>
      </tr>
   </tbody>
</table>

### API Reference

#### `ContentPadding`

```ts
{ top?: number, left?: number, right?: number, bottom?: number }
```

#### `FitMode`

```ts
'width' | 'height' | 'both';
```

#### `OnLoadCompleteEventPayload`

```ts
{
  pageCount: number;
}
```

#### `OnPageChangedEventPayload`

```ts
{ pageIndex: number, pageCount: number }
```

#### `OnErrorEventPayload`

```ts
{
    code: 'invalid_url' | 'invalid_document' | 'password_required' | 'password_incorrect',
    message: string
}
```

## Contributing

Contributions are welcome!

### How to contribute

Please read [CONTRIBUTING.md](./CONTRIBUTING.md)

### How to publish a new version to the registry

> **NOTE**
>
> This package follows semantic versioning with the format: `major.minor.patch`.
>
> - Major version: Increment when making incompatible API changes.
> - Minor version: Increment when adding new functionality in a backward-compatible way.
> - Patch version: Increment when fixing bugs in a backward-compatible manner.

1. Bump `package.json` version using one of `npm version patch|minor|major` - this will create a new `tag`.
2. `git push --tags` to push the new changes including the newly created tag.
3. Navigate to [Create a New Release](https://github.com/kishannareshpal/expo-pdf/releases/new)
4. Select the latest tag you've created above.
5. Use the same name as the tag for the release title.
6. Click <kbd>Generate release notes</kbd>, and/or edit the description to detail the changes.
7. Click the green <kbd>Publish release</kbd> button.
8. A GitHub action will automatically run to publish the new version of the package to the registry.
   - Monitor the status at [kishannareshpal/expo-pdf/actions](https://github.com/kishannareshpal/expo-pdf/actions)

## License

MIT
