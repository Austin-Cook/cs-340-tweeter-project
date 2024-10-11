import { User } from "tweeter-shared";
import ItemBox from "./ItemBox";

export const userItemGenerator = (item: User) => <UserItem value={item} />;

interface Props {
  value: User;
}

const UserItem = (props: Props) => {
  return (
    <ItemBox user={props.value} />
  );
};

export default UserItem;
