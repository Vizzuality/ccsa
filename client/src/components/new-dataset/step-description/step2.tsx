export default function Step2() {
  return (
    <span className="text-xs font-light">
      Add data manually or{" "}
      <button
        type="button"
        onClick={() => console.info("importing CSV")}
        className="text-primary underline"
      >
        import a CSV
      </button>
    </span>
  );
}
