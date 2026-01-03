import { registerWebModule, NativeModule } from 'expo';

import { KishanExpoPdfModuleEvents } from './KishanExpoPdf.types';

class KishanExpoPdfModule extends NativeModule<KishanExpoPdfModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(KishanExpoPdfModule, 'KishanExpoPdfModule');
