package com.kishannareshpal.expopdf.lib

import android.graphics.Rect
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ContentPadding: Record {
  @Field
  val left: Int = 0

  @Field
  val top: Int = 0

  @Field
  val right: Int = 0

  @Field
  val bottom: Int = 0

  fun toRect(): Rect {
    return Rect(this.left, this.top, this.right, this.bottom)
  }
}
