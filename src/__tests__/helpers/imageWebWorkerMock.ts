import '@/system/imageManager/imageManager';
import { $getImageManager } from '@/system/imageManager/imageManager';
import { ImageManagerWorkerFunctionsExtended } from '@systems/imageManager/workerShared';
import { vi } from 'vitest';

$getImageManager()['callFunction'] = vi.fn(
    async (funcID: keyof ImageManagerWorkerFunctionsExtended, args: unknown[] ): Promise<unknown> => {
        switch ( funcID ) {
            case 'blobToUrlObj':
                {
                    const [blob] = args as [blob: Blob];
                    const blobText = await blob.text();
                    return `blob:${blobText}`;
                }
            case 'preloadImage':
                return;
        }
    }
);