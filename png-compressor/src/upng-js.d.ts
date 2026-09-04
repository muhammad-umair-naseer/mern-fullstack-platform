declare module "upng-js" {
  type ImageBuffer = ArrayBuffer | ArrayBufferView;

  const UPNG: {
    encode(buffers: ImageBuffer[], width: number, height: number, colorCount?: number, psnr?: number): ArrayBuffer;
  };

  export = UPNG;
}
