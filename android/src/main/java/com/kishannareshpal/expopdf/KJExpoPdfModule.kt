package com.kishannareshpal.expopdf

import com.kishannareshpal.expopdf.lib.ContentPadding
import com.kishannareshpal.expopdf.lib.FitMode
import com.kishannareshpal.expopdf.ui.LegacyPdfView
import com.kishannareshpal.expopdf.ui.PdfView
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.roundToInt

class KJExpoPdfModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // - See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    // The module will be accessible from `requireNativeModule('KJExpoPdf')` in JavaScript.
    Name("KJExpoPdf")

    View(PdfView::class)

    View(LegacyPdfView::class) {
      Events("onLoadComplete", "onPageChanged", "onError")

      Prop("uri") { view: LegacyPdfView, uri: String? ->
        view.setUri(uri)
      }

      Prop("password") { view: LegacyPdfView, password: String? ->
        view.setPassword(password)
      }

      Prop("pagingEnabled") { view: LegacyPdfView, enabled: Boolean? ->
        view.setPagingEnabled(enabled)
      }

      Prop("doubleTapToZoom") { view: LegacyPdfView, enabled: Boolean? ->
        view.setDoubleTapZoomEnabled(enabled)
      }

      Prop("horizontal") { view: LegacyPdfView, enabled: Boolean? ->
        view.setHorizontalModeEnabled(enabled)
      }

      Prop("pageGap") { view: LegacyPdfView, gap: Float? ->
        view.setPageGap(gap?.roundToInt())
      }

      Prop("contentPadding") { view: LegacyPdfView, contentPadding: ContentPadding? ->
        view.setContentPadding(contentPadding?.toRect())
      }

      Prop("fitMode") { view: LegacyPdfView, mode: FitMode? ->
        view.setFitMode(mode)
      }

      Prop("autoScale") { view: LegacyPdfView, enabled: Boolean? ->
         view.setAutoScaleEnabled(enabled)
      }
    }
  }
}
