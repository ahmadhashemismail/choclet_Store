export async function DELETE(id: number) {
  const res = await fetch(`/api/product/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};