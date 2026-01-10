package com.kishannareshpal.expopdf

import android.annotation.SuppressLint
import android.content.Context
import android.view.ContextThemeWrapper
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.os.bundleOf
import androidx.fragment.compose.AndroidFragment
import androidx.pdf.viewer.fragment.PdfViewerFragment
import com.kishannareshpal.expopdf.theme.KJTheme
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView

data class KJSpecProps(
  val uri: MutableState<String> = mutableStateOf(""),
) : ComposeProps

@SuppressLint("ViewConstructor")
class KJSpecView(context: Context, appContext: AppContext)
  : ExpoComposeView<KJSpecProps>(context, appContext, withHostingView = true) {

  override val props = KJSpecProps()

  @OptIn(ExperimentalMaterial3Api::class)
  @Composable
  override fun Content(modifier: Modifier) {
    KJTheme {
      AndroidFragment<PdfViewerFragment>(
        arguments = bundleOf(
          "documentUri" to props.uri.value
        ),
        modifier = modifier,
      )
    }
  }
}
