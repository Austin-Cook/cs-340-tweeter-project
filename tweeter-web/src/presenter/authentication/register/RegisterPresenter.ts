import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../../model/service/UserService";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Buffer } from "buffer";

export interface RegisterView {
  navigate: (path: string) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null,
    authToken: AuthToken, remember: boolean) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  setImageBytes: Dispatch<SetStateAction<Uint8Array>>
  setImageUrl: Dispatch<SetStateAction<string>>
  setImageFileExtension: Dispatch<SetStateAction<string>>;
}

export class RegisterPresenter {
  private _view: RegisterView;
  private _userService: UserService;
  private _isLoading: boolean = false;

  constructor(view: RegisterView) {
    this._view = view;
    this._userService = new UserService();
  }

  public get isLoading() {
    return this._isLoading;
  }

  public checkSubmitButtonStatus(firstName: string, lastName: string, alias: string,
    password: string, imageUrl: string, imageFileExtension: string): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  public registerOnEnter(event: React.KeyboardEvent<HTMLElement>, firstName: string,
    lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageUrl: string,
    imageFileExtension: string, rememberMe: boolean) {
    if (event.key == "Enter" && !this.checkSubmitButtonStatus(firstName, lastName, alias, password,
      imageUrl, imageFileExtension)) {
      this.doRegister(firstName, lastName, alias, password, imageBytes, imageFileExtension,
        rememberMe);
    }
  };

  public handleFileChange(event: ChangeEvent<HTMLInputElement>, imageBytes: Uint8Array, imageUrl: string,
    imageFileExtension: string): void {
    const file = event.target.files?.[0];
    this.handleImageFile(file, imageBytes, imageUrl, imageFileExtension);
  };

  private handleImageFile(file: File | undefined, imageBytes: Uint8Array, imageUrl: string,
    imageFileExtension: string): void {
    if (file) {
      this._view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._view.setImageFileExtension(fileExtension);
      }
    } else {
      this._view.setImageUrl("");
      this._view.setImageBytes(new Uint8Array());
    }
  };

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };

  public async doRegister(firstName: string, lastName: string, alias: string,
    password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean)
    : Promise<void> {
    try {
      this._isLoading = true;

      const [user, authToken] = await this._userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this._view.updateUserInfo(user, user, authToken, rememberMe);
      this._view.navigate("/");
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this._isLoading = false;
    }
  };
}
