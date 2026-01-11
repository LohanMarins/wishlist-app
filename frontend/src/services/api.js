import { supabase } from "../supabase";

export async function getItems() {
  const { data } = await supabase
    .from("items")
    .select("*");

  return data || [];
}

export async function addItem(item) {
  await supabase.from("items").insert([item]);
}

export async function updateItem(id, updates) {
  await supabase.from("items").update(updates).eq("id", id);
}

export async function deleteItem(id) {
  await supabase.from("items").delete().eq("id", id);
}
