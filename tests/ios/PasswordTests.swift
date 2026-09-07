import PDFKit
import XCTest
@testable import KJExpoPdf

@MainActor
final class PasswordTests: XCTestCase {
  private func documentURL() throws -> URL {
    let document = PDFDocument()
    let image = UIGraphicsImageRenderer(size: CGSize(width: 300, height: 400)).image { context in
      UIColor.white.setFill()
      context.fill(CGRect(x: 0, y: 0, width: 300, height: 400))
    }
    document.insert(try XCTUnwrap(PDFPage(image: image)), at: 0)
    let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".pdf")
    XCTAssertTrue(document.write(to: url, withOptions: [.userPasswordOption: "secret", .ownerPasswordOption: "owner"]))
    addTeardownBlock { try? FileManager.default.removeItem(at: url) }
    return url
  }

  private func drainEvents() async {
    await withCheckedContinuation { continuation in
      DispatchQueue.main.async { continuation.resume() }
    }
  }

  func testLockedDocumentEmitsOnlyAnError() async throws {
    let view = KJExpoPdfView()
    var loaded = 0
    var errors: [String] = []
    view.onLoadComplete.onEventSent = { _ in loaded += 1 }
    view.onError.onEventSent = { errors.append($0["code"] as! String) }
    view.setUri(try documentURL().absoluteString)
    await drainEvents()
    XCTAssertEqual(errors, ["password_required"])
    XCTAssertEqual(loaded, 0)
  }

  func testChangingOrClearingPasswordReloadsAnUnlockedDocument() async throws {
    let view = KJExpoPdfView()
    var loaded = 0
    var errors: [String] = []
    view.onLoadComplete.onEventSent = { _ in loaded += 1 }
    view.onError.onEventSent = { errors.append($0["code"] as! String) }
    view.setPassword("secret")
    view.setUri(try documentURL().absoluteString)
    await drainEvents()
    XCTAssertEqual(loaded, 1)
    view.setPassword("wrong")
    await drainEvents()
    XCTAssertEqual(errors, ["password_incorrect"])
    XCTAssertEqual(loaded, 1)
    let pdfView = try XCTUnwrap(view.subviews.compactMap { $0 as? PDFView }.first)
    XCTAssertNil(pdfView.document)
    view.setPassword(nil)
    await drainEvents()
    XCTAssertEqual(errors, ["password_incorrect", "password_required"])
    view.setPassword("secret")
    await drainEvents()
    XCTAssertEqual(loaded, 2)
    XCTAssertEqual(pdfView.document?.isLocked, false)
    view.setPassword("secret")
    await drainEvents()
    XCTAssertEqual(loaded, 2)
  }

  func testSupersededDocumentDoesNotEmitLoadComplete() async throws {
    let view = KJExpoPdfView()
    var loaded = 0
    view.onLoadComplete.onEventSent = { _ in loaded += 1 }
    view.setPassword("secret")
    view.setUri(try documentURL().absoluteString)
    view.setPassword("wrong")
    await drainEvents()
    XCTAssertEqual(loaded, 0)
  }
}
