//
//  PdfViewExtensions.swift
//  Pods
//
//  Created by Kishan Jadav on 05/01/2026.
//

import PDFKit

extension PDFView {
  func scaleToFit(contentPadding: UIEdgeInsets, resetOffset: Bool) {
    guard let page = self.currentPage else {
      return
    }

    let viewSize = self.bounds.size
    let pageSize = page.bounds(for: self.displayBox).size
    guard viewSize.width > 0, pageSize.width > 0 else {
      return
    }
    
    // Calculate the available space (that is, the View size minus the Padding)
    let availableWidth = viewSize.width - contentPadding.left - contentPadding.right
    let availableHeight = viewSize.height - contentPadding.top - contentPadding.bottom
    
    // Determine the scale factor to fit content into available space
    let targetScale: CGFloat = if self.displayDirection == .horizontal {
      // For horizontal scroll, fit content to height
      availableHeight / pageSize.height
    } else {
      // For vertical scroll, fit content to width
      availableWidth / pageSize.width
    }
    
    // Apply new scale factor
    if abs(self.scaleFactor - targetScale) > 0.001 {
      self.minScaleFactor = targetScale // Prevent zooming out further than padding
      self.scaleFactor = targetScale
    }
    
    self.applyContentPadding(contentPadding, resetOffset: resetOffset)
  }
  
  func applyContentPadding(_ contentPadding: UIEdgeInsets, resetOffset: Bool = false) {
    // Iterate through the PDFView's subviews to find the scroll view
    if let scrollView = self.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView {
      scrollView.contentInset = contentPadding

      if resetOffset {
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
          if let tapGesture = gesture as? UITapGestureRecognizer, tapGesture.numberOfTapsRequired == 2 {
            // Disable the double-tap recognizer
            tapGesture.isEnabled = enabled
          }
        }
      }
      
      // Sometimes the gesture is deeper, so we check sub-subviews (like the document view)
      for internalSubview in subview.subviews {
        if let gestureRecognizers = internalSubview.gestureRecognizers {
          for gesture in gestureRecognizers {
            if let tapGesture = gesture as? UITapGestureRecognizer, tapGesture.numberOfTapsRequired == 2 {
              tapGesture.isEnabled = enabled
            }
          }
        }
      }
    }
  }
}
