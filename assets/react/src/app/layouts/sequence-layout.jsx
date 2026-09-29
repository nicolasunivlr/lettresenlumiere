import { Outlet } from "react-router-dom";
import { SequenceProvider } from "../../features/sequences";

export const SequenceLayout = () => {
  return (
    <SequenceProvider>
      <Outlet />
    </SequenceProvider>
  );
};
