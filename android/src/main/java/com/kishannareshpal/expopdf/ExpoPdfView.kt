package com.kishannareshpal.expopdf

import android.annotation.SuppressLint
import android.content.Context
import android.content.ContextWrapper
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Build
import android.os.ParcelFileDescriptor
import android.os.ext.SdkExtensions
import android.widget.ImageView
import android.widget.ScrollView
import android.widget.LinearLayout
import androidx.annotation.RequiresExtension
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentContainerView
import androidx.pdf.viewer.fragment.PdfViewerFragment
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import java.io.File
import java.io.FileOutputStream
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ExpoPdfView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onLoad by EventDispatcher()
  private val onError by EventDispatcher()

  private var pdfViewerFragment: PdfViewerFragment? = null
  private var pdfRenderer: PdfRenderer? = null
  private var scrollView: ScrollView? = null
  private var pdfContainerView: FragmentContainerView? = null

  // Helper function to find FragmentActivity from context
  private fun getFragmentActivity(): FragmentActivity? {
    var ctx = context
    while (ctx is ContextWrapper) {
      if (ctx is FragmentActivity) {
        return ctx
      }
      ctx = ctx.baseContext
    }
    return null
  }

  @SuppressLint("NewApi")
  fun load(uri: String) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      loadWithPdfViewerFragment(uri)
    } else {
      loadWithPdfRenderer(uri)
    }
  }

  @RequiresExtension(extension = Build.VERSION_CODES.S, version = 13)
  private fun loadWithPdfViewerFragment(uri: String) {
    try {
      val pdfUri = Uri.parse(uri)

      // Initialize container if not exists
      if (pdfContainerView == null) {
        pdfContainerView = FragmentContainerView(context).apply {
          id = generateViewId()
          layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        }
        removeAllViews()
        addView(pdfContainerView)
      }

      val activity = getFragmentActivity() ?: run {
        onError(mapOf("error" to "Unable to find FragmentActivity context"))
        return
      }

      // Remove existing fragment if any
      pdfViewerFragment?.let {
        activity.supportFragmentManager.beginTransaction()
          .remove(it)
          .commitNow()
      }

      // Create and add new PdfViewerFragment
      val fragment = PdfViewerFragment()
      pdfViewerFragment = fragment

      activity.supportFragmentManager.beginTransaction()
        .replace(pdfContainerView!!.id, fragment)
        .commitNow()

      // Load the PDF document
      fragment.documentUri = pdfUri

      onLoad(mapOf("uri" to uri))
    } catch (e: Exception) {
      onError(mapOf("error" to (e.message ?: "Unknown error occurred")))
    }
  }

  private fun loadWithPdfRenderer(uri: String) {
    GlobalScope.launch(Dispatchers.IO) {
      try {
        val pdfFile = downloadOrGetFile(uri)
        val fileDescriptor = ParcelFileDescriptor.open(
          pdfFile,
          ParcelFileDescriptor.MODE_READ_ONLY
        )

        pdfRenderer?.close()
        pdfRenderer = PdfRenderer(fileDescriptor)

        withContext(Dispatchers.Main) {
          renderPages()
          onLoad(mapOf("uri" to uri))
        }
      } catch (e: Exception) {
        withContext(Dispatchers.Main) {
          onError(mapOf("error" to (e.message ?: "Failed to load PDF")))
        }
      }
    }
  }

  private fun downloadOrGetFile(uri: String): File {
    val pdfUri = Uri.parse(uri)

    return when (pdfUri.scheme) {
      "file" -> File(pdfUri.path!!)
      "content" -> {
        // Handle content URIs
        val tempFile = File(context.cacheDir, "temp_pdf_${System.currentTimeMillis()}.pdf")
        context.contentResolver.openInputStream(pdfUri)?.use { input ->
          FileOutputStream(tempFile).use { output ->
            input.copyTo(output)
          }
        }
        tempFile
      }
      "http", "https" -> {
        // Download file
        val tempFile = File(context.cacheDir, "temp_pdf_${System.currentTimeMillis()}.pdf")
        URL(uri).openStream().use { input ->
          FileOutputStream(tempFile).use { output ->
            input.copyTo(output)
          }
        }
        tempFile
      }
      else -> throw IllegalArgumentException("Unsupported URI scheme: ${pdfUri.scheme}")
    }
  }

  private fun renderPages() {
    val renderer = pdfRenderer ?: return

    // Initialize ScrollView if not exists
    if (scrollView == null) {
      scrollView = ScrollView(context).apply {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      }
      removeAllViews()
      addView(scrollView)
    }

    val container = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      )
    }

    // Render all pages
    for (i in 0 until renderer.pageCount) {
      val page = renderer.openPage(i)

      // Create bitmap with page dimensions
      val bitmap = Bitmap.createBitmap(
        page.width * 2, // Scale up for better quality
        page.height * 2,
        Bitmap.Config.ARGB_8888
      )

      page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
      page.close()

      // Add ImageView for each page
      val imageView = ImageView(context).apply {
        setImageBitmap(bitmap)
        layoutParams = LinearLayout.LayoutParams(
          LinearLayout.LayoutParams.MATCH_PARENT,
          LinearLayout.LayoutParams.WRAP_CONTENT
        )
        adjustViewBounds = true
        setPadding(0, 0, 0, 16) // Add spacing between pages
      }

      container.addView(imageView)
    }

    scrollView?.removeAllViews()
    scrollView?.addView(container)
  }

  init {
    // Container will be added dynamically based on Android version
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    // Clean up PdfViewerFragment
    getFragmentActivity()?.let { activity ->
      pdfViewerFragment?.let { fragment ->
        activity.supportFragmentManager.beginTransaction()
          .remove(fragment)
          .commitNowAllowingStateLoss()
      }
    }
    pdfViewerFragment = null

    // Clean up PdfRenderer
    pdfRenderer?.close()
    pdfRenderer = null
  }
}
