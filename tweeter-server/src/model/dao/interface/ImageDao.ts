export interface ImageDao {
  uploadImage: (fileName: string, fileExtension: string, decodedImageBuffer: Buffer) => Promise<string>;
}
