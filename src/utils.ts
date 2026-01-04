import { NativeSyntheticEvent } from 'react-native';

export const forwardNativeEventTo = <T,>(handler?: (payload: T) => void) => {
    if (!handler) return undefined;

    return (event: NativeSyntheticEvent<T>) => {
        // Native event includes a "target" property that I think corresponds to the view tag, but this is not needed in my lib
        delete (event.nativeEvent as any).target;

        handler(event.nativeEvent);
    };
}