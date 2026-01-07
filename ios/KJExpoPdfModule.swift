import ExpoModulesCore

public class KJExpoPdfModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoPdf')` in JavaScript.
    Name("KJExpoPdf")

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(KJExpoPdfView.self) {
      Events("onLoadComplete", "onPageChanged", "onError")

      Prop("uri") { (view: KJExpoPdfView, uri: String) in
        view.setUri(uri)
      }

      Prop("password") { (view: KJExpoPdfView, password: String?) in
        view.setPassword(password)
      }

      Prop("pagingEnabled") { (view: KJExpoPdfView, enabled: Bool?) in
        view.setPagingEnabled(enabled)
      }

      Prop("doubleTapToZoom") { (view: KJExpoPdfView, enabled: Bool?) in
        view.setDoubleTapZoomEnabled(enabled)
      }

      Prop("horizontal") { (view: KJExpoPdfView, enabled: Bool?) in
        view.setHorizontalModeEnabled(enabled)
      }

      Prop("pageGap") { (view: KJExpoPdfView, gap: Int?) in
        view.setPageGap(gap)
      }

      Prop("contentPadding") { (view: KJExpoPdfView, contentPadding: ContentPadding?) in
        view.setContentPadding(contentPadding?.toEdgeInset())
      }

      Prop("fitMode") { (view: KJExpoPdfView, fitMode: FitMode?) in
        view.setFitMode(fitMode)
      }

      Prop("autoScale") { (view: KJExpoPdfView, enabled: Bool?) in
        view.setAutoScaleEnabled(enabled)
      }
    }
  }
}
