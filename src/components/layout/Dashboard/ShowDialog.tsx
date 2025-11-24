import DeleteAccount from "../../dialogs/DeleteAccount";
import EmailUpdateSuccessful from "../../dialogs/EmailUpdateSuccessful";
import PasswordUpdateSuccessful from "../../dialogs/PasswordUpdateSuccessful";

const ShowDialog = () => {
  return (
    <>
      <EmailUpdateSuccessful />
      <PasswordUpdateSuccessful />
      <DeleteAccount />
    </>
  );
};

export default ShowDialog;
