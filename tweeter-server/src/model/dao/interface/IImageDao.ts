export interface IImageDao {
  uploadImage: (fileName: string, fileExtension: string, decodedImageBuffer: Buffer) => Promise<string>;
}
