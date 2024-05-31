import { useMainThemeContext } from "@/mainThemeContext";
import { appGlobals } from "@/system/appGlobals";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { $getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from "lexical";
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { $isImageNode } from "../../nodes/image/imageNode";
import { MousePosition } from "@/utils/types";

interface ImageProps {
    src?: string;
    blob?: Blob;
    imageKey: NodeKey;
}

interface ImageSrc {
    src: string;
    loading: boolean;
}

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

export function Image( { src, blob, imageKey } : ImageProps) {
    const [editor] = useLexicalComposerContext();

    const {commonTheme: {pulsing}, editorTheme: {imageTheme}} = useMainThemeContext();

    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(imageKey);

    const [imageSrc, setImageSrc] = useState<ImageSrc>({src: src || MISSING_IMAGE, loading: false});
    const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(ResizeDirection.None);
    const [markerStyle, setMarkerStyle] = useState<CSSProperties>( {} );
    const [imageStyle, setImageStyle] = useState<CSSProperties>({display: "inline-block", overflow: "hidden", maxWidth: "100%", width: "max-content"});
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
    const imageSizeRef = useRef<{x: number, y: number, width: number, height: number}>( {x: -1, y: -1, width: -1, height: -1} );
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(
        () => {
            const onMouseMove = ( event: MouseEvent ) => {
                if ( resizeDirection != ResizeDirection.None ) {
                    const offset = { x: event.clientX - mouseStartPositionRef.current.x, y: event.clientY - mouseStartPositionRef.current.y };

                    let x0 = imageSizeRef.current.x;
                    let y0 = imageSizeRef.current.y;
                    let x1 = imageSizeRef.current.x + imageSizeRef.current.width;
                    let y1 = imageSizeRef.current.y + imageSizeRef.current.height;

                    if ( resizeDirection & ResizeDirection.Left ) {
                        x0 = event.clientX;
                        x1 = x0 + imageSizeRef.current.width - offset.x;
                    }

                    if ( resizeDirection & ResizeDirection.Right ) {
                        x1 = x0 + imageSizeRef.current.width + offset.x;
                    }

                    if ( resizeDirection & ResizeDirection.Top ) {
                        y0 = event.clientY;
                        y1 = y0 + imageSizeRef.current.height - offset.y;
                    }

                    if ( resizeDirection & ResizeDirection.Bottom ) {
                        y1 = y0 + imageSizeRef.current.height + offset.y;
                    }

                    if ( event.shiftKey ) {
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
                }
            };

            const onMouseUp = () => {
                if ( resizeDirection != ResizeDirection.None ) {
                    setResizeDirection( ResizeDirection.None );

                    setImageStyle( (current) => { return {...current, width: markerStyle.width, height: markerStyle.height }; } );
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            return () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        },
        [markerStyle.height, markerStyle.width, resizeDirection]
    );

    useEffect(
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

            if ( isSelected && imageRef.current ) {
                const commonStyle: CSSProperties = { zIndex: 4, position: "fixed", width: "10px", height: "10px", backgroundColor: "blue" };
                styles.topControl = structuredClone( commonStyle );
                styles.bottomControl = structuredClone( commonStyle );
                styles.leftControl = structuredClone( commonStyle );
                styles.rightControl = structuredClone( commonStyle );

                styles.topLeftControl = structuredClone( commonStyle );
                styles.topRightControl = structuredClone( commonStyle );
                styles.bottomLeftControl = structuredClone( commonStyle );
                styles.bottomRightControl = structuredClone( commonStyle );

                currentMarkerControl = { ...commonStyle, border: "blue solid 2px", backgroundColor: "transparent", visibility: "hidden" };
                
                const {x, y, width, height} = imageRef.current.getBoundingClientRect();
                styles.topControl.left = `${x + 0.5 * width - 5}px`;
                styles.topControl.top = `${y - 5}px`;
                styles.topControl.cursor = 'n-resize';
                
                styles.bottomControl.left = `${x + 0.5 * width - 5}px`;
                styles.bottomControl.top = `${y + height - 5}px`;
                styles.bottomControl.cursor = 's-resize';

                styles.leftControl.left = `${x - 5}px`;
                styles.leftControl.top = `${y + 0.5 * height - 5}px`;
                styles.leftControl.cursor = 'w-resize';
                
                styles.rightControl.left = `${x + width - 5}px`;
                styles.rightControl.top = `${y + 0.5 * height - 5}px`;
                styles.rightControl.cursor = 'e-resize';

                styles.topLeftControl.left = `${x - 5}px`;
                styles.topLeftControl.top = `${y - 5}px`;
                styles.topLeftControl.cursor = 'nw-resize';

                styles.topRightControl.left = `${x + width - 5}px`;
                styles.topRightControl.top = `${y - 5}px`;
                styles.topRightControl.cursor = 'ne-resize';

                styles.bottomLeftControl.left = `${x - 5}px`;
                styles.bottomLeftControl.top = `${y + height - 5}px`;
                styles.bottomLeftControl.cursor = 'sw-resize';

                styles.bottomRightControl.left = `${x + width - 5}px`;
                styles.bottomRightControl.top = `${y + height - 5}px`;
                styles.bottomRightControl.cursor = 'se-resize';              
            }
            setControlStyles( styles );
            setMarkerStyle( currentMarkerControl );
        },
        [isSelected]
    );

    const onResizeImage = useCallback(
         ( direction: ResizeDirection ): React.MouseEventHandler<HTMLDivElement> => (event: React.MouseEvent<HTMLDivElement>) => {
            if ( !imageRef.current ) return;

            mouseStartPositionRef.current = { x: event.clientX, y: event.clientY };

            const {x, y, width, height} = imageRef.current.getBoundingClientRect();
            imageSizeRef.current = {x, y, width, height};

            const currentMarkerStyle: CSSProperties = {};
            currentMarkerStyle.visibility = "visible";
            currentMarkerStyle.left = `${x}px`;
            currentMarkerStyle.top = `${y}px`;
            currentMarkerStyle.width = `${width}px`;
            currentMarkerStyle.height = `${height}px`;

            setMarkerStyle( (current) => { return {...current, ...currentMarkerStyle}; } );

            setResizeDirection(direction);

            event.preventDefault();
            event.stopPropagation();
         },
         []
    );

    useEffect(
        () => {
            if ( imageSrc.src == MISSING_IMAGE && blob ) {
                setImageSrc( (current) => { return {...current, loading: true}; } );
                appGlobals.urlObjManager.blobsToUrlObjs(
                    (urlsObjs) => {
                        setImageSrc( {src: urlsObjs[0], loading: false} );

                        editor.update( 
                            () => {
                                const imageNode = $getNodeByKey( imageKey );
                                if ( $isImageNode(imageNode) ) {
                                    imageNode.setSrc( urlsObjs[0] );
                                }
                            }
                         );
                    },
                    undefined,
                    [blob]
                );
            }
        },
        [blob, editor, imageKey, imageSrc.src]
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
            <div className={(isSelected ? " " + imageTheme.selected : '')} style={imageStyle}>
                <img ref={imageRef} className={imageTheme.element + (imageSrc.loading ? (' ' + pulsing): '')} style={{display:"block"}} src={imageSrc.src} alt={`No image ${imageSrc.src}`}/>  
            </div>

            {isSelected && 
                <>
                    <div style={markerStyle}></div>

                    <div style={controlStyles.topControl} onMouseDown={onResizeImage(ResizeDirection.Top)}></div>
                    <div style={controlStyles.bottomControl} onMouseDown={onResizeImage(ResizeDirection.Bottom)}></div>
                    <div style={controlStyles.leftControl} onMouseDown={onResizeImage(ResizeDirection.Left)}></div>
                    <div style={controlStyles.rightControl} onMouseDown={onResizeImage(ResizeDirection.Right)}></div>

                    <div style={controlStyles.topLeftControl} onMouseDown={onResizeImage(ResizeDirection.TopLeft)}></div>
                    <div style={controlStyles.topRightControl} onMouseDown={onResizeImage(ResizeDirection.TopRight)}></div>
                    <div style={controlStyles.bottomLeftControl} onMouseDown={onResizeImage(ResizeDirection.BottomLeft)}></div>
                    <div style={controlStyles.bottomRightControl} onMouseDown={onResizeImage(ResizeDirection.BottomRight)}></div>
                </>
            }
        </>
    );
}
