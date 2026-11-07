export async function GetProduct() {
  const res = await fetch(`/api/product`, {

    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

