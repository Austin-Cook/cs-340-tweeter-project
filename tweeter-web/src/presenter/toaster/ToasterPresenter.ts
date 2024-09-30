import { Toast } from "../../components/toaster/Toast";

export interface ToasterView {
  deleteToast: (id: string) => void;
}

export class ToasterPresenter {
  private _view: ToasterView;

  constructor(view: ToasterView) {
    this._view = view;
  }

  public deleteExpiredToasts(toastList: Toast[]) {
    const now = Date.now();

    for (let toast of toastList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        this._view.deleteToast(toast.id);
      }
    }
  };

  public deleteExpiredToastsOnInterval(toastList: Toast[]) {
    const interval = setInterval(() => {
      if (toastList.length) {
        this.deleteExpiredToasts(toastList);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }
}
