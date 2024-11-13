import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageDao } from "../interface/ImageDao";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";

export class S3ImageDao implements ImageDao {
  readonly BUCKET = "tweeter-server-profile-images";
  readonly REGION = "us-west-2";

  public async uploadImage(fileName: string, decodedImageBuffer: Buffer): Promise<string> {
    return await doFailureReportingOperation(async () => {
      const s3Params = {
        Bucket: this.BUCKET,
        Key: "image/" + fileName,
        Body: decodedImageBuffer,
        ContentType: "image/png",
        ACL: ObjectCannedACL.public_read,
      };
      const c = new PutObjectCommand(s3Params);
      const client = new S3Client({ region: this.REGION });
      try {
        await client.send(c);
        return (
          `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`
        );
      } catch (error) {
        throw Error("s3 put image failed with: " + error);
      }
    },
      "S3ImageDao",
      "uploadImage"
    );
  }
}
