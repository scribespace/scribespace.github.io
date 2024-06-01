import { useMainThemeContext } from "@/mainThemeContext";
import { appGlobals } from "@/system/appGlobals";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { MousePosition, assert, notNullOrThrowDev, separateValueAndUnit, valueValidOrThrowDev } from "@utils";
import { $getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from "lexical";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { ImageEditor } from "./imageEditor/imageEditor";

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

const MISSING_IMAGE = '/images/no-image.png' as const;

interface ImageProps {
    src?: string;
    width?: number;
    height?: number;
    blob?: Blob;
    imageKey: NodeKey;
    setSrc: ( src: string) => void;
    setWidthHeight: (width: number, height: number) => void;
}

export function Image( { src, width, height, blob, imageKey, setSrc, setWidthHeight } : ImageProps) {
    const [editor] = useLexicalComposerContext();

    const {
        commonTheme: {pulsing}, 
        editorTheme: {imageTheme}, 
        editorTheme: {
            imageTheme: {
                control: imageControl,
                editor: imageEditor
            }
        }
    } = useMainThemeContext();

    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(imageKey);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(ResizeDirection.None);
    const [markerStyle, setMarkerStyle] = useState<CSSProperties>( {} );
    const [controlStyles, setControlStyles] = useState<ImageControlsStyles>( {
        topControl: {},
        bottomControl: {},
        leftControl: {},
        rightControl: {},
        
        topLeftControl: {},
        topRightControl: {},
        bottomLeftControl: {},
        bottomRightControl: {},
    } );
    
    const mouseStartPositionRef = useRef<MousePosition>( {x: -1, y: -1} );
    const mouseCurrentPositionRef = useRef<MousePosition>( {x: -1, y: -1} );
    const imageSizeRef = useRef<{x: number, y: number, width: number, height: number}>( {x: -1, y: -1, width: -1, height: -1} );
    const containerSizeRef = useRef<{x: number, y: number, width: number, height: number}>( {x: -1, y: -1, width: -1, height: -1} );
    const imageEditorRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const processResize = useCallback(
        (shiftKey: boolean) => {
            if ( resizeDirection == ResizeDirection.None ) return;

            const offset = { x: mouseCurrentPositionRef.current.x - mouseStartPositionRef.current.x, y: mouseCurrentPositionRef.current.y - mouseStartPositionRef.current.y };

            let x0 = imageSizeRef.current.x;
            let y0 = imageSizeRef.current.y;
            let x1 = imageSizeRef.current.x + imageSizeRef.current.width;
            let y1 = imageSizeRef.current.y + imageSizeRef.current.height;

            if ( resizeDirection & ResizeDirection.Left ) {
                x0 = mouseCurrentPositionRef.current.x;
                x1 = x0 + imageSizeRef.current.width - offset.x;
            }

            if ( resizeDirection & ResizeDirection.Right ) {
                x1 = x0 + imageSizeRef.current.width + offset.x;
            }

            if ( resizeDirection & ResizeDirection.Top ) {
                y0 = mouseCurrentPositionRef.current.y;
                y1 = y0 + imageSizeRef.current.height - offset.y;
            }

            if ( resizeDirection & ResizeDirection.Bottom ) {
                y1 = y0 + imageSizeRef.current.height + offset.y;
            }

            if ( shiftKey ) {
                if ( (resizeDirection & ResizeDirection.TopLeft) == ResizeDirection.TopLeft ) {
                    if ( Math.abs( offset.x ) > Math.abs( offset.y ) ) {
                        const newOffsetY = offset.x * imageSizeRef.current.height / imageSizeRef.current.width;
                        y0 = mouseStartPositionRef.current.y + newOffsetY;                                    
                    } else {
                        const newOffsetX = offset.y * imageSizeRef.current.width / imageSizeRef.current.height;
                        x0 = mouseStartPositionRef.current.x + newOffsetX; 
                    }
                }

                if ( (resizeDirection & ResizeDirection.BottomRight) == ResizeDirection.BottomRight ) {
                    if ( Math.abs( offset.x ) > Math.abs( offset.y ) ) {
                        const newOffsetY = offset.x * imageSizeRef.current.height / imageSizeRef.current.width;
                        y1 = mouseStartPositionRef.current.y + newOffsetY;                                    
                    } else {
                        const newOffsetX = offset.y * imageSizeRef.current.width / imageSizeRef.current.height;
                        x1 = mouseStartPositionRef.current.x + newOffsetX; 
                    }
                }

                if ( (resizeDirection & ResizeDirection.BottomLeft) == ResizeDirection.BottomLeft ) {
                    if ( Math.abs( offset.x ) > Math.abs( offset.y ) ) {
                        const newOffsetY = offset.x * imageSizeRef.current.height / imageSizeRef.current.width;
                        y1 = mouseStartPositionRef.current.y - newOffsetY;                                    
                    } else {
                        const newOffsetX = offset.y * imageSizeRef.current.width / imageSizeRef.current.height;
                        x0 = mouseStartPositionRef.current.x - newOffsetX; 
                    }
                }

                if ( (resizeDirection & ResizeDirection.TopRight) == ResizeDirection.TopRight ) {
                    if ( Math.abs( offset.x ) > Math.abs( offset.y ) ) {
                        const newOffsetY = offset.x * imageSizeRef.current.height / imageSizeRef.current.width;
                        y0 = mouseStartPositionRef.current.y - newOffsetY;                                    
                    } else {
                        const newOffsetX = offset.y * imageSizeRef.current.width / imageSizeRef.current.height;
                        x1 = mouseStartPositionRef.current.x - newOffsetX; 
                    }
                }
            }

            x0 = Math.max( x0, containerSizeRef.current.x );
            y0 = Math.max( y0, containerSizeRef.current.y );

            x1 = Math.min( x1, containerSizeRef.current.x + containerSizeRef.current.width );
            y1 = Math.min( y1, containerSizeRef.current.y + containerSizeRef.current.height );

            const currentMarkerStyle: CSSProperties = {};
            
            if ( resizeDirection & ResizeDirection.Left || resizeDirection & ResizeDirection.Right ) {
                currentMarkerStyle.width = `${x1 - x0}px`;
                if ( resizeDirection & ResizeDirection.Left ) {
                    currentMarkerStyle.left = `${x0}px`;
                }
            }
            
            if ( resizeDirection & ResizeDirection.Top || resizeDirection & ResizeDirection.Bottom ) {
                currentMarkerStyle.height = `${y1 - y0}px`;
                if ( resizeDirection & ResizeDirection.Top ) {
                    currentMarkerStyle.top = `${y0}px`;
                }
            }

            setMarkerStyle( (current) => { return {...current, ...currentMarkerStyle}; } );
        },
        [resizeDirection]
    );

    useEffect(
        () => {
            const onMouseMove = ( event: MouseEvent ) => {
                mouseCurrentPositionRef.current = { x: event.clientX, y: event.clientY };
                processResize(event.shiftKey);
                
            };

            const onMouseUp = () => {
                if ( resizeDirection == ResizeDirection.None )  return;
                
                setResizeDirection( ResizeDirection.None );

                editor.update( () => {
                    valueValidOrThrowDev( markerStyle.width );
                    valueValidOrThrowDev( markerStyle.height );

                    const width = separateValueAndUnit(markerStyle.width.toString()).value;
                    const height = separateValueAndUnit(markerStyle.height.toString()).value;
                    setWidthHeight( width, height );
                });
            };

            const onKeyChanged = (event: KeyboardEvent) => {
                if ( event.key == "Shift" ) {
                    processResize(event.shiftKey);
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('keydown', onKeyChanged);
            document.addEventListener('keyup', onKeyChanged);

            return () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('keydown', onKeyChanged);
                document.removeEventListener('keyup', onKeyChanged);
        };
        },
        [editor, markerStyle.height, markerStyle.width, processResize, resizeDirection, setWidthHeight]
    );

    const setupControls = useCallback( 
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
            let currentMarkerControl: CSSProperties = {};
            currentMarkerControl.visibility= "hidden";

            if ( isSelected ) {
                notNullOrThrowDev( imageRef.current );
                const anchorSize = imageControl.anchorSize;
                const anchorHalfSize = imageControl.anchorSize * 0.5;

                const {x, y, width: imageWidth, height: imageHeight} = imageRef.current.getBoundingClientRect();

                const imageEditorElement = imageEditorRef.current;
                notNullOrThrowDev(imageEditorElement);
                const {width: imageEditorWidth} = imageEditorElement.getBoundingClientRect();
                imageEditorElement.style.left = `${0.5 * (imageWidth - imageEditorWidth)}px`;
                
                const commonStyle: CSSProperties = { zIndex: 4, position: "fixed", width: `${anchorSize}px`, height: `${anchorSize}px` };
                styles.topControl = structuredClone( commonStyle );
                styles.bottomControl = structuredClone( commonStyle );
                styles.leftControl = structuredClone( commonStyle );
                styles.rightControl = structuredClone( commonStyle );

                styles.topLeftControl = structuredClone( commonStyle );
                styles.topRightControl = structuredClone( commonStyle );
                styles.bottomLeftControl = structuredClone( commonStyle );
                styles.bottomRightControl = structuredClone( commonStyle );

                currentMarkerControl = { zIndex: 4, position: "fixed", backgroundColor: "transparent", visibility: "visible", left: `${x}px`, top: `${y}px`, width: `${imageWidth}px`, height: `${imageHeight}px` };
                
                styles.topControl.left = `${x + 0.5 * imageWidth - anchorHalfSize}px`;
                styles.topControl.top = `${y - anchorHalfSize}px`;
                styles.topControl.cursor = 'n-resize';
                
                styles.bottomControl.left = `${x + 0.5 * imageWidth - anchorHalfSize}px`;
                styles.bottomControl.top = `${y + imageHeight - anchorHalfSize}px`;
                styles.bottomControl.cursor = 's-resize';

                styles.leftControl.left = `${x - anchorHalfSize}px`;
                styles.leftControl.top = `${y + 0.5 * imageHeight - anchorHalfSize}px`;
                styles.leftControl.cursor = 'w-resize';
                
                styles.rightControl.left = `${x + imageWidth - anchorHalfSize}px`;
                styles.rightControl.top = `${y + 0.5 * imageHeight - anchorHalfSize}px`;
                styles.rightControl.cursor = 'e-resize';

                styles.topLeftControl.left = `${x - anchorHalfSize}px`;
                styles.topLeftControl.top = `${y - anchorHalfSize}px`;
                styles.topLeftControl.cursor = 'nw-resize';

                styles.topRightControl.left = `${x + imageWidth - anchorHalfSize}px`;
                styles.topRightControl.top = `${y - anchorHalfSize}px`;
                styles.topRightControl.cursor = 'ne-resize';

                styles.bottomLeftControl.left = `${x - anchorHalfSize}px`;
                styles.bottomLeftControl.top = `${y + imageHeight - anchorHalfSize}px`;
                styles.bottomLeftControl.cursor = 'sw-resize';

                styles.bottomRightControl.left = `${x + imageWidth - anchorHalfSize}px`;
                styles.bottomRightControl.top = `${y + imageHeight - anchorHalfSize}px`;
                styles.bottomRightControl.cursor = 'se-resize';              
            }
            setControlStyles( styles );
            setMarkerStyle( currentMarkerControl );
        },
        [imageControl.anchorSize, isSelected]
    );

    useEffect(
        () => {
            setupControls();
        },
        [setupControls, width, height]
    );

    const onResizeImage = useCallback(
         ( direction: ResizeDirection ): React.MouseEventHandler<HTMLDivElement> => (event: React.MouseEvent<HTMLDivElement>) => {
            notNullOrThrowDev(imageRef.current);
            const parentElement = imageRef.current.parentElement;
            notNullOrThrowDev(parentElement);

            mouseStartPositionRef.current = { x: event.clientX, y: event.clientY };
            const {x, y, width, height} = imageRef.current.getBoundingClientRect();
            imageSizeRef.current = {x, y, width, height};

            editor.update( () => {
                const imageNode = $getNodeByKey(imageKey);
                assert( imageNode != null, "Wrong key for ImageNode" );

                const rootElement = editor.getElementByKey( imageNode!.getTopLevelElementOrThrow().getParentOrThrow().getKey());
                notNullOrThrowDev(rootElement);

                containerSizeRef.current = rootElement.getBoundingClientRect();
                const rootStyle = getComputedStyle(rootElement);
                
                const paddingLeft = rootStyle.paddingLeft ? separateValueAndUnit( rootStyle.paddingLeft ).value : 0;
                const paddingTop = rootStyle.paddingTop ? separateValueAndUnit( rootStyle.paddingTop ).value : 0;
                const paddingRight = rootStyle.paddingRight ? separateValueAndUnit( rootStyle.paddingRight ).value : 0;
                const paddingBottom = rootStyle.paddingBottom ? separateValueAndUnit( rootStyle.paddingBottom ).value : 0;

                containerSizeRef.current.x += paddingLeft;
                containerSizeRef.current.y += paddingTop;
                containerSizeRef.current.width -= paddingRight + paddingLeft;
                containerSizeRef.current.height -= paddingBottom + paddingTop;
            });


            const currentMarkerStyle: CSSProperties = {};
            currentMarkerStyle.left = `${x}px`;
            currentMarkerStyle.top = `${y}px`;
            currentMarkerStyle.width = `${width}px`;
            currentMarkerStyle.height = `${height}px`;

            setMarkerStyle( (current) => { return {...current, ...currentMarkerStyle}; } );

            setResizeDirection(direction);

            event.preventDefault();
            event.stopPropagation();
         },
         [editor, imageKey]
    );

    useEffect(
        () => {
            if ( (src == '' || src == MISSING_IMAGE) && blob ) {
                setIsLoading( true );
                appGlobals.urlObjManager.blobsToUrlObjs(
                    (urlsObjs) => {
                        setIsLoading( false );

                        editor.update( 
                            () => {
                                setSrc( urlsObjs[0] );
                            },
                            { tag: 'history-merge' }// merge history with prev
                         );
                    },
                    undefined,
                    [blob]
                );
            }
        },
        [blob, editor, imageKey, setSrc, src]
    );

    useEffect(
        () => {
            return editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    if ( event.target == imageRef.current ) {
                        clearSelection();
                        setSelected(true);
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            );
        },
        [clearSelection, editor,  setSelected]
    );

    return (
        <>
            <div className={(isSelected ? " " + imageTheme.selected : '')} style={{display: "inline-block", overflow: "hidden", maxWidth: "100%", width, height}}>
                <img ref={imageRef} className={imageTheme.element + (isLoading ? (' ' + pulsing): '')} style={{display:"block"}} src={src || MISSING_IMAGE} alt={`No image ${src || MISSING_IMAGE}`}/>  
            </div>

            {isSelected && 
                <>
                    <div className={imageControl.marker} style={markerStyle}></div>

                    <div className={imageControl.anchor} style={controlStyles.topControl} onMouseDown={onResizeImage(ResizeDirection.Top)}></div>
                    <div className={imageControl.anchor} style={controlStyles.bottomControl} onMouseDown={onResizeImage(ResizeDirection.Bottom)}></div>
                    <div className={imageControl.anchor} style={controlStyles.leftControl} onMouseDown={onResizeImage(ResizeDirection.Left)}></div>
                    <div className={imageControl.anchor} style={controlStyles.rightControl} onMouseDown={onResizeImage(ResizeDirection.Right)}></div>

                    <div className={imageControl.anchor} style={controlStyles.topLeftControl} onMouseDown={onResizeImage(ResizeDirection.TopLeft)}></div>
                    <div className={imageControl.anchor} style={controlStyles.topRightControl} onMouseDown={onResizeImage(ResizeDirection.TopRight)}></div>
                    <div className={imageControl.anchor} style={controlStyles.bottomLeftControl} onMouseDown={onResizeImage(ResizeDirection.BottomLeft)}></div>
                    <div className={imageControl.anchor} style={controlStyles.bottomRightControl} onMouseDown={onResizeImage(ResizeDirection.BottomRight)}></div>
                    
                    <div ref={imageEditorRef} className={imageEditor.container}>
                        <ImageEditor/>
                    </div>
                </>
            }
        </>
    );
}
