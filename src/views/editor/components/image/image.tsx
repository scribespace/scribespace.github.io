import { useMainThemeContext } from "@/mainThemeContext";
import { notNullOrThrowDev, variableExists } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

import { $getImageNodeByKey, $isImageNode } from "@editor/nodes/image/imageNode";
import { CLICK_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getImageManager } from "@systems/imageManager";
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

const MISSING_IMAGE = "/images/no-image.png" as const;

enum ImageState {
  None,
  Loading,
  LoadingFinal,
  Ready,
  Missing,
}

interface ImageProps {
  src?: string;
  width?: number;
  height?: number;
  blob?: Blob;
  imageKey: NodeKey;
}

export function Image({
  src,
  width,
  height,
  blob,
  imageKey,
}: ImageProps) {
  const [editor] = useLexicalComposerContext();

  const {
    commonTheme: { pulsing },
    editorTheme: { imageTheme },
  } = useMainThemeContext();

  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(imageKey);

  const imageRef = useRef<HTMLImageElement>(null);

  const [imageState, setImageState] = useState<ImageState>(ImageState.None);
  const [currentSrc, setCurrentSrc] = useState<string>(src || MISSING_IMAGE);

  const imageLoadFailed = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      setImageState(ImageState.Missing); 
      setCurrentSrc(MISSING_IMAGE);

      editor.update( () => {
        const node = $getNodeByKey(imageKey);
        if ( $isImageNode(node) )
          node.setSrc(MISSING_IMAGE); 
      });
      throw Error( error );
    },
    [editor, imageKey]
  );

  const uploadImage = useCallback(
    (imageBlob: Blob) => {
      $getImageManager().imageUpload(imageBlob).then(
        (url: string) => {
          editor.update( () => {
            setImageState(ImageState.LoadingFinal);
            setCurrentSrc(url);
            const node = $getImageNodeByKey(imageKey);
            if (node)
              node.setSrc(url);
        },
        { tag: "history-merge" }); 
        }
      )
      .catch((error) => { 
            imageLoadFailed(error);
          }
      );
    },
    [editor, imageKey, imageLoadFailed]
  );

  const onLoad = useCallback(
    () => {
      if (imageState == ImageState.LoadingFinal) {
        setImageState(ImageState.Ready);
        if ( !variableExists(width) || !variableExists(height) ) {
          editor.update(
            () => {
              const node = $getNodeByKey(imageKey);
              if ( $isImageNode(node) )
                node.setWidthHeight( imageRef.current!.naturalWidth, imageRef.current!.naturalHeight ); 
            },
            { tag: "history-merge" }
          );
        }
      }
    },
    [editor, height, imageKey, imageState, width]
  );

  const onError = useCallback(
    () => {
        setImageState(ImageState.Missing);
        setCurrentSrc(MISSING_IMAGE);
    },
    []
  );


  useEffect(() => {
    if ( imageState == ImageState.None ) {
       setCurrentSrc(MISSING_IMAGE);

       if ( (src == "") && blob ) {
        setImageState(ImageState.Loading);

        $getImageManager().blobsToUrlObjs([blob])
        .then( (urlsObjs) => {
            setCurrentSrc(urlsObjs[0]);
            uploadImage(blob);
          })
          .catch( (error) => { 
              imageLoadFailed(error);
          });

         return;
       }   

       if ( variableExists(src) ) {
          setImageState(ImageState.Loading);
          $getImageManager().preloadImage(src)
          .then(() => {
              setCurrentSrc( src );
              setImageState(ImageState.LoadingFinal);
            }
          );
          return;
      }

      setImageState(ImageState.Missing);
    }
  }, [blob, editor, imageLoadFailed, imageState, src, uploadImage]);

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
        const imageNode = $getNodeByKey(imageKey);
        notNullOrThrowDev(imageNode);

        const rootElement = editor.getElementByKey( imageNode.getTopLevelElementOrThrow().getParentOrThrow().getKey());
        return rootElement;
      }, 
      [editor, imageKey]
    );

    const updateImageSize = useCallback(
      (width: number, height: number): void => {
        editor.update( () => {
          const node = $getImageNodeByKey(imageKey);
          if ( node )
            node.setWidthHeight(width, height);
        });
      },
      [editor, imageKey]
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
          className={imageTheme.element + ((imageState == ImageState.Loading || imageState == ImageState.LoadingFinal) ? " " + pulsing : "")}
          style={{ display: "block" }}
          src={currentSrc}
          alt={`No image ${currentSrc}`}
          onLoad={onLoad}
          onError={onError}
        />
      </div>

      {isSelected && <ImageControl getImageElement={getImageElement} getImageRootElement={getImageRootElement} updateImageSize={updateImageSize} /> }
    </>
  );
}
