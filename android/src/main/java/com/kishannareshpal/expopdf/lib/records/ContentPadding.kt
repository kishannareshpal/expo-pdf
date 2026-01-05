package com.kishannareshpal.expopdf.lib.records

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
}
