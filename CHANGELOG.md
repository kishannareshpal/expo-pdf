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

## 0.3.0 - 2026-02-03


### ✨ Features

- feat: support color inversion on ios and android ([8951a5c](https://github.com/kishannareshpal/expo-pdf/commit/8951a5c4162e863cb00f21959afe66509a66890d)) by `Kishan Jadav @ mozexames`


### 📚 Documentation

- docs: color inversion ([bb4ed8f](https://github.com/kishannareshpal/expo-pdf/commit/bb4ed8f527a3201a555da62446e4e33831546e75)) by `Kishan Jadav`


### 🧹 Chores

- chore: add color inversion example ([9c90bae](https://github.com/kishannareshpal/expo-pdf/commit/9c90bae266ca489dfb4cb89bf5b9a3d5ce838e2e)) by `Kishan Jadav`


**Full Changelog**: https://github.com/kishannareshpal/expo-pdf/compare/v0.2.6...v0.3.0


## 0.2.6 - 2026-01-23


### 📚 Documentation

- docs: add lib banner ([280c81d](https://github.com/kishannareshpal/expo-pdf/commit/280c81db748787e6341a3bb46663643620b89225)) by `Kishan Jadav`


**Full Changelog**: https://github.com/kishannareshpal/expo-pdf/compare/v0.2.5...v0.2.6


## 0.2.5 - 2026-01-18


**Full Changelog**: https://github.com/kishannareshpal/expo-pdf/compare/v0.2.4...v0.2.5


## 0.2.4 - 2026-01-18


### 📚 Documentation

- docs: update readme with prior art and uniwind info ([41eed16](https://github.com/kishannareshpal/expo-pdf/commit/41eed169f5f1e8edcaf819e42706020f27bdf5f9)) by `Kishan Jadav`
- docs: fix typo ([75204b4](https://github.com/kishannareshpal/expo-pdf/commit/75204b4b04466b3c62ccb78f3fc28b2472c08e9f)) by `Kishan Jadav`


### 🧹 Chores

- chore: add uniwind styled component example ([592aafd](https://github.com/kishannareshpal/expo-pdf/commit/592aafdc40aed850a733d1f9eadf8c7410de8143)) by `Kishan Jadav`


### 📦 Other Changes

- ci: relax pr req and push directly from ci ([baa6a52](https://github.com/kishannareshpal/expo-pdf/commit/baa6a527771ce25aa8dddca055b8cd77f6874453)) by `Kishan Jadav`
- ci: try admin priv. for merging release pr ([f4f3496](https://github.com/kishannareshpal/expo-pdf/commit/f4f349616e7fc26e4bc68630016ba1825106ad76)) by `Kishan Jadav`
- ci: merge release pr ([90b2b2d](https://github.com/kishannareshpal/expo-pdf/commit/90b2b2dd96aecf4734899d70e85cbf0f878450cc)) by `Kishan Jadav`
- ci: fix changelog update ([ca9f012](https://github.com/kishannareshpal/expo-pdf/commit/ca9f0123887c567e325fab9ddc159a01e49bbae8)) by `Kishan Jadav`
- ci: fix pr not merging on release again ([b933332](https://github.com/kishannareshpal/expo-pdf/commit/b9333328a19d0518192aecfab78f5096726c7c7c)) by `Kishan Jadav`
- ci: fix pr not merging on release ([e3cc3bb](https://github.com/kishannareshpal/expo-pdf/commit/e3cc3bb3f5cc7c19baa8ad97d1229b7d37aee662)) by `Kishan Jadav`
- ci: release to create pr to allow push ([60dfc8a](https://github.com/kishannareshpal/expo-pdf/commit/60dfc8a7058dd84e27d071d5ba317e9e306a5b8f)) by `Kishan Jadav`
- ci: tidy release action summary ([64de3d7](https://github.com/kishannareshpal/expo-pdf/commit/64de3d7607f7625994704a66cdedbad25412b695)) by `Kishan Jadav`
- ci: fix gen release notes format ([14d6d2a](https://github.com/kishannareshpal/expo-pdf/commit/14d6d2a391de506e5c7cb201d8616c5e07d145ed)) by `Kishan Jadav`
- ci: update release notes format to include link to commit and author name ([d4c88fa](https://github.com/kishannareshpal/expo-pdf/commit/d4c88fa4c20cad9aaa8165acec262dbdde62c15b)) by `Kishan Jadav`
- ci: include generated summary notes in action summary ([23412a6](https://github.com/kishannareshpal/expo-pdf/commit/23412a6efb602afd1ec2a0a96ac348d714954f69)) by `Kishan Jadav`
- ci: improve release process, update docs preview ([5503c3e](https://github.com/kishannareshpal/expo-pdf/commit/5503c3ec4bafe49ed7a68a2ec8ce821118ad3757)) by `Kishan Jadav`


**Full Changelog**: https://github.com/kishannareshpal/expo-pdf/compare/v0.2.3...v0.2.4


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
