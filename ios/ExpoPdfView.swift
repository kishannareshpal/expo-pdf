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
  private var contentInset: UIEdgeInsets = UIEdgeInsets(top: 50, left: 10, bottom: 50, right: 50)

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    clipsToBounds = true

    addSubview(pdfView)
    setupListeners()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    pdfView.frame = bounds
    
    // Maintain insets on rotation, but don't reset reading position
    self.updateScaleToFitInsets(resetPosition: false)
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

    self.pdfView.autoScales = false
    self.pdfView.displayMode = isPagingEnabled ? .singlePage : .singlePageContinuous
    self.pdfView.displayDirection = isHorizontalModeEnabled ? .horizontal : .vertical

    pdfView.pageBreakMargins = UIEdgeInsets(
      top: 0,
      left: 0,
      bottom: isHorizontalModeEnabled ? 0 : pageGap,
      right: isHorizontalModeEnabled ? pageGap : 0
    )
    self.pdfView.document = document
    
    // Dispatch async to allow PDFView to finish its initial layout
    // then force the offset to respect the top inset.
    DispatchQueue.main.async {
      self.updateScaleToFitInsets(resetPosition: true)
    }

    self.onLoadComplete([
      "pageCount": document.pageCount
    ])
  }
  
  // Update this function signature
  private func enforceContentInset(resetPosition: Bool = false) {
    if let scrollView = pdfView.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView {
      
      scrollView.contentInset = self.contentInset
      scrollView.scrollIndicatorInsets = self.contentInset
      
      // If this is a fresh load, we must manually shift the offset
      // so the content starts BELOW the inset, not BEHIND it.
      if resetPosition {
        var newOffset = scrollView.contentOffset
        
        if pdfView.displayDirection == .vertical {
          // Vertical Scrolling:
          // Adjust Y to show the top header area.
          newOffset.y = -self.contentInset.top
          
          // IMPORTANT: Do NOT touch 'x'.
          // PDFKit has already calculated the correct 'x' to center the page.
          // If you set x = -left, you shift the PDF off-center.
        } else {
          // Horizontal Scrolling:
          // Adjust X to show the left header area.
          newOffset.x = -self.contentInset.left
          
          // Do NOT touch 'y' for horizontal layouts.
        }
        
        scrollView.contentOffset = newOffset
      }
    }
    
    // Find the internal UIScrollView
//    if let scrollView = pdfView.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView {
//      
//      scrollView.contentInset = self.contentInset
//      scrollView.scrollIndicatorInsets = self.contentInset
//      
//      // If this is a fresh load, we must manually shift the offset
//      // so the content starts BELOW the top inset, not BEHIND it.
//      if resetPosition {
//        scrollView.contentOffset = CGPoint(
//          x: -self.contentInset.left,
//          y: -self.contentInset.top
//        )
//      }
//    }
  }
  
  private func updateScaleToFitInsets(resetPosition: Bool) {
    guard
      let document = pdfView.document,
      let page = pdfView.currentPage
    else { return }
    
    // 1. Get the geometry
    let viewSize = self.bounds.size
    let pageSize = page.bounds(for: pdfView.displayBox).size
    
    guard viewSize.width > 0, pageSize.width > 0 else { return }
    
    // 2. Calculate available space (View Size minus Padding)
    let availableWidth = viewSize.width - contentInset.left - contentInset.right
    let availableHeight = viewSize.height - contentInset.top - contentInset.bottom
    
    // 3. Determine the Scale Factor to fit content into available space
    var targetScale: CGFloat = 1.0
    
    if isHorizontalModeEnabled {
      // For horizontal scroll, fit content to height
      targetScale = availableHeight / pageSize.height
    } else {
      // For vertical scroll, fit content to width
      targetScale = availableWidth / pageSize.width
    }
    
    // 4. Apply the calculated scale
    // Check if scale changed significantly to avoid jitter
    if abs(pdfView.scaleFactor - targetScale) > 0.001 {
      pdfView.minScaleFactor = targetScale // Prevent zooming out further than margins
      pdfView.scaleFactor = targetScale
    }
    
    // 5. Apply Insets to internal ScrollView
    if let scrollView = pdfView.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView {
      scrollView.contentInset = self.contentInset
      scrollView.scrollIndicatorInsets = self.contentInset
      
      // 6. Reset Position (Only on fresh load)
      if resetPosition {
        var newOffset = scrollView.contentOffset
        
        if isHorizontalModeEnabled {
          newOffset.x = -self.contentInset.left
        } else {
          newOffset.y = -self.contentInset.top
        }
        
        scrollView.contentOffset = newOffset
      }
    }
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
