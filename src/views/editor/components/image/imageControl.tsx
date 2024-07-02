import { useMainThemeContext } from "@/mainThemeContext";
import { MousePosition, assert, notNullOrThrowDev } from "@/utils";
import { Metric } from "@/utils/types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DEV } from "@systems/environment/environment";

import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

interface ImageControlsStyles {
  topControl: CSSProperties;
  bottomControl: CSSProperties;
  leftControl: CSSProperties;
  rightControl: CSSProperties;

  topLeftControl: CSSProperties;
  topRightControl: CSSProperties;
  bottomLeftControl: CSSProperties;
  bottomRightControl: CSSProperties;
}

enum ResizeDirection {
  None = 0,

  Left = 1 << 0,
  Right = 1 << 1,
  Horizontal = Left | Right,

  Top = 1 << 2,
  Bottom = 1 << 3,
  Vertical = Top | Bottom,

  TopLeft = Top | Left,
  BottomRight = Bottom | Right,

  TopRight = Top | Right,
  BottomLeft = Bottom | Left,
}

interface ImageControlProps {
    imageElement: HTMLImageElement | null;
    inputElement: HTMLElement | null;
    updateImageSize(width: number, height: number): void;
}

interface OffsetLimits {
  min: number,
  max: number,
}

export function ImageControl({imageElement, inputElement, updateImageSize}: ImageControlProps) {
  const [editor] = useLexicalComposerContext();

  const {
    editorTheme: {
      imageTheme: { control: imageControl },
    },
  } = useMainThemeContext();

  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(
    ResizeDirection.None
  );
  const [markerStyle, setMarkerStyle] = useState<CSSProperties>({
      zIndex: 4,
      position: "absolute",
      backgroundColor: "transparent",
      visibility: "visible",
      left: `0%`,
      top: `0%`,
      width: `100%`,
      height: `100%`,
  });

  const mouseStartPositionRef = useRef<MousePosition>({ x: -1, y: -1 });
  const mouseCurrentPositionRef = useRef<MousePosition>({ x: -1, y: -1 });
  const imageSizeRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: -1, y: -1, width: -1, height: -1 });

  const offetLimitsRef = useRef<{
    top: OffsetLimits;
    bottom: OffsetLimits;
    left: OffsetLimits;
    right: OffsetLimits;
  }>({
    top: { min: 0, max: 0 },
    bottom: { min: 0, max: 0 },
    left: { min: 0, max: 0 },
    right: { min: 0, max: 0 },
  });

  const markerElementRef = useRef<HTMLDivElement>(null);

  const initStyles = useMemo(
    () => {
      const styles: ImageControlsStyles = {
        topControl: {},
        bottomControl: {},
        leftControl: {},
        rightControl: {},
  
        topLeftControl: {},
        topRightControl: {},
        bottomLeftControl: {},
        bottomRightControl: {},
      };

      const anchorSize = imageControl.anchorSize;
      const anchorHalfSize = imageControl.anchorSize * 0.5;
  
      const commonStyle: CSSProperties = {
          zIndex: 4,
          position: "absolute",
          width: `${anchorSize}px`,
          height: `${anchorSize}px`,
      };
      styles.topControl = structuredClone(commonStyle);
      styles.bottomControl = structuredClone(commonStyle);
      styles.leftControl = structuredClone(commonStyle);
      styles.rightControl = structuredClone(commonStyle);
  
      styles.topLeftControl = structuredClone(commonStyle);
      styles.topRightControl = structuredClone(commonStyle);
      styles.bottomLeftControl = structuredClone(commonStyle);
      styles.bottomRightControl = structuredClone(commonStyle);
    
      styles.topControl.left = `calc(50% - ${anchorHalfSize}px)`;
      styles.topControl.top = `${-anchorHalfSize}px`;
      styles.topControl.cursor = "n-resize";
  
      styles.bottomControl.left = `calc(50% - ${anchorHalfSize}px)`;
      styles.bottomControl.top = `calc(100% - ${anchorHalfSize}px)`;
      styles.bottomControl.cursor = "s-resize";
  
      styles.leftControl.left = `${-anchorHalfSize}px`;
      styles.leftControl.top = `calc(50% - ${anchorHalfSize}px`;
      styles.leftControl.cursor = "w-resize";
  
      styles.rightControl.left = `calc(100% - ${anchorHalfSize}px)`;
      styles.rightControl.top = `calc(50% - ${anchorHalfSize}px`;
      styles.rightControl.cursor = "e-resize";
  
      styles.topLeftControl.left = `${-anchorHalfSize}px`;
      styles.topLeftControl.top = `${-anchorHalfSize}px`;
      styles.topLeftControl.cursor = "nw-resize";
  
      styles.topRightControl.left = `calc(100% - ${anchorHalfSize}px)`;
      styles.topRightControl.top = `${-anchorHalfSize}px`;
      styles.topRightControl.cursor = "ne-resize";
  
      styles.bottomLeftControl.left = `${-anchorHalfSize}px`;
      styles.bottomLeftControl.top = `calc(100% - ${anchorHalfSize}px`;
      styles.bottomLeftControl.cursor = "sw-resize";
  
      styles.bottomRightControl.left = `calc(100% - ${anchorHalfSize}px)`;
      styles.bottomRightControl.top = `calc(100% - ${anchorHalfSize}px`;
      styles.bottomRightControl.cursor = "se-resize";

      return styles;
    },
    [imageControl.anchorSize]
  );

  const processResize = useCallback(
    (shiftKey: boolean) => {
      if (resizeDirection == ResizeDirection.None) return;

      const offset = {
        x: mouseCurrentPositionRef.current.x - mouseStartPositionRef.current.x,
        y: mouseCurrentPositionRef.current.y - mouseStartPositionRef.current.y,
      };

      if (shiftKey) {
        const useYOffset = Math.abs(offset.x) > Math.abs(offset.y);

        if ( useYOffset ) {
          offset.y = (offset.x * imageSizeRef.current.height) / imageSizeRef.current.width;
        } else {
          offset.x = (offset.y * imageSizeRef.current.width) / imageSizeRef.current.height;
        }
      }
      const currentMarkerStyle: CSSProperties = {};

      if ( (resizeDirection & ResizeDirection.Left) !== 0 ) {
        offset.x = Math.max( offetLimitsRef.current.left.min, Math.min(offetLimitsRef.current.left.max, offset.x) );
        currentMarkerStyle.width = `calc( 100% - ${offset.x}px )`;
        currentMarkerStyle.left = `${offset.x}px`;
      }
      
      if ( (resizeDirection & ResizeDirection.Right) !== 0 ) {
        offset.x = Math.max( offetLimitsRef.current.right.min, Math.min(offetLimitsRef.current.right.max, offset.x) );
        currentMarkerStyle.width = `calc( 100% + ${offset.x}px )`;
      }

      if ( ( resizeDirection & ResizeDirection.Top ) !== 0 ) {
        offset.x = Math.max( offetLimitsRef.current.top.min, Math.min(offetLimitsRef.current.top.max, offset.x) );
        currentMarkerStyle.height =  `calc( 100% - ${offset.y}px )`;
        currentMarkerStyle.top = `${offset.y}px`;
      }
      if ( ( resizeDirection & ResizeDirection.Bottom ) !== 0 ) {
        offset.x = Math.max( offetLimitsRef.current.bottom.min, Math.min(offetLimitsRef.current.bottom.max, offset.x) );
        currentMarkerStyle.height =  `calc( 100% + ${offset.y}px )`;
      }

      setMarkerStyle((current) => {
        return { ...current, ...currentMarkerStyle };
      });
    },
    [resizeDirection]
  );

  const startResizingImage = useCallback(
    (direction: ResizeDirection): React.MouseEventHandler<HTMLDivElement> =>
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Store mouse start position
        notNullOrThrowDev(inputElement);
        const rootElement = inputElement.parentElement;
        notNullOrThrowDev(rootElement);

        mouseStartPositionRef.current = { x: event.clientX + rootElement.scrollLeft, y: event.clientY + rootElement.scrollTop };

        // Store image size
        notNullOrThrowDev(imageElement);
        const { x, y, width, height } = imageElement.getBoundingClientRect();
        imageSizeRef.current = { x, y, width, height };

        // Get offsets boundaries
        editor.getEditorState().read(
          () => {
            notNullOrThrowDev(inputElement);

            const containerSize = inputElement.getBoundingClientRect();
            const inputStyle = getComputedStyle(inputElement);

            const paddingLeft = inputStyle.paddingLeft ? Metric.fromString(inputStyle.paddingLeft).value : 0;
            const paddingTop = inputStyle.paddingTop ? Metric.fromString(inputStyle.paddingTop).value : 0;
            const paddingRight = inputStyle.paddingRight ? Metric.fromString(inputStyle.paddingRight).value : 0;
            const paddingBottom = inputStyle.paddingBottom ? Metric.fromString(inputStyle.paddingBottom).value : 0;

            containerSize.x += paddingLeft;
            containerSize.y += paddingTop;
            containerSize.width -= paddingRight + paddingLeft;
            containerSize.height -= paddingBottom + paddingTop;

            const containerRect = { 
              x0: containerSize.x,
              y0: containerSize.y,
              x1: containerSize.x + containerSize.width,
              y1: containerSize.y + containerSize.height,
             };

             const imageRect = { 
              x0: imageSizeRef.current.x,
              y0: imageSizeRef.current.y,
              x1: imageSizeRef.current.x + imageSizeRef.current.width,
              y1: imageSizeRef.current.y + imageSizeRef.current.height,
             };

             offetLimitsRef.current.top = { 
              min: containerRect.y0 - imageRect.y0,
              max: containerRect.y1 - imageRect.y0,
             };
             offetLimitsRef.current.bottom = { 
              min: containerRect.y0 - imageRect.y1,
              max: containerRect.y1 - imageRect.y1,
             };
             offetLimitsRef.current.left = { 
              min: containerRect.x0 - imageRect.x0,
              max: containerRect.x1 - imageRect.x0,
             };
             offetLimitsRef.current.right = { 
              min: containerRect.x0 - imageRect.x1,
              max: containerRect.x1 - imageRect.x1,
             };
        });

        setResizeDirection(direction);

        event.preventDefault();
        event.stopPropagation();
      },
    [editor, imageElement, inputElement]
  );

  
    const onMouseMove = useCallback(
       (event: MouseEvent) => {
          notNullOrThrowDev(inputElement);
          const rootElement = inputElement.parentElement;
          notNullOrThrowDev(rootElement);
          mouseCurrentPositionRef.current = { x: event.clientX + rootElement.scrollLeft, y: event.clientY + rootElement.scrollTop };
          processResize(event.shiftKey);
        },
        [inputElement, processResize]
      );

    const onMouseUp = useCallback(
      () => {
        if (resizeDirection == ResizeDirection.None) return;

          setResizeDirection(ResizeDirection.None);

          notNullOrThrowDev(markerElementRef.current);

          const markerStyle = getComputedStyle(markerElementRef.current);

          const width = Metric.fromString(markerStyle.width).value;
          const height = Metric.fromString(markerStyle.height).value;
          updateImageSize(width, height);
      },
      [resizeDirection, updateImageSize]
    );

    const onKeyChanged = useCallback(
        (event: KeyboardEvent) => {
          if (event.key == "Shift") {
              processResize(event.shiftKey);
          }
      },
      [processResize]
    );

    useEffect(() => {
        DEV(
          () => {
            if ( inputElement ) {
              const rootElement = inputElement.parentElement;
              notNullOrThrowDev(rootElement);

              const rootStyle = getComputedStyle(rootElement);
              assert( rootStyle.overflowY === 'scroll', `Input's root doesn't have scroll! Correct mouse position calculations` );
            }
          }
        );

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("keydown", onKeyChanged);
        document.addEventListener("keyup", onKeyChanged);

        return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("keydown", onKeyChanged);
        document.removeEventListener("keyup", onKeyChanged);
        };
  }, [inputElement, onKeyChanged, onMouseMove, onMouseUp]);

  return (
 
    <>
      <div ref={markerElementRef} className={imageControl.marker} style={markerStyle}></div>

      <div
      className={imageControl.anchor}
      style={initStyles.topControl}
      onMouseDown={startResizingImage(ResizeDirection.Top)}
      ></div>
      <div
      className={imageControl.anchor}
      style={initStyles.bottomControl}
      onMouseDown={startResizingImage(ResizeDirection.Bottom)}
      ></div>
      <div
      className={imageControl.anchor}
      style={initStyles.leftControl}
      onMouseDown={startResizingImage(ResizeDirection.Left)}
      ></div>
      <div
      className={imageControl.anchor}
      style={initStyles.rightControl}
      onMouseDown={startResizingImage(ResizeDirection.Right)}
      ></div>

      <div
      className={imageControl.anchor}
      style={initStyles.topLeftControl}
      onMouseDown={startResizingImage(ResizeDirection.TopLeft)}
      ></div>
      <div
      className={imageControl.anchor}
      style={initStyles.topRightControl}
      onMouseDown={startResizingImage(ResizeDirection.TopRight)}
      ></div>
      <div
      className={imageControl.anchor}
      style={initStyles.bottomLeftControl}
      onMouseDown={startResizingImage(ResizeDirection.BottomLeft)}
      ></div>
      <div
      className={imageControl.anchor}
      style={initStyles.bottomRightControl}
      onMouseDown={startResizingImage(ResizeDirection.BottomRight)}
      ></div>
    </>
   
  );
}
