export default function Step2() {
  return (
    <p className="text-xs font-light">
      Add data manually or{" "}
      <button
        type="button"
        onClick={() => console.log("importing CSV")}
        className="text-primary underline"
      >
        import a CSV
      </button>
    </p>
  );
}
