import { ErrorBoundary } from "react-error-boundary";
import { Suspense, type JSX, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ErrorFallback from "./ErrorFallback";

type Props = {
    children: ReactNode;
    loadingFallback: JSX.Element;
}

const LazyWrapper = ({ children, loadingFallback }: Props) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => navigate(-1)}
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default LazyWrapper;
