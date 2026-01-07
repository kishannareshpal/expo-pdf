package com.kishannareshpal.expopdf

import android.content.Context
import android.graphics.Color
import android.graphics.Rect
import android.net.Uri
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import com.github.barteksc.pdfviewer.PDFView
import expo.modules.kotlin.viewevent.EventDispatcher
import java.io.FileNotFoundException
import androidx.core.net.toUri
import com.kishannareshpal.expopdf.lib.FitMode

class KJExpoPdfView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  companion object {
    internal val DEFAULT_PAGING_ENABLED = false
    internal val DEFAULT_DOUBLE_TAP_ZOOM_ENABLED = true
    internal val DEFAULT_HORIZONTAL_MODE_ENABLED = false
    internal val DEFAULT_PAGE_GAP = 0
    internal val DEFAULT_CONTENT_PADDING = Rect(0, 0, 0, 0)
    internal val DEFAULT_FIT_MODE = FitMode.both
  }

  private val onLoadComplete by EventDispatcher()
  private val onPageChanged by EventDispatcher()
  private val onError by EventDispatcher()

  internal enum class ErrorCode(val code: String) {
    invalidUri("invalid_uri"),
    invalidDocument("invalid_document"),
    passwordRequired("password_required"),
    passwordIncorrect("password_incorrect")
  }

  private var uri: Uri? = null
  private var password: String? = null
  private var isPagingEnabled: Boolean = DEFAULT_PAGING_ENABLED
  private var isDoubleTapZoomEnabled: Boolean = DEFAULT_DOUBLE_TAP_ZOOM_ENABLED
  private var isHorizontalModeEnabled: Boolean = DEFAULT_HORIZONTAL_MODE_ENABLED
  private var pageGap: Int = DEFAULT_PAGE_GAP
  private var contentPadding: Rect = DEFAULT_CONTENT_PADDING
  private var fitMode: FitMode = DEFAULT_FIT_MODE

  internal val pdfView = PDFView(context, null).apply {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
  }

  init {
    // Set the primitive PdfView's content background to transparent so that it inherits
    // the color from the React Native view (ExpoView), as defined by the
    // style prop in the component (`style={{ backgroundColor: '#eee' }}`).
    this.pdfView.setBackgroundColor(Color.TRANSPARENT)

    addView(this.pdfView)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    this.pdfView.recycle()
  }

  fun setUri(uri: String?) {
    if (uri == null) {
      this.reportError(ErrorCode.invalidUri, "No URI provided")
      return
    }

    try {
      this.uri = uri.toUri()
    } catch (_: Exception) {
      this.reportError(ErrorCode.invalidUri, "The provided URI is invalid")
    }

    this.reloadPdf()
  }

  fun setPassword(password: String?) {
    this.password = password;
    this.reloadPdf()
  }

  fun setPagingEnabled(enabled: Boolean?) {
    this.isPagingEnabled = enabled ?: DEFAULT_PAGING_ENABLED
    this.reloadPdf()
  }

  fun setDoubleTapZoomEnabled(enabled: Boolean?) {
    this.isDoubleTapZoomEnabled = enabled ?: DEFAULT_DOUBLE_TAP_ZOOM_ENABLED
    this.pdfView.enableDoubletap(this.isDoubleTapZoomEnabled)
  }

  fun setHorizontalModeEnabled(enabled: Boolean?) {
    this.isHorizontalModeEnabled = enabled ?: DEFAULT_HORIZONTAL_MODE_ENABLED
    this.reloadPdf()
  }

  fun setPageGap(pageGap: Int?) {
    this.pageGap = pageGap ?: DEFAULT_PAGE_GAP
    this.reloadPdf()
  }

  fun setContentPadding(rect: Rect?) {
    this.contentPadding = rect ?: DEFAULT_CONTENT_PADDING
    this.reloadPdf()
  }

  fun setFitMode(mode: FitMode?) {
    this.fitMode = mode ?: DEFAULT_FIT_MODE
    this.reloadPdf()
  }

  private fun reloadPdf() {
    if (!this.pdfView.isRecycled) {
      this.pdfView.recycle()
    }

    val currentUri = this.uri ?: return

    val pdfBuilder = try {
      if (currentUri.scheme == "content") {
        val contentResolver = context.contentResolver
        val inputStream = contentResolver.openInputStream(currentUri)
          ?: throw FileNotFoundException("Could not open input stream for the provided URI: $currentUri")
        this.pdfView.fromStream(inputStream)
      } else {
        this.pdfView.fromUri(currentUri)
      }
    } catch (e: Exception) {
      this.reportError(ErrorCode.invalidDocument, e.message.toString())
      return
    }

    pdfBuilder
      .pageFitPolicy(this.fitMode.toFitPolicy())
      .enableDoubletap(this.isDoubleTapZoomEnabled)
      .swipeHorizontal(this.isHorizontalModeEnabled)
      .spacing(this.pageGap)
      .contentPadding(
        this.contentPadding.left,
        this.contentPadding.top,
        this.contentPadding.right,
        this.contentPadding.bottom
      )
      .onLoad { pageCount ->
        this.onLoadComplete(
          mapOf(
            "pageCount" to pageCount
          )
        )
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
      pdfBuilder
        .onError { e ->
          // PDF fails to load if it's NOT pw protected AND a password is provided.
          // - For this reason, the first time we load the pdf, we check if we have received the pw
          //   required error and retry loading the PDF with password provided
          if (e.message.toString().lowercase().contains("password required")) {
            if (this.password == null) {
              this.reportError(
                ErrorCode.passwordRequired,
                "PDF requires a password, but no password was provided"
              )
            } else {
              // Password has been provided, so re-attempt a load
              pdfBuilder
                .password(this.password)
                .onError {
                  this.reportError(
                    ErrorCode.passwordIncorrect,
                    "The provided password was incorrect"
                  )
                }
                .load()
            }
          }
        }
        .load()
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    this.pdfView.isRecycled.let {
      this.reloadPdf()
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
