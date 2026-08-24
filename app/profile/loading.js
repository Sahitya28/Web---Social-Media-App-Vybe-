import Spinner from "../../components/Spinner";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-5 mb-6">
        <Spinner />
      </div>
    </div>
  );
}