import ExpoModulesCore
import PDFKit
import SwiftUI

class ExpoPdfView: ExpoView {
  // MARK: - Defaults
  static let DEFAULT_PAGING_ENABLED = false
  static let DEFAULT_DOUBLE_TAP_ZOOM_ENABLED = true
  static let DEFAULT_HORIZONTAL_MODE_ENABLED = false
  static let DEFAULT_PAGE_GAP = 0
  static let DEFAULT_CONTENT_PADDING = UIEdgeInsets.zero

  let onLoadComplete = EventDispatcher()
  let onPageChanged = EventDispatcher()
  let onError = EventDispatcher()

  enum ErrorCode: String, Codable {
    case invalidUri = "invalid_uri"
    case invalidDocument = "invalid_document"
    case passwordRequired = "password_required"
    case passwordIncorrect = "password_incorrect"
  }

  private let pdfView = PDFView()

  private var documentURL: URL? = nil
  private var password: String? = nil
  private var isPagingEnabled: Bool = DEFAULT_PAGING_ENABLED
  private var isDoubleTapZoomEnabled: Bool = DEFAULT_DOUBLE_TAP_ZOOM_ENABLED
  private var isHorizontalModeEnabled: Bool = DEFAULT_HORIZONTAL_MODE_ENABLED
  private var pageGap: Int = DEFAULT_PAGE_GAP
  private var contentPadding: UIEdgeInsets = DEFAULT_CONTENT_PADDING

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    clipsToBounds = true
    
    // Set the primitive PdfView's content background to transparent so that it inherits
    // the color from the React Native view (ExpoView), as defined by the
    // style prop in the component (`style={{ backgroundColor: '#eee' }}`).
    self.pdfView.backgroundColor = .clear
    self.pdfView.autoScales = false

    addSubview(pdfView)
    
    setupListeners()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    pdfView.frame = bounds
    
    // Maintain insets on rotation, but don't reset reading position
    self.pdfView.scaleToFit(contentPadding: self.contentPadding, resetOffset: false)
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
    self.reloadPdf()
  }

  func setPassword(_ password: String?) {
    self.password = password ?? nil
    
    // Reload the PDF as it needs to perform the unlock attempt
    // if password has been set, or lock if password's been removed
    if self.pdfView.document?.isLocked == true {
      self.reloadPdf()
    }
  }

  func setPagingEnabled(_ enabled: Bool?) {
    self.isPagingEnabled = enabled ?? Self.DEFAULT_PAGING_ENABLED
    self.pdfView.displayMode = self.isPagingEnabled ? .singlePage : .singlePageContinuous
  }

  func setDoubleTapZoomEnabled(_ enabled: Bool?) {
    self.isDoubleTapZoomEnabled = enabled ?? Self.DEFAULT_DOUBLE_TAP_ZOOM_ENABLED
    self.pdfView.toggleDoubleTapToZoom(self.isDoubleTapZoomEnabled)
  }

  func setHorizontalModeEnabled(_ enabled: Bool?) {
    self.isHorizontalModeEnabled = enabled ?? Self.DEFAULT_HORIZONTAL_MODE_ENABLED
    self.pdfView.displayDirection = self.isHorizontalModeEnabled ? .horizontal : .vertical
  }

  func setPageGap(_ gap: Int?) {
    self.pageGap = gap ?? Self.DEFAULT_PAGE_GAP
    self.pdfView.pageBreakMargins = UIEdgeInsets(
      top: 0,
      left: 0,
      bottom: isHorizontalModeEnabled ? 0 : CGFloat(pageGap),
      right: isHorizontalModeEnabled ? CGFloat(pageGap) : 0
    )
    
    // PDFView pageBreakMargins not only apply insets between the pages, but also around the pages
    // which is not what we always want - expo-pdf only uses pageBreakMargins for inter page spacing
    // and we use our contentPadding for the spacing around the document.
    // - Subtract the PDFView pageBreakMargins to prevent double spacing
    var padding = self.contentPadding
    let margins = self.pdfView.pageBreakMargins
    
    padding = UIEdgeInsets(
      top: padding.top - margins.top,
      left: padding.left - margins.left,
      bottom: padding.bottom - margins.bottom,
      right: padding.right - margins.right
    )
    self.pdfView.scaleToFit(contentPadding: self.contentPadding, resetOffset: false)
  }
  
  func setContentPadding(_ padding: UIEdgeInsets?) {
    self.contentPadding = padding ?? Self.DEFAULT_CONTENT_PADDING
    
    // PDFView pageBreakMargins not only apply insets between the pages, but also around the pages
    // which is not what we always want - expo-pdf only uses pageBreakMargins for inter page spacing
    // and we use our contentPadding for the spacing around the document.
    // - Subtract the PDFView pageBreakMargins to prevent double spacing
    var padding = self.contentPadding
    let margins = self.pdfView.pageBreakMargins
    
    padding = UIEdgeInsets(
      top: padding.top - margins.top,
      left: padding.left - margins.left,
      bottom: padding.bottom - margins.bottom,
      right: padding.right - margins.right
    )
    self.pdfView.scaleToFit(contentPadding: self.contentPadding, resetOffset: false)
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

  private func reloadPdf() {
    guard let document = self.loadDocument() else {
      return
    }
    
    if document.isLocked {
      if let password = self.password {
        let unlocked = document.unlock(withPassword: password)
        if !unlocked {
          reportError(
            .passwordIncorrect,
            "The provided password was incorrect"
          )
        }
      } else {
        reportError(
          .passwordRequired,
          "PDF requires a password, but no password was provided"
        )
      }
    }
    
    self.pdfView.document = document

    // Dispatch async to allow PDFView to finish its initial layout
    DispatchQueue.main.async {
      self.pdfView.scaleToFit(contentPadding: self.contentPadding, resetOffset: true)
    }

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
        "Failed to load the PDF document"
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

  private func reportError(_ code: ErrorCode, _ message: String) {
    onError([
      "code": code.rawValue,
      "message": message,
    ])
  }
}
