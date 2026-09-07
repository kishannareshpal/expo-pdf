import PDFKit
import XCTest
@testable import KJExpoPdf

@MainActor
final class LayoutTests: XCTestCase {
  func testPagingFitsWithinHorizontalPadding() async throws {
    let view = KJExpoPdfView()
    let controller = UIViewController()
    controller.view = view
    let window = UIWindow(frame: CGRect(x: 0, y: 0, width: 400, height: 800))
    window.rootViewController = controller
    window.makeKeyAndVisible()
    defer { window.isHidden = true }
    let document = PDFDocument()
    let image = UIGraphicsImageRenderer(size: CGSize(width: 300, height: 400)).image { _ in }
    document.insert(try XCTUnwrap(PDFPage(image: image)), at: 0)
    let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".pdf")
    defer { try? FileManager.default.removeItem(at: url) }
    XCTAssertTrue(document.write(to: url))
    view.setFitMode(.width)
    view.setPagingEnabled(true)
    view.setContentPadding(UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16))
    view.setUri(url.absoluteString)
    view.layoutIfNeeded()
    await withCheckedContinuation { continuation in
      DispatchQueue.main.async { DispatchQueue.main.async { continuation.resume() } }
    }
    let pdf = try XCTUnwrap(view.subviews.compactMap { $0 as? PDFView }.first)
    let page = try XCTUnwrap(pdf.currentPage)
    let frame = pdf.convert(page.bounds(for: pdf.displayBox), from: page)
    XCTAssertEqual(frame.minX, 16, accuracy: 1)
    XCTAssertEqual(frame.maxX, pdf.bounds.width - 16, accuracy: 1)
    view.setContentPadding(UIEdgeInsets(top: 16, left: 32, bottom: 16, right: 8))
    await withCheckedContinuation { continuation in
      DispatchQueue.main.async { DispatchQueue.main.async { continuation.resume() } }
    }
    let asymmetricFrame = pdf.convert(page.bounds(for: pdf.displayBox), from: page)
    XCTAssertEqual(asymmetricFrame.minX, 32, accuracy: 1)
    XCTAssertEqual(asymmetricFrame.maxX, pdf.bounds.width - 8, accuracy: 1)
  }

  func testPagingUsesTheNativePageController() throws {
    let view = KJExpoPdfView()
    let pdf = try XCTUnwrap(view.subviews.compactMap { $0 as? PDFView }.first)
    view.setFitMode(.width)
    view.setContentPadding(UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16))
    view.setPageGap(8)
    view.setPagingEnabled(true)
    XCTAssertTrue(pdf.isUsingPageViewController)
    XCTAssertEqual(pdf.displayDirection, .vertical)
    view.setHorizontalModeEnabled(true)
    XCTAssertTrue(pdf.isUsingPageViewController)
    XCTAssertEqual(pdf.displayDirection, .horizontal)
    view.setPagingEnabled(false)
    XCTAssertFalse(pdf.isUsingPageViewController)
    XCTAssertEqual(pdf.displayMode, .singlePageContinuous)
  }

  func testDirectionChangesMoveExistingPageGapToTheNewAxis() throws {
    let view = KJExpoPdfView()
    let pdf = try XCTUnwrap(view.subviews.compactMap { $0 as? PDFView }.first)
    view.setPageGap(16)
    view.setHorizontalModeEnabled(true)
    XCTAssertEqual(pdf.pageBreakMargins.right, 16)
    XCTAssertEqual(pdf.pageBreakMargins.bottom, 0)
    view.setHorizontalModeEnabled(false)
    XCTAssertEqual(pdf.pageBreakMargins.right, 0)
    XCTAssertEqual(pdf.pageBreakMargins.bottom, 16)
  }

  func testInvalidAvailableSizePreservesTheLastValidScale() throws {
    let pdf = PDFView(frame: CGRect(x: 0, y: 0, width: 300, height: 400))
    let document = PDFDocument()
    let image = UIGraphicsImageRenderer(size: CGSize(width: 300, height: 400)).image { _ in }
    document.insert(try XCTUnwrap(PDFPage(image: image)), at: 0)
    pdf.document = document
    pdf.layoutDocumentView()
    pdf.scaleFactor = 1
    pdf.minScaleFactor = 1
    pdf.scaleToFit(contentPadding: UIEdgeInsets(top: 0, left: 400, bottom: 0, right: 0), fitMode: .width, scrollContentPadding: .zero)
    XCTAssertEqual(pdf.scaleFactor, 1)
    XCTAssertEqual(pdf.minScaleFactor, 1)
    pdf.scaleToFit(contentPadding: UIEdgeInsets(top: 500, left: 0, bottom: 0, right: 0), fitMode: .height, scrollContentPadding: .zero)
    XCTAssertEqual(pdf.scaleFactor, 1)
    XCTAssertEqual(pdf.minScaleFactor, 1)
    pdf.frame.size.height = 0
    pdf.scaleToFit(contentPadding: .zero, fitMode: .width, scrollContentPadding: .zero)
    XCTAssertEqual(pdf.scaleFactor, 1)
    XCTAssertEqual(pdf.minScaleFactor, 1)
  }
}
