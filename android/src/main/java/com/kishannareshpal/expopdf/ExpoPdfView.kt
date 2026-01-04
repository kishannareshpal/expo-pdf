package com.kishannareshpal.expopdf

import android.content.Context
import android.graphics.Color
import android.net.Uri
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import com.github.barteksc.pdfviewer.PDFView
import com.github.barteksc.pdfviewer.util.FitPolicy
import expo.modules.kotlin.viewevent.EventDispatcher
import java.io.FileNotFoundException
import androidx.core.net.toUri

class ExpoPdfView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  companion object {
    const val DEFAULT_PASSWORD = ""
    const val DEFAULT_PAGING_ENABLED = false
    const val DEFAULT_DOUBLE_TAP_ZOOM = true
    const val DEFAULT_HORIZONTAL_MODE_ENABLED = false
    const val DEFAULT_PAGE_GAP = 6
  }

  private val onLoadComplete by EventDispatcher()
  private val onPageChanged by EventDispatcher()
  private val onError by EventDispatcher()

  internal enum class ErrorCode(val code: String) {
    invalidUri("invalid_uri"),
    invalidDocument("invalid_document"),
    unknown("unknown"),
  }

  private var uri: Uri? = null
  private var password: String = DEFAULT_PASSWORD
  private var isPagingEnabled: Boolean = DEFAULT_PAGING_ENABLED
  private var isDoubleTapZoomEnabled: Boolean = DEFAULT_DOUBLE_TAP_ZOOM
  private var isHorizontalModeEnabled: Boolean = DEFAULT_HORIZONTAL_MODE_ENABLED
  private var pageGap: Int = DEFAULT_PAGE_GAP

  internal val pdfView = PDFView(context, null).apply {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
  }

  init {
    initPdfView()
    addView(this.pdfView)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    this.pdfView.recycle()
  }

  fun setUri(uri: String?) {
    if (uri == null) {
      this.reportError(ErrorCode.invalidUri, "No document URI provided.")
      return
    }

    try {
      this.uri = uri.toUri()
      this.renderPdf()

    } catch (_: Exception) {
      this.reportError(ErrorCode.invalidUri, "Invalid URI provided: $uri.")
    }
  }

  fun setPassword(password: String) {
    this.password = password;
    this.renderPdf()
  }

  fun resetPassword() {
    this.password = DEFAULT_PASSWORD
    this.renderPdf()
  }

  fun setPagingEnabled(enabled: Boolean) {
    this.isPagingEnabled = enabled
    this.renderPdf()
  }

  fun resetPagingEnabled() {
    this.isPagingEnabled = DEFAULT_PAGING_ENABLED
    this.renderPdf()
  }

  fun setDoubleTapZoomEnabled(enabled: Boolean) {
    this.isDoubleTapZoomEnabled = enabled
    this.renderPdf()
  }

  fun resetDoubleTapZoomEnabled() {
    this.isPagingEnabled = DEFAULT_PAGING_ENABLED
    this.renderPdf()
  }

  fun setHorizontalModeEnabled(enabled: Boolean) {
    this.isHorizontalModeEnabled = enabled
    this.renderPdf()
  }

  fun resetHorizontalModeEnabled() {
    this.isHorizontalModeEnabled = DEFAULT_HORIZONTAL_MODE_ENABLED
    this.renderPdf()
  }

  fun setPageGap(pageGap: Int) {
    this.pageGap = pageGap
    this.renderPdf()
  }

  fun resetPageGap() {
    this.pageGap = DEFAULT_PAGE_GAP
    this.renderPdf()
  }

  private fun renderPdf() {
    // 1. Capture the current state of uri in a local val
    val currentUri = this.uri

    // 2. Perform the null check on the local variable
    if (currentUri == null) {
      this.reportError(ErrorCode.invalidUri, "No document URI provided.")
      return
    }

    val pdfBuilder = if (currentUri.scheme == "content") {
      try {
        val contentResolver = context.contentResolver
        val inputStream = contentResolver.openInputStream(currentUri)
          ?: throw FileNotFoundException("Could not open input stream for URI: $currentUri")

        this.pdfView.fromStream(inputStream)
      } catch (e: Exception) {
        this.reportError(ErrorCode.invalidDocument, e.message.toString())
        return
      }

    } else {
      // Handle file:// or other URIs
      // TODO: Support URLs
      this.pdfView.fromUri(currentUri)
    }


    // Set the primitive PdfView's content background to transparent so that it inherits
    // the color from the React Native view (ExpoView), as defined by the
    // style prop in the component (`style={{ backgroundColor: '#eee' }}`).
    this.pdfView.setBackgroundColor(Color.TRANSPARENT)

    pdfBuilder
      .pageFitPolicy(FitPolicy.BOTH)
      .password(this.password)
      .enableDoubletap(this.isDoubleTapZoomEnabled)
      .swipeHorizontal(this.isHorizontalModeEnabled)
      .spacing(this.pageGap)
      .onError { error ->
        val code = when (error) {
          is FileNotFoundException -> ErrorCode.invalidDocument
          is SecurityException -> ErrorCode.invalidUri
          else -> ErrorCode.unknown
        }

        this.reportError(code, error.message ?: "Unknown error")
      }
      .onLoad {
        this.onLoadComplete(
          mapOf(
            "pageCount" to this.pdfView.pageCount
          )
        );
      }
      .onPageChange { pageIndex, pageCount ->
        this.onPageChanged(
          mapOf(
            "pageIndex" to pageIndex,
            "pageCount" to pageCount
          )
        )
      }

    post {
      pdfBuilder.load()
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    this.pdfView.isRecycled.let {
      this.renderPdf()
    }
  }

  private fun reportError(error: ErrorCode, message: String) {
    this.onError(
      mapOf(
        "code" to error.code,
        "message" to message
      )
    )
  }
}
