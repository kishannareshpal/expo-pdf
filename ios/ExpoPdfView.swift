import ExpoModulesCore
import PDFKit
import SwiftUI

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class ExpoPdfView: ExpoView {
  let pdfView = PDFView()

  let onLoadComplete = EventDispatcher()
  let onPageChanged = EventDispatcher()
  let onError = EventDispatcher()

  enum ErrorCode: String, Codable {
    case noUrl = "no_url"
    case invalidUrl = "invalid_url"
    case invalidDocument = "invalid_document"
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    clipsToBounds = true

    setupPdfView()
    addSubview(pdfView)
    setupListeners()
  }

  override func layoutSubviews() {
    pdfView.frame = bounds
  }

  func load(url: URL?) {
    if self.pdfView.document?.documentURL == url {
      return
    }

    guard let url = url else {
      self.reportError(code: .noUrl, "No URL provided for PDF document")
      return
    }

    guard ["http", "https", "file"].contains(url.scheme?.lowercased()) else {
      self.reportError(
        code: .invalidUrl,
        "URL scheme '\(url.scheme ?? "unknown")' is not supported. Use http, https, or file"
      )
      return
    }

    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      guard let self = self else { return }

      if let document = PDFDocument(url: url) {
        DispatchQueue.main.async {
          self.pdfView.document = document

          // Dispatch load complete event
          self.onLoadComplete([
            "pageCount": document.pageCount
          ])
        }
      } else {
        DispatchQueue.main.async {
          self.reportError(
            code: .invalidDocument,
            "Failed to parse PDF document. The file may be corrupted or not a valid PDF"
          )
        }
      }
    }
  }

  private func setupPdfView() {
    // Set the PDFView's content background to transparent so that it inherits
    // the color from the React Native view (ExpoView), as defined by the
    // style prop in the component (`style={{ backgroundColor: 'bla' }}`).
    self.pdfView.backgroundColor = .clear

    // Automatically fit the PDF to the container width/height
    self.pdfView.autoScales = true

    self.pdfView.displayMode = .singlePageContinuous
    self.pdfView.displayDirection = .vertical
  }

  private func setupListeners() {
    // Listen for page / navigation changes
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handlePageChange),
      name: .PDFViewPageChanged,
      object: pdfView
    )
  }

  private func dispose() {
    NotificationCenter.default.removeObserver(self)
  }

  private func reportError(code: ErrorCode, _ message: String) {
    self.onError([
      "error": code.rawValue,
      "message": message,
    ])
  }

  @objc private func handlePageChange(notification: Notification) {
    guard let currentPage = pdfView.currentPage,
      let document = pdfView.document
    else {
      return
    }

    let pageIndex = document.index(for: currentPage)

    self.onPageChanged([
      "pageIndex": pageIndex,
      "pageCount": document.pageCount,
    ])
  }

  deinit {
    self.dispose()
  }
}
