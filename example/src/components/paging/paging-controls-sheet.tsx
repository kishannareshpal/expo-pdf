import { ReactElement } from 'react';

type PagingControlsSheetProps = {
  isPresented: boolean;
  onIsPresentedChange: (isPresented: boolean) => void;
  children: ReactElement;
};

export const PagingControlsSheet = ({
  isPresented,
  children,
}: PagingControlsSheetProps) => {
  if (!isPresented) {
    return null;
  }

  return children;
};
