//
//  ContentPadding.swift
//  Pods
//
//  Created by Kishan Jadav on 05/01/2026.
//

import ExpoModulesCore

struct ContentPadding: Record {
  @Field
  var left: Int = 0
  
  @Field
  var top: Int = 0
  
  @Field
  var right: Int = 0
  
  @Field
  var bottom: Int = 0
  
  func toEdgeInset() -> UIEdgeInsets {
    UIEdgeInsets(top: CGFloat(self.top), left: CGFloat(self.left), bottom: CGFloat(self.bottom), right: CGFloat(self.right))
  }
}
