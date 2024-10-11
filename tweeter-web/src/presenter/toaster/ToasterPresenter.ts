import { Toast } from "../../components/toaster/Toast";
import { Presenter, View } from "../Presenter";

export interface ToasterView extends View {
  deleteToast: (id: string) => void;
}

export class ToasterPresenter extends Presenter<ToasterView> {
  constructor(view: ToasterView) {
    super(view);
  }

  public deleteExpiredToasts(toastList: Toast[]) {
    const now = Date.now();

    for (let toast of toastList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        this.view.deleteToast(toast.id);
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
