import { NativeModule, requireNativeModule } from 'expo';

type PdfModuleEvents = {}

declare class PdfModule extends NativeModule<PdfModuleEvents> { }

// This call loads the native module object from the JSI.
export default requireNativeModule<PdfModule>('ExpoPdf');
