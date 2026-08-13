//
//  PdfViewExtensions.swift
//  Pods
//
//  Created by Kishan Jadav on 05/01/2026.
//

import ExpoModulesCore
import PDFKit
import UIKit

extension PDFView {
  func scaleToFit(
    contentPadding: UIEdgeInsets,
    fitMode: FitMode,
    minScaleFactor configuredMinScaleFactor: CGFloat? = nil,
    scrollContentPadding: UIEdgeInsets,
    defaultPagePlacementPadding: UIEdgeInsets,
    resetScrollOffset: Bool = false
  ) {
    guard let page = self.currentPage else {
      return
    }

    let viewSize = self.bounds.size
    let pageSize = page.bounds(for: self.displayBox).size

    guard viewSize.width > 0, pageSize.width > 0, pageSize.height > 0 else {
      return
    }

    let availableWidth = viewSize.width - contentPadding.left - contentPadding.right
    let availableHeight = viewSize.height - contentPadding.top - contentPadding.bottom

    guard availableWidth > 0, availableHeight > 0 else {
      return
    }

    let widthScale = availableWidth / pageSize.width
    let heightScale = availableHeight / pageSize.height

    let defaultScale: CGFloat
    switch fitMode {
    case .width:
      defaultScale = widthScale
    case .height:
      defaultScale = heightScale
    case .both:
      defaultScale = min(widthScale, heightScale)
    }

    let effectiveMinScale = configuredMinScaleFactor ?? defaultScale
    let targetScale = max(defaultScale, effectiveMinScale)

    self.performWithoutScaleAnimation {
      self.minScaleFactor = effectiveMinScale

      if abs(self.scaleFactor - targetScale) > 0.001 {
        self.scaleFactor = targetScale
      }

      self.applyContentPadding(scrollContentPadding, resetScrollOffset: resetScrollOffset)
      self.applyDefaultPagePlacement(defaultPagePlacementPadding)
    }
  }

  func applyDefaultPagePlacement(_ contentPadding: UIEdgeInsets) {
    let offset = CGPoint(
      x: (contentPadding.left - contentPadding.right) / 2,
      y: (contentPadding.top - contentPadding.bottom) / 2
    )

    documentView?.transform = CGAffineTransform(
      translationX: offset.x,
      y: offset.y
    )
  }

  func applyContentPadding(_ contentPadding: UIEdgeInsets, resetScrollOffset: Bool = false) {
    for scrollView in self.contentScrollViews {
      let needsInitialOffset = !scrollView.contentInset.matches(contentPadding)

      scrollView.contentInset = contentPadding
      scrollView.scrollIndicatorInsets = contentPadding

      if resetScrollOffset || needsInitialOffset {
        var offset = scrollView.contentOffset
        offset.x = -contentPadding.left
        offset.y = -contentPadding.top
        scrollView.contentOffset = offset
      }
    }
  }

  func toggleDoubleTapToZoom(_ enabled: Bool) {
    // Iterate through the PDFView's subviews to find the scroll view
    for subview in self.subviews {
      if let gestureRecognizers = subview.gestureRecognizers {
        for gesture in gestureRecognizers {
          if let tapGesture = gesture as? UITapGestureRecognizer,
            tapGesture.numberOfTapsRequired == 2
          {
            // Disable the double-tap recognizer
            tapGesture.isEnabled = enabled
          }
        }
      }

      // Sometimes the gesture is deeper, so we check sub-subviews (like the document view)
      for internalSubview in subview.subviews {
        if let gestureRecognizers = internalSubview.gestureRecognizers {
          for gesture in gestureRecognizers {
            if let tapGesture = gesture as? UITapGestureRecognizer,
              tapGesture.numberOfTapsRequired == 2
            {
              tapGesture.isEnabled = enabled
            }
          }
        }
      }
    }
  }
}

private extension PDFView {
  func performWithoutScaleAnimation(_ updates: () -> Void) {
    CATransaction.begin()
    CATransaction.setDisableActions(true)

    UIView.performWithoutAnimation {
      updates()
      self.layoutIfNeeded()
      self.documentView?.layoutIfNeeded()
    }

    CATransaction.commit()
  }

  var contentScrollViews: [UIScrollView] {
    let directScrollViews = subviews
      .compactMap { $0 as? UIScrollView }
      .filter(\.canReceivePdfContentPadding)

    if !directScrollViews.isEmpty {
      return directScrollViews
    }

    return descendantScrollViews.filter(\.canReceivePdfContentPadding)
  }
}

private extension UIScrollView {
  var canReceivePdfContentPadding: Bool {
    !isPagingEnabled
  }
}

private extension UIView {
  var descendantScrollViews: [UIScrollView] {
    subviews.flatMap { subview in
      let nestedScrollViews = subview.descendantScrollViews

      guard let scrollView = subview as? UIScrollView else {
        return nestedScrollViews
      }

      return [scrollView] + nestedScrollViews
    }
  }
}

private extension UIEdgeInsets {
  func matches(_ other: UIEdgeInsets) -> Bool {
    top == other.top &&
      right == other.right &&
      bottom == other.bottom &&
      left == other.left
  }
}
