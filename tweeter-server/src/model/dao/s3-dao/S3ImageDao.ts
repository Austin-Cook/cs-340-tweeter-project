import { ImageDao } from "../interface/ImageDao";

export class S3ImageDao implements ImageDao {
  public async uploadImage(fileName: string, decodedImageBuffer: Buffer): Promise<string> {
    // TODO
    return "";
  }
}
