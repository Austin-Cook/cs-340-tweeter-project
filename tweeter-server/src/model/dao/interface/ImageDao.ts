export interface ImageDao {
  uploadImage: (fileName: string, decodedImageBuffer: Buffer) => Promise<string>;
}