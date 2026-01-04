import ExpoModulesCore
import PDFKit
import SwiftUI

class ExpoPdfView: ExpoView {
  // MARK: - Defaults
  static let DEFAULT_PASSWORD = ""
  static let DEFAULT_PAGING_ENABLED = false
  static let DEFAULT_DOUBLE_TAP_ZOOM = true
  static let DEFAULT_HORIZONTAL_MODE_ENABLED = false
  static let DEFAULT_PAGE_GAP: CGFloat = 6

  let onLoadComplete = EventDispatcher()
  let onPageChanged = EventDispatcher()
  let onError = EventDispatcher()

  enum ErrorCode: String, Codable {
    case invalidUri = "invalid_uri"
    case invalidDocument = "invalid_document"
  }

  private let pdfView = PDFView()

  private var documentURL: URL?
  private var password: String = DEFAULT_PASSWORD
  private var isPagingEnabled: Bool = DEFAULT_PAGING_ENABLED
  private var isDoubleTapZoomEnabled: Bool = DEFAULT_DOUBLE_TAP_ZOOM
  private var isHorizontalModeEnabled: Bool = DEFAULT_HORIZONTAL_MODE_ENABLED
  private var pageGap: CGFloat = DEFAULT_PAGE_GAP

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    clipsToBounds = true

    addSubview(pdfView)
    setupListeners()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    pdfView.frame = bounds
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  func setUri(_ uri: String) {
    guard let parsedURL = URL(string: uri) else {
      reportError(.invalidUri, "Invalid URI provided: \(uri)")
      return
    }

    self.documentURL = parsedURL
    self.renderPdf()
  }

  func setPassword(_ password: String) {
    self.password = password
    self.renderPdf()
  }

  func resetPassword() {
    self.password = Self.DEFAULT_PASSWORD
    self.renderPdf()
  }

  func setPagingEnabled(_ enabled: Bool) {
    self.isPagingEnabled = enabled
    self.renderPdf()
  }

  func resetPagingEnabled() {
    self.isPagingEnabled = Self.DEFAULT_PAGING_ENABLED
    self.renderPdf()
  }

  func setDoubleTapZoomEnabled(_ enabled: Bool) {
    self.isDoubleTapZoomEnabled = enabled
    self.renderPdf()
  }

  func resetDoubleTapZoomEnabled() {
    self.isDoubleTapZoomEnabled = Self.DEFAULT_DOUBLE_TAP_ZOOM
    self.renderPdf()
  }

  func setHorizontalModeEnabled(_ enabled: Bool) {
    self.isHorizontalModeEnabled = enabled
    self.renderPdf()
  }

  func resetHorizontalModeEnabled() {
    self.isHorizontalModeEnabled = Self.DEFAULT_HORIZONTAL_MODE_ENABLED
    self.renderPdf()
  }

  func setPageGap(_ gap: CGFloat) {
    self.pageGap = gap
    self.renderPdf()
  }

  func resetPageGap() {
    self.pageGap = Self.DEFAULT_PAGE_GAP
    self.renderPdf()
  }

  private func renderPdf() {
    guard let document = self.loadDocument() else {
      return
    }

    if document.isLocked {
      if !self.password.isEmpty {
        document.unlock(withPassword: password)
      }
    }

    // Set the primitive PdfView's content background to transparent so that it inherits
    // the color from the React Native view (ExpoView), as defined by the
    // style prop in the component (`style={{ backgroundColor: '#eee' }}`).
    self.pdfView.backgroundColor = .clear

    self.pdfView.autoScales = true
    self.pdfView.displayMode = isPagingEnabled ? .singlePage : .singlePageContinuous
    self.pdfView.displayDirection = isHorizontalModeEnabled ? .horizontal : .vertical

    pdfView.pageBreakMargins = UIEdgeInsets(
      top: 0,
      left: 0,
      bottom: isHorizontalModeEnabled ? 0 : pageGap,
      right: isHorizontalModeEnabled ? pageGap : 0
    )
    self.pdfView.document = document

    self.onLoadComplete([
      "pageCount": document.pageCount
    ])
  }

  private func loadDocument() -> PDFDocument? {
    guard let documentURL else {
      return nil
    }

    // TODO: Apple PDFView supports "http", "https" - but I've not implemented it on Android so for consistency I'm explicitly not allowing it here until then.
    guard ["file"].contains(self.documentURL?.scheme?.lowercased()) else {
      reportError(
        .invalidUri,
        "URL scheme '\(self.documentURL?.scheme ?? "unknown")' is not supported"
      )
      return nil
    }

    guard let document: PDFDocument = PDFDocument(url: documentURL) else {
      self.reportError(
        .invalidDocument,
        "Failed to load PDF document"
      )
      return nil
    }

    return document
  }

  private func setupListeners() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handlePageChange),
      name: .PDFViewPageChanged,
      object: pdfView
    )
  }

  @objc private func handlePageChange() {
    guard
      let page = pdfView.currentPage,
      let document = pdfView.document
    else { return }

    onPageChanged([
      "pageIndex": document.index(for: page),
      "pageCount": document.pageCount,
    ])
  }

  private func reportError(_ code: ErrorCode, _ message: String) {
    onError([
      "code": code.rawValue,
      "message": message,
    ])
  }
}
