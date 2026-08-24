import Spinner from "../../../components/Spinner";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-4 mb-4">
        <Spinner />
      </div>
    </div>
  );
}