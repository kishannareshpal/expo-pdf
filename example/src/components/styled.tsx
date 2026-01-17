import { PdfView as PdfViewPrimitive } from "@kishannareshpal/expo-pdf";
import { ComponentProps } from "react";
import { withUniwind } from "uniwind";

/**
 * A styled version of the PdfView primitive that uses the uniwind library to apply styles.
 * - Only difference with the original PdfView primitive is that this supports the `className` prop for easy customizations.
 */
export const StyledPdfViewPrimitive = withUniwind(PdfViewPrimitive);
export type StyledPdfViewPrimitiveProps = ComponentProps<typeof StyledPdfViewPrimitive>;
