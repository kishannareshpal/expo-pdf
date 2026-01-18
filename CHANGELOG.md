# Changelog

<!--
## x.y.z - YYYY-MM-DD

### 🛠 Breaking changes
- [ios|android] Describe change or paste PR title (<link to pr or if commit if no pr> by @username)

### 🎉 New features
### 🐛 Bug fixes
### 💡 Others

_This version does not introduce any user-facing changes._
-->

## 0.2.4 - 2026-01-18


### 📦 Other Changes

- ci: merge release pr ([90b2b2d](https://github.com/kishannareshpal/expo-pdf/commit/90b2b2dd96aecf4734899d70e85cbf0f878450cc)) by `Kishan Jadav`
- ci: fix changelog update ([ca9f012](https://github.com/kishannareshpal/expo-pdf/commit/ca9f0123887c567e325fab9ddc159a01e49bbae8)) by `Kishan Jadav`
- ci: fix pr not merging on release again ([b933332](https://github.com/kishannareshpal/expo-pdf/commit/b9333328a19d0518192aecfab78f5096726c7c7c)) by `Kishan Jadav`


**Full Changelog**: https://github.com/kishannareshpal/expo-pdf/compare/v0.2.4...v0.2.4


## 0.2.3 - 2026-01-11

_This version does not introduce any user-facing changes._

### 💡 Others

- Expose `react-native` `ViewProps` as part of `PdfViewProps`. This change also allows for better compatibility with other libraries such as `uniwind` or `nativewind` that supports `className` ([db7e666](https://github.com/kishannareshpal/expo-pdf/commit/db7e666) by [@kishannareshpal](https://github.com/kishannareshpal))
- Fix TS docs as well as README prop descriptions ([db7e666](https://github.com/kishannareshpal/expo-pdf/commit/db7e666) by [@kishannareshpal](https://github.com/kishannareshpal))

## 0.2.2 - 2026-01-11

_This version does not introduce any user-facing changes._

### 💡 Others

- Export `PdfViewProps`, the props for the main `PdfView` component ([8d5c963](https://github.com/kishannareshpal/expo-pdf/commit/8d5c963) by [@kishannareshpal](https://github.com/kishannareshpal))

### 🐛 Bug fixes

- Fix exported `ErrorCode` literal type to match updated error codes from the native ([3a34f39](https://github.com/kishannareshpal/expo-pdf/commit/3a34f39) by [@kishannareshpal](https://github.com/kishannareshpal))

## 0.2.1 - 2026-01-09

_This version does not introduce any user-facing changes._

### 💡 Others

- Reduce package size by removing lock files from the package bundle ([f9be18c](https://github.com/kishannareshpal/expo-pdf/commit/f9be18c) by [@kishannareshpal](https://github.com/kishannareshpal))

## 0.2.0 - 2026-01-09

### 🎉 New features

- Add support for the `autoScale` prop to control scaling on view resize ([#5](https://github.com/kishannareshpal/expo-pdf/pull/5) by [@kishannareshpal](https://github.com/kishannareshpal))

### 💡 Others

- Added a new example for bottom sheet to showcase the use of the new `autoScale` prop ([#6](https://github.com/kishannareshpal/expo-pdf/pull/6) by [@kishannareshpal](https://github.com/kishannareshpal))

## 0.1.0 - 2026-01-06

_Initial release with all features documented in README.md_
