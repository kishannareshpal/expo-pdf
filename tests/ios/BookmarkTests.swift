import PDFKit
import XCTest
@testable import KJExpoPdf

@MainActor
final class BookmarkTests: XCTestCase {
  func testNestedBookmarksAndPageNavigation() throws {
    let document = PDFDocument()
    let image = UIGraphicsImageRenderer(size: CGSize(width: 300, height: 400)).image { _ in }
    for index in 0..<2 {
      document.insert(try XCTUnwrap(PDFPage(image: image)), at: index)
    }
    let root = PDFOutline()
    let chapter = PDFOutline()
    chapter.label = "Chapter"
    chapter.destination = PDFDestination(page: try XCTUnwrap(document.page(at: 0)), at: .zero)
    let section = PDFOutline()
    section.label = "Section"
    section.destination = PDFDestination(page: try XCTUnwrap(document.page(at: 1)), at: .zero)
    chapter.insertChild(section, at: 0)
    root.insertChild(chapter, at: 0)
    document.outlineRoot = root
    let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".pdf")
    defer { try? FileManager.default.removeItem(at: url) }
    XCTAssertTrue(document.write(to: url))

    let view = KJExpoPdfView()
    XCTAssertTrue(view.getBookmarks().isEmpty)
    XCTAssertFalse(view.goToPage(0))
    view.setUri(url.absoluteString)
    let bookmarks = view.getBookmarks()
    XCTAssertEqual(bookmarks.count, 1)
    XCTAssertEqual(bookmarks.first?["title"] as? String, "Chapter")
    XCTAssertEqual(bookmarks.first?["pageIndex"] as? Int, 0)
    let children = try XCTUnwrap(bookmarks.first?["children"] as? [[String: Any]])
    XCTAssertEqual(children.first?["title"] as? String, "Section")
    XCTAssertEqual(children.first?["pageIndex"] as? Int, 1)
    XCTAssertTrue(view.goToPage(1))
    let pdf = try XCTUnwrap(view.subviews.compactMap { $0 as? PDFView }.first)
    XCTAssertEqual(pdf.document?.index(for: try XCTUnwrap(pdf.currentPage)), 1)
    XCTAssertFalse(view.goToPage(-1))
    XCTAssertFalse(view.goToPage(2))
  }
}
