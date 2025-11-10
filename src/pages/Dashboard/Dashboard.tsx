import Button from "../../components/ui/Button";
import useAuthStore from "../../store/useAuthStore";

const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const onSignout = useAuthStore((state) => state.onSignout);

  return (
    <main>
      <h1>Welcome to dashboard, {currentUser?.name}</h1>
      <Button variant="destructive" onClick={onSignout} type="button">
        Sign Out
      </Button>
    </main>
  );
};

export default Dashboard;
