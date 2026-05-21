import DeleteAccount from "../../dialogs/DeleteAccount";
import PasswordUpdateSuccessful from "../../dialogs/PasswordUpdateSuccessful";

const ShowDialog = () => {
  return (
    <>
      <PasswordUpdateSuccessful />
      <DeleteAccount />
    </>
  );
};

export default ShowDialog;
