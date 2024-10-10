import Post from "./Post";
import { Status } from "tweeter-shared";
import ItemBox from "./ItemBox";

export const statusItemGenerator = (item: Status) => <StatusItem value={item} />;

interface Props {
  value: Status;
}

const StatusItem = (props: Props) => {
  return (
    <ItemBox
      user={props.value.user}
      ItemText={
        <>
          {props.value.formattedDate}
          <br />
          <Post status={props.value} />
        </>}
    />
  );
};

export default StatusItem;
