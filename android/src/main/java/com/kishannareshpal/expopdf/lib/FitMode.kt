package com.kishannareshpal.expopdf.lib

import com.github.barteksc.pdfviewer.util.FitPolicy
import expo.modules.kotlin.types.Enumerable

enum class FitMode(val value: String) : Enumerable {
  width("width"),
  height("height"),
  both("both");

  fun toFitPolicy(): FitPolicy {
    return when (this) {
      width -> FitPolicy.WIDTH
      height -> FitPolicy.HEIGHT
      both -> FitPolicy.BOTH
    }
  }
}
