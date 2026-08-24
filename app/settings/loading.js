import Spinner from "../../components/Spinner";

export default function Loading() {
  return (
    <div className="max-w-lg mx-auto card p-4">
      <Spinner />
    </div>
  );
}