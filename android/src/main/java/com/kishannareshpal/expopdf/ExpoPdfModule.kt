package com.kishannareshpal.expopdf

import android.net.Uri
import androidx.core.net.toUri
import com.kishannareshpal.expopdf.lib.ContentPadding
import com.kishannareshpal.expopdf.lib.FitMode
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import kotlin.math.roundToInt

class ExpoPdfModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoPdf')` in JavaScript.
    Name("ExpoPdf")

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ExpoPdfView::class) {
      Events("onLoadComplete", "onPageChanged", "onError")

      Prop("uri") { view: ExpoPdfView, uri: String? ->
        view.setUri(uri)
      }

      Prop("password") { view: ExpoPdfView, password: String? ->
        view.setPassword(password)
      }

      Prop("pagingEnabled") { view: ExpoPdfView, enabled: Boolean? ->
        view.setPagingEnabled(enabled)
      }

      Prop("disableDoubleTapToZoom") { view: ExpoPdfView, disabled: Boolean? ->
        view.setDoubleTapZoomEnabled(disabled != true)
      }

      Prop("horizontal") { view: ExpoPdfView, enabled: Boolean? ->
        view.setHorizontalModeEnabled(enabled)
      }

      Prop("pageGap") { view: ExpoPdfView, gap: Float? ->
        view.setPageGap(gap?.roundToInt())
      }

      Prop("contentPadding") { view: ExpoPdfView, contentPadding: ContentPadding? ->
        view.setContentPadding(contentPadding?.toRect())
      }

      Prop("fitMode") { view: ExpoPdfView, mode: FitMode? ->
        view.setFitMode(mode)
      }
    }
  }
}
