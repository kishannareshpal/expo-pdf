package com.kishannareshpal.expopdf.lib

import android.graphics.Rect
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ContentPadding: Record {
  @Field
  val left: Float = 0f

  @Field
  val top: Float = 0f

  @Field
  val right: Float = 0f

  @Field
  val bottom: Float = 0f

  fun toRect(): Rect {
    return Rect(this.left.toInt(), this.top.toInt(), this.right.toInt(), this.bottom.toInt())
  }
}
