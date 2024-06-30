import { useMainThemeContext } from "@/mainThemeContext";
import { notNullOrThrowDev, variableExists } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

import { $getImageNodeByKey } from "@editor/nodes/image/imageNode";
import { CLICK_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getImageManager, ImageObject, ImageState } from "@systems/imageManager";
import { LOADING_IMAGE, MISSING_IMAGE } from "@systems/imageManager/imageConstants";
import {
  $getNodeByKey,
  NodeKey
} from "lexical";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ImageControl } from "./imageControl";
import { Metric } from "@/utils/types";

enum ImageLoadingState {
  None = 0,
  Loading = 1 << 0,
  Ready = 1 << 1,
  Failed = 1 << 2,
}

interface ImageProps {
  src: string;
  width?: Metric;
  height?: Metric;
  imageNodeKey: NodeKey;
  imageID: number;
}

export function Image({
  src,
  width,
  height,
  imageNodeKey,
  imageID,
}: ImageProps) {
  const [editor] = useLexicalComposerContext();

  const {
    commonTheme: { pulsing },
    editorTheme: { imageTheme },
  } = useMainThemeContext();

  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(imageNodeKey);
  const [currentSrc, setCurrentSrc] = useState<string>(LOADING_IMAGE);
  const [isLoading, setIsLoading] = useState<ImageLoadingState>(ImageLoadingState.Loading);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const onError = useCallback(
    () => {
      setCurrentSrc(MISSING_IMAGE);
      setIsLoading(ImageLoadingState.Failed);
    },
    []
  );

  const {displayWidth, displayHeight} : {displayWidth: string | undefined, displayHeight: string | undefined} = useMemo(
    () => {
      if ( variableExists(width) && variableExists(height) ) {
        if( width.unit === 'a4w' && rootElement ) {
          return { displayWidth: `${rootElement.clientWidth * width.value}px`, displayHeight: `${rootElement.clientWidth * height.value}px` };
        }
        return { displayWidth: width.toString(), displayHeight: height.toString() };
      }

      return {displayHeight: undefined, displayWidth: undefined};

    },
    [height, rootElement, width]
  );

  const onLoad = useCallback(
    () => {
      if ( (isLoading & ImageLoadingState.Ready) !== 0 ) { 
          setIsLoading(ImageLoadingState.None);

          if (!variableExists(width) || !variableExists(height)) {
          editor.update( () => {
            const node = $getImageNodeByKey(imageNodeKey);
            if ( node ) {
              if ( imageRef.current && rootElement && rootElement.clientWidth > 0 && rootElement.clientHeight > 0 ) {
                const normalizedWidth = imageRef.current.width / rootElement.clientWidth;
                const normalizeHeight = imageRef.current.height / rootElement.clientWidth;
                node.setWidthHeight( new Metric(normalizedWidth, 'a4w'), new Metric(normalizeHeight, 'a4w'));
              }
            }
          }, {tag:"history-merge"});
        }
      }
    },
    [editor, height, imageNodeKey, isLoading, rootElement, width]
  );

  useEffect(() => {
    return $registerCommandListener(
      CLICK_CMD,
      (event: MouseEvent) => {
        if (event.target == imageRef.current) {
          clearSelection();
          setSelected(true);
          return true;
        }
        
        return false;
      }
    );
  }, [clearSelection, editor, setSelected]);

    const updateImageSize = useCallback(
      (width: number, height: number): void => {
        editor.update( () => {
          const node = $getImageNodeByKey(imageNodeKey);
          if ( node ) {
            notNullOrThrowDev(rootElement);
            const normalizedWidth = width / rootElement.clientWidth;
            const normalizeHeight = height / rootElement.clientWidth;
            node.setWidthHeight( new Metric(normalizedWidth, 'a4w'), new Metric(normalizeHeight, 'a4w'));
          }
        });
      },
      [editor, imageNodeKey, rootElement]
    );

    const imageUpdate = useCallback( 
      (imageObject: ImageObject, oldState: ImageState) => {
        setCurrentSrc(imageObject.src);
        const isUploading = (imageObject.state & ImageState.Uploading) !== 0;
        const isPreloadingUrl = (imageObject.state & (ImageState.Preloading | ImageState.BlobURL)) === ImageState.Preloading;
        const newLoadingState = isLoading | ((isUploading || isPreloadingUrl) ? ImageLoadingState.Loading : ImageLoadingState.Ready);
        setIsLoading( newLoadingState );

        const changedState = oldState ^ imageObject.state;
        if ( (changedState & ImageState.Uploading) !== 0 ) {
          editor.update( () => {
            const node = $getImageNodeByKey(imageNodeKey);
            if ( node ) {
              node.setSrc(imageObject.fileUrl);
              node.setFilePath(imageObject.filePath);
            }
          }, {tag:"history-merge"});
        }
      },
      [editor, imageNodeKey, isLoading]
    );

    useEffect(
      () => {
        if ( (src === MISSING_IMAGE || (isLoading & ImageLoadingState.Failed) !== 0) && imageID === -1 )
          return;

        let updatedImageID = imageID;
        if ( updatedImageID === -1 ) {
          updatedImageID = $getImageManager().imagePreload(src);
        } 

        return $getImageManager().registerListener(updatedImageID, imageUpdate);
      },
      [imageID, imageUpdate, isLoading, src]
    );

    useEffect(
      () => {
        editor.update(
          () => {            
              const imageNode = $getNodeByKey(imageNodeKey);
              notNullOrThrowDev(imageNode);
        
              setRootElement(editor.getElementByKey( imageNode.getTopLevelElementOrThrow().getParentOrThrow().getKey()));
            }
          );
      },
      [editor, imageNodeKey]
    );

  return (
    <div
      className={isSelected ? " " + imageTheme.selected : ""}
      style={{
        position: 'relative',
        display: "inline-block",
        maxWidth: "100%",
        width: displayWidth,
        height: displayHeight,
      }}
    >
      <img
        ref={imageRef}
        className={imageTheme.element + ((isLoading & ImageLoadingState.Loading) !== 0 ? " " + pulsing : "")}
        style={{ display: "block" }}
        src={currentSrc}
        alt={`No image ${currentSrc}`}
        onError={onError}
        onLoad={onLoad}
      />
      {isSelected && <ImageControl imageElement={imageRef.current} inputElement={rootElement} updateImageSize={updateImageSize} /> }
    </div>
  );
}
