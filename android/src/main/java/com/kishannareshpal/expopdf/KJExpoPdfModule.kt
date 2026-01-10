package com.kishannareshpal.expopdf

import android.net.Uri
import androidx.core.net.toUri
import com.kishannareshpal.expopdf.lib.ContentPadding
import com.kishannareshpal.expopdf.lib.FitMode
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import kotlin.math.roundToInt

class KJExpoPdfModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoPdf')` in JavaScript.
    Name("KJExpoPdf")

    View(KJSpecView::class)

    View(KJExpoPdfView::class) {
      Events("onLoadComplete", "onPageChanged", "onError")

      Prop("uri") { view: KJExpoPdfView, uri: String? ->
        view.setUri(uri)
      }

      Prop("password") { view: KJExpoPdfView, password: String? ->
        view.setPassword(password)
      }

      Prop("pagingEnabled") { view: KJExpoPdfView, enabled: Boolean? ->
        view.setPagingEnabled(enabled)
      }

      Prop("doubleTapToZoom") { view: KJExpoPdfView, enabled: Boolean? ->
        view.setDoubleTapZoomEnabled(enabled)
      }

      Prop("horizontal") { view: KJExpoPdfView, enabled: Boolean? ->
        view.setHorizontalModeEnabled(enabled)
      }

      Prop("pageGap") { view: KJExpoPdfView, gap: Float? ->
        view.setPageGap(gap?.roundToInt())
      }

      Prop("contentPadding") { view: KJExpoPdfView, contentPadding: ContentPadding? ->
        view.setContentPadding(contentPadding?.toRect())
      }

      Prop("fitMode") { view: KJExpoPdfView, mode: FitMode? ->
        view.setFitMode(mode)
      }

      Prop("autoScale") { view: KJExpoPdfView, enabled: Boolean? ->
         view.setAutoScaleEnabled(enabled)
      }
    }
  }
}
