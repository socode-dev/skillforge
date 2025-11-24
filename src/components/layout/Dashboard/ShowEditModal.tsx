import EditEmail from "../../modals/EditEmail";
import EditMultiFactor from "../../modals/EditMultiFactor";
import EditName from "../../modals/EditName";
import EditPassword from "../../modals/EditPassword";

const ShowEditModal = () => {
  return (
    <>
      <EditName />
      <EditEmail />
      <EditPassword />
      <EditMultiFactor />
    </>
  );
};

export default ShowEditModal;
