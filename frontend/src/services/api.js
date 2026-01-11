import { supabase } from "../supabase";

export async function getItems() {
  const { data } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

export function addItem(item) {
  return supabase.from("items").insert(item);
}

export function updateItem(id, updates) {
  return supabase.from("items").update(updates).eq("id", id);
}

export function deleteItem(id) {
  return supabase.from("items").delete().eq("id", id);
}

export function buyItem(id, userId) {
  return supabase
    .from("items")
    .update({
      bought_by: userId,
      bought_at: new Date().toISOString()
    })
    .eq("id", id);
}

export function deliverItem(id) {
  return supabase
    .from("items")
    .update({ delivered: true })
    .eq("id", id);
}
