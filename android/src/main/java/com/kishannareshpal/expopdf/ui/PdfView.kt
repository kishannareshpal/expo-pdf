package com.kishannareshpal.expopdf.ui

import android.annotation.SuppressLint
import android.content.Context
import android.view.ContextThemeWrapper
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.core.net.toUri
import androidx.core.os.bundleOf
import androidx.fragment.compose.AndroidFragment
import com.kishannareshpal.expopdf.R
import com.kishannareshpal.expopdf.ui.pdfview.ThemedPdfViewFragment
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView

data class PdfViewProps(
  val uri: MutableState<String> = mutableStateOf(""),
) : ComposeProps

@SuppressLint("ViewConstructor")
class PdfView(
  context: Context,
  appContext: AppContext
) : ExpoComposeView<PdfViewProps>(
  ContextThemeWrapper(context, R.style.Theme_AndroidPdfView),
  appContext,
  withHostingView = true
) {
  override val props = PdfViewProps()

  @OptIn(ExperimentalMaterial3Api::class)
  @Composable
  override fun Content(modifier: Modifier) {
    AndroidFragment<ThemedPdfViewFragment>(
      arguments = bundleOf(
        "documentUri" to props.uri.value.toUri()
      ),
      modifier = modifier,
    )
  }
}
