import ExpoModulesCore

public class ExpoPdfModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoPdf')` in JavaScript.
    Name("ExpoPdf")

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoPdfView.self) {
      Events("onLoadComplete", "onPageChanged", "onError")

      Prop("uri") { (view: ExpoPdfView, uri: String) in
        view.setUri(uri)
      }

      Prop("password") { (view: ExpoPdfView, password: String?) in
        if let password {
          view.setPassword(password)
        } else {
          view.resetPassword()
        }
      }

      Prop("pagingEnabled") { (view: ExpoPdfView, enabled: Bool?) in
        if let enabled {
          view.setPagingEnabled(enabled)
        } else {
          view.resetPagingEnabled()
        }
      }

      Prop("disableDoubleTapToZoom") { (view: ExpoPdfView, disabled: Bool?) in
        if let disabled {
          view.setDoubleTapZoomEnabled(!disabled)
        } else {
          view.resetDoubleTapZoomEnabled()
        }
      }

      Prop("horizontal") { (view: ExpoPdfView, enabled: Bool?) in
        if let enabled {
          view.setHorizontalModeEnabled(!enabled)
        } else {
          view.resetHorizontalModeEnabled()
        }
      }

      Prop("pageGap") { (view: ExpoPdfView, gap: CGFloat?) in
        if let gap {
          view.setPageGap(gap)
        } else {
          view.resetPageGap()
        }
      }
    }
  }
}
