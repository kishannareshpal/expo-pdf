package com.kishannareshpal.expopdf.ui.pdfview

import android.os.Build
import android.os.Bundle
import android.view.ContextThemeWrapper
import android.view.LayoutInflater
import androidx.annotation.RequiresExtension
import androidx.pdf.viewer.fragment.PdfViewerFragment
import com.kishannareshpal.expopdf.R

@RequiresExtension(extension = Build.VERSION_CODES.S, version = 13)
class ThemedPdfViewFragment : PdfViewerFragment() {
  override fun onGetLayoutInflater(savedInstanceState: Bundle?): LayoutInflater {
    val base = super.onGetLayoutInflater(savedInstanceState)
    // Apply Material 3 theme to this view as androidx.pdf requires it
    val themedContext = ContextThemeWrapper(requireContext(), R.style.Theme_AndroidPdfView)
    return base.cloneInContext(themedContext)
  }
}
