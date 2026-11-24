export async function DELETE(id: number) {
  const res = await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};