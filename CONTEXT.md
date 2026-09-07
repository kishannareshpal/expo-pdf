# Expo PDF

Expo PDF is a native PDF viewer component for React Native and Expo applications. Its language describes how pages fit, scroll, snap, and zoom inside a viewer.

## Language

**Viewer**:
The rectangular area owned by the PDF component in the application layout.
_Avoid_: Container, frame

**Page**:
A single PDF document page rendered inside the viewer. A document has one or more pages.
_Avoid_: Sheet, slide

**Paging**:
A viewing mode where navigation moves page-by-page through snap positions. Paging can be vertical or horizontal.
_Avoid_: Snapping mode

**Continuous Mode**:
A viewing mode where pages are part of one scrollable document flow instead of separate snap positions.
_Avoid_: Free scrolling

**Content Padding**:
The inset around PDF pages inside the viewer. In paging, it defines the default fitted placement of each page and the pan boundary padding around zoomed pages; in continuous mode, it remains scrollable padding around the document flow.
_Avoid_: Margin, safe area

**Default Scale**:
The initial fitted zoom level for a page inside the viewer, computed from the fit mode and content padding.
_Avoid_: Initial zoom, auto scale

**Default Placement**:
The visual position of a page at the default scale. In paging, default placement respects asymmetric content padding rather than always centering the page in the viewer.
_Avoid_: Centering, alignment

**Minimum Scale Factor**:
The smallest zoom level the viewer allows. It may be lower or higher than the default scale when explicitly configured.
_Avoid_: Min zoom

## Example Dialogue

Developer: "Should content padding stop the page from rendering into the padded area after zooming?"

Domain expert: "No. In paging, content padding defines default fitted placement and pan boundaries. Once zoomed in, the page can render across the full viewer, but panning still leaves padding at the page edges."

Developer: "Does continuous mode follow the same rule?"

Domain expert: "No. In continuous mode, content padding is scrollable padding around the document flow."

Developer: "If left and right content padding are different, should the page still be centered?"

Domain expert: "No. In paging, asymmetric content padding changes the page's default placement."
