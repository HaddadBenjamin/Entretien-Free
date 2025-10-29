export default function AddressForm({ default: defaultValue }: { default: string }) {
  return (
    <form>
      <input type="text" defaultValue={defaultValue} className="border p-2 w-full" />
    </form>
  );
}
