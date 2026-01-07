//
//  PdfViewExtensions.swift
//  Pods
//
//  Created by Kishan Jadav on 05/01/2026.
//

import ExpoModulesCore
import PDFKit

extension PDFView {
  func scaleToFit(contentPadding: UIEdgeInsets, fitMode: FitMode, resetScrollOffset: Bool = false) {
    guard let page = self.currentPage else {
      return
    }

    let viewSize = self.bounds.size
    let pageSize = page.bounds(for: self.displayBox).size

    // Ensure we have valid dimensions to avoid division by zero
    guard viewSize.width > 0, pageSize.width > 0, pageSize.height > 0 else {
      return
    }

    // Calculate the available space (View size minus Padding)
    let availableWidth = viewSize.width - contentPadding.left - contentPadding.right
    let availableHeight = viewSize.height - contentPadding.top - contentPadding.bottom

    // Calculate potential scale factors
    let widthScale = availableWidth / pageSize.width
    let heightScale = availableHeight / pageSize.height

    // Determine the target scale based on the requested FitMode
    let targetScale: CGFloat
    switch fitMode {
    case .width:
      targetScale = widthScale
    case .height:
      targetScale = heightScale
    case .both:
      // "Aspect Fit": Choose the smaller scale to ensure the whole page is visible
      targetScale = min(widthScale, heightScale)
    }

    // Apply new scale factor
    if abs(self.scaleFactor - targetScale) > 0.001 {
      self.minScaleFactor = targetScale  // Prevent zooming out further than the fit
      self.scaleFactor = targetScale
    }

    self.applyContentPadding(contentPadding, resetScrollOffset: resetScrollOffset)
  }

  func applyContentPadding(_ contentPadding: UIEdgeInsets, resetScrollOffset: Bool = false) {
    // Iterate through the PDFView's subviews to find the scroll view
    if let scrollView = self.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView {
      scrollView.contentInset = contentPadding

      if resetScrollOffset {
        var offset = scrollView.contentOffset
        if self.displayDirection == .horizontal {
          offset.x = -contentPadding.left
        } else {
          offset.y = -contentPadding.top
        }
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
