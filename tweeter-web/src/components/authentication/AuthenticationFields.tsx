import { Dispatch, SetStateAction, useState } from "react";
import { AuthenticationFieldsPresenter } from "../../presenter/authentication/AuthenticationFieldsPresenter";

interface Props {
  onEnter: () => Promise<void>;
  checkSubmitButtonStatus: () => boolean;
  setAlias: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

const AuthenticationFields = (props: Props) => {
  const [presenter] = useState(new AuthenticationFieldsPresenter());

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="name@example.com"
          onKeyDown={(event) => presenter.onEnter(event, props.onEnter,
            props.checkSubmitButtonStatus)}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          onKeyDown={(event) => presenter.onEnter(event, props.onEnter,
            props.checkSubmitButtonStatus)}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
