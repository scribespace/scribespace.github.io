import { useMainThemeContext } from "@/mainThemeContext";
import { notNullOrThrowDev } from "@/utils";
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
  useRef,
  useState
} from "react";
import { ImageControl } from "./imageControl";

enum ImageLoadingState {
  None = 0,
  Loading = 1 << 0,
  Ready = 1 << 1,
  Failed = 1 << 2,
}

interface ImageProps {
  src: string;
  width?: number;
  height?: number;
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

  const imageRef = useRef<HTMLImageElement>(null);

  const onError = useCallback(
    () => {
      setCurrentSrc(MISSING_IMAGE);
      setIsLoading(ImageLoadingState.Failed);
    },
    []
  );

  const onLoad = useCallback(
    () => {
      if ( (isLoading & ImageLoadingState.Ready) !== 0 ) { 
        setIsLoading(ImageLoadingState.None);

        editor.update( () => {
          const node = $getImageNodeByKey(imageNodeKey);
          if ( node ) {
            if ( imageRef.current ) {
              node.setWidthHeight(imageRef.current.naturalWidth, imageRef.current.naturalHeight);
            }
          }
        }, {tag:"history-merge"});
      }
    },
    [editor, imageNodeKey, isLoading]
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

    const getImageElement = useCallback(
      (): HTMLImageElement | null => {
        return imageRef.current;
      }, 
      []
    );

    const getImageRootElement = useCallback(
      (): HTMLElement | null => {
        const imageNode = $getNodeByKey(imageNodeKey);
        notNullOrThrowDev(imageNode);

        const rootElement = editor.getElementByKey( imageNode.getTopLevelElementOrThrow().getParentOrThrow().getKey());
        return rootElement;
      }, 
      [editor, imageNodeKey]
    );

    const updateImageSize = useCallback(
      (width: number, height: number): void => {
        editor.update( () => {
          const node = $getImageNodeByKey(imageNodeKey);
          if ( node )
            node.setWidthHeight(width, height);
        });
      },
      [editor, imageNodeKey]
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

  return (
    <>
      <div
        className={isSelected ? " " + imageTheme.selected : ""}
        style={{
          display: "inline-block",
          overflow: "hidden",
          maxWidth: "100%",
          width,
          height,
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
      </div>

      {isSelected && <ImageControl getImageElement={getImageElement} getImageRootElement={getImageRootElement} updateImageSize={updateImageSize} /> }
    </>
  );
}
