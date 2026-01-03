import { NativeModule, requireNativeModule } from 'expo';

import { KishanExpoPdfModuleEvents } from './KishanExpoPdf.types';

declare class KishanExpoPdfModule extends NativeModule<KishanExpoPdfModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<KishanExpoPdfModule>('KishanExpoPdf');
